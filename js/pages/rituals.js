/* ============================================
   Ritual Knowledge Library Page
   ============================================ */

const RitualsPage = (() => {
    let rituals = [];
    let activeCategory = 'all';

    const categories = [
        { id: 'all', label: 'All Rituals', icon: '📖' },
        { id: 'Life Events', label: 'Life Events', icon: '🎂' },
        { id: 'Marriage', label: 'Marriage', icon: '💍' },
        { id: 'Seasonal', label: 'Seasonal', icon: '🍂' },
        { id: 'Regular Practice', label: 'Regular Practice', icon: '🔥' }
    ];

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Ritual Library' }
                ])}

                ${Components.sectionHeader(
                    'Ritual Knowledge Library',
                    'A comprehensive encyclopedia of Kashmiri Pandit rituals — from daily practices to life ceremonies',
                    { h1: true }
                )}

                <!-- Search -->
                <div class="mb-6">
                    ${Components.searchBar('Search rituals...', 'RitualsPage.filterRituals')}
                </div>

                <!-- Category Tabs -->
                <div class="mb-6">
                    ${Components.tabs(categories, activeCategory, 'RitualsPage.setCategory')}
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
            grid.innerHTML = Components.emptyState('📖', 'No rituals found', 'Try a different search or category');
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

                <p style="margin-bottom: var(--space-6)">${ritual.purpose || ritual.description}</p>

                ${ritual.history ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📜 History</h4>
                    <p style="margin-bottom: var(--space-6)">${ritual.history}</p>
                ` : ''}

                ${ritual.significance ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ Significance</h4>
                    <p style="margin-bottom: var(--space-6)">${ritual.significance}</p>
                ` : ''}

                ${ritual.materials && ritual.materials.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📦 Required Materials</h4>
                    ${Components.checklist(ritual.materials, `ritual-mat-${id}`)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${ritual.steps && ritual.steps.length ? `
                    <h4 style="margin-bottom: var(--space-4); color: var(--color-secondary)">📋 Step-by-Step Process</h4>
                    ${Components.timeline(ritual.steps)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${ritual.variations && ritual.variations.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🔄 Regional Variations</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${ritual.variations.map(v => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">• ${v}</li>`).join('')}
                    </ul>
                ` : ''}

                ${ritual.misconceptions && ritual.misconceptions.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">⚠️ Common Misconceptions</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${ritual.misconceptions.map(m => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">❌ ${m}</li>`).join('')}
                    </ul>
                ` : ''}

                ${ritual.faqs && ritual.faqs.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">❓ Frequently Asked Questions</h4>
                    ${Components.accordion(ritual.faqs, `ritual-faq-${id}`)}
                ` : ''}
            </div>
        `;

        Components.openModal(content);
    }

    return { render, afterRender, setCategory, filterRituals, showRitualDetail };
})();
