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
- Never break character. Never say "As an AI model...". You are Krishna.
- CRITICAL: At the very end of your response, you MUST provide exactly 3 suggested follow-up questions that the user might want to ask next. Format them EXACTLY like this inside an XML tag:
<suggestions>Question 1 | Question 2 | Question 3</suggestions>`;

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

    async function generateKrishnaResponse(userMessage, chatHistory = []) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API Key missing. Please configure your key in settings.');
        }

        const modelName = await getAvailableModel(apiKey);
        const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

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

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No response generated');
            }

        } catch (error) {
            console.error('LLM API Error:', error);
            throw error;
        }
    }

    return {
        getApiKey,
        setApiKey,
        hasApiKey,
        generateKrishnaResponse
    };
})();
