/* ============================================
   Home Page
   ============================================ */

const HomePage = (() => {
    function render() {
        return `
            <div class="page-enter">
                <!-- Hero Section -->
                <section class="hero hero-glow">
                    <h1 class="hero-title">
                        Preserving <span class="highlight">Kashmir's</span><br>
                        Sacred Heritage
                    </h1>
                    <p class="hero-subtitle">
                        A digital companion for the Kashmiri Pandit community — bridging generations 
                        with authentic knowledge of festivals, rituals, traditions, and spiritual practices.
                    </p>
                    <div class="hero-actions">
                        <a href="#calendar" class="btn btn-primary btn-lg">
                            📅 Explore Festivals
                        </a>
                        <a href="#rituals" class="btn btn-outline btn-lg">
                            📖 Browse Rituals
                        </a>
                    </div>
                </section>

                ${Components.ornamentalDivider('🔱')}

                <!-- Today's Panchang Widget -->
                <section class="mb-8 reveal" id="homePanchangWidget">
                    <!-- Loaded dynamically in afterRender -->
                </section>

                <!-- Stats -->
                <section class="grid-4 mb-8 reveal">
                    ${Components.statCard('8+', 'Festivals', '📅')}
                    ${Components.statCard('8+', 'Rituals', '📖')}
                    ${Components.statCard('9', 'Ceremonies', '💒')}
                    ${Components.statCard('6+', 'Articles', '📚')}
                </section>

                <!-- Feature Cards -->
                <section class="mb-8">
                    ${Components.sectionHeader(
                        'Explore Your Heritage',
                        'Discover the rich traditions, rituals, and wisdom of the Kashmiri Pandit community'
                    )}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('📅', 'Festival Calendar', 
                            'Explore the complete calendar of Kashmiri Pandit festivals with dates, rituals, foods, and significance.', '#calendar')}
                        ${Components.featureCard('📖', 'Ritual Library', 
                            'A comprehensive encyclopedia of rituals — from daily practices to life events and ceremonies.', '#rituals')}
                        ${Components.featureCard('💒', 'Wedding Guide', 
                            'Your digital companion for Kashmiri Pandit weddings — timeline, rituals, checklists, and more.', '#wedding')}
                        ${Components.featureCard('🎂', 'Janma Tithi Finder', 
                            'Find your Hindu birthday based on the lunar calendar. Enter your birth details to discover your Tithi.', '#birthday')}
                        ${Components.featureCard('🌌', 'Kundali Generator', 
                            'Generate your complete Vedic Birth Chart instantly, privately, and offline.', '#kundali')}
                        ${Components.featureCard('🌟', 'Muhurat Finder', 
                            'Identify auspicious dates and timings for important life events based on traditional Panchang.', '#muhurat')}
                        ${Components.featureCard('👪', 'Family Heritage', 
                            'Preserve your family records — Gotra, Kuldevta, native village, traditions, and observances.', '#heritage')}
                        ${Components.featureCard('📚', 'Knowledge Archive', 
                            'Articles, history, cultural essays, temple information, and religious teachings.', '#archive')}
                        ${Components.featureCard('🔮', 'Knowledge Guide', 
                            'Ask questions about Kashmiri Pandit traditions and get answers from our knowledge base.', '#guide')}
                        ${Components.featureCard('📜', 'Learn Sharada', 
                            'Explore and learn the ancient sacred Sharada script used for religious texts.', '#sharada')}
                    </div>
                </section>

                ${Components.ornamentalDivider('❖')}

                <!-- Upcoming Festivals Quick View -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader(
                        'Key Festivals',
                        'Important festivals observed by the Kashmiri Pandit community'
                    )}
                    <div class="grid-2" id="homeUpcomingFestivals">
                        <div class="skeleton skeleton-card"></div>
                        <div class="skeleton skeleton-card"></div>
                    </div>
                </section>

                <!-- Mission Statement -->
                <section class="reveal">
                    ${Components.card(`
                        <div class="text-center" style="padding: var(--space-8)">
                            <h2 style="margin-bottom: var(--space-4)">Our Mission</h2>
                            <div class="section-divider" style="margin: 0 auto var(--space-6)"></div>
                            <p style="max-width: 700px; margin: 0 auto; font-size: var(--text-lg); line-height: 2">
                                This platform preserves, organizes, and makes accessible authentic Kashmiri Pandit traditions. 
                                It serves as a bridge between the community and its heritage — <strong style="color: var(--color-secondary)">not 
                                to replace scholars and priests</strong>, but to ensure knowledge is available to every 
                                family, everywhere.
                            </p>
                            <div class="flex justify-center gap-4 mt-6 flex-wrap">
                                ${Components.badge('✅ Scholar Validated', 'accent')}
                                ${Components.badge('📖 Authentic Sources', 'secondary')}
                                ${Components.badge('🌍 For the Diaspora', 'primary')}
                            </div>
                        </div>
                    `, { featured: true })}
                </section>
            </div>
        `;
    }

    function renderPanchangWidget() {
        const container = document.getElementById('homePanchangWidget');
        if (!container) return;
        
        try {
            const now = new Date();
            // Wait for astronomy engine to load, retry if not loaded yet
            if (typeof CalendarCalc === 'undefined' || typeof CalendarCalc.getHinduDate === 'undefined') {
                setTimeout(renderPanchangWidget, 500);
                return;
            }

            // Using default coordinates for Srinagar (can be enhanced to use Geolocation API later)
            const hinduDate = CalendarCalc.getHinduDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
            
            container.innerHTML = Components.card(`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.5rem">🌅</span> Today's Panchang
                    </h3>
                    <div style="font-size: var(--text-sm); color: var(--text-muted);">
                        ${now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border); border-radius: var(--radius-sm); padding: var(--space-4);">
                        <div style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-2);">Tithi</div>
                        <div style="font-size: var(--text-lg); font-weight: bold; color: var(--color-secondary);">${hinduDate.tithi.paksha} ${hinduDate.tithi.name}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">${hinduDate.hinduMonth.name} Mass</div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border); border-radius: var(--radius-sm); padding: var(--space-4);">
                        <div style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-2);">Nakshatra</div>
                        <div style="font-size: var(--text-lg); font-weight: bold; color: var(--color-secondary);">${hinduDate.nakshatra.name}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">Moon in ${hinduDate.rashi.name} Rashi</div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border); border-radius: var(--radius-sm); padding: var(--space-4);">
                        <div style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-2);">Sunrise (IST)</div>
                        <div style="font-size: var(--text-lg); font-weight: bold; color: var(--color-secondary);">05:30 AM</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">Vedic Day Begins</div>
                    </div>
                </div>
            `, { glass: true, featured: false });
        } catch(e) {
            console.error("Error rendering Panchang Widget", e);
            container.innerHTML = ''; // Fail silently
        }
    }

    function afterRender() {
        // Render Panchang
        renderPanchangWidget();

        // Load upcoming festivals
        App.loadData('festivals').then(festivals => {
            const container = document.getElementById('homeUpcomingFestivals');
            if (container && festivals) {
                const featured = festivals.slice(0, 4);
                container.innerHTML = featured.map(f => Components.festivalCard(f)).join('');
            }
        });

        // Init scroll reveal
        setTimeout(() => Components.initScrollReveal(), 100);
    }

    return { render, afterRender };
})();
