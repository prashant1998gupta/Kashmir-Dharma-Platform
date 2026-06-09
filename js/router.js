/* ============================================
   Hash-based SPA Router
   ============================================ */

const Router = (() => {
    const routes = {
        'home': { page: HomePage, title: 'Home' },
        'calendar': { page: CalendarPage, title: 'Festival Calendar' },
        'rituals': { page: RitualsPage, title: 'Ritual Library' },
        'wedding': { page: WeddingPage, title: 'Wedding Guide' },
        'birthday': { page: BirthdayPage, title: 'Janma Tithi' },
        'kundali': { page: KundaliPage, title: 'Kundali Generator' },
        'matching': { page: MatchingPage, title: 'Kundali Matching' },
        'rashiphal': { page: RashiphalPage, title: 'Daily Horoscope' },
        'muhurat': { page: MuhuratPage, title: 'Muhurat Finder' },
        'varshphal': { page: VarshphalPage, title: 'Annual Varshphal' },
        'heritage': { page: HeritagePage, title: 'Family Heritage' },
        'archive': { page: ArchivePage, title: 'Knowledge Archive' },
        'audio': { page: AudioPage, title: 'Audio Library' },
        'guide': { page: GuidePage, title: 'Knowledge Guide' },
        'sharada': { page: SharadaPage, title: 'Learn Sharada Script' },
        'gita': { page: GitaPage, title: 'Gita Wisdom Guide' }
    };

    let currentPage = null;

    /**
     * Initialize the router
     */
    function init() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    /**
     * Handle route change
     */
    function handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const route = routes[hash];

        if (!route) {
            navigate('home');
            return;
        }

        // Update page title
        document.title = `${route.title} — Kashmir Dharma Companion`;

        // Update active nav link
        updateActiveNav(hash);

        // Gita is an immersive full-screen surface, not part of the standard app shell.
        if (hash === 'gita' && currentPage && currentPage !== 'gita') {
            sessionStorage.setItem('kdp_last_non_gita_route', currentPage);
        } else if (hash !== 'gita') {
            sessionStorage.setItem('kdp_last_non_gita_route', hash);
        }
        document.body.classList.toggle('gita-immersive-route', hash === 'gita');

        // Close mobile sidebar
        closeMobileSidebar();

        // Render page
        renderPage(route, hash);
    }

    /**
     * Render the page content
     */
    function renderPage(route, hash) {
        const container = document.getElementById('pageContainer');
        if (!container) return;
        const isGitaImmersive = hash === 'gita';

        // Exit animation
        container.style.opacity = '0';
        container.style.transform = isGitaImmersive ? 'none' : 'translateY(10px)';

        setTimeout(() => {
            currentPage = hash;
            container.innerHTML = route.page.render();
            
            // Enter animation
            if (isGitaImmersive) {
                container.style.transition = isGitaImmersive ? 'opacity 0.25s ease' : 'opacity 0.4s ease, transform 0.4s ease';
                container.style.opacity = '1';
                container.style.transform = isGitaImmersive ? 'none' : 'translateY(0)';
            } else {
                requestAnimationFrame(() => {
                    container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                });
            }

            // Call afterRender for data loading
            if (route.page.afterRender) {
                route.page.afterRender();
            }
            
            // Re-run translations for newly injected page content
            if (typeof I18n !== 'undefined') {
                I18n.translatePage();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: isGitaImmersive ? 'auto' : 'smooth' });
        }, 150);
    }

    /**
     * Navigate to a page
     */
    function navigate(page) {
        window.location.hash = page;
    }

    /**
     * Update the active nav link
     */
    function updateActiveNav(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === hash);
        });
    }

    /**
     * Close mobile sidebar
     */
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const toggle = document.getElementById('menuToggle');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
    }

    /**
     * Get current page name
     */
    function getCurrentPage() {
        return currentPage;
    }

    return { init, navigate, getCurrentPage };
})();
