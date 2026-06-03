/* ============================================
   Kundali Matching Page (Guna Milan)
   ============================================ */

const MatchingPage = (() => {

    function render() {
        const cityOptions = typeof CityDatabase !== 'undefined' ? 
            CityDatabase.map(c => `<option value="${c.name}"></option>`).join('') : '';

        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Kundali Matching' }
                ])}

                ${Components.sectionHeader(
                    'Ashtakoot Kundali Matching',
                    'Discover marriage compatibility using the advanced 36-point Guna Milan system.',
                    { h1: true }
                )}

                <div class="grid-2">
                    <!-- Boy's Details -->
                    <div class="card card-glass" style="padding: var(--space-6);">
                        <h3 style="color: var(--color-primary); margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">Boy's Details</h3>
                        <div class="form-group">
                            <label class="form-label" for="boy-name">Name</label>
                            <input type="text" id="boy-name" class="form-control" placeholder="Enter name">
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label class="form-label" for="boy-date">Date of Birth</label>
                                <input type="date" id="boy-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="boy-time">Time of Birth</label>
                                <input type="time" id="boy-time" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="boy-city">City of Birth</label>
                            <input type="text" id="boy-city" class="form-control" placeholder="Search global cities..." autocomplete="off">
                            <ul id="boy-city-results"></ul>
                        </div>
                    </div>

                    <!-- Girl's Details -->
                    <div class="card card-glass" style="padding: var(--space-6);">
                        <h3 style="color: var(--color-secondary); margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">Girl's Details</h3>
                        <div class="form-group">
                            <label class="form-label" for="girl-name">Name</label>
                            <input type="text" id="girl-name" class="form-control" placeholder="Enter name">
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label class="form-label" for="girl-date">Date of Birth</label>
                                <input type="date" id="girl-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="girl-time">Time of Birth</label>
                                <input type="time" id="girl-time" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="girl-city">City of Birth</label>
                            <input type="text" id="girl-city" class="form-control" placeholder="Search global cities..." autocomplete="off">
                            <ul id="girl-city-results"></ul>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin: var(--space-8) 0;">
                    <button class="btn btn-primary" style="padding: var(--space-4) var(--space-8); font-size: 1.1rem; border-radius: var(--radius-full);" onclick="MatchingPage.generateMatch()">
                        ✨ Calculate Compatibility Match
                    </button>
                </div>

                <!-- Match Result Section -->
                <div id="matchResult" style="display: none; margin-top: var(--space-8);">
                    <div class="card card-glass" style="padding: var(--space-6);">
                        
                        <!-- Print Actions -->
                        <div style="text-align: right; margin-bottom: var(--space-4);">
                            <button class="btn btn-outline" onclick="window.print()">🖨️ Print / Save as PDF</button>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: var(--space-8);">
                            <h2 style="color: var(--color-secondary); margin-bottom: var(--space-2);">Compatibility Report</h2>
                            <p id="match-names" style="font-size: var(--text-lg); color: var(--text-primary);"></p>
                        </div>

                        <!-- Score Display -->
                        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: var(--space-8); flex-direction: column;">
                            <div style="position: relative; width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(var(--color-primary) var(--match-pct, 0%), rgba(255,255,255,0.05) 0); display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                <div style="width: 170px; height: 170px; border-radius: 50%; background: var(--bg-card); display: flex; flex-direction: column; justify-content: center; align-items: center;">
                                    <div style="font-size: 3rem; font-weight: bold; color: var(--text-primary);" id="match-score">0</div>
                                    <div style="color: var(--text-muted); font-size: var(--text-sm);">Out of 36</div>
                                </div>
                            </div>
                            <div id="match-verdict" style="margin-top: var(--space-4); font-size: var(--text-xl); font-weight: bold;"></div>
                        </div>

                        <!-- 8 Koota Breakdown -->
                        <h3 style="border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2); margin-bottom: var(--space-4);">Ashtakoot Breakdown (8 Kootas)</h3>
                        <div class="grid-2" id="koota-breakdown">
                            <!-- Injected dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        if (typeof CityAPI !== 'undefined') {
            CityAPI.initCityAutocomplete('boy-city', 'boy-city-results');
            CityAPI.initCityAutocomplete('girl-city', 'girl-city-results');
        }
        
        if (typeof AstroCalc === 'undefined' || typeof MatchCalc === 'undefined') {
            Components.showToast('Calculation engines failed to load. Please check internet connection.', 'error');
        }
    }

    function generateMatch() {
        if (typeof AstroCalc === 'undefined') return;

        const bName = document.getElementById('boy-name').value || 'Boy';
        const bDate = document.getElementById('boy-date').value;
        const bTime = document.getElementById('boy-time').value;
        const bCityName = document.getElementById('boy-city').value;
        const bCityInput = document.getElementById('boy-city');

        const gName = document.getElementById('girl-name').value || 'Girl';
        const gDate = document.getElementById('girl-date').value;
        const gTime = document.getElementById('girl-time').value;
        const gCityName = document.getElementById('girl-city').value;
        const gCityInput = document.getElementById('girl-city');

        if (!bDate || !bTime || !bCityName || !gDate || !gTime || !gCityName) {
            Components.showToast('Please fill all birth details for both individuals', 'error');
            return;
        }

        let bCityObj;
        if (bCityInput.dataset.lat) {
            bCityObj = {
                name: bCityName,
                lat: parseFloat(bCityInput.dataset.lat),
                lng: parseFloat(bCityInput.dataset.lng),
                tz: typeof CityAPI !== 'undefined' ? CityAPI.getTzOffset(bCityInput.dataset.tzStr, `${bDate}T${bTime}:00`) : 5.5
            };
        } else {
            bCityObj = CityDatabase.find(c => c.name.toLowerCase() === bCityName.toLowerCase());
        }

        let gCityObj;
        if (gCityInput.dataset.lat) {
            gCityObj = {
                name: gCityName,
                lat: parseFloat(gCityInput.dataset.lat),
                lng: parseFloat(gCityInput.dataset.lng),
                tz: typeof CityAPI !== 'undefined' ? CityAPI.getTzOffset(gCityInput.dataset.tzStr, `${gDate}T${gTime}:00`) : 5.5
            };
        } else {
            gCityObj = CityDatabase.find(c => c.name.toLowerCase() === gCityName.toLowerCase());
        }

        if (!bCityObj || !gCityObj) {
            Components.showToast('Please select valid cities from the dropdown list', 'error');
            return;
        }

        try {
            // Generate full chart for Boy
            const bChart = AstroCalc.generateKundali(bDate, bTime, bCityObj);
            // Generate full chart for Girl
            const gChart = AstroCalc.generateKundali(gDate, gTime, gCityObj);

            // Extract Moon details (Rashi and Nakshatra)
            const bMoon = bChart.planets.find(p => p.id === 'Moon');
            const gMoon = gChart.planets.find(p => p.id === 'Moon');

            if (!bMoon || !gMoon) throw new Error("Could not calculate Moon positions");

            const boy = {
                rashi: bMoon.rashi,
                nakshatra: bMoon.nakshatraIndex
            };

            const girl = {
                rashi: gMoon.rashi,
                nakshatra: gMoon.nakshatraIndex
            };

            // Calculate Guna Milan
            const result = MatchCalc.calculateGunaMilan(boy, girl);
            
            displayResult(bName, gName, result);

        } catch (e) {
            console.error(e);
            Components.showToast('Error calculating match. Please check inputs.', 'error');
        }
    }

    function displayResult(bName, gName, result) {
        document.getElementById('matchResult').style.display = 'block';
        document.getElementById('match-names').textContent = `${bName} & ${gName}`;

        const score = result.total;
        document.getElementById('match-score').textContent = score;
        
        const pct = (score / 36) * 100;
        document.getElementById('match-score').parentElement.parentElement.style.setProperty('--match-pct', `${pct}%`);

        const verdictEl = document.getElementById('match-verdict');
        if (score >= 26) {
            verdictEl.textContent = 'Excellent Match';
            verdictEl.style.color = 'var(--success-color, #2ecc71)';
        } else if (score >= 18) {
            verdictEl.textContent = 'Average / Good Match';
            verdictEl.style.color = 'var(--warning-color, #f1c40f)';
        } else {
            verdictEl.textContent = 'Not Recommended';
            verdictEl.style.color = 'var(--error-color, #e74c3c)';
        }

        // Breakdown
        const breakdownContainer = document.getElementById('koota-breakdown');
        const kootas = ['varna', 'vashya', 'tara', 'yoni', 'graha', 'gana', 'bhakoot', 'nadi'];
        
        let html = '';
        kootas.forEach(k => {
            const data = result[k];
            const isGood = data.scored >= (data.max / 2);
            const color = data.scored === 0 ? 'var(--error-color, #e74c3c)' : (data.scored === data.max ? 'var(--success-color, #2ecc71)' : 'var(--color-primary)');
            
            html += `
                <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); padding: var(--space-4); display: flex; justify-content: space-between; align-items: center; border-left: 3px solid ${color}; margin-bottom: var(--space-2);">
                    <div>
                        <div style="font-weight: bold; color: var(--text-primary); margin-bottom: 2px;">${data.name}</div>
                        <div style="font-size: var(--text-xs); color: var(--text-muted);">${data.desc}</div>
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: ${color};">
                        ${data.scored} <span style="font-size: var(--text-sm); color: var(--text-muted); font-weight: normal;">/ ${data.max}</span>
                    </div>
                </div>
            `;
        });
        
        breakdownContainer.innerHTML = html;

        setTimeout(() => {
            document.getElementById('matchResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    return {
        render,
        afterRender,
        generateMatch
    };
})();
