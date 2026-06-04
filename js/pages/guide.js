/* ============================================
   AI Knowledge Guide Page (Smart Search + FAQ)
   ============================================ */

const GuidePage = (() => {
    let chatMessages = [];
    let dataLoaded = false;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('guide.title', 'Knowledge Guide') : 'Knowledge Guide' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('guide.header', 'Knowledge Guide') : 'Knowledge Guide',
                    typeof I18n !== 'undefined' ? I18n.t('guide.desc', 'Ask questions about Kashmiri Pandit traditions and get answers from our scholar-validated knowledge base') : 'Ask questions about Kashmiri Pandit traditions and get answers from our scholar-validated knowledge base',
                    { h1: true }
                )}

                <div class="grid-2" style="align-items: start">
                    <!-- Chat Interface -->
                    <div>
                        ${Components.card(`
                            <div class="chat-container" id="chatContainer">
                                <div class="chat-messages" id="chatMessages">
                                    <div class="chat-bubble assistant">
                                        ${typeof I18n !== 'undefined' ? I18n.t('guide.greeting', "<strong>🔮 Namaskar!</strong><br><br>I'm your Knowledge Guide for Kashmiri Pandit traditions. Ask me anything about festivals, rituals, ceremonies, or cultural practices.<br><br><em style=\"color: var(--text-muted); font-size: var(--text-xs)\">I search through our scholar-validated knowledge base to answer your questions.</em>") : "<strong>🔮 Namaskar!</strong><br><br>I'm your Knowledge Guide for Kashmiri Pandit traditions. Ask me anything about festivals, rituals, ceremonies, or cultural practices.<br><br><em style=\"color: var(--text-muted); font-size: var(--text-xs)\">I search through our scholar-validated knowledge base to answer your questions.</em>"}
                                    </div>
                                </div>
                                <div class="chat-input-container">
                                    <input type="text" class="chat-input" id="chatInput" 
                                           placeholder="${typeof I18n !== 'undefined' ? I18n.t('guide.placeholder', 'Ask about Kashmiri Pandit traditions...') : 'Ask about Kashmiri Pandit traditions...'}"
                                           onkeypress="if(event.key==='Enter') GuidePage.sendMessage()">
                                    <button class="btn btn-primary" onclick="GuidePage.sendMessage()">
                                        ${typeof I18n !== 'undefined' ? I18n.t('guide.send', 'Send') : 'Send'}
                                    </button>
                                </div>
                            </div>
                        `, { glass: true })}
                    </div>

                    <!-- Suggestions & Quick Links -->
                    <div>
                        ${Components.card(`
                            <h3 style="margin-bottom: var(--space-4)">💡 ${typeof I18n !== 'undefined' ? I18n.t('guide.suggested', 'Suggested Questions') : 'Suggested Questions'}</h3>
                            <div class="flex flex-col gap-2" id="suggestedQuestions">
                                <div class="skeleton skeleton-text"></div>
                                <div class="skeleton skeleton-text"></div>
                                <div class="skeleton skeleton-text"></div>
                            </div>
                        `)}

                        <div class="mt-4">
                            ${Components.card(`
                                <h3 style="margin-bottom: var(--space-4)">🔍 ${typeof I18n !== 'undefined' ? I18n.t('guide.quick_topics', 'Quick Topics') : 'Quick Topics'}</h3>
                                <div class="tag-group">
                                    <span class="tag" onclick="GuidePage.askQuestion('What is Navreh?')">Navreh</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('What is Herath?')">Herath</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('What is Devgon?')">Devgon</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Kashmiri Pandit wedding rituals')">Wedding</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('What is Yagnopavit?')">Yagnopavit</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('How to perform Havan?')">Havan</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Kashmir Shaivism')">Kashmir Shaivism</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Who is Lal Ded?')">Lal Ded</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Kashmiri Pandit cuisine')">Cuisine</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Sacred temples of Kashmir')">Temples</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('What is Zyeth Atham?')">Zyeth Atham</span>
                                    <span class="tag" onclick="GuidePage.askQuestion('Shraddha rituals')">Shraddha</span>
                                </div>
                            `)}
                        </div>

                        <div class="mt-4">
                            ${Components.card(`
                                <div class="flex items-center gap-3">
                                    <span style="font-size: 1.5rem">ℹ️</span>
                                    <div>
                                        <h4 style="margin: 0 0 var(--space-1) 0; font-size: var(--text-sm)">${typeof I18n !== 'undefined' ? I18n.t('guide.about', 'About This Guide') : 'About This Guide'}</h4>
                                        <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0">
                                            This guide searches through our curated knowledge base of festivals, rituals, 
                                            wedding ceremonies, and cultural articles. For complex religious questions, 
                                            we recommend consulting with a Kashmiri Pandit scholar.
                                        </p>
                                    </div>
                                </div>
                            `, { compact: true })}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function afterRender() {
        // Load all data to build search index
        try {
            const [festivals, rituals, wedding, archive] = await Promise.all([
                App.loadData('festivals'),
                App.loadData('rituals'),
                App.loadData('wedding'),
                App.loadData('archive')
            ]);

            SearchEngine.buildIndex({ festivals, rituals, wedding, archive });
            dataLoaded = true;

            // Render suggested questions
            const suggestions = SearchEngine.getSuggestedQuestions();
            const container = document.getElementById('suggestedQuestions');
            if (container) {
                container.innerHTML = suggestions.map(q => `
                    <button class="btn btn-ghost w-full" style="text-align: left; justify-content: flex-start; font-size: var(--text-sm)"
                            onclick="GuidePage.askQuestion('${q.replace(/'/g, "\\'")}')">
                        💬 ${q}
                    </button>
                `).join('');
            }
        } catch (e) {
            console.error('Failed to load data for guide:', e);
        }
    }

    function askQuestion(question) {
        const input = document.getElementById('chatInput');
        if (input) input.value = question;
        sendMessage();
    }

    function sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input || !input.value.trim()) return;

        const question = input.value.trim();
        input.value = '';

        // Add user message
        addChatBubble(question, 'user');

        if (!dataLoaded) {
            addChatBubble('Please wait, I am still loading the knowledge base...', 'assistant');
            return;
        }

        // Get answer
        setTimeout(() => {
            const answer = SearchEngine.getAnswer(question);
            
            let responseHtml = formatAnswer(answer.text);

            if (answer.sources.length > 0) {
                responseHtml += `<div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--surface-border)">`;
                responseHtml += `<div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2)">Related Topics:</div>`;
                responseHtml += `<div class="flex gap-2 flex-wrap">`;
                answer.sources.forEach(s => {
                    responseHtml += `<a href="#${s.page}" class="tag">${s.icon} ${s.title}</a>`;
                });
                responseHtml += `</div></div>`;
            }

            if (answer.suggestions.length > 0) {
                responseHtml += `<div style="margin-top: var(--space-3)">`;
                responseHtml += `<div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2)">Try asking:</div>`;
                answer.suggestions.forEach(s => {
                    responseHtml += `<button class="btn btn-ghost btn-sm" style="font-size: var(--text-xs)" onclick="GuidePage.askQuestion('${s.replace(/'/g, "\\'")}')">💬 ${s}</button>`;
                });
                responseHtml += `</div>`;
            }

            addChatBubble(responseHtml, 'assistant', true);
        }, 300);
    }

    function formatAnswer(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-secondary)">$1</strong>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    function addChatBubble(content, type, isHtml = false) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        
        if (isHtml) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }

        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
    }

    return { render, afterRender, sendMessage, askQuestion };
})();
