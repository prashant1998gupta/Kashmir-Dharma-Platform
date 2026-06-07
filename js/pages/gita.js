/* ============================================
   Gita AI Companion
   Verse-grounded guidance, BYOK AI, reflections
   ============================================ */

const GitaPage = (() => {
    const REFLECTIONS_KEY = 'kdp_gita_reflections';
    let chatHistory = [];
    let isTyping = false;
    let selectedMode = 'guidance';
    let selectedFocus = 'duty';
    let lastExchange = null;

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
                        <button class="btn btn-outline btn-sm" onclick="GitaPage.openJournalModal()">${t('gita.reflections', 'Reflections')}</button>
                        <button class="btn btn-outline btn-sm" onclick="GitaPage.openSettingsModal()">${t('gita.settings', 'Settings')}</button>
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

                        <div id="gitaQuickPrompts" class="gita-prompt-strip">
                            ${promptKeys.map(item => `
                                <button class="gita-prompt-chip" onclick="GitaPage.askPrompt('${item.prompt}')" type="button">${t(item.label, item.label)}</button>
                            `).join('')}
                        </div>

                        <div class="gita-chat-actions">
                            <button class="btn btn-outline btn-sm" onclick="GitaPage.copyLastAnswer()" id="gitaCopyBtn" disabled>${t('gita.copy_answer', 'Copy answer')}</button>
                            <button class="btn btn-outline btn-sm" onclick="GitaPage.saveLastReflection()" id="gitaSaveBtn" disabled>${t('gita.save_reflection', 'Save reflection')}</button>
                            <button class="btn btn-outline btn-sm" onclick="GitaPage.clearChat()">${t('gita.clear_chat', 'Clear')}</button>
                        </div>

                        <div class="gita-input-area">
                            <div class="chat-input-container">
                                <input type="text" class="form-control" id="gitaChatInput"
                                       placeholder="${t('gita.input_placeholder', 'Ask Krishna for guidance...')}"
                                       onkeypress="if(event.key==='Enter') GitaPage.sendMessage()">
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
                language: getLanguage(),
                verseContext
            });

            renderAssistantResponse(message, finalResponse, typingId);
        } catch (error) {
            console.error(error);
            const fallback = LLM.generateLocalResponse(message, {
                mode: selectedMode,
                focus: selectedFocus,
                language: getLanguage(),
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
        if (!suggestions.length || !bubble) return;
        const suggContainer = document.createElement('div');
        suggContainer.className = 'gita-suggestions';

        suggestions.slice(0, 3).forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip';
            btn.innerText = suggestion;
            btn.onclick = () => GitaPage.ask(suggestion);
            suggContainer.appendChild(btn);
        });
        bubble.appendChild(suggContainer);
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
        const copyBtn = document.getElementById('gitaCopyBtn');
        const saveBtn = document.getElementById('gitaSaveBtn');
        if (copyBtn) copyBtn.disabled = !lastExchange;
        if (saveBtn) saveBtn.disabled = !lastExchange;
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

    function openJournalModal() {
        const reflections = getReflections();
        const body = reflections.length
            ? reflections.map(item => `
                <div class="gita-journal-item">
                    <div class="gita-journal-date">${new Date(item.createdAt).toLocaleString(getLanguage() === 'hi' ? 'hi-IN' : 'en-IN')}</div>
                    <strong>${escapeHtml(item.question)}</strong>
                    <p>${stripHtml(formatMarkdown(item.answer)).slice(0, 360)}${item.answer.length > 360 ? '...' : ''}</p>
                </div>
            `).join('')
            : `<p class="text-muted">${t('gita.no_reflections', 'No saved reflections yet.')}</p>`;

        Components.openModal(`
            <div style="padding: var(--space-2);">
                <h2 style="margin-bottom: var(--space-4);">${t('gita.reflections', 'Reflections')}</h2>
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
        setMode,
        setFocus,
        openSettingsModal,
        closeSettingsModal,
        saveApiKey,
        clearApiKey,
        copyLastAnswer,
        saveLastReflection,
        openJournalModal,
        clearChat,
        goBack
    };
})();
