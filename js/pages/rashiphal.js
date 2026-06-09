/* ============================================
   Rashiphal (Daily Horoscope) Page
   ============================================ */

const RashiphalPage = (() => {
    
    const ZODIACS = [
        { id: 'aries', name: 'Aries', icon: '♈', angle: 0 },
        { id: 'taurus', name: 'Taurus', icon: '♉', angle: 30 },
        { id: 'gemini', name: 'Gemini', icon: '♊', angle: 60 },
        { id: 'cancer', name: 'Cancer', icon: '♋', angle: 90 },
        { id: 'leo', name: 'Leo', icon: '♌', angle: 120 },
        { id: 'virgo', name: 'Virgo', icon: '♍', angle: 150 },
        { id: 'libra', name: 'Libra', icon: '♎', angle: 180 },
        { id: 'scorpio', name: 'Scorpio', icon: '♏', angle: 210 },
        { id: 'sagittarius', name: 'Sagittarius', icon: '♐', angle: 240 },
        { id: 'capricorn', name: 'Capricorn', icon: '♑', angle: 270 },
        { id: 'aquarius', name: 'Aquarius', icon: '♒', angle: 300 },
        { id: 'pisces', name: 'Pisces', icon: '♓', angle: 330 }
    ];

    let currentZodiacId = null;

    function render() {
        return `
            <div class="page-enter" style="background: radial-gradient(circle at 30% 60%, #3d582f 0%, #4a2825 50%, #111 100%); color: #fff; min-height: calc(100vh - 80px); margin: -var(--space-6); padding: var(--space-6); border-radius: var(--radius-lg); position: relative; overflow: hidden;">
                <!-- Decorative stars -->
                <div style="position: absolute; top: 10%; left: 10%; width: 2px; height: 2px; background: white; border-radius: 50%; opacity: 0.8; box-shadow: 0 0 10px white;"></div>
                <div style="position: absolute; top: 30%; right: 20%; width: 2px; height: 2px; background: white; border-radius: 50%; opacity: 0.6;"></div>
                <div style="position: absolute; bottom: 20%; left: 30%; width: 2px; height: 2px; background: white; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 5px white;"></div>
                <div style="position: absolute; top: 60%; right: 5%; width: 2px; height: 2px; background: white; border-radius: 50%; opacity: 0.5;"></div>

                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.rashiphal', 'Daily Horoscope') : 'Daily Horoscope' }
                ])}

                <div style="text-align: center; margin-bottom: var(--space-8); position: relative; z-index: 2;">
                    <h1 style="font-size: 3rem; margin-bottom: var(--space-2); color: #fff;">Pick your sign. Read your day.</h1>
                    <p style="color: rgba(255,255,255,0.7); font-size: 1.1rem;">Twelve signs, one rotation. Click yours to lock the wheel.</p>
                </div>

                <div class="grid-2" style="align-items: center; gap: var(--space-8);">
                    
                    <!-- Left: Interactive Wheel -->
                    <div style="position: relative; width: 100%; height: 500px; display: flex; justify-content: center; align-items: center; overflow: visible;">
                        <div class="zodiac-wheel-container">
                            <div class="sun-center">
                                <div class="sun-center-icon" id="sun-icon">☀️</div>
                            </div>
                            <div class="orbital-ring rotating" id="orbital-ring">
                                ${ZODIACS.map(z => `
                                    <div class="zodiac-node" data-id="${z.id}" data-angle="${z.angle}" onclick="RashiphalPage.selectZodiac('${z.id}')">
                                        <div class="zodiac-icon">${z.icon}</div>
                                        <div class="zodiac-label">${z.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Horoscope Details -->
                    <div id="horoscope-details-container" style="opacity: 1; transform: translateX(0); transition: all 0.5s ease;">
                        <div class="horoscope-panel">
                            <div style="text-transform: uppercase; letter-spacing: 2px; color: #ff6b6b; font-size: 0.8rem; margin-bottom: var(--space-2);">
                                DAILY HOROSCOPE • <span id="h-date"></span>
                            </div>
                            <h2 id="h-title" style="font-size: 3.5rem; margin-bottom: var(--space-4); display: flex; align-items: center; gap: 15px; color: #fff;">
                                Sign Name <span id="h-emoji"></span>
                            </h2>
                            
                            <div class="horoscope-stats">
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Mood</div>
                                    <div class="h-stat-value" id="h-mood">Happy</div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Love</div>
                                    <div class="h-stat-value h-stars">★★★★☆</div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Career</div>
                                    <div class="h-stat-value h-stars">★★★★★</div>
                                </div>
                                <div class="h-stat-box">
                                    <div class="h-stat-label">Money</div>
                                    <div class="h-stat-value h-stars">★★★☆☆</div>
                                </div>
                            </div>

                            <p id="h-desc" style="font-size: 1.1rem; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: var(--space-6);">
                                Select a sign to reveal your daily astrological insights.
                            </p>

                            <div style="display: flex; gap: var(--space-4); align-items: center; font-size: 0.9rem; margin-bottom: var(--space-6);">
                                <div><span style="color: rgba(255,255,255,0.6)">Lucky number:</span> <strong id="h-number" style="color: #fff">9</strong></div>
                                <div><span style="color: rgba(255,255,255,0.6)">Lucky color:</span> <strong id="h-color" style="color: #fff">Red</strong> <span id="h-color-dot" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: red; vertical-align: middle; margin-left: 4px;"></span></div>
                            </div>

                            <div style="display: flex; gap: var(--space-4); align-items: center;">
                                <button style="background: #FFD700; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 30px; border: none; cursor: pointer; font-size: 0.95rem; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Read full forecast</button>
                                <button style="background: transparent; color: #fff; font-weight: 500; padding: 12px 24px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; font-size: 0.95rem; transition: background 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">Compatibility &rarr;</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    function afterRender() {
        positionNodes();
        
        // Set today's date
        const dateEl = document.getElementById('h-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        
        // Show default horoscope (Aries) without locking the wheel
        updatePanelData('aries', 'Aries', '♈');
    }

    function updatePanelData(id, name, icon) {
        const data = generateHoroscopeData(id);
        document.getElementById('h-title').innerHTML = `${name} <span style="font-size: 2.5rem;">${icon}</span>`;
        document.getElementById('h-mood').textContent = data.mood;
        document.getElementById('h-desc').textContent = data.desc;
        document.getElementById('h-number').textContent = data.number;
        document.getElementById('h-color').textContent = data.colorName;
        document.getElementById('h-color-dot').style.background = data.colorHex;
    }

    function positionNodes() {
        const ring = document.getElementById('orbital-ring');
        if (!ring) return;

        // Radius of the circle (half of the container width approx)
        const radius = 200; // Fixed radius for a 500px container to leave margin
        const nodes = ring.querySelectorAll('.zodiac-node');
        
        nodes.forEach(node => {
            const angleDeg = parseFloat(node.getAttribute('data-angle'));
            const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 so 0 starts at top
            
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            // Position it from the center (50% 50%)
            node.style.left = `calc(50% + ${x}px)`;
            node.style.top = `calc(50% + ${y}px)`;
            
            // Counter-rotate the inner icon/label so it stays upright
            // Initially 0 since ring is not rotated
            node.style.transform = `rotate(0deg)`;
        });
    }

    // Dummy deterministic data generation based on date and sign
    function generateHoroscopeData(zodiacId) {
        const hash = (zodiacId.charCodeAt(0) + new Date().getDate()) % 5;
        const moods = ['Energetic 🔥', 'Calm 🌊', 'Creative ✨', 'Bored 😑', 'Focused 🎯'];
        const colors = ['#FF4500', '#4169E1', '#FFD700', '#32CD32', '#8A2BE2'];
        const colorNames = ['Ruby Red', 'Royal Blue', 'Golden Yellow', 'Emerald Green', 'Mystic Purple'];
        
        const descriptions = {
            aries: "Your fiery energy is at its peak today. Channel it into a creative project or take the lead on a tough assignment.",
            taurus: "Patience is your greatest virtue today. Take things slow, enjoy a good meal, and let the universe bring things to you.",
            gemini: "Sparkling conversations could bring back romance or an exciting new friendship to you today. Keep your mind open.",
            cancer: "Your intuition is practically a superpower right now. Trust your gut feelings regarding a family matter.",
            leo: "The spotlight is naturally drawn to you. It's a great day to present an idea or simply enjoy the attention.",
            virgo: "Focus on the details. Organizing your space or your thoughts will lead to a surprising breakthrough this afternoon.",
            libra: "Balance is key. You might need to mediate a dispute between friends or find harmony in your own conflicting desires.",
            scorpio: "Your intensity is magnetic today. Dive deep into research or a passion project; surface-level interactions won't satisfy you.",
            sagittarius: "Adventure is calling! Even if you can't travel, explore a new philosophy, book, or cuisine today.",
            capricorn: "Hard work is paying off. You might receive recognition or hit a milestone in your long-term goals.",
            aquarius: "Your innovative ideas are flowing. Don't be afraid to share an unconventional solution to a stubborn problem.",
            pisces: "Your dreams are vivid and meaningful. Pay attention to your subconscious, as it's trying to guide your waking decisions."
        };

        return {
            mood: moods[hash],
            desc: descriptions[zodiacId] || descriptions['aries'],
            number: (hash * 3 + 7) % 100,
            colorName: colorNames[hash],
            colorHex: colors[hash]
        };
    }

    function selectZodiac(id) {
        const ring = document.getElementById('orbital-ring');
        const nodes = ring.querySelectorAll('.zodiac-node');
        const sunIcon = document.getElementById('sun-icon');
        const detailsContainer = document.getElementById('horoscope-details-container');
        
        // Stop the ambient rotation
        ring.classList.remove('rotating');
        
        let targetAngle = 0;
        let selectedName = '';
        let selectedIcon = '';

        nodes.forEach(node => {
            node.classList.remove('active');
            if (node.getAttribute('data-id') === id) {
                node.classList.add('active');
                targetAngle = parseFloat(node.getAttribute('data-angle'));
                selectedName = node.querySelector('.zodiac-label').textContent;
                selectedIcon = node.querySelector('.zodiac-icon').textContent;
            }
        });

        // We want the selected node to be at the TOP (which is intuitively where we focus).
        // Since the node was placed at `targetAngle` (where 0 is top), we need to rotate the ring by `-targetAngle`.
        // However, to make it spin naturally and consistently, we calculate the shortest rotation path or just set it.
        const rotateDeg = -targetAngle;
        
        // Rotate the ring
        ring.style.transform = `rotate(${rotateDeg}deg)`;
        
        // Counter-rotate all nodes so they stay completely upright
        nodes.forEach(node => {
            node.style.transform = `rotate(${-rotateDeg}deg) scale(${node.classList.contains('active') ? '1.3' : '1'})`;
        });

        // Update center sun icon
        sunIcon.textContent = selectedIcon;
        // Match center sun background color loosely to the sign hash or use Astrotalk's green
        document.querySelector('.sun-center').style.background = data.colorHex;

        // Fetch data and update panel
        updatePanelData(id, selectedName, selectedIcon);

        // Show panel
        detailsContainer.style.opacity = '1';
        detailsContainer.style.transform = 'translateX(0)';
    }

    return {
        render,
        afterRender,
        selectZodiac
    };
})();

// Attach to global window
window.RashiphalPage = RashiphalPage;
