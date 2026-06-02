/* ============================================
   Learn Sharada Script Page
   ============================================ */

const SharadaPage = (() => {
    let sharadaData = null;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Learn Sharada Script' }
                ])}

                ${Components.sectionHeader(
                    'Learn Sharada Script',
                    'Explore the ancient, sacred script of Kashmir used for religious texts and horoscopes.',
                    { h1: true }
                )}

                <div id="sharadaContent">
                    <div class="skeleton skeleton-card" style="height: 200px; margin-bottom: var(--space-4)"></div>
                    <div class="skeleton skeleton-card" style="height: 400px"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        App.loadData('sharada').then(data => {
            sharadaData = data;
            renderContent();
        });
    }

    function renderContent() {
        if (!sharadaData) return;
        const container = document.getElementById('sharadaContent');
        if (!container) return;

        let contentHtml = `
            <!-- Overview -->
            ${Components.card(`
                <div style="padding: var(--space-4)">
                    <h3 style="margin-bottom: var(--space-3)">📜 About Sharada</h3>
                    <p style="margin-bottom: var(--space-4)">${sharadaData.description}</p>
                    <ul style="list-style: none;">
                        ${sharadaData.resources.map(r => `<li style="margin-bottom: var(--space-2); color: var(--color-secondary);">✨ ${r}</li>`).join('')}
                    </ul>
                </div>
            `, { featured: true })}
            <div style="margin-bottom: var(--space-8)"></div>
        `;

        sharadaData.categories.forEach(category => {
            contentHtml += `
                <h2 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${category.name}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
            `;

            category.characters.forEach(char => {
                contentHtml += `
                    <div class="card card-hover" style="text-align: center; padding: var(--space-4); border-radius: var(--radius-md);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-2); color: var(--text-heading); font-family: sans-serif;">${char.char}</div>
                        <div style="font-size: var(--text-sm); color: var(--color-secondary); font-weight: bold; margin-bottom: 2px;">${char.transliteration}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted);">${char.devanagari}</div>
                    </div>
                `;
            });

            contentHtml += `</div>`;
        });

        container.innerHTML = contentHtml;
        setTimeout(() => Components.initScrollReveal(), 100);
    }

    return { render, afterRender };
})();
