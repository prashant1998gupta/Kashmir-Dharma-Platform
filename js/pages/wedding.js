/* ============================================
   Wedding Guide Page
   ============================================ */

const WeddingPage = (() => {
    let weddingData = null;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('wedding.title', 'Wedding Guide') : 'Wedding Guide' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('wedding.header', 'Kashmiri Pandit Wedding Guide') : 'Kashmiri Pandit Wedding Guide',
                    typeof I18n !== 'undefined' ? I18n.t('wedding.desc', 'Your digital companion for understanding the complete Kashmiri Pandit marriage ceremonies') : 'Your digital companion for understanding the complete Kashmiri Pandit marriage ceremonies',
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
                    <h3 style="margin-bottom: var(--space-3)">💒 ${typeof I18n !== 'undefined' ? I18n.t('wedding.overview', 'Overview') : 'Overview'}</h3>
                    <p>${weddingData.overview}</p>
                </div>
            `, { featured: true })}

            <div style="margin-bottom: var(--space-8)"></div>

            <!-- Wedding Timeline -->
            <h2 style="margin-bottom: var(--space-6)">${typeof I18n !== 'undefined' ? I18n.t('wedding.timeline', 'Wedding Ceremony Timeline') : 'Wedding Ceremony Timeline'}</h2>
            
            ${Components.timeline(weddingData.ceremonies.map(c => ({
                title: `${c.day ? c.day + ' — ' : ''}${c.name}`,
                description: c.description,
                extra: `
                    <div class="mt-4">
                        <button class="btn btn-outline btn-sm" onclick="WeddingPage.showCeremonyDetail('${c.id}')">
                            ${typeof I18n !== 'undefined' ? I18n.t('wedding.view_details', 'View Details →') : 'View Details →'}
                        </button>
                    </div>
                `
            })))}

            <div style="margin-bottom: var(--space-8)"></div>

            ${Components.ornamentalDivider('💒')}

            <!-- Traditional Songs -->
            <h2 style="margin-bottom: var(--space-6)">${typeof I18n !== 'undefined' ? I18n.t('wedding.songs', 'Traditional Wedding Songs') : 'Traditional Wedding Songs'}</h2>
            <div class="grid-2 mb-8">
                ${weddingData.traditional_songs.map(s => Components.card(`
                    <h4 style="margin-bottom: var(--space-2)">🎵 ${s.name}</h4>
                    <p style="font-size: var(--text-sm); margin-bottom: var(--space-2)">${s.description}</p>
                    <span class="text-muted" style="font-size: var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('wedding.when', 'When:') : 'When:'} ${s.when}</span>
                `)).join('')}
            </div>

            <!-- Tips for Diaspora -->
            <h2 style="margin-bottom: var(--space-6)">${typeof I18n !== 'undefined' ? I18n.t('wedding.tips', 'Tips for Families Outside Kashmir') : 'Tips for Families Outside Kashmir'}</h2>
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
                
                ${ceremony.audioUrl ? Components.audioPlayer(ceremony.audioUrl, typeof I18n !== 'undefined' ? I18n.t('wedding.listen', 'Listen to Vanvun / Chant') : 'Listen to Vanvun / Chant', ceremony.audioSubtitle || (typeof I18n !== 'undefined' ? I18n.t('wedding.audio_subtitle', 'Traditional Kashmiri Wedding Song') : 'Traditional Kashmiri Wedding Song')) : ''}

                <p style="margin: var(--space-4) 0">${ceremony.description}</p>

                ${ceremony.significance ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ ${typeof I18n !== 'undefined' ? I18n.t('wedding.significance', 'Significance') : 'Significance'}</h4>
                    <p style="margin-bottom: var(--space-6)">${ceremony.significance}</p>
                ` : ''}

                ${ceremony.steps && ceremony.steps.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📋 ${typeof I18n !== 'undefined' ? I18n.t('wedding.steps', 'Steps') : 'Steps'}</h4>
                    <ol style="list-style: decimal; padding-left: var(--space-6); margin-bottom: var(--space-6)">
                        ${ceremony.steps.map(s => `<li style="padding: var(--space-2) 0; color: var(--text-secondary)">${s}</li>`).join('')}
                    </ol>
                ` : ''}

                ${ceremony.materials && ceremony.materials.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📦 ${typeof I18n !== 'undefined' ? I18n.t('wedding.materials', 'Materials Needed') : 'Materials Needed'}</h4>
                    ${Components.checklist(ceremony.materials, `wedding-${id}`)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${ceremony.responsibilities ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">👪 ${typeof I18n !== 'undefined' ? I18n.t('wedding.responsibilities', 'Family Responsibilities') : 'Family Responsibilities'}</h4>
                    <div class="grid-2" style="gap: var(--space-3)">
                        ${ceremony.responsibilities.bride_family ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.t('wedding.bride_family', "Bride's Family") : "Bride's Family"}</h5>
                            <p style="font-size: var(--text-sm)">${ceremony.responsibilities.bride_family}</p>
                        `, { compact: true }) : ''}
                        ${ceremony.responsibilities.groom_family ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.t('wedding.groom_family', "Groom's Family") : "Groom's Family"}</h5>
                            <p style="font-size: var(--text-sm)">${ceremony.responsibilities.groom_family}</p>
                        `, { compact: true }) : ''}
                        ${ceremony.responsibilities.both ? Components.card(`
                            <h5 style="color: var(--color-secondary); margin-bottom: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.t('wedding.both_families', 'Both Families') : 'Both Families'}</h5>
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
