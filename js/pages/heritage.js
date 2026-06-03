/* ============================================
   Family Heritage Records Page
   ============================================ */

const HeritagePage = (() => {
    function render() {
        const heritage = Storage.getHeritage();
        
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Family Heritage' }
                ])}

                ${Components.sectionHeader(
                    'Family Heritage Records',
                    'Preserve your family heritage — Gotra, Kuldevta, native village, traditions, and important observances. All data is stored privately on your device.',
                    { h1: true }
                )}

                <div class="grid-2" style="align-items: start">
                    <!-- Heritage Form -->
                    ${Components.card(`
                        <h3 style="margin-bottom: var(--space-6)">👪 Your Family Details</h3>
                        
                        <div class="form-group mb-4">
                            <label class="form-label" for="familyName">Family Name (Kram)</label>
                            <input type="text" class="form-input" id="familyName" 
                                   placeholder="e.g., Razdan, Kaul, Bhat, Dhar" 
                                   value="${heritage.familyName || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="gotra">Gotra</label>
                            <input type="text" class="form-input" id="gotra" 
                                   placeholder="e.g., Bharadwaj, Kashyap, Vatsa"
                                   value="${heritage.gotra || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="kuldevta">Kuldevta / Kuldevi</label>
                            <input type="text" class="form-input" id="kuldevta" 
                                   placeholder="e.g., Goddess Sharika, Lord Shiva"
                                   value="${heritage.kuldevta || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="nativeVillage">Native Village / Place in Kashmir</label>
                            <input type="text" class="form-input" id="nativeVillage" 
                                   placeholder="e.g., Habba Kadal, Rainawari, Baramulla"
                                   value="${heritage.nativeVillage || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="traditions">Family Traditions & Customs</label>
                            <textarea class="form-textarea" id="traditions" 
                                      placeholder="Describe any unique family traditions, customs, or practices that have been passed down..."
                                      rows="4">${heritage.traditions || ''}</textarea>
                        </div>

                        <div class="form-group mb-6">
                            <label class="form-label">Important Annual Observances</label>
                            <div id="observancesContainer">
                                ${(heritage.observances || []).map((obs, i) => `
                                    <div class="flex gap-2 mb-2 items-center" id="obs-${i}">
                                        <input type="text" class="form-input" style="flex:1" 
                                               value="${obs}" placeholder="e.g., Annual Devgon"
                                               onchange="HeritagePage.updateObservance(${i}, this.value)">
                                        <button class="btn btn-ghost" onclick="HeritagePage.removeObservance(${i})" style="color: var(--color-primary-light)">✕</button>
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn btn-ghost btn-sm mt-2" onclick="HeritagePage.addObservance()">
                                + Add Observance
                            </button>
                        </div>

                        <div class="flex gap-3 flex-wrap">
                            <button class="btn btn-primary" onclick="HeritagePage.save()">
                                💾 Save Heritage
                            </button>
                            <button class="btn btn-outline" onclick="HeritagePage.exportData()">
                                📤 Export
                            </button>
                            <label class="btn btn-outline" style="cursor: pointer">
                                📥 Import
                                <input type="file" accept=".json" style="display:none" 
                                       onchange="HeritagePage.importData(this.files[0])">
                            </label>
                        </div>
                    `, { glass: true })}

                    <!-- Preview / Info -->
                    <div>
                        ${Components.card(`
                            <h3 style="margin-bottom: var(--space-4)">📖 About Family Heritage</h3>
                            <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                                Preserving family heritage is essential for maintaining the cultural identity of Kashmiri Pandits. 
                                Many important details about family traditions, ancestral villages, and customs are at risk of 
                                being lost as older generations pass on.
                            </p>
                            <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                                This section allows you to digitally record your family's heritage for future generations. 
                                All data is <strong style="color: var(--color-accent-light)">stored privately on your device</strong> 
                                and is not sent to any server.
                            </p>
                            ${Components.accordion([
                                {
                                    title: 'What is a Gotra?',
                                    content: 'Gotra is a lineage system in Hinduism that identifies the ancestral sage (Rishi) from whom a family line descends. It plays an important role in Hindu marriage customs, as marriages within the same gotra are traditionally avoided.'
                                },
                                {
                                    title: 'What is a Kuldevta?',
                                    content: 'Kuldevta (or Kuldevi) is the family deity — the god or goddess that the family has traditionally worshipped for generations. The Kuldevta varies from family to family and is a deeply personal aspect of religious identity.'
                                },
                                {
                                    title: 'Why is the native village important?',
                                    content: 'The native village in Kashmir holds deep emotional and cultural significance. Many family names (Kram) are derived from the village of origin. Preserving this information helps maintain the connection with ancestral roots.'
                                },
                                {
                                    title: 'How is data stored?',
                                    content: "All data is stored in your browser's local storage. It is never sent to any server. You can export your data as a JSON file for backup and import it on another device."
                                }
                            ], 'heritage-info')}
                        `)}

                        <!-- Heritage Preview Card -->
                        <div class="mt-4" id="heritagePreview">
                            ${renderPreview(heritage)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderPreview(heritage) {
        if (!heritage.familyName && !heritage.gotra && !heritage.kuldevta) {
            return Components.card(`
                <div class="empty-state" style="padding: var(--space-6)">
                    <div class="empty-state-icon">👪</div>
                    <div class="empty-state-title">No Heritage Saved Yet</div>
                    <div class="empty-state-text">Fill in your family details and click Save to see a preview here.</div>
                </div>
            `);
        }

        return Components.card(`
            <h3 style="margin-bottom: var(--space-4); color: var(--color-secondary)">🪔 Family Heritage Card</h3>
            <div style="border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: var(--space-4)">
                ${heritage.familyName ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">FAMILY NAME</span><div style="font-size: var(--text-lg); font-weight: 600">${heritage.familyName}</div></div>` : ''}
                ${heritage.gotra ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">GOTRA</span><div>${heritage.gotra}</div></div>` : ''}
                ${heritage.kuldevta ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">KULDEVTA</span><div>${heritage.kuldevta}</div></div>` : ''}
                ${heritage.nativeVillage ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">NATIVE VILLAGE</span><div>${heritage.nativeVillage}</div></div>` : ''}
                ${heritage.traditions ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">TRADITIONS</span><div style="font-size:var(--text-sm)">${heritage.traditions}</div></div>` : ''}
                ${heritage.observances && heritage.observances.length ? `
                    <div><span class="text-muted" style="font-size:var(--text-xs)">ANNUAL OBSERVANCES</span>
                    <div class="tag-group mt-2">${heritage.observances.filter(Boolean).map(o => `<span class="tag">${o}</span>`).join('')}</div></div>
                ` : ''}
            </div>
            ${heritage.updatedAt ? `<div class="text-muted mt-2" style="font-size: var(--text-xs)">Last updated: ${new Date(heritage.updatedAt).toLocaleDateString('en-IN')}</div>` : ''}
        `, { featured: true });
    }

    function afterRender() {}

    let observances = [];

    function getFormData() {
        return {
            familyName: document.getElementById('familyName')?.value || '',
            gotra: document.getElementById('gotra')?.value || '',
            kuldevta: document.getElementById('kuldevta')?.value || '',
            nativeVillage: document.getElementById('nativeVillage')?.value || '',
            traditions: document.getElementById('traditions')?.value || '',
            observances: getObservances()
        };
    }

    function getObservances() {
        const container = document.getElementById('observancesContainer');
        if (!container) return [];
        const inputs = container.querySelectorAll('input[type="text"]');
        return Array.from(inputs).map(i => i.value).filter(Boolean);
    }

    function addObservance() {
        const container = document.getElementById('observancesContainer');
        if (!container) return;
        const index = container.children.length;
        const div = document.createElement('div');
        div.className = 'flex gap-2 mb-2 items-center';
        div.id = `obs-${index}`;
        div.innerHTML = `
            <input type="text" class="form-input" style="flex:1" placeholder="e.g., Annual Devgon">
            <button class="btn btn-ghost" onclick="this.parentElement.remove()" style="color: var(--color-primary-light)">✕</button>
        `;
        container.appendChild(div);
    }

    function removeObservance(index) {
        const el = document.getElementById(`obs-${index}`);
        if (el) el.remove();
    }

    function updateObservance(index, value) {
        // Auto-saved through getObservances() on save
    }

    function save() {
        const data = getFormData();
        Storage.saveHeritage(data);
        
        // Update preview
        const preview = document.getElementById('heritagePreview');
        if (preview) {
            preview.innerHTML = renderPreview(data);
            setTimeout(() => {
                const y = preview.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 150);
        }
        
        Components.showToast('Family heritage saved successfully!', 'success');
    }

    function exportData() {
        Storage.exportHeritage();
        Components.showToast('Heritage data exported', 'success');
    }

    async function importData(file) {
        if (!file) return;
        try {
            const data = await Storage.importHeritage(file);
            Components.showToast('Heritage data imported successfully!', 'success');
            // Re-render page
            const container = document.getElementById('pageContainer');
            if (container) {
                container.innerHTML = render();
                afterRender();
            }
        } catch (err) {
            Components.showToast('Failed to import: ' + err.message, 'error');
        }
    }

    return { render, afterRender, addObservance, removeObservance, updateObservance, save, exportData, importData };
})();
