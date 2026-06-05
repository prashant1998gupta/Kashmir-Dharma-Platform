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

    async function generateKrishnaResponse(userMessage, chatHistory = []) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('API Key missing. Please configure your key in settings.');
        }

        // We'll use Gemini API by default as it's highly accessible
        // endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=...

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Format history for Gemini
        // Gemini uses 'user' and 'model' roles.
        const contents = [];
        
        // Inject system prompt into the first message
        const firstMessageText = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`;

        // Just sending the current message for now to keep it simple, 
        // but can be extended to include chatHistory.
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
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to fetch response from AI');
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
