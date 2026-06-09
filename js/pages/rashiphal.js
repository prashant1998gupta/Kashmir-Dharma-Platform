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

    let currentZodiacId = 'aries';
    let resizeHandler = null;

    function render() {
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
                    <h1>Pick your sign. Read your day.</h1>
                    <p>Twelve signs, one rotation. Click yours to lock the wheel.</p>
                </header>

                <div class="rashiphal-layout">
                    <div class="rashiphal-wheel-wrap">
                        <div class="zodiac-wheel-container">
                            <div class="sun-center">
                                <div class="sun-center-icon" id="sun-icon" aria-hidden="true">\u2600\uFE0F</div>
                            </div>
                            <div class="orbital-ring rotating" id="orbital-ring">
                                ${ZODIACS.map(z => `
                                    <button class="zodiac-node" type="button" data-id="${z.id}" data-angle="${z.angle}" onclick="RashiphalPage.selectZodiac('${z.id}')" aria-label="Select ${z.name}" aria-pressed="false">
                                        <span class="zodiac-icon" aria-hidden="true">${z.icon}</span>
                                        <span class="zodiac-label">${z.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div id="horoscope-details-container" class="horoscope-details-container">
                        <div class="horoscope-panel">
                            <div class="horoscope-kicker">
                                Daily Horoscope <span aria-hidden="true">&bull;</span> <span id="h-date"></span>
                            </div>
                            <h2 id="h-title" class="horoscope-title">
                                Aries <span id="h-emoji" aria-hidden="true">\u2648</span>
                            </h2>

                            <div class="horoscope-stats">
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Mood</div>
                                    <div class="h-stat-value" id="h-mood">Focused</div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Love</div>
                                    <div class="h-stat-value h-stars" id="h-love"></div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Career</div>
                                    <div class="h-stat-value h-stars" id="h-career"></div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Money</div>
                                    <div class="h-stat-value h-stars" id="h-money"></div>
                                </div>
                            </div>

                            <p id="h-desc" class="horoscope-desc">
                                Select a sign to reveal your daily astrological insights.
                            </p>

                            <div class="horoscope-lucky-row">
                                <div><span>Lucky number:</span> <strong id="h-number">9</strong></div>
                                <div><span>Lucky color:</span> <strong id="h-color">Red</strong> <span id="h-color-dot" class="h-color-dot"></span></div>
                            </div>

                            <div class="horoscope-actions">
                                <button class="horoscope-primary-btn" type="button">Read full forecast</button>
                                <button class="horoscope-secondary-btn" type="button">Compatibility &rarr;</button>
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
            dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

    function updatePanelData(id) {
        const zodiac = getZodiac(id);
        const data = generateHoroscopeData(id);
        const titleEl = document.getElementById('h-title');
        const emojiEl = document.getElementById('h-emoji');
        const sunEl = document.querySelector('.sun-center');
        const colorDot = document.getElementById('h-color-dot');

        if (titleEl) {
            titleEl.firstChild.nodeValue = `${zodiac.name} `;
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
        const daySeed = today.getDate() + today.getMonth() + today.getFullYear();
        const hash = (zodiacId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + daySeed) % 5;
        const moods = ['Energetic', 'Calm', 'Creative', 'Reflective', 'Focused'];
        const palette = [
            { hex: '#FF6B4A', glow: 'rgba(255, 107, 74, 0.48)', name: 'Ruby Red' },
            { hex: '#4169E1', glow: 'rgba(65, 105, 225, 0.48)', name: 'Royal Blue' },
            { hex: '#FFD166', glow: 'rgba(255, 209, 102, 0.42)', name: 'Golden Yellow' },
            { hex: '#45B36B', glow: 'rgba(69, 179, 107, 0.46)', name: 'Emerald Green' },
            { hex: '#8E5CF0', glow: 'rgba(142, 92, 240, 0.48)', name: 'Mystic Purple' }
        ];

        const descriptions = {
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
        };

        return {
            mood: moods[hash],
            love: Math.max(3, ((hash + 2) % 5) + 1),
            career: Math.max(3, ((hash + 3) % 5) + 1),
            money: Math.max(2, ((hash + 1) % 5) + 1),
            desc: descriptions[zodiacId] || descriptions.aries,
            number: ((hash + 3) * 7) % 99 || 9,
            colorName: palette[hash].name,
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
