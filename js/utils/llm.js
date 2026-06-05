/* ============================================
   LLM Integration (Gita AI)
   Handles API calls to Gemini (or OpenAI) using BYOK
   ============================================ */

const LLM = (() => {
    const STORAGE_KEY = 'kdp_gita_ai_key';
    const SYSTEM_PROMPT = `You are Lord Krishna from the Mahabharata. A user is coming to you for advice, guidance, or knowledge. 
You must answer their questions based ENTIRELY on the teachings of the Bhagavad Gita and Sanatana Dharma.
Tone: Compassionate, wise, divine, and deeply philosophical yet practical.
Instructions:
- Address the user as 'My friend' or 'Arjuna' metaphorically, but keep it natural.
- Quote relevant verses (Shlokas) from the Bhagavad Gita where appropriate, providing both the Sanskrit (transliterated or Devanagari) and its meaning.
- Keep responses concise but impactful (1-3 paragraphs usually).
- If the user asks about something modern (like coding, anxiety, modern jobs), relate it back to eternal principles like Dharma, Karma Yoga, Jnana, or Bhakti.
- Never break character. Never say "As an AI model...". You are Krishna.`;

    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY) || '';
    }

    function setApiKey(key) {
        localStorage.setItem(STORAGE_KEY, key.trim());
    }

    function hasApiKey() {
        return !!getApiKey();
    }

    let availableModel = null;

    async function getAvailableModel(apiKey) {
        if (availableModel) return availableModel;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch available models. Check your API key.');
        }

        const data = await response.json();
        const models = data.models || [];
        
        // Find a gemini model that supports generateContent
        const validModel = models.find(m => 
            m.name.includes('gemini') && 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent')
        );

        if (validModel) {
            // e.g. "models/gemini-1.5-flash"
            availableModel = validModel.name;
            return availableModel;
        } else {
            throw new Error('No compatible Gemini models found for this API key in your region.');
        }
    }

    async function streamKrishnaResponse(userMessage, chatHistory = [], onChunk) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API Key missing. Please configure your key in settings.');
        }

        const modelName = await getAvailableModel(apiKey);
        const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;

        // Format history for Gemini
        const contents = [];
        const firstMessageText = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`;

        contents.push({
            role: 'user',
            parts: [{ text: firstMessageText }]
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                })
            });

            if (!response.ok) {
                let errMsg = 'Failed to fetch response from AI';
                try {
                    const errorData = await response.json();
                    errMsg = errorData.error?.message || errMsg;
                } catch(e) {}
                throw new Error(errMsg);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); 

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6).trim();
                        if (!dataStr) continue;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.candidates && data.candidates.length > 0) {
                                const chunkText = data.candidates[0].content?.parts?.[0]?.text || '';
                                fullText += chunkText;
                                if (onChunk) onChunk(fullText);
                            }
                        } catch (e) {
                            // ignore parse errors for partial chunks
                        }
                    }
                }
            }
            
            return fullText;

        } catch (error) {
            console.error('LLM API Error:', error);
            throw error;
        }
    }

    return {
        getApiKey,
        setApiKey,
        hasApiKey,
        streamKrishnaResponse
    };
})();
