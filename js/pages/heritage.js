/* ============================================
   Family Heritage Records Page
   ============================================ */

const HeritagePage = (() => {
    function render() {
        const heritage = Storage.getHeritage();
        
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('heritage.title', 'Family Heritage') : 'Family Heritage' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('heritage.header', 'Family Heritage Records') : 'Family Heritage Records',
                    typeof I18n !== 'undefined' ? I18n.t('heritage.desc', 'Preserve your family heritage — Gotra, Kuldevta, native village, traditions, and important observances. All data is stored privately on your device.') : 'Preserve your family heritage — Gotra, Kuldevta, native village, traditions, and important observances. All data is stored privately on your device.',
                    { h1: true }
                )}

                <div class="grid-2" style="align-items: start">
                    <!-- Heritage Form -->
                    ${Components.card(`
                        <h3 style="margin-bottom: var(--space-6)">👪 ${typeof I18n !== 'undefined' ? I18n.t('heritage.family_details', 'Your Family Details') : 'Your Family Details'}</h3>
                        
                        <div class="form-group mb-4">
                            <label class="form-label" for="familyName">${typeof I18n !== 'undefined' ? I18n.t('heritage.family_name', 'Family Name (Kram)') : 'Family Name (Kram)'}</label>
                            <input type="text" class="form-input" id="familyName" 
                                   placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.family_name_placeholder', 'e.g., Razdan, Kaul, Bhat, Dhar') : 'e.g., Razdan, Kaul, Bhat, Dhar'}" 
                                   value="${heritage.familyName || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="gotra">${typeof I18n !== 'undefined' ? I18n.t('heritage.gotra', 'Gotra') : 'Gotra'}</label>
                            <input type="text" class="form-input" id="gotra" 
                                   placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.gotra_placeholder', 'e.g., Bharadwaj, Kashyap, Vatsa') : 'e.g., Bharadwaj, Kashyap, Vatsa'}"
                                   value="${heritage.gotra || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="kuldevta">${typeof I18n !== 'undefined' ? I18n.t('heritage.kuldevta', 'Kuldevta / Kuldevi') : 'Kuldevta / Kuldevi'}</label>
                            <input type="text" class="form-input" id="kuldevta" 
                                   placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.kuldevta_placeholder', 'e.g., Goddess Sharika, Lord Shiva') : 'e.g., Goddess Sharika, Lord Shiva'}"
                                   value="${heritage.kuldevta || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="nativeVillage">${typeof I18n !== 'undefined' ? I18n.t('heritage.native_village', 'Native Village / Place in Kashmir') : 'Native Village / Place in Kashmir'}</label>
                            <input type="text" class="form-input" id="nativeVillage" 
                                   placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.native_village_placeholder', 'e.g., Habba Kadal, Rainawari, Baramulla') : 'e.g., Habba Kadal, Rainawari, Baramulla'}"
                                   value="${heritage.nativeVillage || ''}">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="traditions">${typeof I18n !== 'undefined' ? I18n.t('heritage.traditions', 'Family Traditions & Customs') : 'Family Traditions & Customs'}</label>
                            <textarea class="form-textarea" id="traditions" 
                                      placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.traditions_placeholder', 'Describe any unique family traditions, customs, or practices that have been passed down...') : 'Describe any unique family traditions, customs, or practices that have been passed down...'}"
                                      rows="4">${heritage.traditions || ''}</textarea>
                        </div>

                        <div class="form-group mb-6">
                            <label class="form-label">${typeof I18n !== 'undefined' ? I18n.t('heritage.observances', 'Important Annual Observances') : 'Important Annual Observances'}</label>
                            <div id="observancesContainer">
                                ${(heritage.observances || []).map((obs, i) => `
                                    <div class="flex gap-2 mb-2 items-center" id="obs-${i}">
                                        <input type="text" class="form-input" style="flex:1" 
                                               value="${obs}" placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.observance_placeholder', 'e.g., Annual Devgon') : 'e.g., Annual Devgon'}"
                                               onchange="HeritagePage.updateObservance(${i}, this.value)">
                                        <button class="btn btn-ghost" onclick="HeritagePage.removeObservance(${i})" style="color: var(--color-primary-light)">✕</button>
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn btn-ghost btn-sm mt-2" onclick="HeritagePage.addObservance()">
                                + ${typeof I18n !== 'undefined' ? I18n.t('heritage.add_observance', 'Add Observance') : 'Add Observance'}
                            </button>
                        </div>

                        <div class="flex gap-3 flex-wrap">
                            <button class="btn btn-primary" onclick="HeritagePage.save()">
                                💾 ${typeof I18n !== 'undefined' ? I18n.t('heritage.save_btn', 'Save Heritage') : 'Save Heritage'}
                            </button>
                            <button class="btn btn-outline" onclick="HeritagePage.exportData()">
                                📤 ${typeof I18n !== 'undefined' ? I18n.t('heritage.export_btn', 'Export') : 'Export'}
                            </button>
                            <label class="btn btn-outline" style="cursor: pointer">
                                📥 ${typeof I18n !== 'undefined' ? I18n.t('heritage.import_btn', 'Import') : 'Import'}
                                <input type="file" accept=".json" style="display:none" 
                                       onchange="HeritagePage.importData(this.files[0])">
                            </label>
                        </div>
                    `, { glass: true })}

                    <!-- Preview / Info -->
                    <div>
                        ${Components.card(`
                            <h3 style="margin-bottom: var(--space-4)">📖 ${typeof I18n !== 'undefined' ? I18n.t('heritage.about', 'About Family Heritage') : 'About Family Heritage'}</h3>
                            <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                                ${typeof I18n !== 'undefined' ? I18n.t('heritage.about_p1', 'Preserving family heritage is essential for maintaining the cultural identity of Kashmiri Pandits. Many important details about family traditions, ancestral villages, and customs are at risk of being lost as older generations pass on.') : 'Preserving family heritage is essential for maintaining the cultural identity of Kashmiri Pandits. Many important details about family traditions, ancestral villages, and customs are at risk of being lost as older generations pass on.'}
                            </p>
                            <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                                ${typeof I18n !== 'undefined' ? I18n.t('heritage.about_p2', 'This section allows you to digitally record your family heritage for future generations. All data is stored privately on your device and is not sent to any server.') : 'This section allows you to digitally record your family heritage for future generations. All data is stored privately on your device and is not sent to any server.'}
                            </p>
                            ${Components.accordion([
                                {
                                    title: typeof I18n !== 'undefined' ? I18n.t('heritage.gotra_q', 'What is a Gotra?') : 'What is a Gotra?',
                                    content: typeof I18n !== 'undefined' ? I18n.t('heritage.gotra_a', 'Gotra is a lineage system in Hinduism that identifies the ancestral sage from whom a family line descends. It plays an important role in Hindu marriage customs.') : 'Gotra is a lineage system in Hinduism that identifies the ancestral sage from whom a family line descends. It plays an important role in Hindu marriage customs.'
                                },
                                {
                                    title: typeof I18n !== 'undefined' ? I18n.t('heritage.kuldevta_q', 'What is a Kuldevta?') : 'What is a Kuldevta?',
                                    content: typeof I18n !== 'undefined' ? I18n.t('heritage.kuldevta_a', 'Kuldevta or Kuldevi is the family deity that the family has traditionally worshipped for generations. It is a deeply personal aspect of religious identity.') : 'Kuldevta or Kuldevi is the family deity that the family has traditionally worshipped for generations. It is a deeply personal aspect of religious identity.'
                                },
                                {
                                    title: typeof I18n !== 'undefined' ? I18n.t('heritage.village_q', 'Why is the native village important?') : 'Why is the native village important?',
                                    content: typeof I18n !== 'undefined' ? I18n.t('heritage.village_a', 'The native village in Kashmir holds deep emotional and cultural significance. Preserving it helps maintain the connection with ancestral roots.') : 'The native village in Kashmir holds deep emotional and cultural significance. Preserving it helps maintain the connection with ancestral roots.'
                                },
                                {
                                    title: typeof I18n !== 'undefined' ? I18n.t('heritage.storage_q', 'How is data stored?') : 'How is data stored?',
                                    content: typeof I18n !== 'undefined' ? I18n.t('heritage.storage_a', 'All data is stored in your browser local storage. It is never sent to any server. You can export your data as a JSON file for backup.') : 'All data is stored in your browser local storage. It is never sent to any server. You can export your data as a JSON file for backup.'
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
                    <div class="empty-state-title">${typeof I18n !== 'undefined' ? I18n.t('heritage.no_saved', 'No Heritage Saved Yet') : 'No Heritage Saved Yet'}</div>
                    <div class="empty-state-text">${typeof I18n !== 'undefined' ? I18n.t('heritage.no_saved_text', 'Fill in your family details and click Save to see a preview here.') : 'Fill in your family details and click Save to see a preview here.'}</div>
                </div>
            `);
        }

        return Components.card(`
            <h3 style="margin-bottom: var(--space-4); color: var(--color-secondary)">🪔 ${typeof I18n !== 'undefined' ? I18n.t('heritage.card_title', 'Family Heritage Card') : 'Family Heritage Card'}</h3>
            <div style="border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: var(--space-4)">
                ${heritage.familyName ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.family_name_upper', 'FAMILY NAME') : 'FAMILY NAME'}</span><div style="font-size: var(--text-lg); font-weight: 600">${heritage.familyName}</div></div>` : ''}
                ${heritage.gotra ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.gotra_upper', 'GOTRA') : 'GOTRA'}</span><div>${heritage.gotra}</div></div>` : ''}
                ${heritage.kuldevta ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.kuldevta_upper', 'KULDEVTA') : 'KULDEVTA'}</span><div>${heritage.kuldevta}</div></div>` : ''}
                ${heritage.nativeVillage ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.native_village_upper', 'NATIVE VILLAGE') : 'NATIVE VILLAGE'}</span><div>${heritage.nativeVillage}</div></div>` : ''}
                ${heritage.traditions ? `<div class="mb-3"><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.traditions_upper', 'TRADITIONS') : 'TRADITIONS'}</span><div style="font-size:var(--text-sm)">${heritage.traditions}</div></div>` : ''}
                ${heritage.observances && heritage.observances.length ? `
                    <div><span class="text-muted" style="font-size:var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.observances_upper', 'ANNUAL OBSERVANCES') : 'ANNUAL OBSERVANCES'}</span>
                    <div class="tag-group mt-2">${heritage.observances.filter(Boolean).map(o => `<span class="tag">${o}</span>`).join('')}</div></div>
                ` : ''}
            </div>
            ${heritage.updatedAt ? `<div class="text-muted mt-2" style="font-size: var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('heritage.last_updated', 'Last updated:') : 'Last updated:'} ${new Date(heritage.updatedAt).toLocaleDateString(typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN')}</div>` : ''}
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
            <input type="text" class="form-input" style="flex:1" placeholder="${typeof I18n !== 'undefined' ? I18n.t('heritage.observance_placeholder', 'e.g., Annual Devgon') : 'e.g., Annual Devgon'}">
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
        
        Components.showToast(typeof I18n !== 'undefined' ? I18n.t('heritage.save_success', 'Heritage saved successfully') : 'Heritage saved successfully', 'success');
    }

    function exportData() {
        Storage.exportHeritage();
        Components.showToast(typeof I18n !== 'undefined' ? I18n.t('heritage.export_success', 'Heritage data exported') : 'Heritage data exported', 'success');
    }

    async function importData(file) {
        if (!file) return;
        try {
            const data = await Storage.importHeritage(file);
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('heritage.import_success', 'Heritage imported successfully') : 'Heritage imported successfully', 'success');
            // Re-render page
            const container = document.getElementById('pageContainer');
            if (container) {
                container.innerHTML = render();
                afterRender();
            }
        } catch (err) {
            Components.showToast(`${typeof I18n !== 'undefined' ? I18n.t('heritage.import_error', 'Could not import heritage file') : 'Could not import heritage file'}: ${err.message}`, 'error');
        }
    }

    return { render, afterRender, addObservance, removeObservance, updateObservance, save, exportData, importData };
})();
