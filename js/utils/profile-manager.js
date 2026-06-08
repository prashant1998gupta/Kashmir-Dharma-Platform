/* ============================================
   Family Profile Manager (Offline Storage)
   ============================================ */

const ProfileManager = (() => {
    const STORAGE_KEY = 'kdp_family_profiles';

    function t(key, fallback) {
        return typeof I18n !== 'undefined' ? I18n.t(key, fallback) : fallback;
    }

    function getProfiles() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading profiles from localStorage", e);
            return [];
        }
    }

    function saveProfiles(profiles) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        } catch (e) {
            console.error("Error saving profiles to localStorage", e);
            if (typeof Components !== 'undefined' && Components.showToast) Components.showToast(t('profile.storage_error', 'Storage error. Profiles may not be saved.'), "error");
        }
    }

    function addProfile(profile) {
        const profiles = getProfiles();
        profile.id = 'prof_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        profiles.push(profile);
        saveProfiles(profiles);
        return profile;
    }

    function updateProfile(id, updatedData) {
        const profiles = getProfiles();
        const index = profiles.findIndex(p => p.id === id);
        if (index !== -1) {
            profiles[index] = { ...profiles[index], ...updatedData };
            saveProfiles(profiles);
            return profiles[index];
        }
        return null;
    }

    function deleteProfile(id) {
        let profiles = getProfiles();
        profiles = profiles.filter(p => p.id !== id);
        saveProfiles(profiles);
    }

    function getProfileById(id) {
        return getProfiles().find(p => p.id === id) || null;
    }

    /**
     * Renders an HTML <select> dropdown of profiles
     * @param {string} selectId ID for the select element
     * @param {string} onchangeHandler Function name to call on change
     * @returns {string} HTML string
     */
    function renderProfileSelector(selectId, onchangeHandler) {
        const profiles = getProfiles();
        if (profiles.length === 0) {
            return `
                <div id="${selectId}_wrapper" data-handler="${onchangeHandler}" style="margin-top: var(--space-2);">
                    <button class="btn btn-outline" onclick="ProfileManager.openManagerModal()" style="width: 100%; border-style: dashed;">
                        ${t('profile.add_family', '+ Add a Family Profile')}
                    </button>
                </div>
            `;
        }
        
        const options = profiles.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        return `
            <div id="${selectId}_wrapper" data-handler="${onchangeHandler}" class="profile-selector" style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
                <label for="${selectId}" style="color: var(--text-secondary); font-weight: 500;">${t('profile.load_saved', 'Load Saved Profile:')}</label>
                <select id="${selectId}" class="form-select" onchange="${onchangeHandler}(this.value)" style="flex: 1;">
                    <option value="">${t('profile.select_profile', '-- Select a Profile --')}</option>
                    ${options}
                </select>
            </div>
        `;
    }

    function refreshSelectors() {
        document.querySelectorAll('[id$="_wrapper"]').forEach(wrapper => {
            if (wrapper.id.endsWith('_wrapper') && wrapper.dataset.handler) {
                const selectId = wrapper.id.replace('_wrapper', '');
                const handler = wrapper.dataset.handler;
                const select = wrapper.querySelector('select');
                const val = select ? select.value : '';
                
                wrapper.outerHTML = renderProfileSelector(selectId, handler);
                
                const newSelect = document.getElementById(selectId);
                if (newSelect && val) {
                    newSelect.value = val;
                }
            }
        });
    }

    /**
     * Generates HTML for the Profile Manager UI
     */
    function renderManagerUI() {
        const profiles = getProfiles();
        let profilesHtml = '';

        if (profiles.length === 0) {
            profilesHtml = `
                <div class="card card-glass" style="text-align: center; padding: var(--space-8);">
                    <div style="font-size: 3rem; margin-bottom: var(--space-3);">👥</div>
                    <h4 style="margin-bottom: var(--space-2); color: var(--text-heading);">${t('profile.no_saved_title', 'No Profiles Saved Yet')}</h4>
                    <p style="color: var(--text-muted); font-size: var(--text-sm);">${t('profile.no_saved_desc', 'Add family members using the form to quickly generate their charts and dates.')}</p>
                </div>
            `;
        } else {
            profilesHtml = profiles.map(p => `
                <div class="card card-glass" style="margin-bottom: var(--space-3); padding: var(--space-4); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; color: var(--text-heading);">${p.name}</h4>
                        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">
                            ${p.dob} ${p.time ? '| ' + p.time : ''} | ${p.lat}, ${p.lng}
                        </div>
                    </div>
                    <button class="btn btn-ghost" style="color: #ff4444; padding: 4px 8px;" onclick="ProfileManager.handleDelete('${p.id}')" aria-label="${t('profile.delete_label', 'Delete Profile')}">
                        <span style="font-size: 1.2rem;">🗑️</span>
                    </button>
                </div>
            `).join('');
        }

        return `
            <div style="padding: var(--space-6);">
                <h2 style="margin-bottom: var(--space-4);">${t('profile.manager_title', 'Family Profiles')}</h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">${t('profile.manager_desc', 'Save birth details of family members to quickly generate their Kundali, Janma Tithi, and Muhurat calculations.')}</p>
                
                <div class="grid-2">
                    <!-- Add New Form -->
                    <div class="card">
                        <h3 style="margin-bottom: var(--space-4);">${t('profile.add_new', 'Add New Profile')}</h3>
                        <form id="profileAddForm" onsubmit="ProfileManager.handleAdd(event)">
                            <div class="form-group">
                                <label class="form-label">${t('profile.name', 'Name')}</label>
                                <input type="text" id="profName" class="form-input" placeholder="${t('profile.name_placeholder', 'E.g., Rahul Koul')}" required style="width:100%">
                            </div>
                            <div class="form-group">
                                <label class="form-label">${t('profile.dob', 'Date of Birth')}</label>
                                <input type="date" id="profDob" class="form-input" required style="width:100%; color-scheme: dark;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">${t('profile.tob_optional', 'Time of Birth (Optional)')}</label>
                                <input type="time" id="profTime" class="form-input" style="width:100%; color-scheme: dark;">
                            </div>
                            <div class="grid-2">
                                <div class="form-group">
                                    <label class="form-label">${t('profile.latitude', 'Latitude')}</label>
                                    <input type="number" step="0.0001" id="profLat" class="form-input" value="34.0837" required style="width:100%">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">${t('profile.longitude', 'Longitude')}</label>
                                    <input type="number" step="0.0001" id="profLng" class="form-input" value="74.7973" required style="width:100%">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${t('profile.timezone', 'Timezone Offset (Hours from UTC)')}</label>
                                <input type="number" step="0.5" id="profTz" class="form-input" value="5.5" required style="width:100%">
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">${t('profile.save', 'Save Profile')}</button>
                        </form>
                    </div>

                    <!-- Saved Profiles List -->
                    <div>
                        <h3 style="margin-bottom: var(--space-4);">${t('profile.saved_profiles', 'Saved Profiles')}</h3>
                        <div id="profilesListContainer">
                            ${profilesHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function handleAdd(e) {
        e.preventDefault();
        const profile = {
            name: document.getElementById('profName').value,
            dob: document.getElementById('profDob').value,
            time: document.getElementById('profTime').value,
            lat: parseFloat(document.getElementById('profLat').value),
            lng: parseFloat(document.getElementById('profLng').value),
            tz: parseFloat(document.getElementById('profTz').value)
        };

        addProfile(profile);
        document.getElementById('profileAddForm').reset();
        
        // Re-render the modal content to show the new profile
        const container = document.getElementById('modalBody');
        if (container) {
            container.innerHTML = renderManagerUI();
        }
        
        refreshSelectors();
        
        if (typeof Components !== 'undefined' && Components.showToast) {
            Components.showToast(t('profile.save_success', 'Profile saved successfully'), "success");
        }
    }

    function handleDelete(id) {
        if (confirm(t('profile.delete_confirm', 'Are you sure you want to delete this profile?'))) {
            deleteProfile(id);
            // Re-render the modal
            const container = document.getElementById('modalBody');
            if (container) {
                container.innerHTML = renderManagerUI();
            }
            refreshSelectors();
        }
    }

    function openManagerModal() {
        if (typeof Components !== 'undefined' && Components.openModal) {
            Components.openModal(renderManagerUI());
            
            // Close mobile sidebar if open
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    }

    return {
        getProfiles,
        addProfile,
        updateProfile,
        deleteProfile,
        getProfileById,
        renderProfileSelector,
        openManagerModal,
        handleAdd,
        handleDelete
    };
})();

window.ProfileManager = ProfileManager;
