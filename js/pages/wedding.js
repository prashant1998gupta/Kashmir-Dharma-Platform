/* ============================================
   Wedding Guide Page
   ============================================ */

const WeddingPage = (() => {
    let weddingData = null;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Wedding Guide' }
                ])}

                ${Components.sectionHeader(
                    'Kashmiri Pandit Wedding Guide',
                    'Your digital companion for understanding the complete Kashmiri Pandit marriage ceremonies',
                    { h1: true }
                )}

                <div id="weddingContent">
                    <div class="skeleton skeleton-card" style="height: 200px; margin-bottom: var(--space-4)"></div>
                    <div class="skeleton skeleton-card" style="height: 400px"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        App.loadData('wedding').then(data => {
            weddingData = data;
            renderContent();
        });
    }

    function renderContent() {
        if (!weddingData) return;
        const container = document.getElementById('weddingContent');
        if (!container) return;

        container.innerHTML = `
            <!-- Overview -->
            ${Components.card(`
                <div style="padding: var(--space-4)">
                    <h3 style="margin-bottom: var(--space-3)">💒 Overview</h3>
                    <p>${weddingData.overview}</p>
                </div>
            `, { featured: true })}

            <div style="margin-bottom: var(--space-8)"></div>

            <!-- Wedding Timeline -->
            <h2 style="margin-bottom: var(--space-6)">Wedding Ceremony Timeline</h2>
            
            ${Components.timeline(weddingData.ceremonies.map(c => ({
                title: `${c.day ? c.day + ' — ' : ''}${c.name}`,
                description: c.description,
                extra: `
                    <div class="mt-4">
                        <button class="btn btn-outline btn-sm" onclick="WeddingPage.showCeremonyDetail('${c.id}')">
                            View Details →
                        </button>
                    </div>
                `
            })))}

            <div style="margin-bottom: var(--space-8)"></div>

            ${Components.ornamentalDivider('💒')}

            <!-- Traditional Songs -->
            <h2 style="margin-bottom: var(--space-6)">Traditional Wedding Songs</h2>
            <div class="grid-2 mb-8">
                ${weddingData.traditional_songs.map(s => Components.card(`
                    <h4 style="margin-bottom: var(--space-2)">🎵 ${s.name}</h4>
                    <p style="font-size: var(--text-sm); margin-bottom: var(--space-2)">${s.description}</p>
                    <span class="text-muted" style="font-size: var(--text-xs)">When: ${s.when}</span>
                `)).join('')}
            </div>

            <!-- Tips for Diaspora -->
            <h2 style="margin-bottom: var(--space-6)">Tips for Families Outside Kashmir</h2>
            ${Components.card(`
                <div class="checklist">
                    ${weddingData.tips_for_diaspora.map((tip, i) => `
                        <div class="checklist-item">
                            <span style="color: var(--color-secondary); margin-right: var(--space-2)">💡</span>
                            <span class="checklist-label">${tip}</span>
                        </div>
                    `).join('')}
                </div>
            `)}
        `;

        setTimeout(() => Components.initScrollReveal(), 100);
    }

    function showCeremonyDetail(id) {
        if (!weddingData) return;
        const ceremony = weddingData.ceremonies.find(c => c.id === id);
        if (!ceremony) return;

        const content = `
            <div style="padding: var(--space-8)">
                <h2 style="margin-bottom: var(--space-2)">${ceremony.name}</h2>
                ${ceremony.day ? `<span class="badge badge-secondary mb-4" style="display:inline-block">${ceremony.day}</span>` : ''}
                
                ${ceremony.audioUrl ? Components.audioPlayer(ceremony.audioUrl, 'Listen to Vanvun / Chant', ceremony.audioSubtitle || 'Traditional Kashmiri Wedding Song') : ''}

                <p style="margin: var(--space-4) 0">${ceremony.description}</p>

                ${ceremony.significance ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ Significance</h4>
                    <p style="margin-bottom: var(--space-6)">${ceremony.significance}</p>
                ` : ''}

                ${ceremony.steps && ceremony.steps.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📋 Steps</h4>
                    <ol style="list-style: decimal; padding-left: var(--space-6); margin-bottom: var(--space-6)">
                        ${ceremony.steps.map(s => `<li style="padding: var(--space-2) 0; color: var(--text-secondary)">${s}</li>`).join('')}
                    </ol>
                ` : ''}

                ${ceremony.materials && ceremony.materials.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📦 Materials Needed</h4>
                    ${Components.checklist(ceremony.materials, `wedding-${id}`)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${ceremony.responsibilities ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">👪 Family Responsibilities</h4>
                    <div class="grid-2" style="gap: var(--space-3)">
                        ${ceremony.responsibilities.bride_family ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">Bride's Family</h5>
                            <p style="font-size: var(--text-sm)">${ceremony.responsibilities.bride_family}</p>
                        `, { compact: true }) : ''}
                        ${ceremony.responsibilities.groom_family ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">Groom's Family</h5>
                            <p style="font-size: var(--text-sm)">${ceremony.responsibilities.groom_family}</p>
                        `, { compact: true }) : ''}
                        ${ceremony.responsibilities.both ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">Both Families</h5>
                            <p style="font-size: var(--text-sm)">${ceremony.responsibilities.both}</p>
                        `, { compact: true }) : ''}
                    </div>
                ` : ''}
            </div>
        `;

        Components.openModal(content);
    }

    return { render, afterRender, showCeremonyDetail };
})();
