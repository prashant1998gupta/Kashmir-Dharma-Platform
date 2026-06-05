/* ============================================
   Gita AI Page (GitaGPT Clone)
   ============================================ */

const GitaPage = (() => {
    let chatHistory = [];
    let isTyping = false;

    function render() {
        return `
            <div class="page-enter gita-ai-page bg-divine" style="height: calc(100vh - 120px); display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <div>
                        <h1 style="color: var(--color-primary); margin: 0; font-size: var(--text-2xl); display: flex; align-items: center; gap: var(--space-2);">
                            <span style="font-size: 1.5em;">🦚</span> ${I18n.t('gita.title')}
                        </h1>
                        <p style="color: var(--text-muted); margin-top: var(--space-1); font-size: var(--text-sm);">${I18n.t('gita.subtitle')}</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="GitaPage.openSettingsModal()" title="API Settings">
                        ⚙️ ${I18n.t('gita.settings')}
                    </button>
                </div>

                <div class="card gita-glass-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
                    <!-- Chat Messages Area -->
                    <div id="gitaChatMessages" style="flex: 1; overflow-y: auto; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4);">
                        <div class="chat-bubble assistant divine-bubble">
                            <strong>${I18n.t('gita.welcome_title')}</strong><br><br>
                            ${I18n.t('gita.welcome_desc')}<br>
                            ${I18n.t('gita.welcome_prompt')}
                        </div>
                    </div>

                    <!-- Quick Prompts (only show if chat is empty) -->
                    <div id="gitaQuickPrompts" style="padding: 0 var(--space-6) var(--space-4) var(--space-6); display: flex; gap: var(--space-2); flex-wrap: wrap;">
                        <button class="tag" style="background: var(--bg-tertiary); cursor: pointer; border: none;" onclick="GitaPage.ask('${I18n.t('gita.quick_1_prompt')}')">${I18n.t('gita.quick_1')}</button>
                        <button class="tag" style="background: var(--bg-tertiary); cursor: pointer; border: none;" onclick="GitaPage.ask('${I18n.t('gita.quick_2_prompt')}')">${I18n.t('gita.quick_2')}</button>
                        <button class="tag" style="background: var(--bg-tertiary); cursor: pointer; border: none;" onclick="GitaPage.ask('${I18n.t('gita.quick_3_prompt')}')">${I18n.t('gita.quick_3')}</button>
                    </div>

                    <!-- Input Area -->
                    <div style="padding: var(--space-4) var(--space-6); background: rgba(0,0,0,0.2); border-top: 1px solid var(--surface-border);">
                        <div class="chat-input-container" style="display: flex; gap: var(--space-3);">
                            <input type="text" class="form-control" id="gitaChatInput" 
                                   style="flex: 1; border-radius: 24px; padding: var(--space-3) var(--space-5); background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.2);"
                                   placeholder="${I18n.t('gita.input_placeholder')}"
                                   onkeypress="if(event.key==='Enter') GitaPage.sendMessage()">
                            <button class="btn btn-primary" style="border-radius: 50%; width: 52px; height: 52px; padding: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(163,38,38,0.4);" onclick="GitaPage.sendMessage()" id="gitaSendBtn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                        <div style="text-align: center; font-size: 11px; color: var(--text-muted); margin-top: var(--space-2);">
                            ${I18n.t('gita.disclaimer')}
                        </div>
                    </div>
                </div>

                <!-- API Settings Modal -->
                <div id="gitaApiModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; z-index: 1000;">
                    <div class="card card-glass" style="max-width: 500px; width: 90%; padding: var(--space-6);">
                        <h2 style="color: var(--color-primary); margin-bottom: var(--space-4);">${I18n.t('gita.modal_title')}</h2>
                        <p style="color: var(--text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-4);">
                            ${I18n.t('gita.modal_desc')}
                        </p>
                        <div class="form-group">
                            <label class="form-label">${I18n.t('gita.modal_label')}</label>
                            <input type="password" id="gitaApiKeyInput" class="form-control" placeholder="AIzaSy...">
                        </div>
                        <div style="font-size: var(--text-xs); margin-bottom: var(--space-5);">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--color-secondary);">${I18n.t('gita.modal_link')}</a>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: var(--space-3);">
                            <button class="btn btn-outline" onclick="document.getElementById('gitaApiModal').style.display = 'none'">${I18n.t('gita.btn_cancel')}</button>
                            <button class="btn btn-primary" onclick="GitaPage.saveApiKey()">${I18n.t('gita.btn_save')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        chatHistory = [];
        isTyping = false;
        
        // Auto-show API modal if key is missing
        if (!LLM.hasApiKey()) {
            setTimeout(() => {
                openSettingsModal();
            }, 1000);
        }
    }

    function openSettingsModal() {
        const modal = document.getElementById('gitaApiModal');
        const input = document.getElementById('gitaApiKeyInput');
        if (modal && input) {
            input.value = LLM.getApiKey();
            modal.style.display = 'flex';
        }
    }

    function saveApiKey() {
        const input = document.getElementById('gitaApiKeyInput');
        if (input) {
            const key = input.value.trim();
            if (key) {
                LLM.setApiKey(key);
                document.getElementById('gitaApiModal').style.display = 'none';
                Components.showToast('API Key saved successfully!', 'success');
            } else {
                Components.showToast('Please enter a valid key', 'error');
            }
        }
    }

    function ask(question) {
        const input = document.getElementById('gitaChatInput');
        if (input) {
            input.value = question;
            sendMessage();
        }
    }

    async function sendMessage() {
        if (isTyping) return;
        
        if (!LLM.hasApiKey()) {
            openSettingsModal();
            Components.showToast('Please configure your API Key first', 'error');
            return;
        }

        const input = document.getElementById('gitaChatInput');
        const message = input.value.trim();
        if (!message) return;

        // Hide quick prompts
        const prompts = document.getElementById('gitaQuickPrompts');
        if (prompts) prompts.style.display = 'none';

        // Clear input
        input.value = '';
        
        // Render user message
        addBubble(message, 'user');
        
        isTyping = true;
        const btn = document.getElementById('gitaSendBtn');
        if (btn) btn.style.opacity = '0.5';

        // Render typing indicator
        const typingId = 'typing-' + Date.now();
        addBubble('<div class="typing-indicator"><span></span><span></span><span></span></div>', 'assistant', typingId);

        try {
            let finalResponse = await LLM.generateKrishnaResponse(message, chatHistory);

            // Extract suggestions handling potential newlines
            let suggestions = [];
            const suggestionMatch = finalResponse.match(/<suggestions>([\s\S]*?)<\/suggestions>/i);
            if (suggestionMatch) {
                let sText = suggestionMatch[1];
                // Strip out markdown bullets if the LLM hallucinated them instead of pipes
                sText = sText.replace(/\n-/g, '|').replace(/\n\*/g, '|');
                suggestions = sText.split(/[|\n]+/).map(s => s.trim().replace(/^[-*]\s*/, '')).filter(s => s.length > 5);
                finalResponse = finalResponse.replace(/<suggestions>[\s\S]*?<\/suggestions>/i, '').trim();
            }

            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            let responseBubbleId = 'msg-' + Date.now();
            addBubble('', 'assistant', responseBubbleId);

            // Word-by-word typewriter effect
            const words = finalResponse.split(' ');
            let currentText = '';
            let i = 0;
            const bubble = document.getElementById(responseBubbleId);

            function typeNextWord() {
                if (i < words.length) {
                    currentText += (i === 0 ? '' : ' ') + words[i];
                    if (bubble) {
                        bubble.innerHTML = formatMarkdown(currentText);
                        const container = document.getElementById('gitaChatMessages');
                        if (container) container.scrollTop = container.scrollHeight;
                    }
                    i++;
                    setTimeout(typeNextWord, 40); // 40ms per word
                } else {
                    chatHistory.push({ role: 'user', text: message });
                    chatHistory.push({ role: 'assistant', text: finalResponse });
                    isTyping = false;
                    if (btn) btn.style.opacity = '1';

                    // Display suggestions if any
                    if (suggestions.length > 0 && bubble) {
                        const suggContainer = document.createElement('div');
                        suggContainer.style.marginTop = 'var(--space-4)';
                        suggContainer.style.display = 'flex';
                        suggContainer.style.gap = 'var(--space-2)';
                        suggContainer.style.flexWrap = 'wrap';
                        
                        suggestions.forEach(s => {
                            const btn = document.createElement('button');
                            btn.className = 'suggestion-chip';
                            btn.innerText = s;
                            btn.onclick = () => GitaPage.ask(s);
                            suggContainer.appendChild(btn);
                        });
                        bubble.appendChild(suggContainer);
                        
                        const container = document.getElementById('gitaChatMessages');
                        if (container) container.scrollTop = container.scrollHeight;
                    }
                }
            }
            
            typeNextWord();

        } catch (error) {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            
            addBubble(`<em>Error: ${error.message}. Please check your API key or try again later.</em>`, 'assistant');
            
            if (error.message.includes('API Key')) {
                openSettingsModal();
            }
            isTyping = false;
            if (btn) btn.style.opacity = '1';
        }
    }

    function addBubble(content, type, id = null) {
        const container = document.getElementById('gitaChatMessages');
        if (!container) return;

        const bubble = document.createElement('div');
        
        if (type === 'assistant') {
            bubble.className = `chat-bubble ${type} divine-bubble`;
        } else {
            bubble.className = `chat-bubble ${type} modern-bubble`;
        }
        
        if (id) bubble.id = id;

        bubble.innerHTML = content;
        
        // Add animation
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(10px)';
        bubble.style.transition = 'all 0.3s ease';
        
        container.appendChild(bubble);
        
        // Trigger reflow
        void bubble.offsetWidth;
        
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
        
        // Auto scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    return { render, afterRender, sendMessage, ask, openSettingsModal, saveApiKey };
})();
