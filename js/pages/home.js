/* ============================================
   Home Page
   ============================================ */

const HomePage = (() => {
    function render() {
        return `
            <div class="page-enter home-dashboard">
                <!-- Sacred Header -->
                <section class="reveal" id="homeDynamicHeader">
                    <div class="sacred-header-panel">
                        <div class="skeleton" style="height: 80px; width: 80%; margin: 0 auto 10px;"></div>
                        <div class="skeleton" style="height: 30px; width: 40%; margin: 0 auto;"></div>
                    </div>
                </section>

                <!-- Pahar Tracker -->
                <section class="reveal" id="homeSunWidgets">
                    <div class="pahar-tracker">
                        <div class="skeleton" style="height: 80px; width: 220px; border-radius: 14px;"></div>
                        <div class="skeleton" style="height: 80px; width: 220px; border-radius: 14px;"></div>
                    </div>
                </section>

                <!-- Framed Inspiration -->
                <section class="reveal">
                    <div class="framed-inspiration">
                        <div class="inspiration-image-frame">
                            <img src="img/inspiration/shiva.png" alt="Lord Shiva Meditation">
                        </div>
                        <div class="inspiration-text-content">
                            <h3 class="inspiration-mantra">Om Namah Shivaya <br><span class="highlight">Har Har Mahadev</span></h3>
                            <p class="inspiration-meaning">May the divine grace of Lord Shiva bring peace, wisdom, and strength to your spiritual journey.</p>
                        </div>
                    </div>
                </section>

                <!-- Presence & Highlights -->
                <div class="grid-2 reveal" style="gap: var(--space-6); align-items: start; margin-top: var(--space-4);">
                    <section id="homePresenceWidget">
                        <h2 class="dharma-section-title">Today's Presence</h2>
                        <div class="presence-glass-card mt-4">
                            <div class="skeleton" style="height: 100px; width: 100%;"></div>
                        </div>
                    </section>

                    <section id="homeHighlightsWidget">
                        <h2 class="dharma-section-title">Highlights</h2>
                        <div class="highlight-list mt-4">
                            <div class="skeleton" style="height: 80px; border-radius: 8px;"></div>
                            <div class="skeleton" style="height: 80px; border-radius: 8px; margin-top: 12px;"></div>
                        </div>
                    </section>
                </div>

                ${Components.ornamentalDivider('❖')}

                <!-- Quick Actions Grid -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader('Quick Tools', 'Access your spiritual utilities')}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('📅', 'Festival Calendar', 'Explore Kashmiri Pandit festivals', '#calendar')}
                        ${Components.featureCard('🌌', 'Kundali Generator', 'Generate your Vedic Birth Chart', '#kundali')}
                        ${Components.featureCard('🌟', 'Muhurat Finder', 'Identify auspicious dates & timings', '#muhurat')}
                    </div>
                </section>
                
                <!-- Explore More Grid -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader('Explore Knowledge', 'Deep dive into heritage')}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('📖', 'Ritual Library', 'Comprehensive encyclopedia of rituals', '#rituals')}
                        ${Components.featureCard('💒', 'Wedding Guide', 'Your companion for KP weddings', '#wedding')}
                        ${Components.featureCard('📜', 'Learn Sharada', 'Learn the ancient sacred script', '#sharada')}
                    </div>
                </section>
            </div>
        `;
    }

    function renderPanchangData() {
        const headerContainer = document.getElementById('homeDynamicHeader');
        const sunContainer = document.getElementById('homeSunWidgets');
        const presenceContainer = document.getElementById('homePresenceWidget');
        
        if (!headerContainer || !sunContainer || !presenceContainer) return;
        
        try {
            const now = new Date();
            if (typeof CalendarCalc === 'undefined' || typeof CalendarCalc.getHinduDate === 'undefined') {
                setTimeout(renderPanchangData, 500);
                return;
            }

            const hinduDate = CalendarCalc.getHinduDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
            
            // 1. Render Header
            const gregorianDateStr = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
            
            const tithiName = hinduDate.tithi.name || 'Pratipada';
            const paksha = hinduDate.tithi.paksha || 'Shukla';
            const tithiNumber = hinduDate.tithi.number || 1;
            const monthName = hinduDate.hinduMonth.name || 'Chaitra';
            
            headerContainer.innerHTML = `
                <div class="sacred-header-panel">
                    <div class="tithi-sacred-display">
                        <div class="tithi-sacred-main">${tithiName}</div>
                        <div class="tithi-sacred-sub">${tithiNumber} ${monthName} • ${paksha} Paksha</div>
                        <div class="gregorian-sacred-date">${gregorianDateStr}</div>
                    </div>
                </div>
            `;

            // 2. Render Sun Widgets
            let sunriseStr = "06:00 AM";
            let sunsetStr = "06:00 PM";

            const calculateSunTimes = (lat, lon) => {
                if (typeof Astronomy === 'undefined') return { rise: sunriseStr, set: sunsetStr };
                try {
                    const observer = new Astronomy.Observer(lat, lon, 0);
                    const astroDate = new Astronomy.AstroTime(now);
                    const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, astroDate, 1);
                    const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, astroDate, 1);
                    return {
                        rise: rise ? rise.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : sunriseStr,
                        set: set ? set.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : sunsetStr
                    };
                } catch (e) {
                    console.error("Error calculating sun times", e);
                    return { rise: sunriseStr, set: sunsetStr };
                }
            };

            const defaultTimes = calculateSunTimes(34.0837, 74.7973); // Srinagar

            sunContainer.innerHTML = `
                <div class="pahar-tracker">
                    <div class="pahar-card pahar-sunrise">
                        <div class="pahar-icon">🌅</div>
                        <div class="pahar-info">
                            <span class="pahar-label" id="sunriseLabel">Sunrise (Srinagar)</span>
                            <span class="pahar-time" id="sunriseTime">${defaultTimes.rise}</span>
                        </div>
                    </div>
                    <div class="pahar-card pahar-sunset">
                        <div class="pahar-icon">🌙</div>
                        <div class="pahar-info">
                            <span class="pahar-label" id="sunsetLabel">Sunset (Srinagar)</span>
                            <span class="pahar-time" id="sunsetTime">${defaultTimes.set}</span>
                        </div>
                    </div>
                </div>
            `;

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const localTimes = calculateSunTimes(position.coords.latitude, position.coords.longitude);
                    const srTimeEl = document.getElementById('sunriseTime');
                    const ssTimeEl = document.getElementById('sunsetTime');
                    const srLabelEl = document.getElementById('sunriseLabel');
                    const ssLabelEl = document.getElementById('sunsetLabel');
                    if (srTimeEl && ssTimeEl) {
                        srTimeEl.innerText = localTimes.rise;
                        ssTimeEl.innerText = localTimes.set;
                        srLabelEl.innerText = 'Sunrise (Local)';
                        ssLabelEl.innerText = 'Sunset (Local)';
                    }
                }, () => {
                    console.log("Geolocation permission denied or unavailable. Using Srinagar times.");
                });
            }

            // 3. Render Presence
            presenceContainer.innerHTML = `
                <h2 class="dharma-section-title">Today's Presence</h2>
                <div class="presence-glass-card mt-4">
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">🌙</span> Tithi</div>
                        <div class="presence-item-value" style="color: var(--color-secondary);">${tithiName}</div>
                    </div>
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">✨</span> Nakshatra</div>
                        <div class="presence-item-value">${hinduDate.nakshatra.name || 'Pushya'}</div>
                    </div>
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">♋</span> Rashi</div>
                        <div class="presence-item-value">${hinduDate.rashi.name || 'Karka'}</div>
                    </div>
                </div>
            `;
            
        } catch(e) {
            console.error("Error rendering Panchang Data", e);
        }
    }

    function renderHighlights() {
        const container = document.getElementById('homeHighlightsWidget');
        if (!container) return;

        App.loadData('festivals').then(festivals => {
            let highlightsHTML = '<div class="highlight-list mt-4">';
            
            // Festival Event
            if (festivals && festivals.length > 0) {
                const f = festivals[0];
                highlightsHTML += `
                    <div class="highlight-glass-item">
                        <div class="hg-content">
                            <h4>${f.name}</h4>
                            <p>${f.date || 'Upcoming'}</p>
                        </div>
                        <div class="hg-badge">FESTIVAL</div>
                    </div>
                `;
            } else {
                highlightsHTML += `
                    <div class="highlight-glass-item" style="justify-content: center; opacity: 0.7;">
                        <p style="margin: 0;">No major highlights today.</p>
                    </div>
                `;
            }
            
            highlightsHTML += '</div>';
            container.innerHTML = `
                <h2 class="dharma-section-title">Highlights</h2>
                ${highlightsHTML}
            `;
        });
    }

    function afterRender() {
        renderPanchangData();
        renderHighlights();
        setTimeout(() => Components.initScrollReveal(), 100);
    }

    return { render, afterRender };
})();
