/* ============================================
   Annual Varshphal Page (Tajika System)
   ============================================ */

const VarshphalPage = (() => {

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Annual Varshphal' }
                ])}

                ${Components.sectionHeader(
                    'Tajika Varshphal',
                    'Generate your precise Annual Horoscope for any target year based on your exact Solar Return.',
                    { h1: true }
                )}

                <div class="card card-glass" style="padding: var(--space-6); max-width: 800px; margin: 0 auto var(--space-8) auto;">
                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label" for="v-name">Name</label>
                            <input type="text" id="v-name" class="form-control" placeholder="Enter name">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="v-target-year">Target Year (e.g. 2024)</label>
                            <input type="number" id="v-target-year" class="form-control" placeholder="2024" min="1900" max="2100">
                        </div>
                    </div>
                    
                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label" for="v-date">Date of Birth</label>
                            <input type="date" id="v-date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="v-time">Time of Birth</label>
                            <input type="time" id="v-time" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="v-city">City of Birth</label>
                        <input type="text" id="v-city" class="form-control search-input" placeholder="Search city..." autocomplete="off">
                        <ul id="v-city-results" class="search-results"></ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: var(--space-6);">
                        <button class="btn btn-primary" onclick="VarshphalPage.generateVarshphal()">Generate Annual Report</button>
                    </div>
                </div>

                <!-- Result Section -->
                <div id="varshphalResult" style="display: none;">
                    <div class="card card-glass" style="padding: var(--space-6);">
                        
                        <div style="text-align: right; margin-bottom: var(--space-4);">
                            <button class="btn btn-outline" onclick="window.print()">🖨️ Print / Save as PDF</button>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: var(--space-6);">
                            <h2 style="color: var(--color-secondary); margin-bottom: var(--space-2);" id="v-res-title"></h2>
                            <p style="color: var(--text-muted);" id="v-res-subtitle"></p>
                        </div>

                        <!-- Key Highlights -->
                        <div class="grid-3 print-avoid-break" style="margin-bottom: var(--space-8);">
                            <div style="background: rgba(255,255,255,0.05); padding: var(--space-4); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--surface-border);">
                                <div style="color: var(--text-muted); font-size: var(--text-sm); margin-bottom: 4px;">Muntha Rashi</div>
                                <div id="v-res-muntha" style="font-size: var(--text-xl); font-weight: bold; color: var(--color-primary);"></div>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: var(--space-4); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--surface-border);">
                                <div style="color: var(--text-muted); font-size: var(--text-sm); margin-bottom: 4px;">Muntha Lord</div>
                                <div id="v-res-muntha-lord" style="font-size: var(--text-xl); font-weight: bold; color: var(--color-primary);"></div>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: var(--space-4); border-radius: var(--radius-md); text-align: center; border: 1px solid var(--color-secondary);">
                                <div style="color: var(--text-muted); font-size: var(--text-sm); margin-bottom: 4px; text-transform: uppercase;">Year Lord (Varsheshvara)</div>
                                <div id="v-res-year-lord" style="font-size: var(--text-xl); font-weight: bold; color: var(--color-secondary);"></div>
                            </div>
                        </div>

                        <div class="grid-2 print-flex-wrap" style="gap: var(--space-8);">
                            <!-- Natal Chart -->
                            <div class="print-avoid-break">
                                <h3 style="text-align: center; margin-bottom: var(--space-4);">Natal Lagna Chart</h3>
                                <div id="v-natal-chart" style="max-width: 350px; margin: 0 auto;"></div>
                            </div>
                            <!-- Varshapravesh Chart -->
                            <div class="print-avoid-break">
                                <h3 style="text-align: center; margin-bottom: var(--space-4);">Solar Return Chart (Varsha Lagna)</h3>
                                <div id="v-return-chart" style="max-width: 350px; margin: 0 auto;"></div>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--space-8); padding: var(--space-6); background: rgba(0,0,0,0.2); border-radius: var(--radius-lg); border-left: 4px solid var(--color-secondary);">
                            <h3 style="color: var(--color-secondary); margin-bottom: var(--space-2);">Astrological Summary</h3>
                            <p style="color: var(--text-primary); line-height: 1.6;">
                                The <strong>Solar Return (Varshapravesh)</strong> occurred on <span id="v-res-date" style="font-weight: bold; color: var(--color-primary);"></span>. 
                                During this year (Age <span id="v-res-age"></span>), your <strong>Muntha</strong> is activated in the <span id="v-res-muntha-sign"></span> sign.
                                The Year Lord (Varsheshvara) guiding this entire period is <strong><span id="v-res-year-lord-txt"></span></strong>. 
                                Ensure you strengthen <span id="v-res-year-lord-txt2"></span> through appropriate mantras and rituals during this year.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        SearchEngine.initCitySearch('v-city', 'v-city-results');
        document.getElementById('v-target-year').value = new Date().getFullYear();
    }

    function drawChartSVG(houses, lagnaSign, title) {
        // Reusing the drawing logic from Kundali
        const p = (h) => (houses[h] && houses[h].length > 0) ? houses[h].join(' ') : '';
        const rashiNum = (h) => ((lagnaSign - 1 + h - 1) % 12) + 1;
        
        return `
            <svg viewBox="0 0 400 400" width="100%" height="100%" style="background: var(--bg-tertiary); border: 2px solid var(--color-secondary); border-radius: var(--radius-sm);">
                <rect x="0" y="0" width="400" height="400" fill="none" stroke="var(--color-secondary)" stroke-width="4"/>
                <line x1="0" y1="0" x2="400" y2="400" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="0" y1="400" x2="400" y2="0" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="200" y1="0" x2="400" y2="200" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="400" y1="200" x2="200" y2="400" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="200" y1="400" x2="0" y2="200" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="0" y1="200" x2="200" y2="0" stroke="var(--color-secondary)" stroke-width="2"/>
                
                <text x="200" y="100" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(1)}</text>
                <text x="100" y="50" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(2)}</text>
                <text x="50" y="100" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(3)}</text>
                <text x="100" y="200" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(4)}</text>
                <text x="50" y="300" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(5)}</text>
                <text x="100" y="350" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(6)}</text>
                <text x="200" y="300" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(7)}</text>
                <text x="300" y="350" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(8)}</text>
                <text x="350" y="300" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(9)}</text>
                <text x="300" y="200" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(10)}</text>
                <text x="350" y="100" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(11)}</text>
                <text x="300" y="50" fill="var(--text-primary)" font-size="16" text-anchor="middle" font-weight="bold">${p(12)}</text>
                
                <!-- Rashi Numbers -->
                <text x="200" y="20" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(1)}</text>
                <text x="100" y="15" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(2)}</text>
                <text x="15" y="100" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(3)}</text>
                <text x="50" y="200" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(4)}</text>
                <text x="15" y="300" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(5)}</text>
                <text x="100" y="385" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(6)}</text>
                <text x="200" y="385" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(7)}</text>
                <text x="300" y="385" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(8)}</text>
                <text x="385" y="300" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(9)}</text>
                <text x="350" y="200" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(10)}</text>
                <text x="385" y="100" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(11)}</text>
                <text x="300" y="15" fill="var(--color-secondary)" font-size="12" text-anchor="middle">${rashiNum(12)}</text>
            </svg>
        `;
    }

    const RASHIS = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    function generateVarshphal() {
        if (typeof VarshphalCalc === 'undefined') return;

        const name = document.getElementById('v-name').value || 'User';
        const date = document.getElementById('v-date').value;
        const time = document.getElementById('v-time').value;
        const targetYear = document.getElementById('v-target-year').value;
        const cityName = document.getElementById('v-city').value;
        const cityInput = document.getElementById('v-city');

        if (!date || !time || !cityName || !targetYear) {
            Components.showToast('Please fill all fields', 'error');
            return;
        }

        const cityObj = cityInput.dataset.lat ? {
            name: cityName, lat: parseFloat(cityInput.dataset.lat), lng: parseFloat(cityInput.dataset.lng), tz: parseFloat(cityInput.dataset.tz)
        } : CityDatabase.find(c => c.name === cityName);

        if (!cityObj) {
            Components.showToast('Please select a valid city', 'error');
            return;
        }

        try {
            const result = VarshphalCalc.generateVarshphal(date, time, cityObj, targetYear);
            
            document.getElementById('varshphalResult').style.display = 'block';
            document.getElementById('v-res-title').textContent = `${name}'s Varshphal (${targetYear})`;
            
            const rDate = result.returnDate;
            const rDateStr = `${rDate.toDateString()} at ${rDate.toLocaleTimeString()}`;
            document.getElementById('v-res-subtitle').textContent = `Solar Return: ${rDateStr} | ${cityName}`;
            
            const munthaSignName = RASHIS[result.munthaRashi - 1];
            
            document.getElementById('v-res-muntha').textContent = munthaSignName;
            document.getElementById('v-res-muntha-lord').textContent = result.munthaLord;
            document.getElementById('v-res-year-lord').textContent = result.yearLord;
            
            document.getElementById('v-natal-chart').innerHTML = drawChartSVG(result.natalChart.houses, result.natalChart.lagnaRashi);
            document.getElementById('v-return-chart').innerHTML = drawChartSVG(result.varshaChart.houses, result.varshaChart.lagnaRashi);
            
            document.getElementById('v-res-date').textContent = rDateStr;
            document.getElementById('v-res-age').textContent = result.age;
            document.getElementById('v-res-muntha-sign').textContent = munthaSignName;
            document.getElementById('v-res-year-lord-txt').textContent = result.yearLord;
            document.getElementById('v-res-year-lord-txt2').textContent = result.yearLord;
            
            setTimeout(() => {
                document.getElementById('varshphalResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (e) {
            console.error(e);
            Components.showToast('Error generating Varshphal. Check inputs.', 'error');
        }
    }

    return {
        render,
        afterRender,
        generateVarshphal
    };
})();
