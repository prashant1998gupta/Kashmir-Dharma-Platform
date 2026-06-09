/* ============================================
   Rashiphal (Daily Horoscope) Page
   ============================================ */

const RashiphalPage = (() => {
    const ZODIACS = [
        { id: 'aries', name: 'Aries', icon: '\u2648', angle: 0 },
        { id: 'taurus', name: 'Taurus', icon: '\u2649', angle: 30 },
        { id: 'gemini', name: 'Gemini', icon: '\u264A', angle: 60 },
        { id: 'cancer', name: 'Cancer', icon: '\u264B', angle: 90 },
        { id: 'leo', name: 'Leo', icon: '\u264C', angle: 120 },
        { id: 'virgo', name: 'Virgo', icon: '\u264D', angle: 150 },
        { id: 'libra', name: 'Libra', icon: '\u264E', angle: 180 },
        { id: 'scorpio', name: 'Scorpio', icon: '\u264F', angle: 210 },
        { id: 'sagittarius', name: 'Sagittarius', icon: '\u2650', angle: 240 },
        { id: 'capricorn', name: 'Capricorn', icon: '\u2651', angle: 270 },
        { id: 'aquarius', name: 'Aquarius', icon: '\u2652', angle: 300 },
        { id: 'pisces', name: 'Pisces', icon: '\u2653', angle: 330 }
    ];

    const COPY = {
        en: {
            heroTitle: 'Pick your sign. Read your day.',
            heroSubtitle: 'Twelve signs, one rotation. Click yours to lock the wheel.',
            kicker: 'Daily Horoscope',
            mood: 'Mood',
            love: 'Love',
            career: 'Career',
            money: 'Money',
            placeholder: 'Select a sign to reveal your daily astrological insights.',
            luckyNumber: 'Lucky number:',
            luckyColor: 'Lucky color:',
            readFull: 'Read full forecast',
            compatibility: 'Compatibility \u2192',
            selectSign: 'Select',
            signs: {
                aries: 'Aries',
                taurus: 'Taurus',
                gemini: 'Gemini',
                cancer: 'Cancer',
                leo: 'Leo',
                virgo: 'Virgo',
                libra: 'Libra',
                scorpio: 'Scorpio',
                sagittarius: 'Sagittarius',
                capricorn: 'Capricorn',
                aquarius: 'Aquarius',
                pisces: 'Pisces'
            },
            moods: ['Energetic', 'Calm', 'Creative', 'Reflective', 'Focused'],
            colors: ['Ruby Red', 'Royal Blue', 'Golden Yellow', 'Emerald Green', 'Mystic Purple'],
            descriptions: {
                aries: 'Your fiery energy is at its peak today. Channel it into a creative project or take the lead on a tough assignment.',
                taurus: 'Patience is your greatest strength today. Move steadily, enjoy simple comforts, and let delayed answers arrive naturally.',
                gemini: 'Sparkling conversations can open an unexpected door. Keep your mind open, but verify details before committing.',
                cancer: 'Your intuition is especially sharp right now. Trust your instincts around home, family, and emotional decisions.',
                leo: 'The spotlight is drawn toward you. Present an idea, share your warmth, and let confidence guide the room.',
                virgo: 'Small improvements matter today. Organizing your space or your notes can lead to a useful afternoon breakthrough.',
                libra: 'Balance is the assignment. Mediate carefully, protect your own peace, and choose harmony without avoiding truth.',
                scorpio: 'Your focus is magnetic. Dive into research, a passion project, or a private goal that needs sustained attention.',
                sagittarius: 'Adventure is calling in a practical way. Try a new subject, route, cuisine, or conversation that widens your view.',
                capricorn: 'Consistent effort is paying off. A milestone, useful recognition, or clearer plan may surface before evening.',
                aquarius: 'Your unconventional thinking is useful today. Share the idea that seems unusual; it may solve a stubborn problem.',
                pisces: 'Your inner world is active and meaningful. Give dreams, memories, and quiet signals room to guide your choices.'
            }
        },
        hi: {
            heroTitle: '\u0905\u092A\u0928\u0940 \u0930\u093E\u0936\u093F \u091A\u0941\u0928\u0947\u0902. \u0906\u091C \u0915\u093E \u0926\u093F\u0928 \u092A\u0922\u093C\u0947\u0902.',
            heroSubtitle: '\u092C\u093E\u0930\u0939 \u0930\u093E\u0936\u093F\u092F\u093E\u0902, \u090F\u0915 \u091A\u0915\u094D\u0930. \u0905\u092A\u0928\u0940 \u0930\u093E\u0936\u093F \u091A\u0941\u0928\u0947\u0902.',
            kicker: '\u0926\u0948\u0928\u093F\u0915 \u0930\u093E\u0936\u093F\u092B\u0932',
            mood: '\u092E\u0928\u094B\u092D\u093E\u0935',
            love: '\u092A\u094D\u0930\u0947\u092E',
            career: '\u0915\u0930\u093F\u092F\u0930',
            money: '\u0927\u0928',
            placeholder: '\u0905\u092A\u0928\u093E \u0926\u0948\u0928\u093F\u0915 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u0940\u092F \u0938\u0902\u0915\u0947\u0924 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u093E\u0936\u093F \u091A\u0941\u0928\u0947\u0902.',
            luckyNumber: '\u0936\u0941\u092D \u0905\u0902\u0915:',
            luckyColor: '\u0936\u0941\u092D \u0930\u0902\u0917:',
            readFull: '\u092A\u0942\u0930\u093E \u0930\u093E\u0936\u093F\u092B\u0932 \u092A\u0922\u093C\u0947\u0902',
            compatibility: '\u0938\u0902\u0917\u0924\u0924\u093E \u2192',
            selectSign: '\u091A\u0941\u0928\u0947\u0902',
            signs: {
                aries: '\u092E\u0947\u0937',
                taurus: '\u0935\u0943\u0937\u092D',
                gemini: '\u092E\u093F\u0925\u0941\u0928',
                cancer: '\u0915\u0930\u094D\u0915',
                leo: '\u0938\u093F\u0902\u0939',
                virgo: '\u0915\u0928\u094D\u092F\u093E',
                libra: '\u0924\u0941\u0932\u093E',
                scorpio: '\u0935\u0943\u0936\u094D\u091A\u093F\u0915',
                sagittarius: '\u0927\u0928\u0941',
                capricorn: '\u092E\u0915\u0930',
                aquarius: '\u0915\u0941\u0902\u092D',
                pisces: '\u092E\u0940\u0928'
            },
            moods: ['\u090A\u0930\u094D\u091C\u093E\u0935\u093E\u0928', '\u0936\u093E\u0902\u0924', '\u0930\u091A\u0928\u093E\u0924\u094D\u092E\u0915', '\u091A\u093F\u0902\u0924\u0928\u0936\u0940\u0932', '\u0915\u0947\u0902\u0926\u094D\u0930\u093F\u0924'],
            colors: ['\u0930\u0942\u092C\u0940 \u0932\u093E\u0932', '\u0930\u0949\u092F\u0932 \u0928\u0940\u0932\u093E', '\u0938\u0941\u0928\u0939\u0930\u093E \u092A\u0940\u0932\u093E', '\u092A\u0928\u094D\u0928\u093E \u0939\u0930\u093E', '\u0930\u0939\u0938\u094D\u092F\u092E\u092F \u092C\u0948\u0902\u0917\u0928\u0940'],
            descriptions: {
                aries: '\u0906\u091C \u0906\u092A\u0915\u0940 \u090A\u0930\u094D\u091C\u093E \u092E\u091C\u092C\u0942\u0924 \u0939\u0948. \u0907\u0938\u0947 \u0930\u091A\u0928\u093E\u0924\u094D\u092E\u0915 \u0915\u093E\u092E \u092F\u093E \u0915\u093F\u0938\u0940 \u0915\u0920\u093F\u0928 \u091C\u093C\u093F\u092E\u094D\u092E\u0947\u0926\u093E\u0930\u0940 \u092E\u0947\u0902 \u0932\u0917\u093E\u090F\u0902.',
                taurus: '\u0906\u091C \u0927\u0948\u0930\u094D\u092F \u0906\u092A\u0915\u0940 \u0938\u092C\u0938\u0947 \u092C\u0921\u093C\u0940 \u0936\u0915\u094D\u0924\u093F \u0939\u0948. \u0927\u0940\u0930\u0947 \u091A\u0932\u0947\u0902 \u0914\u0930 \u0909\u0924\u094D\u0924\u0930\u094B\u0902 \u0915\u094B \u0938\u094D\u0935\u093E\u092D\u093E\u0935\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0906\u0928\u0947 \u0926\u0947\u0902.',
                gemini: '\u0906\u091C \u0905\u091A\u094D\u091B\u0940 \u092C\u093E\u0924\u091A\u0940\u0924 \u0928\u092F\u093E \u0905\u0935\u0938\u0930 \u0926\u0947 \u0938\u0915\u0924\u0940 \u0939\u0948. \u092E\u0928 \u0916\u0941\u0932\u093E \u0930\u0916\u0947\u0902, \u092A\u0930 \u0928\u093F\u0930\u094D\u0923\u092F \u0938\u0947 \u092A\u0939\u0932\u0947 \u0935\u093F\u0935\u0930\u0923 \u091C\u093E\u0902\u091A\u0947\u0902.',
                cancer: '\u0906\u091C \u0906\u092A\u0915\u093E \u0905\u0902\u0924\u0930\u094D\u091C\u094D\u091E\u093E\u0928 \u0924\u0947\u091C \u0939\u0948. \u0918\u0930, \u092A\u0930\u093F\u0935\u093E\u0930 \u0914\u0930 \u092D\u093E\u0935\u0928\u093E\u0924\u094D\u092E\u0915 \u0928\u093F\u0930\u094D\u0923\u092F\u094B\u0902 \u092E\u0947\u0902 \u0905\u092A\u0928\u0940 \u0905\u0928\u0941\u092D\u0942\u0924\u093F \u092A\u0930 \u092D\u0930\u094B\u0938\u093E \u0915\u0930\u0947\u0902.',
                leo: '\u0927\u094D\u092F\u093E\u0928 \u0938\u094D\u0935\u093E\u092D\u093E\u0935\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0906\u092A\u0915\u0940 \u0913\u0930 \u0906\u090F\u0917\u093E. \u0915\u094B\u0908 \u0935\u093F\u091A\u093E\u0930 \u0938\u093E\u091D\u093E \u0915\u0930\u0928\u0947 \u0914\u0930 \u0906\u0924\u094D\u092E\u0935\u093F\u0936\u094D\u0935\u093E\u0938 \u0938\u0947 \u091A\u0932\u0928\u0947 \u0915\u093E \u0926\u093F\u0928 \u0939\u0948.',
                virgo: '\u091B\u094B\u091F\u0947 \u0938\u0941\u0927\u093E\u0930 \u0906\u091C \u092C\u0921\u093C\u093E \u092B\u0930\u094D\u0915 \u0932\u093E\u090F\u0902\u0917\u0947. \u0905\u092A\u0928\u0940 \u091C\u0917\u0939 \u092F\u093E \u092F\u094B\u091C\u0928\u093E \u0915\u094B \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0915\u0930\u0947\u0902.',
                libra: '\u0906\u091C \u0938\u0902\u0924\u0941\u0932\u0928 \u091C\u093C\u0930\u0942\u0930\u0940 \u0939\u0948. \u0936\u093E\u0902\u0924\u093F \u091A\u0941\u0928\u0947\u0902, \u092A\u0930 \u0938\u091A\u094D\u091A\u093E\u0908 \u0938\u0947 \u092C\u091A\u0947\u0902 \u0928\u0939\u0940\u0902.',
                scorpio: '\u0906\u091C \u0906\u092A\u0915\u093E \u0927\u094D\u092F\u093E\u0928 \u0917\u0939\u0930\u093E \u0939\u0948. \u0936\u094B\u0927, \u0928\u093F\u091C\u0940 \u0932\u0915\u094D\u0937\u094D\u092F \u092F\u093E \u0915\u093F\u0938\u0940 \u092A\u094D\u0930\u093F\u092F \u0915\u093E\u0930\u094D\u092F \u092E\u0947\u0902 \u092E\u0928 \u0932\u0917\u093E\u090F\u0902.',
                sagittarius: '\u0906\u091C \u0928\u092F\u093E \u0905\u0928\u0941\u092D\u0935 \u0906\u092A\u0915\u094B \u092A\u094D\u0930\u0947\u0930\u093F\u0924 \u0915\u0930\u0947\u0917\u093E. \u0928\u0908 \u092C\u093E\u0924, \u0928\u0908 \u0926\u093F\u0936\u093E \u092F\u093E \u0928\u0908 \u0938\u0940\u0916 \u0915\u094B \u0905\u092A\u0928\u093E\u090F\u0902.',
                capricorn: '\u0932\u0917\u093E\u0924\u093E\u0930 \u092E\u0947\u0939\u0928\u0924 \u0915\u093E \u092B\u0932 \u0926\u093F\u0916 \u0930\u0939\u093E \u0939\u0948. \u0906\u091C \u0915\u094B\u0908 \u0938\u094D\u092A\u0937\u094D\u091F \u092F\u094B\u091C\u0928\u093E \u092F\u093E \u091B\u094B\u091F\u0940 \u0909\u092A\u0932\u092C\u094D\u0927\u093F \u092E\u093F\u0932 \u0938\u0915\u0924\u0940 \u0939\u0948.',
                aquarius: '\u0906\u091C \u0906\u092A\u0915\u0940 \u0905\u0928\u094B\u0916\u0940 \u0938\u094B\u091A \u0915\u093E\u092E \u0906\u090F\u0917\u0940. \u091C\u094B \u0935\u093F\u091A\u093E\u0930 \u0905\u0932\u0917 \u0932\u0917\u0947, \u0909\u0938\u0947 \u0938\u093E\u091D\u093E \u0915\u0930\u0928\u0947 \u0938\u0947 \u0928 \u0921\u0930\u0947\u0902.',
                pisces: '\u0906\u092A\u0915\u0940 \u0905\u0902\u0924\u0930\u094D\u0926\u0941\u0928\u093F\u092F\u093E \u0906\u091C \u0938\u0915\u094D\u0930\u093F\u092F \u0939\u0948. \u0936\u093E\u0902\u0924 \u0938\u0902\u0915\u0947\u0924\u094B\u0902 \u0914\u0930 \u0938\u094D\u0935\u092A\u094D\u0928\u094B\u0902 \u0915\u094B \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0902.'
            }
        }
    };

    let currentZodiacId = 'aries';
    let resizeHandler = null;

    function render() {
        const copy = getCopy();
        return `
            <section class="rashiphal-page page-enter">
                <div class="rashiphal-star rashiphal-star-1" aria-hidden="true"></div>
                <div class="rashiphal-star rashiphal-star-2" aria-hidden="true"></div>
                <div class="rashiphal-star rashiphal-star-3" aria-hidden="true"></div>
                <div class="rashiphal-star rashiphal-star-4" aria-hidden="true"></div>

                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.rashiphal', 'Daily Horoscope') : 'Daily Horoscope' }
                ])}

                <header class="rashiphal-header">
                    <h1>${copy.heroTitle}</h1>
                    <p>${copy.heroSubtitle}</p>
                </header>

                <div class="rashiphal-layout">
                    <div class="rashiphal-wheel-wrap">
                        <div class="zodiac-wheel-container">
                            <div class="sun-center">
                                <div class="sun-center-icon" id="sun-icon" aria-hidden="true">\u2600\uFE0F</div>
                            </div>
                            <div class="orbital-ring" id="orbital-ring">
                                ${ZODIACS.map(z => `
                                    <button class="zodiac-node" type="button" data-id="${z.id}" data-angle="${z.angle}" onclick="RashiphalPage.selectZodiac('${z.id}')" aria-label="${copy.selectSign} ${copy.signs[z.id]}" aria-pressed="false">
                                        <span class="zodiac-icon" aria-hidden="true">${z.icon}</span>
                                        <span class="zodiac-label">${copy.signs[z.id]}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div id="horoscope-details-container" class="horoscope-details-container">
                        <div class="horoscope-panel">
                            <div class="horoscope-kicker">
                                ${copy.kicker} <span aria-hidden="true">&bull;</span> <span id="h-date"></span>
                            </div>
                            <h2 id="h-title" class="horoscope-title">
                                ${copy.signs.aries} <span id="h-emoji" aria-hidden="true">\u2648</span>
                            </h2>

                            <div class="horoscope-stats">
                                <div class="h-stat-box">
                                    <div class="h-stat-label">${copy.mood}</div>
                                    <div class="h-stat-value" id="h-mood">Focused</div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">${copy.love}</div>
                                    <div class="h-stat-value h-stars" id="h-love"></div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">${copy.career}</div>
                                    <div class="h-stat-value h-stars" id="h-career"></div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">${copy.money}</div>
                                    <div class="h-stat-value h-stars" id="h-money"></div>
                                </div>
                            </div>

                            <p id="h-desc" class="horoscope-desc">
                                ${copy.placeholder}
                            </p>

                            <div class="horoscope-lucky-row">
                                <div><span>${copy.luckyNumber}</span> <strong id="h-number">9</strong></div>
                                <div><span>${copy.luckyColor}</span> <strong id="h-color">Red</strong> <span id="h-color-dot" class="h-color-dot"></span></div>
                            </div>

                            <div class="horoscope-actions">
                                <button class="horoscope-primary-btn" type="button">${copy.readFull}</button>
                                <button class="horoscope-secondary-btn" type="button">${copy.compatibility}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function afterRender() {
        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);
        }

        resizeHandler = debounce(() => {
            positionNodes();
            rotateToSelected(false);
        }, 120);
        window.addEventListener('resize', resizeHandler);

        positionNodes();

        const dateEl = document.getElementById('h-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString(getDateLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
        }

        selectZodiac(currentZodiacId);
    }

    function debounce(fn, wait) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), wait);
        };
    }

    function getZodiac(id) {
        return ZODIACS.find(z => z.id === id) || ZODIACS[0];
    }

    function getLanguage() {
        return typeof I18n !== 'undefined' && I18n.getLanguage ? I18n.getLanguage() : 'en';
    }

    function getCopy() {
        return COPY[getLanguage()] || COPY.en;
    }

    function getDateLocale() {
        return getLanguage() === 'hi' ? 'hi-IN' : 'en-US';
    }

    function updatePanelData(id) {
        const zodiac = getZodiac(id);
        const copy = getCopy();
        const data = generateHoroscopeData(id);
        const titleEl = document.getElementById('h-title');
        const emojiEl = document.getElementById('h-emoji');
        const sunEl = document.querySelector('.sun-center');
        const colorDot = document.getElementById('h-color-dot');

        if (titleEl) {
            titleEl.firstChild.nodeValue = `${copy.signs[zodiac.id]} `;
        }
        if (emojiEl) emojiEl.textContent = zodiac.icon;

        setText('h-mood', data.mood);
        setText('h-love', renderStars(data.love));
        setText('h-career', renderStars(data.career));
        setText('h-money', renderStars(data.money));
        setText('h-desc', data.desc);
        setText('h-number', data.number);
        setText('h-color', data.colorName);

        if (colorDot) colorDot.style.background = data.colorHex;
        if (sunEl) {
            sunEl.style.background = data.colorHex;
            sunEl.style.boxShadow = `0 0 60px ${data.glow}, inset 0 0 20px rgba(255,255,255,0.28)`;
        }

        return data;
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function renderStars(value) {
        return `${'\u2605'.repeat(value)}${'\u2606'.repeat(5 - value)}`;
    }

    function positionNodes() {
        const ring = document.getElementById('orbital-ring');
        if (!ring) return;

        const ringRect = ring.getBoundingClientRect();
        const radius = Math.max(96, (Math.min(ringRect.width, ringRect.height) / 2) - 30);
        const nodes = ring.querySelectorAll('.zodiac-node');

        nodes.forEach(node => {
            const angleDeg = parseFloat(node.getAttribute('data-angle'));
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            node.style.left = `calc(50% + ${x}px)`;
            node.style.top = `calc(50% + ${y}px)`;
        });
    }

    function generateHoroscopeData(zodiacId) {
        const today = new Date();
        const copy = getCopy();
        const daySeed = today.getDate() + today.getMonth() + today.getFullYear();
        const hash = (zodiacId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + daySeed) % 5;
        const palette = [
            { hex: '#FF6B4A', glow: 'rgba(255, 107, 74, 0.48)' },
            { hex: '#4169E1', glow: 'rgba(65, 105, 225, 0.48)' },
            { hex: '#FFD166', glow: 'rgba(255, 209, 102, 0.42)' },
            { hex: '#45B36B', glow: 'rgba(69, 179, 107, 0.46)' },
            { hex: '#8E5CF0', glow: 'rgba(142, 92, 240, 0.48)' }
        ];

        return {
            mood: copy.moods[hash],
            love: Math.max(3, ((hash + 2) % 5) + 1),
            career: Math.max(3, ((hash + 3) % 5) + 1),
            money: Math.max(2, ((hash + 1) % 5) + 1),
            desc: copy.descriptions[zodiacId] || copy.descriptions.aries,
            number: ((hash + 3) * 7) % 99 || 9,
            colorName: copy.colors[hash],
            colorHex: palette[hash].hex,
            glow: palette[hash].glow
        };
    }

    function selectZodiac(id, options = {}) {
        currentZodiacId = id;
        const ring = document.getElementById('orbital-ring');
        const sunIcon = document.getElementById('sun-icon');
        if (!ring) return;

        const zodiac = getZodiac(id);
        const nodes = ring.querySelectorAll('.zodiac-node');

        if (!options.keepRotating) {
            ring.classList.remove('rotating');
        }

        nodes.forEach(node => {
            const isActive = node.getAttribute('data-id') === id;
            node.classList.toggle('active', isActive);
            node.setAttribute('aria-pressed', String(isActive));
        });

        updatePanelData(id);
        if (sunIcon) sunIcon.textContent = zodiac.icon;
        rotateToSelected(!options.keepRotating);
    }

    function rotateToSelected(animate = true) {
        const ring = document.getElementById('orbital-ring');
        if (!ring) return;

        const selectedNode = ring.querySelector(`.zodiac-node[data-id="${currentZodiacId}"]`);
        if (!selectedNode) return;

        const targetAngle = parseFloat(selectedNode.getAttribute('data-angle'));
        const rotateDeg = -targetAngle;
        const nodes = ring.querySelectorAll('.zodiac-node');

        ring.style.transition = animate ? '' : 'none';
        ring.style.transform = `rotate(${rotateDeg}deg)`;

        nodes.forEach(node => {
            const scale = node.classList.contains('active') ? 1.24 : 1;
            node.style.transform = `rotate(${-rotateDeg}deg) scale(${scale})`;
        });

        if (!animate) {
            requestAnimationFrame(() => {
                ring.style.transition = '';
            });
        }
    }

    return {
        render,
        afterRender,
        selectZodiac
    };
})();

window.RashiphalPage = RashiphalPage;
