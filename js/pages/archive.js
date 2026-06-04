/* ============================================
   Knowledge Archive Page
   ============================================ */

const ArchivePage = (() => {
    let articles = [];
    let activeCategory = 'all';

    const categories = [
        { id: 'all', label: typeof I18n !== 'undefined' ? I18n.t('archive.cat_all', 'All') : 'All', icon: '📚' },
        { id: 'History', label: typeof I18n !== 'undefined' ? I18n.t('archive.cat_history', 'History') : 'History', icon: '📜' },
        { id: 'Teachings', label: typeof I18n !== 'undefined' ? I18n.t('archive.cat_teachings', 'Teachings') : 'Teachings', icon: '🕉️' },
        { id: 'Culture', label: typeof I18n !== 'undefined' ? I18n.t('archive.cat_culture', 'Culture') : 'Culture', icon: '🎭' },
        { id: 'Temples', label: typeof I18n !== 'undefined' ? I18n.t('archive.cat_temples', 'Temples') : 'Temples', icon: '🛕' }
    ];

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('archive.title', 'Knowledge Archive') : 'Knowledge Archive' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('archive.header', 'Knowledge Archive') : 'Knowledge Archive',
                    typeof I18n !== 'undefined' ? I18n.t('archive.desc', 'Articles, historical documents, cultural essays, temple information, and religious teachings') : 'Articles, historical documents, cultural essays, temple information, and religious teachings',
                    { h1: true }
                )}

                <div class="flex gap-4 mb-6 flex-wrap items-center">
                    ${Components.searchBar(typeof I18n !== 'undefined' ? I18n.t('archive.search', 'Search articles...') : 'Search articles...', 'ArchivePage.filterArticles', 'archiveSearch')}
                </div>

                ${Components.tabs(categories, activeCategory, 'ArchivePage.setCategory')}

                <div id="archiveGrid" class="grid-auto">
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        App.loadData('archive').then(data => {
            articles = data || [];
            renderArticles(articles);
        });
    }

    function setCategory(category) {
        activeCategory = category;
        const filtered = category === 'all'
            ? articles
            : articles.filter(a => a.category === category);
        renderArticles(filtered);

        document.querySelectorAll('.tab').forEach(tab => {
            const cat = categories.find(c => tab.textContent.trim().includes(c.label));
            tab.classList.toggle('active', cat && cat.id === category);
        });
    }

    function filterArticles(query) {
        let filtered = articles;
        if (activeCategory !== 'all') {
            filtered = filtered.filter(a => a.category === activeCategory);
        }
        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                a.tags.some(t => t.toLowerCase().includes(q))
            );
        }
        renderArticles(filtered);
    }

    function renderArticles(list) {
        const grid = document.getElementById('archiveGrid');
        if (!grid) return;

        if (list.length === 0) {
            grid.innerHTML = Components.emptyState('📚', 'No articles found', 'Try a different search or category');
            return;
        }

        grid.innerHTML = list.map(article => {
            const isBookmarked = Storage.isBookmarked(article.id);
            return Components.card(`
                <div class="flex justify-between items-center mb-3">
                    ${Components.badge(article.category, 'secondary')}
                    <button class="btn btn-ghost btn-sm" 
                            onclick="event.stopPropagation(); ArchivePage.toggleBookmark('${article.id}')"
                            title="${isBookmarked ? 'Remove bookmark' : 'Bookmark'}">
                        ${isBookmarked ? '⭐' : '☆'}
                    </button>
                </div>
                <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-2); cursor: pointer" 
                    onclick="ArchivePage.showArticle('${article.id}')">
                    ${article.title}
                </h3>
                <p style="font-size: var(--text-sm); margin-bottom: var(--space-3); color: var(--text-secondary)">
                    ${article.excerpt}
                </p>
                <div class="flex justify-between items-center">
                    <div class="tag-group">
                        ${article.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="ArchivePage.showArticle('${article.id}')">
                        ${typeof I18n !== 'undefined' ? I18n.t('archive.read', 'Read →') : 'Read →'}
                    </button>
                </div>
            `, { interactive: true });
        }).join('');
    }

    function showArticle(id) {
        const article = articles.find(a => a.id === id);
        if (!article) return;

        // Convert newlines to paragraphs
        const contentHtml = article.content
            .split('\n\n')
            .map(para => {
                if (para.startsWith('- ')) {
                    return `<ul style="list-style: disc; padding-left: var(--space-6); margin: var(--space-2) 0">${
                        para.split('\n').filter(l => l.startsWith('- ')).map(l => `<li style="color: var(--text-secondary); margin: var(--space-1) 0">${l.slice(2)}</li>`).join('')
                    }</ul>`;
                }
                if (/^\d+\./.test(para)) {
                    return `<ol style="list-style: decimal; padding-left: var(--space-6); margin: var(--space-2) 0">${
                        para.split('\n').filter(l => /^\d+\./.test(l)).map(l => `<li style="color: var(--text-secondary); margin: var(--space-1) 0">${l.replace(/^\d+\.\s*/, '')}</li>`).join('')
                    }</ol>`;
                }
                return `<p style="margin-bottom: var(--space-4); color: var(--text-secondary); line-height: 1.9">${para}</p>`;
            })
            .join('');

        const content = `
            <div style="padding: var(--space-8)">
                <div class="mb-4">
                    ${Components.badge(article.category, 'secondary')}
                    <span class="text-muted" style="margin-left: var(--space-3); font-size: var(--text-xs)">${article.date}</span>
                </div>
                <h2 style="margin-bottom: var(--space-6)">${article.title}</h2>
                <div style="font-size: var(--text-sm)">
                    ${contentHtml}
                </div>
                <div class="mt-6">
                    <div class="tag-group">
                        ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        Components.openModal(content);
    }

    function toggleBookmark(id) {
        if (Storage.isBookmarked(id)) {
            Storage.removeBookmark(id);
            Components.showToast('Bookmark removed', 'warning');
        } else {
            const article = articles.find(a => a.id === id);
            if (article) {
                Storage.addBookmark({ id: article.id, title: article.title, type: 'article' });
                Components.showToast('Article bookmarked!', 'success');
            }
        }
        // Re-render
        const filtered = activeCategory === 'all' ? articles : articles.filter(a => a.category === activeCategory);
        renderArticles(filtered);
    }

    return { render, afterRender, setCategory, filterArticles, showArticle, toggleBookmark };
})();
