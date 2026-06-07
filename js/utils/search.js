/* ============================================
   Search Utilities
   Full-text search across knowledge base
   ============================================ */

const SearchEngine = (() => {
    let searchIndex = [];

    /**
     * Build search index from all loaded data
     */
    function buildIndex(data) {
        searchIndex = [];

        // Index festivals
        if (data.festivals) {
            data.festivals.forEach(f => {
                searchIndex.push({
                    id: `festival-${f.id}`,
                    type: 'festival',
                    title: f.name,
                    content: [
                        f.name, f.description, f.historicalSignificance,
                        f.spiritualSignificance, f.ritualProcedure,
                        ...(f.preparations || []),
                        ...(f.traditionalFoods || []),
                        ...(f.prayers || []),
                        ...(f.faqs || []).map(q => q.question + ' ' + q.answer)
                    ].filter(Boolean).join(' ').toLowerCase(),
                    icon: '📅',
                    page: 'calendar',
                    data: f
                });
            });
        }

        // Index rituals
        if (data.rituals) {
            data.rituals.forEach(r => {
                searchIndex.push({
                    id: `ritual-${r.id}`,
                    type: 'ritual',
                    title: r.name,
                    content: [
                        r.name, r.category, r.purpose, r.history,
                        r.significance, r.description,
                        ...(r.materials || []),
                        ...(r.steps || []).map(s => s.title + ' ' + s.description),
                        ...(r.faqs || []).map(q => q.question + ' ' + q.answer)
                    ].filter(Boolean).join(' ').toLowerCase(),
                    icon: '📖',
                    page: 'rituals',
                    data: r
                });
            });
        }

        // Index wedding ceremonies
        if (data.wedding) {
            data.wedding.ceremonies.forEach(c => {
                searchIndex.push({
                    id: `wedding-${c.id}`,
                    type: 'wedding',
                    title: c.name,
                    content: [
                        c.name, c.description, c.significance,
                        ...(c.steps || []),
                        ...(c.materials || [])
                    ].filter(Boolean).join(' ').toLowerCase(),
                    icon: '💒',
                    page: 'wedding',
                    data: c
                });
            });
        }

        // Index archive articles
        if (data.archive) {
            data.archive.forEach(a => {
                searchIndex.push({
                    id: `archive-${a.id}`,
                    type: 'article',
                    title: a.title,
                    content: [
                        a.title, a.category, a.excerpt, a.content,
                        ...(a.tags || [])
                    ].filter(Boolean).join(' ').toLowerCase(),
                    icon: '📚',
                    page: 'archive',
                    data: a
                });
            });
        }
    }

    /**
     * Search with fuzzy matching
     */
    function search(query, maxResults = 20) {
        if (!query || query.trim().length < 2) return [];
        
        const terms = query.toLowerCase().trim().split(/\s+/);
        const results = [];

        searchIndex.forEach(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();

            terms.forEach(term => {
                // Exact title match (highest priority)
                if (titleLower === term) {
                    score += 100;
                }
                // Title contains term
                else if (titleLower.includes(term)) {
                    score += 50;
                }
                // Title starts with term
                else if (titleLower.startsWith(term)) {
                    score += 40;
                }
                // Content contains term
                if (item.content.includes(term)) {
                    // Count occurrences for relevance
                    const count = (item.content.match(new RegExp(escapeRegex(term), 'g')) || []).length;
                    score += Math.min(count * 5, 30);
                }
                // Fuzzy match (allows 1-2 character difference)
                if (score === 0 && term.length > 3) {
                    const fuzzyScore = fuzzyMatch(term, titleLower);
                    if (fuzzyScore > 0.6) {
                        score += fuzzyScore * 20;
                    }
                }
            });

            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);
    }

    /**
     * Simple fuzzy matching using Levenshtein-like ratio
     */
    function fuzzyMatch(str1, str2) {
        if (str2.includes(str1)) return 1;
        
        const len1 = str1.length;
        const len2 = str2.length;
        
        // Check if any word in str2 is similar
        const words = str2.split(/\s+/);
        let bestScore = 0;
        
        words.forEach(word => {
            if (word.length < 2) return;
            let matches = 0;
            const shorter = Math.min(str1.length, word.length);
            for (let i = 0; i < shorter; i++) {
                if (str1[i] === word[i]) matches++;
            }
            const score = matches / Math.max(str1.length, word.length);
            bestScore = Math.max(bestScore, score);
        });

        return bestScore;
    }

    /**
     * Escape special regex characters
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get suggested questions based on the knowledge base
     */
    function getSuggestedQuestions() {
        const isHindi = (typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi');
        if (isHindi) {
            return [
                "नवरेह क्या है?",
                "हेराथ कब मनाया जाता है?",
                "ज़्येठ अठम के लिए क्या तैयारी करनी चाहिए?",
                "देवगोन का क्या महत्व है?",
                "कश्मीरी पंडित विवाह में कौन से अनुष्ठान होते हैं?",
                "यज्ञोपवीत संस्कार क्या है?",
                "हवन कैसे किया जाता है?",
                "खेत्सीमावस क्या है?",
                "पन त्योहार में कौन से भोजन तैयार किए जाते हैं?",
                "श्राद्ध का क्या महत्व है?"
            ];
        }
        return [
            "What is Navreh?",
            "When is Herath celebrated?",
            "What should be prepared for Zyeth Atham?",
            "What is the significance of Devgon?",
            "What are the rituals in a Kashmiri Pandit wedding?",
            "What is Yagnopavit ceremony?",
            "How to perform Havan?",
            "What is Khetsrimavas?",
            "What foods are prepared for Pan festival?",
            "What is the significance of Shraddha?"
        ];
    }

    /**
     * Get an answer to a question from the knowledge base
     */
    function getAnswer(question) {
        const results = search(question, 5);
        
        const isHi = (typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi');
        if (results.length === 0) {
            return {
                text: isHi ? "हमारे ज्ञान संग्रह में इसके बारे में विशिष्ट जानकारी नहीं मिली। संभव है कि यह विषय अभी तक प्रलेखित नहीं किया गया हो, या अपना प्रश्न दोबारा लिखें। प्रामाणिक मार्गदर्शन के लिए कश्मीरी पंडित विद्वान से परामर्श करें।" : "I couldn't find specific information about that in our knowledge base. This could be because the topic hasn't been documented yet, or try rephrasing your question. For authentic guidance, we recommend consulting with a Kashmiri Pandit scholar.",
                sources: [],
                suggestions: getSuggestedQuestions().slice(0, 3)
            };
        }

        const topResult = results[0];
        let answerText = '';

        if (topResult.type === 'festival') {
            const f = topResult.data;
            answerText = `**${f.name}**\n\n${f.description}\n\n`;
            if (f.historicalSignificance) answerText += `**${isHi ? 'ऐतिहासिक महत्व' : 'Historical Significance'}:** ${f.historicalSignificance}\n\n`;
            if (f.spiritualSignificance) answerText += `**${isHi ? 'आध्यात्मिक महत्व' : 'Spiritual Significance'}:** ${f.spiritualSignificance}\n\n`;
            if (f.date) answerText += `**${isHi ? 'कब' : 'When'}:** ${f.date}\n\n`;
        } else if (topResult.type === 'ritual') {
            const r = topResult.data;
            answerText = `**${r.name}**\n\n${r.description || r.purpose}\n\n`;
            if (r.significance) answerText += `**${isHi ? 'महत्व' : 'Significance'}:** ${r.significance}\n\n`;
        } else if (topResult.type === 'wedding') {
            const c = topResult.data;
            answerText = `**${c.name}**\n\n${c.description}\n\n`;
            if (c.significance) answerText += `**${isHi ? 'महत्व' : 'Significance'}:** ${c.significance}\n\n`;
        } else if (topResult.type === 'article') {
            const a = topResult.data;
            answerText = `**${a.title}**\n\n${a.excerpt || a.content}\n\n`;
        }

        return {
            text: answerText,
            sources: results.slice(0, 3).map(r => ({
                title: r.title,
                type: r.type,
                icon: r.icon,
                page: r.page
            })),
            suggestions: []
        };
    }

    return {
        buildIndex,
        search,
        getAnswer,
        getSuggestedQuestions
    };
})();
