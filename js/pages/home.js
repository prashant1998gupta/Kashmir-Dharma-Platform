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
                            <h3 class="inspiration-mantra" data-i18n="home.mantra">${typeof I18n !== 'undefined' ? I18n.t('home.mantra', 'Om Namah Shivaya') : 'Om Namah Shivaya'} <br><span class="highlight" data-i18n="home.mantra_highlight">${typeof I18n !== 'undefined' ? I18n.t('home.mantra_highlight', 'Har Har Mahadev') : 'Har Har Mahadev'}</span></h3>
                            <p class="inspiration-meaning" data-i18n="home.mantra_meaning">${typeof I18n !== 'undefined' ? I18n.t('home.mantra_meaning', 'May the divine grace of Lord Shiva bring peace, wisdom, and strength to your spiritual journey.') : 'May the divine grace of Lord Shiva bring peace, wisdom, and strength to your spiritual journey.'}</p>
                        </div>
                    </div>
                </section>

                <!-- Presence & Highlights -->
                <div class="grid-2 reveal" style="gap: var(--space-6); align-items: start; margin-top: var(--space-4);">
                    <section id="homePresenceWidget">
                        <h2 class="dharma-section-title" data-i18n="home.presence_title">${typeof I18n !== 'undefined' ? I18n.t('home.presence_title', "Today's Presence") : "Today's Presence"}</h2>
                        <div class="presence-glass-card mt-4">
                            <div class="skeleton" style="height: 100px; width: 100%;"></div>
                        </div>
                    </section>

                    <section id="homeHighlightsWidget">
                        <h2 class="dharma-section-title" data-i18n="home.highlights_title">${typeof I18n !== 'undefined' ? I18n.t('home.highlights_title', 'Highlights') : 'Highlights'}</h2>
                        <div class="highlight-list mt-4">
                            <div class="skeleton" style="height: 80px; border-radius: 8px;"></div>
                            <div class="skeleton" style="height: 80px; border-radius: 8px; margin-top: 12px;"></div>
                        </div>
                    </section>
                </div>

                <section id="homeCosmicEnergyWidget" class="mb-8 reveal">
                    <h2 class="dharma-section-title" data-i18n="home.cosmic_title">${typeof I18n !== 'undefined' ? I18n.t('home.cosmic_title', 'Current Cosmic Energy') : 'Current Cosmic Energy'}</h2>
                    <div class="presence-glass-card mt-4" style="text-align: center; display: block; padding: var(--space-5);">
                        <div class="skeleton" style="height: 60px; width: 100%;"></div>
                    </div>
                </section>

                ${Components.ornamentalDivider('❖')}

                <!-- Quick Actions Grid -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader((typeof I18n !== 'undefined') ? I18n.t('home.quick_tools') : 'Quick Tools', (typeof I18n !== 'undefined') ? I18n.t('home.quick_tools_desc') : 'Access your spiritual utilities')}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('🦚', (typeof I18n !== 'undefined') ? I18n.t('nav.gita') : 'Gita AI Companion', (typeof I18n !== 'undefined') ? I18n.t('home.card_gita_desc', 'Open a full-screen Bhagavad Gita guidance companion') : 'Open a full-screen Bhagavad Gita guidance companion', '#gita')}
                        ${Components.featureCard('📅', (typeof I18n !== 'undefined') ? I18n.t('nav.calendar') : 'Festival Calendar', (typeof I18n !== 'undefined') ? I18n.t('home.card_cal_desc') : 'Explore Kashmiri Pandit festivals', '#calendar')}
                        ${Components.featureCard('🌌', (typeof I18n !== 'undefined') ? I18n.t('nav.kundali') : 'Kundali Generator', (typeof I18n !== 'undefined') ? I18n.t('home.card_kundali_desc') : 'Generate your Vedic Birth Chart', '#kundali')}
                        ${Components.featureCard('🌟', (typeof I18n !== 'undefined') ? I18n.t('nav.muhurat') : 'Muhurat Finder', (typeof I18n !== 'undefined') ? I18n.t('home.card_muhurat_desc') : 'Identify auspicious dates & timings', '#muhurat')}
                    </div>
                </section>
                
                <!-- Explore More Grid -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader((typeof I18n !== 'undefined') ? I18n.t('home.explore_knowledge') : 'Explore Knowledge', (typeof I18n !== 'undefined') ? I18n.t('home.explore_knowledge_desc') : 'Deep dive into heritage')}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('📖', (typeof I18n !== 'undefined') ? I18n.t('nav.rituals') : 'Ritual Library', (typeof I18n !== 'undefined') ? I18n.t('home.card_rituals_desc') : 'Comprehensive encyclopedia of rituals', '#rituals')}
                        ${Components.featureCard('💒', (typeof I18n !== 'undefined') ? I18n.t('nav.wedding') : 'Wedding Guide', (typeof I18n !== 'undefined') ? I18n.t('home.card_wedding_desc') : 'Your companion for KP weddings', '#wedding')}
                        ${Components.featureCard('📜', (typeof I18n !== 'undefined') ? I18n.t('nav.sharada') : 'Learn Sharada', (typeof I18n !== 'undefined') ? I18n.t('home.card_sharada_desc') : 'Learn the ancient sacred script', '#sharada')}
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
            const locale = (typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'hi-IN' : 'en-GB';
            const gregorianDateStr = now.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
            
            const tithiName = hinduDate.tithi.name || 'Pratipada';
            const paksha = hinduDate.tithi.paksha || 'Shukla';
            const tithiNumber = hinduDate.tithi.number || 1;
            const monthName = hinduDate.hinduMonth.name || 'Chaitra';
            
            const tithiNameTranslated = typeof I18n !== 'undefined' ? I18n.tAstro(tithiName) : tithiName;
            
            const pakshaBase = (paksha.split(' ')[0] || 'Shukla');
            const pakshaTranslated = typeof I18n !== 'undefined' ? I18n.t(`astro.paksha.${pakshaBase}`, pakshaBase) : pakshaBase;
            const pakshaWord = typeof I18n !== 'undefined' ? I18n.t('astro.paksha.word', 'Paksha') : 'Paksha';
            
            const monthNameTranslated = typeof I18n !== 'undefined' ? I18n.t(`astro.month.${monthName}`, monthName) : monthName;
            
            headerContainer.innerHTML = `
                <div class="sacred-header-panel">
                    <div class="tithi-sacred-display">
                        <div class="tithi-sacred-main">${tithiNameTranslated}</div>
                        <div class="tithi-sacred-sub">${tithiNumber} ${monthNameTranslated} • ${pakshaTranslated} ${pakshaWord}</div>
                        <div class="gregorian-sacred-date">${gregorianDateStr}</div>
                        <div class="home-gita-launch-row">
                            <a href="#gita" class="home-gita-launch">
                                <span>🦚</span>
                                <span>${typeof I18n !== 'undefined' ? I18n.t('home.open_gita_ai', 'Open Gita AI') : 'Open Gita AI'}</span>
                            </a>
                        </div>
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

            const tSunrise = typeof I18n !== 'undefined' ? I18n.t('home.sunrise') : 'Sunrise';
            const tSunset = typeof I18n !== 'undefined' ? I18n.t('home.sunset') : 'Sunset';
            const tSrinagar = typeof I18n !== 'undefined' ? I18n.t('home.srinagar') : 'Srinagar';
            const tLocal = typeof I18n !== 'undefined' ? I18n.t('home.local') : 'Local';

            sunContainer.innerHTML = `
                <div class="pahar-tracker">
                    <div class="pahar-card pahar-sunrise">
                        <div class="pahar-icon">🌅</div>
                        <div class="pahar-info">
                            <span class="pahar-label" id="sunriseLabel">${tSunrise} (${tSrinagar})</span>
                            <span class="pahar-time" id="sunriseTime">${defaultTimes.rise}</span>
                        </div>
                    </div>
                    <div class="pahar-card pahar-sunset">
                        <div class="pahar-icon">🌙</div>
                        <div class="pahar-info">
                            <span class="pahar-label" id="sunsetLabel">${tSunset} (${tSrinagar})</span>
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
                        srLabelEl.innerText = `${tSunrise} (${tLocal})`;
                        ssLabelEl.innerText = `${tSunset} (${tLocal})`;
                    }
                }, () => {
                    console.log("Geolocation permission denied or unavailable. Using Srinagar times.");
                });
            }

            // 3. Render Presence
            const tTithi = typeof I18n !== 'undefined' ? I18n.t('home.tithi') : 'Tithi';
            const tNakshatra = typeof I18n !== 'undefined' ? I18n.t('home.nakshatra') : 'Nakshatra';
            const tRashi = typeof I18n !== 'undefined' ? I18n.t('home.rashi') : 'Rashi';

            const displayTithi = typeof I18n !== 'undefined' ? I18n.tAstro(tithiName) : tithiName;
            
            const rawNakshatra = hinduDate.nakshatra.name || 'Pushya';
            const displayNakshatra = typeof I18n !== 'undefined' ? I18n.t(`astro.nakshatra.${rawNakshatra.replace(/ /g, '_')}`, rawNakshatra) : rawNakshatra;
            
            const rawRashi = hinduDate.rashi.name || 'Karka (Cancer)';
            const rashiBaseNameWidget = rawRashi.split(' (')[0];
            const displayRashi = typeof I18n !== 'undefined' ? I18n.t(`astro.rashi.${rashiBaseNameWidget}`, rawRashi) : rawRashi;

            presenceContainer.innerHTML = `
                <h2 class="dharma-section-title" data-i18n="home.presence_title">${typeof I18n !== 'undefined' ? I18n.t('home.presence_title') : 'Today\'s Presence'}</h2>
                <div class="presence-glass-card mt-4">
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">🌙</span> ${tTithi}</div>
                        <div class="presence-item-value" style="color: var(--color-secondary);">${displayTithi}</div>
                    </div>
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">✨</span> ${tNakshatra}</div>
                        <div class="presence-item-value">${displayNakshatra}</div>
                    </div>
                    <div class="presence-item">
                        <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">♋</span> ${tRashi}</div>
                        <div class="presence-item-value">${displayRashi}</div>
                    </div>
                </div>
            `;

            // 4. Render Cosmic Energy
            const cosmicContainer = document.getElementById('homeCosmicEnergyWidget');
            if (cosmicContainer) {
                const rashiName = hinduDate.rashi.name || '';
                const rashiMeanings = {
                    'Mesh': { en: 'Aries', icon: '♈', desc: 'A time of dynamic energy and initiation. Focus on taking bold steps forward and leading with courage.' },
                    'Vrish': { en: 'Taurus', icon: '♉', desc: 'A period of grounding and stability. Excellent for focusing on finances, sensual comforts, and building solid foundations.' },
                    'Mithun': { en: 'Gemini', icon: '♊', desc: 'A time of communication and curiosity. Connect with others, exchange ideas, and satisfy your intellectual pursuits.' },
                    'Karka': { en: 'Cancer', icon: '♋', desc: 'A phase of emotional depth and nurturing. Ideal for focusing on home, family, and inner spiritual peace.' },
                    'Simh': { en: 'Leo', icon: '♌', desc: 'A period of creativity and self-expression. Step into the spotlight and let your natural leadership shine.' },
                    'Kanya': { en: 'Virgo', icon: '♍', desc: 'A time for organization and service. Focus on details, health routines, and practical improvements in your daily life.' },
                    'Tula': { en: 'Libra', icon: '♎', desc: 'A phase of balance and relationships. Seek harmony in partnerships and appreciate beauty in all its forms.' },
                    'Vrishchik': { en: 'Scorpio', icon: '♏', desc: 'A time of transformation and intensity. Delve deep into mysteries and embrace profound emotional connections.' },
                    'Dhanu': { en: 'Sagittarius', icon: '♐', desc: 'A period of expansion and philosophy. Embrace optimism, travel, and the search for higher wisdom.' },
                    'Makar': { en: 'Capricorn', icon: '♑', desc: 'A phase of discipline and ambition. Focus on your career, responsibilities, and long-term goals.' },
                    'Kumbh': { en: 'Aquarius', icon: '♒', desc: 'A time of innovation and community. Connect with groups, embrace your uniqueness, and champion humanitarian causes.' },
                    'Meen': { en: 'Pisces', icon: '♓', desc: 'A period of intuition and spirituality. Rest, reflect, and connect with the divine through art and meditation.' }
                };

                const rashiKey = Object.keys(rashiMeanings).find(k => rashiName.includes(k));
                if (rashiKey) {
                    const rData = rashiMeanings[rashiKey];
                    const tMoonIn = typeof I18n !== 'undefined' ? I18n.t('home.moon_in', 'The Moon is in') : 'The Moon is in';
                    const cosmicDesc = typeof I18n !== 'undefined' ? I18n.t(`home.cosmic.${rashiKey}`, rData.desc) : rData.desc;
                    // We extract the english name from the parenthetical (e.g. "Makara (Capricorn)") to translate it properly or just use the base string
                    const rashiBaseName = (hinduDate.rashi.name || '').split(' (')[0] || rashiName;
                    const translatedRashi = typeof I18n !== 'undefined' ? I18n.t(`astro.rashi.${rashiBaseName}`, rashiBaseName) : rashiBaseName;
                    
                    cosmicContainer.innerHTML = `
                        <h2 class="dharma-section-title" data-i18n="home.cosmic_title">${typeof I18n !== 'undefined' ? I18n.t('home.cosmic_title') : 'Current Cosmic Energy'}</h2>
                        <div class="presence-glass-card mt-4" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: var(--space-6);">
                            <div style="font-size: 3rem; color: var(--color-secondary); margin-bottom: var(--space-2); text-shadow: 0 0 20px var(--color-secondary-glow);">${rData.icon}</div>
                            <h3 style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--text-primary); margin-bottom: var(--space-3);">
                                ${tMoonIn} <span style="color: var(--color-secondary);">${translatedRashi}</span>
                            </h3>
                            <p style="color: var(--text-secondary); max-width: 600px; line-height: 1.6; font-size: var(--text-base); margin: 0 auto;">
                                ${cosmicDesc}
                            </p>
                        </div>
                    `;
                } else {
                    cosmicContainer.style.display = 'none';
                }
            }
            
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
                const festName = typeof I18n !== 'undefined' ? I18n.t(`fest.${f.id}.name`, f.name) : f.name;
                const festDate = typeof I18n !== 'undefined' ? I18n.t(`fest.${f.id}.date`, f.date || 'Upcoming') : (f.date || 'Upcoming');
                highlightsHTML += `
                    <div class="highlight-glass-item">
                        <div class="hg-content">
                            <h4>${festName}</h4>
                            <p>${festDate}</p>
                        </div>
                        <div class="hg-badge">${typeof I18n !== 'undefined' ? I18n.t('home.festival', 'FESTIVAL') : 'FESTIVAL'}</div>
                    </div>
                `;
            } else {
                highlightsHTML += `
                    <div class="highlight-glass-item" style="justify-content: center; opacity: 0.7;">
                        <p style="margin: 0;">${typeof I18n !== 'undefined' ? I18n.t('home.no_highlights', 'No major highlights today.') : 'No major highlights today.'}</p>
                    </div>
                `;
            }
            
            highlightsHTML += '</div>';
            container.innerHTML = `
                <h2 class="dharma-section-title" data-i18n="home.highlights_title">${typeof I18n !== 'undefined' ? I18n.t('home.highlights_title', 'Highlights') : 'Highlights'}</h2>
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
