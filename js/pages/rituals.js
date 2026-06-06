/* ============================================
   Ritual Knowledge Library Page
   ============================================ */

const RitualsPage = (() => {
    let rituals = [];
    let activeCategory = 'all';

    function getCategories() {
        return [
            { id: 'all', label: typeof I18n !== 'undefined' ? I18n.t('rituals.cat_all', 'All Rituals') : 'All Rituals', icon: '📖' },
            { id: 'Life Events', label: typeof I18n !== 'undefined' ? I18n.t('rituals.cat_life', 'Life Events') : 'Life Events', icon: '🎂' },
            { id: 'Marriage', label: typeof I18n !== 'undefined' ? I18n.t('rituals.cat_marriage', 'Marriage') : 'Marriage', icon: '💍' },
            { id: 'Seasonal', label: typeof I18n !== 'undefined' ? I18n.t('rituals.cat_seasonal', 'Seasonal') : 'Seasonal', icon: '🍂' },
            { id: 'Regular Practice', label: typeof I18n !== 'undefined' ? I18n.t('rituals.cat_practice', 'Regular Practice') : 'Regular Practice', icon: '🔥' }
        ];
    }

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('rituals.title', 'Ritual Library') : 'Ritual Library' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('rituals.header', 'Ritual Knowledge Library') : 'Ritual Knowledge Library',
                    typeof I18n !== 'undefined' ? I18n.t('rituals.desc', 'A comprehensive encyclopedia of Kashmiri Pandit rituals — from daily practices to life ceremonies') : 'A comprehensive encyclopedia of Kashmiri Pandit rituals — from daily practices to life ceremonies',
                    { h1: true }
                )}

                <!-- Search -->
                <div class="mb-6">
                    ${Components.searchBar(typeof I18n !== 'undefined' ? I18n.t('rituals.search', 'Search rituals...') : 'Search rituals...', 'RitualsPage.filterRituals')}
                </div>

                <!-- Category Tabs -->
                <div class="mb-6">
                    ${Components.tabs(getCategories(), activeCategory, 'RitualsPage.setCategory')}
                </div>

                <!-- Rituals Grid -->
                <div id="ritualsGrid" class="grid-auto">
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        App.loadData('rituals').then(data => {
            rituals = data || [];
            renderRitualCards(rituals);
        });
    }

    function setCategory(category) {
        activeCategory = category;
        const filtered = category === 'all'
            ? rituals
            : rituals.filter(r => r.category === category);
        renderRitualCards(filtered);

        // Update tab styles
        document.querySelectorAll('.tab').forEach(tab => {
            const categories = getCategories();
            tab.classList.toggle('active', tab.textContent.trim().includes(
                categories.find(c => c.id === category)?.label || ''
            ));
        });
    }

    function filterRituals(query) {
        let filtered = rituals;
        if (activeCategory !== 'all') {
            filtered = filtered.filter(r => r.category === activeCategory);
        }
        if (query) {
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.purpose?.toLowerCase().includes(query.toLowerCase()) ||
                r.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        renderRitualCards(filtered);
    }

    function renderRitualCards(list) {
        const grid = document.getElementById('ritualsGrid');
        if (!grid) return;

        if (list.length === 0) {
            grid.innerHTML = Components.emptyState(
                '📖',
                typeof I18n !== 'undefined' ? I18n.t('rituals.no_found', 'No rituals found') : 'No rituals found',
                typeof I18n !== 'undefined' ? I18n.t('rituals.try_different', 'Try a different search or category') : 'Try a different search or category'
            );
            return;
        }

        grid.innerHTML = list.map(r => Components.ritualCard(r)).join('');
    }

    function showRitualDetail(id) {
        const ritual = rituals.find(r => r.id === id);
        if (!ritual) return;

        const content = `
            <div style="padding: var(--space-8)">
                <div class="flex items-center gap-4 mb-6">
                    <span style="font-size: 3rem">${ritual.icon || '🕉️'}</span>
                    <div>
                        <h2 style="margin: 0">${ritual.name}</h2>
                        ${Components.badge(ritual.category, 'secondary')}
                    </div>
                </div>

                ${ritual.audioUrl ? Components.audioPlayer(ritual.audioUrl, typeof I18n !== 'undefined' ? I18n.t('rituals.listen', 'Listen to Mantra/Chant') : 'Listen to Mantra/Chant', ritual.audioSubtitle || (typeof I18n !== 'undefined' ? I18n.t('rituals.audio_subtitle', 'Authentic pronunciation and recitation') : 'Authentic pronunciation and recitation')) : ''}

                <p style="margin-bottom: var(--space-6)">${ritual.purpose || ritual.description}</p>

                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📜 ${typeof I18n !== 'undefined' ? I18n.t('rituals.history', 'History') : 'History'}</h4>
                        <p style="margin-bottom: var(--space-6)">${ritual.history}</p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ ${typeof I18n !== 'undefined' ? I18n.t('rituals.significance', 'Significance') : 'Significance'}</h4>
                        <p style="margin-bottom: var(--space-6)">${ritual.significance}</p>
                    </div>
                </div>

                <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📦 ${typeof I18n !== 'undefined' ? I18n.t('rituals.materials', 'Required Materials') : 'Required Materials'}</h4>
                <div class="tag-group mb-6">
                    ${ritual.materials.map(m => `<span class="tag">${m}</span>`).join('')}
                </div>

                <h4 style="margin-bottom: var(--space-4); color: var(--color-secondary)">📋 ${typeof I18n !== 'undefined' ? I18n.t('rituals.steps', 'Step-by-Step Process') : 'Step-by-Step Process'}</h4>
                <div style="margin-bottom: var(--space-6)">
                    ${ritual.steps.map((s, i) => `
                        <div class="flex gap-4 mb-4" style="background: var(--bg-tertiary); padding: var(--space-3); border-radius: var(--radius-md);">
                            <div style="background: var(--color-secondary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: var(--text-xs); flex-shrink: 0;">${i + 1}</div>
                            <div>${s}</div>
                        </div>
                    `).join('')}
                </div>

                ${ritual.variations && ritual.variations.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🔄 ${typeof I18n !== 'undefined' ? I18n.t('rituals.variations', 'Regional Variations') : 'Regional Variations'}</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${ritual.variations.map(v => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">• ${v}</li>`).join('')}
                    </ul>
                ` : ''}

                ${ritual.misconceptions && ritual.misconceptions.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">⚠️ ${typeof I18n !== 'undefined' ? I18n.t('rituals.misconceptions', 'Common Misconceptions') : 'Common Misconceptions'}</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${ritual.misconceptions.map(m => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">❌ ${m}</li>`).join('')}
                    </ul>
                ` : ''}

                ${ritual.faq && ritual.faq.length > 0 ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">❓ ${typeof I18n !== 'undefined' ? I18n.t('rituals.faq', 'Frequently Asked Questions') : 'Frequently Asked Questions'}</h4>
                    ${Components.accordion(ritual.faq, `ritual-faq-${id}`)}
                ` : ''}
            </div>
        `;

        Components.openModal(content);
    }

    return { render, afterRender, setCategory, filterRituals, showRitualDetail };
})();
