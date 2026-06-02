/* ============================================
   App Entry Point
   Kashmiri Pandit Digital Companion
   ============================================ */

const App = (() => {
    const dataCache = {};

    /**
     * Initialize the application
     */
    function init() {
        setupMobileMenu();
        setupModalClose();
        Router.init();
    }

    /**
     * Load data from JSON files with caching
     */
    async function loadData(name) {
        if (dataCache[name]) {
            return dataCache[name];
        }

        try {
            const response = await fetch(`data/${name}.json`);
            if (!response.ok) throw new Error(`Failed to load ${name}`);
            const data = await response.json();
            dataCache[name] = data;
            return data;
        } catch (error) {
            console.error(`Error loading data/${name}.json:`, error);
            return null;
        }
    }

    /**
     * Setup mobile menu toggle
     */
    function setupMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                toggle.classList.remove('active');
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
    }

    /**
     * Setup modal close handlers
     */
    function setupModalClose() {
        const closeBtn = document.getElementById('modalClose');
        const overlay = document.getElementById('modalOverlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', Components.closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    Components.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Components.closeModal();
            }
        });
    }

    return { init, loadData };
})();

// Boot the application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
