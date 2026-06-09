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

                <section id="homeDailyWisdomWidget" class="mb-8 reveal">
                    <h2 class="dharma-section-title" data-i18n="home.wisdom.title">${typeof I18n !== 'undefined' ? I18n.t('home.wisdom.title', 'Daily Wisdom') : 'Daily Wisdom'}</h2>
                    <div class="grid-2 mt-4" style="gap: var(--space-4);">
                        <div class="presence-glass-card" id="homeGitaWidget" style="padding: var(--space-5); display: flex; flex-direction: column; justify-content: center;">
                            <div class="skeleton" style="height: 100px; width: 100%;"></div>
                        </div>
                        <div class="presence-glass-card" id="homeSubhashitaWidget" style="padding: var(--space-5); display: flex; flex-direction: column; justify-content: center;">
                            <div class="skeleton" style="height: 100px; width: 100%;"></div>
                        </div>
                    </div>
                </section>

                ${Components.ornamentalDivider('❖')}

                <!-- Quick Actions Grid -->
                <section class="mb-8 reveal">
                    ${Components.sectionHeader((typeof I18n !== 'undefined') ? I18n.t('home.quick_tools') : 'Quick Tools', (typeof I18n !== 'undefined') ? I18n.t('home.quick_tools_desc') : 'Access your spiritual utilities')}
                    <div class="grid-3 stagger-children">
                        ${Components.featureCard('🦚', (typeof I18n !== 'undefined') ? I18n.t('nav.gita') : 'Gita Wisdom Guide', (typeof I18n !== 'undefined') ? I18n.t('home.card_gita_desc', 'Open a full-screen Bhagavad Gita guidance companion') : 'Open a full-screen Bhagavad Gita guidance companion', '#gita')}
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
                                <span>${typeof I18n !== 'undefined' ? I18n.t('home.open_gita_ai', 'Open Gita Guide') : 'Open Gita Guide'}</span>
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

            const tYoga = typeof I18n !== 'undefined' ? I18n.t('home.panchang.yoga', 'Yoga') : 'Yoga';
            const tKarana = typeof I18n !== 'undefined' ? I18n.t('home.panchang.karana', 'Karana') : 'Karana';
            const tBrahma = typeof I18n !== 'undefined' ? I18n.t('home.panchang.brahma', 'Brahma Muhurat') : 'Brahma Muhurat';
            const tAbhijit = typeof I18n !== 'undefined' ? I18n.t('home.panchang.abhijit', 'Abhijit Muhurat') : 'Abhijit Muhurat';
            const tRahu = typeof I18n !== 'undefined' ? I18n.t('home.panchang.rahu', 'Rahu Kaal') : 'Rahu Kaal';

            const rawYoga = hinduDate.yoga ? hinduDate.yoga.name : 'Unknown';
            const displayYoga = typeof I18n !== 'undefined' ? I18n.t(`astro.yoga.${rawYoga}`, rawYoga) : rawYoga;
            
            const rawKarana = hinduDate.karana ? hinduDate.karana.name : 'Unknown';
            const displayKarana = typeof I18n !== 'undefined' ? I18n.t(`astro.karana.${rawKarana}`, rawKarana) : rawKarana;

            // We calculate default timings for Srinagar for the dashboard. It will update async if geolocation is allowed.
            const srinagarLat = 34.0837;
            const srinagarLon = 74.7973;
            let brahmaStr = '-- : --';
            let abhijitStr = '-- : --';
            let rahuStr = '-- : --';
            
            if (typeof CalendarCalc !== 'undefined' && CalendarCalc.calculateSunriseSunset) {
                const sunData = CalendarCalc.calculateSunriseSunset(now, srinagarLat, srinagarLon);
                if (sunData && sunData.sunrise && sunData.sunset) {
                    const brahma = CalendarCalc.calculateBrahmaMuhurat(sunData.sunrise);
                    const abhijit = CalendarCalc.calculateAbhijitMuhurat(sunData.sunrise, sunData.sunset);
                    const rahu = CalendarCalc.calculateRahuKalam(sunData.sunrise, sunData.sunset, now.getDay());
                    
                    const formatTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--';
                    if (brahma) brahmaStr = `${formatTime(brahma.start)} - ${formatTime(brahma.end)}`;
                    if (abhijit) abhijitStr = `${formatTime(abhijit.start)} - ${formatTime(abhijit.end)}`;
                    if (rahu) rahuStr = `${formatTime(rahu.start)} - ${formatTime(rahu.end)}`;
                }
            }

            presenceContainer.innerHTML = `
                <h2 class="dharma-section-title" data-i18n="home.presence_title">${typeof I18n !== 'undefined' ? I18n.t('home.presence_title') : 'Today\'s Presence'}</h2>
                <div class="presence-glass-card mt-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div class="panchang-col">
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
                        <div class="presence-item">
                            <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">🧘</span> ${tYoga}</div>
                            <div class="presence-item-value">${displayYoga}</div>
                        </div>
                        <div class="presence-item">
                            <div class="presence-item-label"><span style="font-size: 1.2rem; margin-right: 4px;">🙌</span> ${tKarana}</div>
                            <div class="presence-item-value">${displayKarana}</div>
                        </div>
                    </div>
                    <div class="panchang-col muhurat-col" style="border-left: 1px solid rgba(255,255,255,0.1); padding-left: var(--space-4);">
                        <div class="presence-item">
                            <div class="presence-item-label" style="color: var(--color-success);"><span style="font-size: 1.2rem; margin-right: 4px;">🌅</span> ${tBrahma}</div>
                            <div class="presence-item-value" id="dashBrahma" style="font-size: 0.9rem;">${brahmaStr}</div>
                        </div>
                        <div class="presence-item mt-3">
                            <div class="presence-item-label" style="color: var(--color-success);"><span style="font-size: 1.2rem; margin-right: 4px;">☀️</span> ${tAbhijit}</div>
                            <div class="presence-item-value" id="dashAbhijit" style="font-size: 0.9rem;">${abhijitStr}</div>
                        </div>
                        <div class="presence-item mt-3">
                            <div class="presence-item-label" style="color: var(--color-error);"><span style="font-size: 1.2rem; margin-right: 4px;">🌑</span> ${tRahu}</div>
                            <div class="presence-item-value" id="dashRahu" style="font-size: 0.9rem;">${rahuStr}</div>
                        </div>
                    </div>
                </div>
            `;

            // 4. Update Day-Wise God Image and Mantra
            const dayOfWeek = new Date().getDay();
            const godsConfig = [
                {
                    key: 'surya',
                    img: 'img/inspiration/surya.png',
                    name: 'Lord Surya',
                    mantraKey: 'home.mantra_surya',
                    mantraDefault: 'Om Suryaya Namaha',
                    highlightKey: 'home.mantra_surya_highlight',
                    highlightDefault: 'Radiant Sun',
                    meaningKey: 'home.mantra_surya_meaning',
                    meaningDefault: 'May the Sun God illuminate your path with vitality, health, and cosmic energy.',
                    loreKey: 'home.lore.surya',
                    loreDefault: 'Sunday is ruled by the Sun, the source of all life and consciousness. It is a day to cultivate inner strength, health, and a luminous aura.',
                    sadhanaKey: 'home.sadhana.surya',
                    sadhanaDefault: 'Sadhana: Offer water (Arghya) to the Sun at sunrise, and chant the Gayatri Mantra 11 times.'
                },
                {
                    key: 'shiva',
                    img: 'img/inspiration/shiva.png',
                    name: 'Lord Shiva',
                    mantraKey: 'home.mantra_shiva',
                    mantraDefault: 'Om Namah Shivaya',
                    highlightKey: 'home.mantra_shiva_highlight',
                    highlightDefault: 'Har Har Mahadev',
                    meaningKey: 'home.mantra_shiva_meaning',
                    meaningDefault: 'May the divine grace of Lord Shiva bring peace, wisdom, and strength to your spiritual journey.',
                    loreKey: 'home.lore.shiva',
                    loreDefault: 'Monday is ruled by the Moon and dedicated to Lord Shiva, the master of asceticism and inner peace. It brings emotional calmness.',
                    sadhanaKey: 'home.sadhana.shiva',
                    sadhanaDefault: 'Sadhana: Offer milk or water to the Shivling, or silently chant "Om Namah Shivaya" for 5 minutes.'
                },
                {
                    key: 'hanuman',
                    img: 'img/inspiration/hanuman.png',
                    name: 'Lord Hanuman',
                    mantraKey: 'home.mantra_hanuman',
                    mantraDefault: 'Om Hanumate Namaha',
                    highlightKey: 'home.mantra_hanuman_highlight',
                    highlightDefault: 'Jai Shri Ram',
                    meaningKey: 'home.mantra_hanuman_meaning',
                    meaningDefault: 'May Lord Hanuman bless you with boundless courage, devotion, and unwavering strength.',
                    loreKey: 'home.lore.hanuman',
                    loreDefault: 'Tuesday is ruled by Mars, governed by Lord Hanuman. It is a day of immense physical and mental energy, perfect for overcoming fears.',
                    sadhanaKey: 'home.sadhana.hanuman',
                    sadhanaDefault: 'Sadhana: Recite the Hanuman Chalisa. Face challenges head-on today without avoidance.'
                },
                {
                    key: 'ganesha',
                    img: 'img/inspiration/ganesha.png',
                    name: 'Lord Ganesha',
                    mantraKey: 'home.mantra_ganesha',
                    mantraDefault: 'Om Gam Ganapataye Namaha',
                    highlightKey: 'home.mantra_ganesha_highlight',
                    highlightDefault: 'Vighnaharta',
                    meaningKey: 'home.mantra_ganesha_meaning',
                    meaningDefault: 'May Lord Ganesha remove all obstacles and bless your endeavors with auspicious beginnings.',
                    loreKey: 'home.lore.ganesha',
                    loreDefault: 'Wednesday is ruled by Mercury. Worshipping Lord Ganesha today sharpens the intellect, removes obstacles in learning, and brings good fortune.',
                    sadhanaKey: 'home.sadhana.ganesha',
                    sadhanaDefault: 'Sadhana: Offer Durva grass if possible, and mentally pray for the removal of unseen mental blocks.'
                },
                {
                    key: 'vishnu',
                    img: 'img/inspiration/vishnu.png',
                    name: 'Lord Vishnu',
                    mantraKey: 'home.mantra_vishnu',
                    mantraDefault: 'Om Namo Bhagavate Vasudevaya',
                    highlightKey: 'home.mantra_vishnu_highlight',
                    highlightDefault: 'Hari Om',
                    meaningKey: 'home.mantra_vishnu_meaning',
                    meaningDefault: 'May Lord Vishnu sustain your life with cosmic harmony, truth, and spiritual preservation.',
                    loreKey: 'home.lore.vishnu',
                    loreDefault: 'Thursday is ruled by Jupiter (Guru), the planet of wisdom. Lord Vishnu sustains the universe through dharma and cosmic harmony.',
                    sadhanaKey: 'home.sadhana.vishnu',
                    sadhanaDefault: 'Sadhana: Express deep gratitude for your life’s blessings. Chant "Om Namo Bhagavate Vasudevaya".'
                },
                {
                    key: 'durga',
                    img: 'img/inspiration/durga.png',
                    name: 'Goddess Durga',
                    mantraKey: 'home.mantra_durga',
                    mantraDefault: 'Om Dum Durgayei Namaha',
                    highlightKey: 'home.mantra_durga_highlight',
                    highlightDefault: 'Jai Mata Di',
                    meaningKey: 'home.mantra_durga_meaning',
                    meaningDefault: 'May the divine mother grant you invincible courage, compassion, and spiritual triumph.',
                    loreKey: 'home.lore.durga',
                    loreDefault: 'Friday is ruled by Venus. The Divine Mother embodies supreme compassion and fierce protection. It is a day of beauty, art, and motherly love.',
                    sadhanaKey: 'home.sadhana.durga',
                    sadhanaDefault: 'Sadhana: Perform an act of kindness for a woman or mother-figure in your life.'
                },
                {
                    key: 'shani',
                    img: 'img/inspiration/shani.png',
                    name: 'Lord Shani',
                    mantraKey: 'home.mantra_shani',
                    mantraDefault: 'Om Sham Shanaischaraya Namaha',
                    highlightKey: 'home.mantra_shani_highlight',
                    highlightDefault: 'Karmic Balance',
                    meaningKey: 'home.mantra_shani_meaning',
                    meaningDefault: 'May Lord Shani bless you with righteous discipline, justice, and profound patience.',
                    loreKey: 'home.lore.shani',
                    loreDefault: 'Saturday is ruled by Saturn, the planet of karma and discipline. Lord Shani teaches patience, hard work, and justice.',
                    sadhanaKey: 'home.sadhana.shani',
                    sadhanaDefault: 'Sadhana: Practice fasting, silence, or donate food/clothes to the needy. Avoid anger today.'
                }
            ];

            const todayGod = godsConfig[dayOfWeek];
            
            const imgEl = document.querySelector('.inspiration-image-frame img');
            const mantraEl = document.querySelector('.inspiration-mantra');
            const meaningEl = document.querySelector('.inspiration-meaning');

            if (imgEl) {
                imgEl.src = todayGod.img;
                imgEl.alt = todayGod.name;
            }
            if (mantraEl) {
                const tMantra = typeof I18n !== 'undefined' ? I18n.t(todayGod.mantraKey, todayGod.mantraDefault) : todayGod.mantraDefault;
                const tHighlight = typeof I18n !== 'undefined' ? I18n.t(todayGod.highlightKey, todayGod.highlightDefault) : todayGod.highlightDefault;
                mantraEl.innerHTML = `<span data-i18n="${todayGod.mantraKey}">${tMantra}</span> <br><span class="highlight" data-i18n="${todayGod.highlightKey}">${tHighlight}</span>`;
                mantraEl.removeAttribute('data-i18n'); // Remove from parent so translatePage() doesn't flatten it
            }
            if (meaningEl) {
                meaningEl.setAttribute('data-i18n', todayGod.meaningKey);
                meaningEl.innerText = typeof I18n !== 'undefined' ? I18n.t(todayGod.meaningKey, todayGod.meaningDefault) : todayGod.meaningDefault;
                
                // Add lore and sadhana
                let loreHtml = `<div class="mt-4" style="font-size: 0.95rem; opacity: 0.9;" data-i18n="${todayGod.loreKey}">${typeof I18n !== 'undefined' ? I18n.t(todayGod.loreKey, todayGod.loreDefault) : todayGod.loreDefault}</div>`;
                let sadhanaHtml = `<div class="mt-3" style="font-weight: 600; color: var(--color-primary-light);" data-i18n="${todayGod.sadhanaKey}">${typeof I18n !== 'undefined' ? I18n.t(todayGod.sadhanaKey, todayGod.sadhanaDefault) : todayGod.sadhanaDefault}</div>`;
                
                // Check if they already exist, if not append them
                let loreContainer = meaningEl.parentElement.querySelector('.daily-lore-container');
                if (!loreContainer) {
                    loreContainer = document.createElement('div');
                    loreContainer.className = 'daily-lore-container';
                    meaningEl.parentElement.appendChild(loreContainer);
                }
                loreContainer.innerHTML = loreHtml + sadhanaHtml;
            }

            // 5. Render Daily Wisdom
            const gitaWidget = document.getElementById('homeGitaWidget');
            const subWidget = document.getElementById('homeSubhashitaWidget');
            
            if (gitaWidget) {
                const gitaKey = `home.gita.day${dayOfWeek}`;
                const gitaSkKey = `${gitaKey}_sk`;
                const gitaText = typeof I18n !== 'undefined' ? I18n.t(gitaKey, 'Gita Verse') : 'Gita Verse';
                const gitaSkText = typeof I18n !== 'undefined' ? I18n.t(gitaSkKey, '') : '';
                const gitaTitle = typeof I18n !== 'undefined' ? I18n.t('home.wisdom.shloka', 'Gita Verse of the Day') : 'Gita Verse of the Day';
                
                gitaWidget.innerHTML = `
                    <h3 style="font-size: 1.1rem; margin-bottom: var(--space-3); color: var(--color-primary-light);" data-i18n="home.wisdom.shloka">${gitaTitle}</h3>
                    <div style="font-size: 1.2rem; font-weight: 600; color: var(--color-secondary); margin-bottom: var(--space-2); line-height: 1.5; font-family: 'Sanskrit Text', serif;" data-i18n="${gitaSkKey}">${gitaSkText}</div>
                    <div style="font-size: 0.95rem; line-height: 1.6; opacity: 0.9;" data-i18n="${gitaKey}">${gitaText}</div>
                `;
            }

            if (subWidget) {
                const subKey = `home.sub.day${dayOfWeek}`;
                const subSkKey = `${subKey}_sk`;
                const subText = typeof I18n !== 'undefined' ? I18n.t(subKey, 'Ancient Proverb') : 'Ancient Proverb';
                const subSkText = typeof I18n !== 'undefined' ? I18n.t(subSkKey, '') : '';
                const subTitle = typeof I18n !== 'undefined' ? I18n.t('home.wisdom.subhashita', 'Subhashitam') : 'Subhashitam';
                
                subWidget.innerHTML = `
                    <h3 style="font-size: 1.1rem; margin-bottom: var(--space-3); color: var(--color-primary-light);" data-i18n="home.wisdom.subhashita">${subTitle}</h3>
                    <div style="font-size: 1.2rem; font-weight: 600; color: var(--color-secondary); margin-bottom: var(--space-2); line-height: 1.5; font-family: 'Sanskrit Text', serif;" data-i18n="${subSkKey}">${subSkText}</div>
                    <div style="font-size: 0.95rem; line-height: 1.6; opacity: 0.9;" data-i18n="${subKey}">${subText}</div>
                `;
            }

            // 5. Render Cosmic Energy
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
