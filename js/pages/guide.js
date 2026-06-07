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
                                    ${(() => {
                                        const isHi = (typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi');
                                        const topics = isHi ? [
                                            { label: 'नवरेह', q: 'नवरेह क्या है?' },
                                            { label: 'हेराथ', q: 'हेराथ क्या है?' },
                                            { label: 'देवगोन', q: 'देवगोन क्या है?' },
                                            { label: 'विवाह', q: 'कश्मीरी पंडित विवाह अनुष्ठान' },
                                            { label: 'यज्ञोपवीत', q: 'यज्ञोपवीत क्या है?' },
                                            { label: 'हवन', q: 'हवन कैसे किया जाता है?' },
                                            { label: 'कश्मीर शैवदर्शन', q: 'कश्मीर शैवदर्शन' },
                                            { label: 'लल देद', q: 'लल देद कौन हैं?' },
                                            { label: 'व्यंजन', q: 'कश्मीरी पंडित व्यंजन' },
                                            { label: 'मंदिर', q: 'कश्मीर के पवित्र मंदिर' },
                                            { label: 'ज़्येठ अठम', q: 'ज़्येठ अठम क्या है?' },
                                            { label: 'श्राद्ध', q: 'श्राद्ध अनुष्ठान' }
                                        ] : [
                                            { label: 'Navreh', q: 'What is Navreh?' },
                                            { label: 'Herath', q: 'What is Herath?' },
                                            { label: 'Devgon', q: 'What is Devgon?' },
                                            { label: 'Wedding', q: 'Kashmiri Pandit wedding rituals' },
                                            { label: 'Yagnopavit', q: 'What is Yagnopavit?' },
                                            { label: 'Havan', q: 'How to perform Havan?' },
                                            { label: 'Kashmir Shaivism', q: 'Kashmir Shaivism' },
                                            { label: 'Lal Ded', q: 'Who is Lal Ded?' },
                                            { label: 'Cuisine', q: 'Kashmiri Pandit cuisine' },
                                            { label: 'Temples', q: 'Sacred temples of Kashmir' },
                                            { label: 'Zyeth Atham', q: 'What is Zyeth Atham?' },
                                            { label: 'Shraddha', q: 'Shraddha rituals' }
                                        ];
                                        return topics.map(t => `<span class="tag" onclick="GuidePage.askQuestion('${t.q.replace(/'/g, "\\\\'")}')">${t.label}</span>`).join('');
                                    })()}
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
                                            ${typeof I18n !== 'undefined' ? I18n.t('guide.about_text', 'This guide searches through our curated knowledge base of festivals, rituals, wedding ceremonies, and cultural articles. For complex religious questions, we recommend consulting with a Kashmiri Pandit scholar.') : 'This guide searches through our curated knowledge base of festivals, rituals, wedding ceremonies, and cultural articles. For complex religious questions, we recommend consulting with a Kashmiri Pandit scholar.'}
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
            addChatBubble(typeof I18n !== 'undefined' ? I18n.t('guide.loading', 'Please wait, I am still loading the knowledge base...') : 'Please wait, I am still loading the knowledge base...', 'assistant');
            return;
        }

        // Get answer
        setTimeout(() => {
            const answer = SearchEngine.getAnswer(question);
            
            let responseHtml = formatAnswer(answer.text);

            if (answer.sources.length > 0) {
                responseHtml += `<div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--surface-border)">`;
                responseHtml += `<div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.t('guide.related', 'Related Topics:') : 'Related Topics:'}</div>`;
                responseHtml += `<div class="flex gap-2 flex-wrap">`;
                answer.sources.forEach(s => {
                    responseHtml += `<a href="#${s.page}" class="tag">${s.icon} ${s.title}</a>`;
                });
                responseHtml += `</div></div>`;
            }

            if (answer.suggestions.length > 0) {
                responseHtml += `<div style="margin-top: var(--space-3)">`;
                responseHtml += `<div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.t('guide.try_asking', 'Try asking:') : 'Try asking:'}</div>`;
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
