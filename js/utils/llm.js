/* ============================================
   LLM Integration (Gita AI)
   BYOK Gemini calls plus local verse-grounded fallback
   ============================================ */

const LLM = (() => {
    const STORAGE_KEY = 'kdp_gita_ai_key';
    let availableModel = null;
    let modelKeyFingerprint = null;

    const MODE_INSTRUCTIONS = {
        guidance: 'Give compassionate life guidance. Translate the Gita principle into a practical next step.',
        study: 'Teach the verse carefully. Explain context, key Sanskrit terms, and how the idea applies today.',
        sadhana: 'Create a small spiritual practice plan with mantra, reflection, and one doable action.',
        decision: 'Help the seeker clarify dharma, attachment, duty, fear, and the next right action.'
    };

    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY) || '';
    }

    function setApiKey(key) {
        localStorage.setItem(STORAGE_KEY, key.trim());
        availableModel = null;
        modelKeyFingerprint = null;
    }

    function clearApiKey() {
        localStorage.removeItem(STORAGE_KEY);
        availableModel = null;
        modelKeyFingerprint = null;
    }

    function hasApiKey() {
        return !!getApiKey();
    }

    function getLanguageName(language) {
        const names = {
            en: 'English',
            hi: 'Hindi in Devanagari',
            sa: 'Sanskrit in Devanagari',
            bn: 'Bengali',
            gu: 'Gujarati',
            kn: 'Kannada',
            ml: 'Malayalam',
            mr: 'Marathi',
            or: 'Odia',
            pa: 'Punjabi in Gurmukhi',
            ta: 'Tamil',
            te: 'Telugu',
            as: 'Assamese',
            bho: 'Bhojpuri in Devanagari',
            mai: 'Maithili in Devanagari',
            ne: 'Nepali in Devanagari'
        };
        return names[language] || 'English';
    }

    function getVerseContext(userMessage, options = {}) {
        if (options.verseContext && options.verseContext.length) return options.verseContext;
        if (typeof GitaVerseLibrary === 'undefined') return [];
        return GitaVerseLibrary.search(userMessage, 3);
    }

    function formatVerseForPrompt(verse, language = 'en') {
        if (typeof GitaVerseLibrary === 'undefined') return '';
        return [
            `BG ${verse.id}`,
            `Sanskrit: ${verse.sanskrit}`,
            `Transliteration: ${verse.transliteration}`,
            `Meaning: ${GitaVerseLibrary.textFor(verse, 'meaning', language)}`,
            `Practice: ${GitaVerseLibrary.textFor(verse, 'practice', language)}`
        ].join('\n');
    }

    function buildSystemPrompt(options = {}) {
        const language = options.language || 'en';
        const mode = options.mode || 'guidance';
        const modeInstruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.guidance;

        return `You are Gita AI, a respectful spiritual guidance assistant inspired by Sri Krishna's teachings in the Bhagavad Gita.

Important identity and safety:
- Do not claim to be the literal deity, a priest, doctor, therapist, or emergency service.
- Speak with reverence, warmth, humility, and practical clarity.
- Stay grounded in the Bhagavad Gita and Sanatana Dharma. Do not invent verse numbers.
- If the user expresses self-harm, immediate danger, abuse, or medical/legal crisis, gently encourage urgent local help and trusted human support before spiritual reflection.
- For complex ritual, legal, medical, or mental health matters, recommend a qualified professional or traditional guru where appropriate.

Language:
- Reply in ${getLanguageName(language)}, unless the user clearly asks for another language.

Response style:
- Mode: ${modeInstruction}
- Use clear markdown.
- Prefer one exact Bhagavad Gita anchor from the provided verse context.
- Include the verse reference, Sanskrit, a plain meaning, practical guidance, and one reflection/action.
- Keep it concise enough to read on mobile.
- End with exactly 3 suggested follow-up questions in this exact XML tag, keeping the tag name in English:
<suggestions>Question 1 | Question 2 | Question 3</suggestions>`;
    }

    async function getAvailableModel(apiKey) {
        const fingerprint = apiKey.slice(0, 8);
        if (availableModel && modelKeyFingerprint === fingerprint) return availableModel;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch available models. Check your API key.');
        }

        const data = await response.json();
        const models = data.models || [];
        const validModels = models.filter(model =>
            model.name &&
            model.name.includes('gemini') &&
            model.supportedGenerationMethods &&
            model.supportedGenerationMethods.includes('generateContent')
        );

        const preference = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-2.5-pro',
            'gemini-2.0-pro',
            'gemini-1.5-pro'
        ];

        validModels.sort((a, b) => {
            const ai = preference.findIndex(name => a.name.includes(name));
            const bi = preference.findIndex(name => b.name.includes(name));
            const aScore = ai === -1 ? 999 : ai;
            const bScore = bi === -1 ? 999 : bi;
            return aScore - bScore || a.name.localeCompare(b.name);
        });

        if (!validModels.length) {
            throw new Error('No compatible Gemini models found for this API key in your region.');
        }

        availableModel = validModels[0].name;
        modelKeyFingerprint = fingerprint;
        return availableModel;
    }

    async function generateKrishnaResponse(userMessage, chatHistory = [], options = {}) {
        const apiKey = getApiKey();
        if (!apiKey) {
            return generateLocalResponse(userMessage, options);
        }

        const language = options.language || (typeof I18n !== 'undefined' ? I18n.getLanguage() : 'en');
        const verseContext = getVerseContext(userMessage, options);
        const modelName = await getAvailableModel(apiKey);
        const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
        const contents = [];

        chatHistory.slice(-8).forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        });

        const contextText = verseContext.length
            ? verseContext.map(verse => formatVerseForPrompt(verse, language)).join('\n\n---\n\n')
            : 'No local verse context available. Use only well-known Bhagavad Gita teachings and avoid inventing verse references.';

        contents.push({
            role: 'user',
            parts: [{
                text: [
                    `Seeker question: ${userMessage}`,
                    '',
                    'Relevant local Bhagavad Gita verse context:',
                    contextText
                ].join('\n')
            }]
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: buildSystemPrompt({ ...options, language }) }]
                },
                contents,
                generationConfig: {
                    temperature: 0.55,
                    topP: 0.9,
                    maxOutputTokens: 1200
                }
            })
        });

        if (!response.ok) {
            let errMsg = 'Failed to fetch response from AI';
            try {
                const errorData = await response.json();
                errMsg = errorData.error?.message || errMsg;
            } catch (e) {}
            throw new Error(errMsg);
        }

        const data = await response.json();
        const part = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!part) {
            throw new Error('No response generated');
        }

        return part;
    }

    function isCrisisMessage(message) {
        return /\b(suicide|kill myself|end my life|self harm|hurt myself|मरना|आत्महत्या|खुद को नुकसान)\b/i.test(message);
    }

    function generateLocalResponse(userMessage, options = {}) {
        const language = options.language || (typeof I18n !== 'undefined' ? I18n.getLanguage() : 'en');
        const mode = options.mode || 'guidance';
        const verses = getVerseContext(userMessage, options);
        const verse = verses[0] || (typeof GitaVerseLibrary !== 'undefined' ? GitaVerseLibrary.getDailyVerse() : null);

        if (!verse || typeof GitaVerseLibrary === 'undefined') {
            return language === 'hi'
                ? 'मैं अभी स्थानीय श्लोक संदर्भ नहीं पढ़ पा रहा हूँ। कृपया बाद में पुनः प्रयास करें।<suggestions>कर्म योग क्या है? | मन को शांत कैसे करूँ? | धर्म कैसे समझूँ?</suggestions>'
                : 'I cannot read the local verse context right now. Please try again in a moment.<suggestions>What is karma yoga? | How do I calm my mind? | How do I understand dharma?</suggestions>';
        }

        const reference = GitaVerseLibrary.formatReference(verse);
        const meaning = GitaVerseLibrary.textFor(verse, 'meaning', language);
        const practice = GitaVerseLibrary.textFor(verse, 'practice', language);

        if (isCrisisMessage(userMessage)) {
            return language === 'hi'
                ? `**पहले सुरक्षा**\n\nयदि आप स्वयं को नुकसान पहुँचाने के बारे में सोच रहे हैं, तो अभी किसी भरोसेमंद व्यक्ति, स्थानीय आपातकालीन सेवा, या मानसिक स्वास्थ्य सहायता से संपर्क करें। अकेले मत रहें।\n\n**गीता आधार: अध्याय ${reference}**\n\n${verse.sanskrit}\n\n${meaning}\n\n**अभी का छोटा कदम**\n${practice}\n\n<suggestions>मैं अभी सुरक्षित रहने के लिए क्या करूँ? | मन को स्थिर कैसे करूँ? | किससे बात करूँ?</suggestions>`
                : `**Safety first**\n\nIf you are thinking about harming yourself, please contact a trusted person, local emergency services, or a mental health crisis line now. Do not stay alone with this.\n\n**Gita Anchor: Chapter ${reference}**\n\n${verse.sanskrit}\n\n${meaning}\n\n**One small step now**\n${practice}\n\n<suggestions>What can I do to stay safe right now? | How do I steady my mind? | Who should I talk to?</suggestions>`;
        }

        if (language === 'hi') {
            const modeLead = mode === 'study'
                ? 'इस श्लोक को समझने का सरल तरीका यह है:'
                : mode === 'sadhana'
                    ? 'आज की साधना को छोटा और स्थिर रखें:'
                    : mode === 'decision'
                        ? 'निर्णय के लिए फल से हटकर धर्म पर लौटें:'
                        : 'कृष्ण की शिक्षा आपको कर्म, समत्व और श्रद्धा की ओर लौटा रही है:';

            return `**मार्गदर्शन**\n${modeLead} परिस्थिति को पूरी तरह नियंत्रित करने की जगह अपने अगले सही कर्म को स्पष्ट करें।\n\n**गीता आधार: अध्याय ${reference}**\n\n${verse.sanskrit}\n\n${meaning}\n\n**आज का अभ्यास**\n${practice}\n\n**चिंतन प्रश्न**\nयदि मैं फल की चिंता थोड़ी कम कर दूँ, तो अभी मेरा धर्मपूर्ण अगला कदम क्या होगा?\n\n<suggestions>कर्म योग को जीवन में कैसे लागू करूँ? | मन को स्थिर कैसे करूँ? | इस स्थिति में मेरा धर्म क्या है?</suggestions>`;
        }

        const modeLead = mode === 'study'
            ? 'A clear way to study this verse is to separate the principle from the emotion around it:'
            : mode === 'sadhana'
                ? 'Keep today’s practice small, sincere, and repeatable:'
                : mode === 'decision'
                    ? 'For this decision, move attention from the result back to dharma:'
                    : 'Krishna’s teaching brings you back to action, balance, and trust:';

        return `**Guidance**\n${modeLead} do the next right action without making your peace depend entirely on the outcome.\n\n**Gita Anchor: Chapter ${reference}**\n\n${verse.sanskrit}\n\n${meaning}\n\n**Practice for today**\n${practice}\n\n**Reflection**\nIf I release some anxiety about the result, what is the most dharmic next step available now?\n\n<suggestions>How do I practice karma yoga? | How can I calm my mind? | What is my dharma in this situation?</suggestions>`;
    }

    return {
        getApiKey,
        setApiKey,
        clearApiKey,
        hasApiKey,
        generateKrishnaResponse,
        generateLocalResponse
    };
})();
