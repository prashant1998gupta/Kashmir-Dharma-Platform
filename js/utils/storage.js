/* ============================================
   Local Storage Utilities
   Family Heritage Data & User Preferences
   ============================================ */

const Storage = (() => {
    const KEYS = {
        HERITAGE: 'kp_family_heritage',
        BOOKMARKS: 'kp_bookmarks',
        PREFERENCES: 'kp_preferences',
        CHECKLIST: 'kp_checklists'
    };

    /**
     * Safe get from localStorage
     */
    function get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn(`Storage.get error for key "${key}":`, e);
            return defaultValue;
        }
    }

    /**
     * Safe set to localStorage
     */
    function set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`Storage.set error for key "${key}":`, e);
            return false;
        }
    }

    /**
     * Remove from localStorage
     */
    function remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    // --- Family Heritage ---
    function getHeritage() {
        return get(KEYS.HERITAGE, {
            familyName: '',
            gotra: '',
            kuldevta: '',
            nativeVillage: '',
            traditions: '',
            observances: []
        });
    }

    function saveHeritage(data) {
        return set(KEYS.HERITAGE, { ...data, updatedAt: new Date().toISOString() });
    }

    function exportHeritage() {
        const data = getHeritage();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `family_heritage_${data.familyName || 'backup'}_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importHeritage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    saveHeritage(data);
                    resolve(data);
                } catch (err) {
                    reject(new Error('Invalid file format'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // --- Bookmarks ---
    function getBookmarks() {
        return get(KEYS.BOOKMARKS, []);
    }

    function addBookmark(item) {
        const bookmarks = getBookmarks();
        if (!bookmarks.find(b => b.id === item.id)) {
            bookmarks.push({ ...item, addedAt: new Date().toISOString() });
            set(KEYS.BOOKMARKS, bookmarks);
        }
    }

    function removeBookmark(id) {
        const bookmarks = getBookmarks().filter(b => b.id !== id);
        set(KEYS.BOOKMARKS, bookmarks);
    }

    function isBookmarked(id) {
        return getBookmarks().some(b => b.id === id);
    }

    // --- Checklists ---
    function getChecklist(checklistId) {
        const all = get(KEYS.CHECKLIST, {});
        return all[checklistId] || {};
    }

    function setChecklistItem(checklistId, itemId, checked) {
        const all = get(KEYS.CHECKLIST, {});
        if (!all[checklistId]) all[checklistId] = {};
        all[checklistId][itemId] = checked;
        set(KEYS.CHECKLIST, all);
    }

    // --- Preferences ---
    function getPreferences() {
        return get(KEYS.PREFERENCES, {
            notifications: true,
            compactView: false
        });
    }

    function setPreference(key, value) {
        const prefs = getPreferences();
        prefs[key] = value;
        set(KEYS.PREFERENCES, prefs);
    }

    return {
        get,
        set,
        remove,
        getHeritage,
        saveHeritage,
        exportHeritage,
        importHeritage,
        getBookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getChecklist,
        setChecklistItem,
        getPreferences,
        setPreference
    };
})();
