/* ============================================
   Gita AI Companion
   Verse-grounded guidance, BYOK AI, reflections
   ============================================ */

const GitaPage = (() => {
    const REFLECTIONS_KEY = 'kdp_gita_reflections';
    const ANSWER_LANGUAGE_KEY = 'kdp_gita_answer_language';
    const SUPPORT_CONFIG = {
        upiId: '',
        paymentLink: '',
        qrImage: '',
        email: ''
    };
    let chatHistory = [];
    let isTyping = false;
    let selectedMode = 'guidance';
    let selectedFocus = 'duty';
    let selectedAnswerLanguage = localStorage.getItem(ANSWER_LANGUAGE_KEY) || null;
    let lastExchange = null;
    let recognitionInstance = null;

    const answerLanguages = [
        { code: 'en', label: 'English', speech: 'en-IN' },
        { code: 'hi', label: 'हिंदी', speech: 'hi-IN' },
        { code: 'sa', label: 'संस्कृत', speech: 'hi-IN' },
        { code: 'bn', label: 'বাংলা', speech: 'bn-IN' },
        { code: 'gu', label: 'ગુજરાતી', speech: 'gu-IN' },
        { code: 'kn', label: 'ಕನ್ನಡ', speech: 'kn-IN' },
        { code: 'ml', label: 'മലയാളം', speech: 'ml-IN' },
        { code: 'mr', label: 'मराठी', speech: 'mr-IN' },
        { code: 'or', label: 'ଓଡ଼ିଆ', speech: 'or-IN' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ', speech: 'pa-IN' },
        { code: 'ta', label: 'தமிழ்', speech: 'ta-IN' },
        { code: 'te', label: 'తెలుగు', speech: 'te-IN' },
        { code: 'as', label: 'অসমীয়া', speech: 'as-IN' },
        { code: 'bho', label: 'भोजपुरी', speech: 'hi-IN' },
        { code: 'mai', label: 'मैथिली', speech: 'hi-IN' },
        { code: 'ne', label: 'नेपाली', speech: 'ne-NP' }
    ];

    const modes = [
        { id: 'guidance', label: 'gita.mode_guidance', desc: 'gita.mode_guidance_desc' },
        { id: 'study', label: 'gita.mode_study', desc: 'gita.mode_study_desc' },
        { id: 'sadhana', label: 'gita.mode_sadhana', desc: 'gita.mode_sadhana_desc' },
        { id: 'decision', label: 'gita.mode_decision', desc: 'gita.mode_decision_desc' }
    ];

    const focusAreas = [
        { id: 'duty', label: 'gita.focus_duty' },
        { id: 'anxiety', label: 'gita.focus_anxiety' },
        { id: 'relationship', label: 'gita.focus_relationship' },
        { id: 'discipline', label: 'gita.focus_discipline' },
        { id: 'devotion', label: 'gita.focus_devotion' }
    ];

    const promptKeys = [
        { label: 'gita.quick_1', prompt: 'gita.quick_1_prompt' },
        { label: 'gita.quick_2', prompt: 'gita.quick_2_prompt' },
        { label: 'gita.quick_3', prompt: 'gita.quick_3_prompt' },
        { label: 'gita.quick_4', prompt: 'gita.quick_4_prompt' },
        { label: 'gita.quick_5', prompt: 'gita.quick_5_prompt' },
        { label: 'gita.quick_6', prompt: 'gita.quick_6_prompt' }
    ];

    function t(key, fallback) {
        return typeof I18n !== 'undefined' ? I18n.t(key, fallback) : fallback;
    }

    function getLanguage() {
        return typeof I18n !== 'undefined' ? I18n.getLanguage() : 'en';
    }

    function getAnswerLanguage() {
        if (!selectedAnswerLanguage) {
            selectedAnswerLanguage = getLanguage();
        }
        return selectedAnswerLanguage;
    }

    function getAnswerLanguageLabel() {
        const language = answerLanguages.find(item => item.code === getAnswerLanguage());
        return language ? language.label : 'English';
    }

    function getDailyVerse() {
        return typeof GitaVerseLibrary !== 'undefined' ? GitaVerseLibrary.getDailyVerse() : null;
    }

    function render() {
        const dailyVerse = getDailyVerse();
        const verseCount = typeof GitaVerseLibrary !== 'undefined' ? GitaVerseLibrary.verses.length : 0;
        const hasApiKey = typeof LLM !== 'undefined' && LLM.hasApiKey();

        return `
            <div class="page-enter gita-ai-page">
                <div class="gita-hero-bar">
                    <button class="gita-back-btn" onclick="GitaPage.goBack()" type="button">
                        <span>←</span>
                        <span>${t('gita.back_to_app', 'Back to app')}</span>
                    </button>
                    <div class="gita-title-block">
                        <div class="gita-kicker">${t('gita.kicker', 'Bhagavad Gita guidance')}</div>
                        <h1>${t('gita.title', 'Gita AI Companion')}</h1>
                        <p>${t('gita.subtitle', 'Seek wisdom from the Bhagavad Gita')}</p>
                    </div>
                    <div class="gita-hero-actions">
                        <span class="gita-status ${hasApiKey ? 'online' : 'local'}">${hasApiKey ? t('gita.ai_ready', 'AI ready') : t('gita.local_ready', 'Local verse mode')}</span>
                        <label class="gita-language-select-wrap" aria-label="${t('gita.answer_language', 'Answer language')}">
                            <select id="gitaAnswerLanguage" class="gita-language-select" onchange="GitaPage.setAnswerLanguage(this.value)">
                                ${answerLanguages.map(language => `
                                    <option value="${language.code}" ${getAnswerLanguage() === language.code ? 'selected' : ''}>${language.label}</option>
                                `).join('')}
                            </select>
                        </label>
                        <button class="btn btn-outline btn-sm" onclick="GitaPage.openJournalModal()">${t('gita.reflections', 'Reflections')}</button>
                        <button class="btn btn-outline btn-sm" onclick="GitaPage.openSettingsModal()">${t('gita.settings', 'Settings')}</button>
                        <div class="gita-menu-wrap">
                            <button class="btn btn-outline btn-sm gita-menu-trigger" onclick="GitaPage.toggleMenu()" aria-label="${t('gita.more_menu', 'More options')}" type="button">☰</button>
                            <div id="gitaMoreMenu" class="gita-more-menu" hidden>
                                <button onclick="GitaPage.openAboutModal()" type="button">${t('gita.about', 'About')}</button>
                                <button onclick="GitaPage.openPrivacyModal()" type="button">${t('gita.privacy', 'Privacy')}</button>
                                <button onclick="GitaPage.openSupportModal()" type="button">${t('gita.support', 'Support')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="gita-product-grid">
                    <aside class="gita-side-panel">
                        ${renderDailyVerse(dailyVerse)}
                        <div class="gita-panel-section">
                            <div class="gita-section-title">${t('gita.guidance_mode', 'Guidance mode')}</div>
                            <div class="gita-mode-grid">
                                ${modes.map(mode => `
                                    <button class="gita-mode-btn ${selectedMode === mode.id ? 'active' : ''}" onclick="GitaPage.setMode('${mode.id}')" type="button">
                                        <strong>${t(mode.label, mode.id)}</strong>
                                        <span>${t(mode.desc, '')}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="gita-panel-section">
                            <div class="gita-section-title">${t('gita.focus_area', 'Focus area')}</div>
                            <div class="gita-focus-row">
                                ${focusAreas.map(focus => `
                                    <button class="gita-focus-chip ${selectedFocus === focus.id ? 'active' : ''}" onclick="GitaPage.setFocus('${focus.id}')" type="button">
                                        ${t(focus.label, focus.id)}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="gita-panel-section gita-grounding-note">
                            <strong>${t('gita.grounded_title', 'Grounded by scripture')}</strong>
                            <span>${t('gita.grounded_desc', '{count} curated Gita anchors guide local fallback and AI context.').replace('{count}', verseCount)}</span>
                        </div>
                    </aside>

                    <section class="gita-chat-shell">
                        <div id="gitaChatMessages" class="gita-chat-messages">
                            ${renderWelcomeBubble()}
                        </div>

                        <div class="gita-input-area" style="padding-top: var(--space-4);">
                            <div class="chat-input-container">
                                <input type="text" class="form-control" id="gitaChatInput"
                                       placeholder="${t('gita.input_placeholder', 'Ask Krishna for guidance...')}"
                                       onkeypress="if(event.key==='Enter') GitaPage.sendMessage()">
                                <button class="btn btn-outline gita-voice-btn" onclick="GitaPage.startVoiceInput()" id="gitaVoiceBtn" aria-label="${t('gita.voice_input', 'Voice input')}" type="button">
                                    <span>🎙</span>
                                </button>
                                <button class="btn btn-primary gita-send-btn" onclick="GitaPage.sendMessage()" id="gitaSendBtn" aria-label="${t('gita.send', 'Send')}">
                                    <span>➤</span>
                                </button>
                            </div>
                            <div class="gita-disclaimer">${t('gita.disclaimer', 'AI responses are generated based on the Bhagavad Gita. Requires a Gemini API Key.')}</div>
                        </div>
                    </section>
                </div>

                <div id="gitaApiModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; z-index: 1000;">
                    <div class="card card-glass gita-settings-modal">
                        <h2>${t('gita.modal_title', 'AI Settings')}</h2>
                        <p>${t('gita.modal_desc', 'To use the Gita AI Companion, you need a free Google Gemini API Key. Your key is stored securely in your browser local storage and is never sent to our servers.')}</p>
                        <div class="form-group">
                            <label class="form-label">${t('gita.modal_label', 'Gemini API Key')}</label>
                            <input type="password" id="gitaApiKeyInput" class="form-control" placeholder="AIzaSy...">
                        </div>
                        <div class="gita-modal-footnote">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">${t('gita.modal_link', 'Get a free Gemini API Key here')}</a>
                            <span>${t('gita.local_mode_note', 'Without a key, the page still gives local verse-grounded guidance.')}</span>
                        </div>
                        <div class="gita-modal-actions">
                            <button class="btn btn-outline" onclick="GitaPage.closeSettingsModal()">${t('gita.btn_cancel', 'Cancel')}</button>
                            ${hasApiKey ? `<button class="btn btn-outline" onclick="GitaPage.clearApiKey()">${t('gita.remove_key', 'Remove key')}</button>` : ''}
                            <button class="btn btn-primary" onclick="GitaPage.saveApiKey()">${t('gita.btn_save', 'Save Key')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderDailyVerse(verse) {
        if (!verse || typeof GitaVerseLibrary === 'undefined') return '';
        return `
            <div class="gita-daily-card">
                <div class="gita-section-title">${t('gita.daily_verse', 'Today’s verse')}</div>
                <div class="gita-reference">${t('gita.chapter', 'Chapter')} ${GitaVerseLibrary.formatReference(verse)}</div>
                <div class="gita-sanskrit">${verse.sanskrit.replace(/\n/g, '<br>')}</div>
                <p>${GitaVerseLibrary.textFor(verse, 'meaning', getLanguage())}</p>
                <button class="btn btn-primary btn-sm" onclick="GitaPage.askDailyVerse()">${t('gita.reflect_on_this', 'Reflect on this')}</button>
            </div>
        `;
    }

    function renderWelcomeBubble() {
        return `
            <div class="chat-bubble assistant divine-bubble">
                <strong>${t('gita.welcome_title', 'Radhe Radhe!')}</strong><br><br>
                ${t('gita.welcome_desc', 'I am your AI companion inspired by the teachings of Lord Krishna in the Bhagavad Gita.')}<br>
                ${t('gita.welcome_prompt', 'Tell me, what troubles your mind today? How can I guide you towards peace and clarity?')}
                
                <div class="gita-welcome-prompts mt-4">
                    ${promptKeys.map(item => `
                        <button class="gita-prompt-chip" onclick="GitaPage.askPrompt('${item.prompt}')" type="button">${t(item.label, item.label)}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function afterRender() {
        chatHistory = [];
        isTyping = false;
        lastExchange = null;
        updateActionButtons();
    }

    function setMode(mode) {
        selectedMode = mode;
        document.querySelectorAll('.gita-mode-btn').forEach(btn => btn.classList.remove('active'));
        const target = Array.from(document.querySelectorAll('.gita-mode-btn')).find(btn => btn.getAttribute('onclick')?.includes(`'${mode}'`));
        if (target) target.classList.add('active');
    }

    function setFocus(focus) {
        selectedFocus = focus;
        document.querySelectorAll('.gita-focus-chip').forEach(btn => btn.classList.remove('active'));
        const target = Array.from(document.querySelectorAll('.gita-focus-chip')).find(btn => btn.getAttribute('onclick')?.includes(`'${focus}'`));
        if (target) target.classList.add('active');
    }

    function setAnswerLanguage(language) {
        selectedAnswerLanguage = answerLanguages.some(item => item.code === language) ? language : 'en';
        localStorage.setItem(ANSWER_LANGUAGE_KEY, selectedAnswerLanguage);
        Components.showToast(t('gita.language_saved', 'Answer language updated'), 'success');
    }

    function toggleMenu() {
        const menu = document.getElementById('gitaMoreMenu');
        if (!menu) return;
        menu.hidden = !menu.hidden;
    }

    function closeMenu() {
        const menu = document.getElementById('gitaMoreMenu');
        if (menu) menu.hidden = true;
    }

    function openAboutModal() {
        closeMenu();
        Components.openModal(`
            <div class="gita-info-modal">
                <h2>${t('gita.about_title', 'About Gita AI')}</h2>
                <p>${t('gita.about_p1', 'Gita AI is a scripture-grounded guidance companion for reflection, study, sadhana, and decision clarity.')}</p>
                <p>${t('gita.about_p2', 'It uses curated Bhagavad Gita anchors for local answers, and can use your own Gemini API key for richer responses when you choose to add one.')}</p>
                <p>${t('gita.about_p3', 'This tool is for spiritual reflection and learning. For medical, legal, safety, or serious mental health concerns, please seek qualified human support.')}</p>
            </div>
        `);
    }

    function openPrivacyModal() {
        closeMenu();
        Components.openModal(`
            <div class="gita-info-modal">
                <h2>${t('gita.privacy_title', 'Privacy')}</h2>
                <ul class="gita-info-list">
                    <li>${t('gita.privacy_p1', 'Your Gemini API key, saved reflections, and Gita preferences are stored in this browser local storage.')}</li>
                    <li>${t('gita.privacy_p2', 'In local verse mode, answers are generated in the browser from the curated verse library.')}</li>
                    <li>${t('gita.privacy_p3', 'When you use a Gemini API key, your question and selected verse context are sent to Google Gemini to generate the answer.')}</li>
                    <li>${t('gita.privacy_p4', 'Do not enter highly sensitive personal, medical, legal, financial, or emergency information into the chat.')}</li>
                </ul>
            </div>
        `);
    }

    function openSupportModal() {
        closeMenu();
        const hasSupport = SUPPORT_CONFIG.upiId || SUPPORT_CONFIG.paymentLink || SUPPORT_CONFIG.qrImage || SUPPORT_CONFIG.email;
        const supportBody = hasSupport
            ? `
                ${SUPPORT_CONFIG.qrImage ? `<img class="gita-support-qr" src="${SUPPORT_CONFIG.qrImage}" alt="${t('gita.support_qr_alt', 'Support QR code')}">` : ''}
                ${SUPPORT_CONFIG.upiId ? `<p><strong>${t('gita.support_upi', 'UPI ID')}:</strong> <button class="gita-link-button" onclick="GitaPage.copySupportText('${escapeAttribute(SUPPORT_CONFIG.upiId)}')" type="button">${escapeHtml(SUPPORT_CONFIG.upiId)}</button></p>` : ''}
                ${SUPPORT_CONFIG.paymentLink ? `<p><a href="${escapeAttribute(SUPPORT_CONFIG.paymentLink)}" target="_blank" rel="noopener">${t('gita.support_payment_link', 'Open support link')}</a></p>` : ''}
                ${SUPPORT_CONFIG.email ? `<p><a href="mailto:${escapeAttribute(SUPPORT_CONFIG.email)}">${escapeHtml(SUPPORT_CONFIG.email)}</a></p>` : ''}
            `
            : `<p>${t('gita.support_not_configured', 'Support details are not configured yet. Add your own payment link, UPI ID, or QR asset before launch.')}</p>`;

        Components.openModal(`
            <div class="gita-info-modal gita-support-modal">
                <h2>${t('gita.support_title', 'Support this project')}</h2>
                <p>${t('gita.support_desc', 'If this companion helps your spiritual practice, you can support its maintenance and future improvements.')}</p>
                ${supportBody}
            </div>
        `);
    }

    function copySupportText(value) {
        if (!value || !navigator.clipboard) return;
        navigator.clipboard.writeText(value)
            .then(() => Components.showToast(t('gita.copied', 'Copied'), 'success'))
            .catch(() => Components.showToast(t('gita.copy_failed', 'Could not copy'), 'error'));
    }

    function openSettingsModal() {
        const modal = document.getElementById('gitaApiModal');
        const input = document.getElementById('gitaApiKeyInput');
        if (modal && input) {
            input.value = typeof LLM !== 'undefined' ? LLM.getApiKey() : '';
            modal.style.display = 'flex';
        }
    }

    function closeSettingsModal() {
        const modal = document.getElementById('gitaApiModal');
        if (modal) modal.style.display = 'none';
    }

    function saveApiKey() {
        const input = document.getElementById('gitaApiKeyInput');
        if (!input || typeof LLM === 'undefined') return;
        const key = input.value.trim();
        if (key.length < 12) {
            Components.showToast(t('gita.key_invalid', 'Please enter a valid key'), 'error');
            return;
        }
        LLM.setApiKey(key);
        closeSettingsModal();
        Components.showToast(t('gita.key_saved', 'API key saved successfully'), 'success');
        Router.navigate('gita');
    }

    function clearApiKey() {
        if (typeof LLM !== 'undefined') LLM.clearApiKey();
        closeSettingsModal();
        Components.showToast(t('gita.key_removed', 'API key removed. Local verse mode is active.'), 'success');
        Router.navigate('gita');
    }

    function askPrompt(promptKey) {
        ask(t(promptKey, ''));
    }

    function askDailyVerse() {
        const verse = getDailyVerse();
        if (!verse || typeof GitaVerseLibrary === 'undefined') return;
        const prompt = t('gita.daily_prompt', 'Help me reflect on Bhagavad Gita {ref}: {meaning}')
            .replace('{ref}', verse.id)
            .replace('{meaning}', GitaVerseLibrary.textFor(verse, 'meaning', getLanguage()));
        ask(prompt);
    }

    function ask(question) {
        const input = document.getElementById('gitaChatInput');
        if (input) {
            input.value = question;
            sendMessage();
        }
    }

    function startVoiceInput() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const input = document.getElementById('gitaChatInput');
        const voiceBtn = document.getElementById('gitaVoiceBtn');

        if (!SpeechRecognition || !input) {
            Components.showToast(t('gita.voice_unsupported', 'Voice input is not supported in this browser.'), 'warning');
            return;
        }

        if (recognitionInstance) {
            recognitionInstance.stop();
            recognitionInstance = null;
            if (voiceBtn) voiceBtn.classList.remove('active');
            return;
        }

        const language = answerLanguages.find(item => item.code === getAnswerLanguage()) || answerLanguages[0];
        const recognition = new SpeechRecognition();
        recognition.lang = language.speech;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionInstance = recognition;
        if (voiceBtn) voiceBtn.classList.add('active');

        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript || '';
            input.value = transcript.trim();
            input.focus();
        };

        recognition.onerror = () => {
            Components.showToast(t('gita.voice_failed', 'Could not hear clearly. Please try again.'), 'warning');
        };

        recognition.onend = () => {
            recognitionInstance = null;
            if (voiceBtn) voiceBtn.classList.remove('active');
        };

        recognition.start();
    }

    async function sendMessage() {
        if (isTyping || typeof LLM === 'undefined') return;

        const input = document.getElementById('gitaChatInput');
        const message = input ? input.value.trim() : '';
        if (!message) return;

        const prompts = document.getElementById('gitaQuickPrompts');
        if (prompts) prompts.style.display = 'none';
        input.value = '';

        addBubble(message, 'user');
        setBusy(true);

        const typingId = 'typing-' + Date.now();
        addBubble('<div class="typing-indicator"><span></span><span></span><span></span></div>', 'assistant', typingId, true);

        const verseContext = typeof GitaVerseLibrary !== 'undefined'
            ? GitaVerseLibrary.search(`${message} ${selectedFocus}`, 3)
            : [];

        try {
            if (!LLM.hasApiKey()) {
                Components.showToast(t('gita.local_mode_toast', 'Answering from local Gita verse mode. Add an API key for richer AI guidance.'), 'info');
            }

            let finalResponse = await LLM.generateKrishnaResponse(message, chatHistory, {
                mode: selectedMode,
                focus: selectedFocus,
                language: getAnswerLanguage(),
                verseContext
            });

            renderAssistantResponse(message, finalResponse, typingId);
        } catch (error) {
            console.error(error);
            const fallback = LLM.generateLocalResponse(message, {
                mode: selectedMode,
                focus: selectedFocus,
                language: getAnswerLanguage(),
                verseContext
            });
            Components.showToast(t('gita.ai_fallback', 'AI service was unavailable, so I used local Gita verse guidance.'), 'warning');
            renderAssistantResponse(message, fallback, typingId);
        }
    }

    function renderAssistantResponse(userMessage, rawResponse, typingId) {
        let { answer, suggestions } = extractSuggestions(rawResponse);
        answer = escapeHtml(answer);

        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const responseBubbleId = 'msg-' + Date.now();
        addBubble('', 'assistant', responseBubbleId, true);

        const words = answer.split(' ');
        let currentText = '';
        let i = 0;
        const bubble = document.getElementById(responseBubbleId);

        function finish() {
            chatHistory.push({ role: 'user', text: userMessage });
            chatHistory.push({ role: 'assistant', text: answer });
            lastExchange = {
                question: userMessage,
                answer,
                mode: selectedMode,
                focus: selectedFocus,
                createdAt: new Date().toISOString()
            };
            setBusy(false);
            updateActionButtons();
            renderSuggestions(suggestions, bubble);
        }

        function typeNextWord() {
            if (i < words.length) {
                currentText += (i === 0 ? '' : ' ') + words[i];
                if (bubble) {
                    bubble.innerHTML = formatMarkdown(currentText);
                    scrollChatToBottom();
                }
                i += 1;
                setTimeout(typeNextWord, 24);
            } else {
                finish();
            }
        }

        typeNextWord();
    }

    function renderSuggestions(suggestions, bubble) {
        if (!bubble) return;
        
        const actionRow = document.createElement('div');
        actionRow.className = 'gita-bubble-actions mt-3';
        actionRow.style.display = 'flex';
        actionRow.style.flexWrap = 'wrap';
        actionRow.style.gap = '8px';
        actionRow.style.borderTop = '1px solid rgba(212, 175, 55, 0.15)';
        actionRow.style.paddingTop = '12px';

        actionRow.innerHTML = `
            <button class="btn btn-outline btn-xs" onclick="GitaPage.copyLastAnswer()"><span style="font-size: 1.1em; margin-right: 4px;">📋</span> ${t('gita.copy_answer', 'Copy')}</button>
            <button class="btn btn-outline btn-xs" onclick="GitaPage.saveLastReflection()"><span style="font-size: 1.1em; margin-right: 4px;">🔖</span> ${t('gita.save_reflection', 'Save')}</button>
            <button class="btn btn-outline btn-xs" onclick="GitaPage.shareLastAnswer()"><span style="font-size: 1.1em; margin-right: 4px;">📤</span> ${t('gita.share', 'Share')}</button>
            <button class="btn btn-outline btn-xs" onclick="GitaPage.retryLastQuestion()"><span style="font-size: 1.1em; margin-right: 4px;">🔄</span> ${t('gita.retry', 'Retry')}</button>
        `;
        bubble.appendChild(actionRow);

        if (suggestions.length > 0) {
            const suggContainer = document.createElement('div');
            suggContainer.className = 'gita-suggestions mt-2';
            suggContainer.style.display = 'flex';
            suggContainer.style.flexWrap = 'wrap';
            suggContainer.style.gap = '8px';

            suggestions.slice(0, 3).forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-chip btn btn-outline btn-sm';
                btn.innerText = suggestion;
                btn.onclick = () => GitaPage.ask(suggestion);
                suggContainer.appendChild(btn);
            });
            bubble.appendChild(suggContainer);
        }
        
        scrollChatToBottom();
    }

    function extractSuggestions(response) {
        let answer = String(response || '').trim();
        let suggestions = [];
        const suggestionMatch = answer.match(/<suggestions>([\s\S]*?)<\/suggestions>/i);
        if (suggestionMatch) {
            suggestions = suggestionMatch[1]
                .replace(/\n[-*]/g, '|')
                .split(/[|\n]+/)
                .map(s => s.trim().replace(/^[-*]\s*/, ''))
                .filter(s => s.length > 3);
            answer = answer.replace(/<suggestions>[\s\S]*?<\/suggestions>/i, '').trim();
        }
        return { answer, suggestions };
    }

    function addBubble(content, type, id = null, allowHtml = false) {
        const container = document.getElementById('gitaChatMessages');
        if (!container) return;

        const bubble = document.createElement('div');
        bubble.className = type === 'assistant'
            ? 'chat-bubble assistant divine-bubble'
            : 'chat-bubble user modern-bubble';
        if (id) bubble.id = id;
        if (allowHtml) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }

        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(10px)';
        bubble.style.transition = 'all 0.3s ease';
        container.appendChild(bubble);
        void bubble.offsetWidth;
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
        scrollChatToBottom();
    }

    function setBusy(value) {
        isTyping = value;
        const btn = document.getElementById('gitaSendBtn');
        const input = document.getElementById('gitaChatInput');
        if (btn) {
            btn.disabled = value;
            btn.style.opacity = value ? '0.55' : '1';
        }
        if (input) input.disabled = value;
    }

    function updateActionButtons() {
        // Obsolete, actions are now rendered directly inside bubbles.
    }

    function copyLastAnswer() {
        if (!lastExchange) return;
        const plain = stripHtml(formatMarkdown(lastExchange.answer));
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(plain)
                .then(() => Components.showToast(t('gita.copied', 'Answer copied'), 'success'))
                .catch(() => Components.showToast(t('gita.copy_failed', 'Could not copy answer'), 'error'));
        } else {
            Components.showToast(t('gita.copy_failed', 'Could not copy answer'), 'error');
        }
    }

    function saveLastReflection() {
        if (!lastExchange) return;
        const reflections = getReflections();
        reflections.unshift(lastExchange);
        localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections.slice(0, 30)));
        Components.showToast(t('gita.reflection_saved', 'Reflection saved'), 'success');
    }

    function retryLastQuestion() {
        if (!lastExchange || isTyping) return;
        ask(lastExchange.question);
    }

    function shareLastAnswer() {
        if (!lastExchange) return;
        const plainAnswer = stripHtml(formatMarkdown(lastExchange.answer));
        const shareText = `${t('gita.share_question', 'Question')}: ${lastExchange.question}\n\n${plainAnswer}`;

        if (navigator.share) {
            navigator.share({
                title: t('gita.title', 'Gita AI Companion'),
                text: shareText
            }).catch(() => {});
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => Components.showToast(t('gita.share_copied', 'Share text copied'), 'success'))
                .catch(() => Components.showToast(t('gita.copy_failed', 'Could not copy answer'), 'error'));
        } else {
            Components.showToast(t('gita.share_unavailable', 'Sharing is not available in this browser'), 'warning');
        }
    }

    function openJournalModal() {
        const reflections = getReflections();
        const body = reflections.length
            ? reflections.map(item => `
                <div class="gita-journal-item">
                    <div class="gita-journal-date">${new Date(item.createdAt).toLocaleString(getLanguage() === 'hi' ? 'hi-IN' : 'en-IN')}</div>
                    <div class="gita-journal-question"><strong>Q: ${escapeHtml(item.question)}</strong></div>
                    <div class="gita-reflection-body">${formatMarkdown(item.answer)}</div>
                </div>
            `).join('')
            : `<p class="text-muted" style="text-align: center; padding: 2rem 0;">${t('gita.no_reflections', 'No saved reflections yet.')}</p>`;

        Components.openModal(`
            <div class="gita-journal-container">
                <h2 style="margin-bottom: var(--space-4); border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 12px;">${t('gita.reflections', 'Reflections')}</h2>
                <div class="gita-journal-list">${body}</div>
            </div>
        `);
    }

    function getReflections() {
        try {
            return JSON.parse(localStorage.getItem(REFLECTIONS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function clearChat() {
        chatHistory = [];
        lastExchange = null;
        const messages = document.getElementById('gitaChatMessages');
        const prompts = document.getElementById('gitaQuickPrompts');
        if (messages) messages.innerHTML = renderWelcomeBubble();
        if (prompts) prompts.style.display = 'flex';
        updateActionButtons();
    }

    function goBack() {
        const previousPage = sessionStorage.getItem('kdp_last_non_gita_route') || 'home';
        Router.navigate(previousPage === 'gita' ? 'home' : previousPage);
    }

    function scrollChatToBottom() {
        const container = document.getElementById('gitaChatMessages');
        if (container) container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, '&#096;');
    }

    function stripHtml(value) {
        const div = document.createElement('div');
        div.innerHTML = value;
        return div.textContent || div.innerText || '';
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    return {
        render,
        afterRender,
        sendMessage,
        ask,
        askPrompt,
        askDailyVerse,
        startVoiceInput,
        setMode,
        setFocus,
        setAnswerLanguage,
        toggleMenu,
        openAboutModal,
        openPrivacyModal,
        openSupportModal,
        copySupportText,
        openSettingsModal,
        closeSettingsModal,
        saveApiKey,
        clearApiKey,
        copyLastAnswer,
        saveLastReflection,
        retryLastQuestion,
        shareLastAnswer,
        openJournalModal,
        clearChat,
        goBack
    };
})();
