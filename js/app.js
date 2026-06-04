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
        setupTheme();
        setupMobileMenu();
        setupModalClose();
        Router.init();
        if (typeof I18n !== 'undefined') {
            I18n.translatePage();
        }
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

    /**
     * Setup Light/Dark Mode Theme
     */
    function setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeToggleButton('light');
        }
    }

    /**
     * Toggle Theme Function
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        localStorage.setItem('theme', newTheme);
        updateThemeToggleButton(newTheme);
    }

    function updateThemeToggleButton(theme) {
        const icon = document.getElementById('themeToggleIcon');
        const text = document.getElementById('themeToggleText');
        if (icon && text) {
            if (theme === 'light') {
                icon.textContent = '🌙';
                text.textContent = 'Dark Mode';
            } else {
                icon.textContent = '☀️';
                text.textContent = 'Light Mode';
            }
        }
    }

    return { init, loadData, toggleTheme };
})();

// Boot the application when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
