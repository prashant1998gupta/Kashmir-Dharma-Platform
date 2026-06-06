/* ============================================
   Kundali Generator Page
   ============================================ */

const KundaliPage = (() => {
    
    function render() {
        const homeText = typeof I18n !== 'undefined' ? I18n.t('nav.home') : 'Home';
        const titleText = typeof I18n !== 'undefined' ? I18n.t('kundali.title') : 'Kundali Generator';
        const descText = typeof I18n !== 'undefined' ? I18n.t('kundali.desc') : 'Generate your Vedic Birth Chart locally and privately. No data is sent to any server.';
        const enterDetailsText = typeof I18n !== 'undefined' ? I18n.t('kundali.enter_details') : 'Enter Birth Details';
        const nameText = typeof I18n !== 'undefined' ? I18n.t('kundali.name') : 'Name';
        const dobText = typeof I18n !== 'undefined' ? I18n.t('kundali.dob') : 'Date of Birth';
        const tobText = typeof I18n !== 'undefined' ? I18n.t('kundali.tob') : 'Time of Birth';
        const cityText = typeof I18n !== 'undefined' ? I18n.t('kundali.city') : 'City of Birth (Searchable)';
        const cityPlaceholder = typeof I18n !== 'undefined' ? I18n.t('kundali.city_placeholder') : 'Type to search global cities...';
        const generateText = typeof I18n !== 'undefined' ? I18n.t('kundali.generate') : 'Generate Kundali ✨';
        const printText = typeof I18n !== 'undefined' ? I18n.t('kundali.print') : '🖨️ Print / Save as PDF';
        const lagnaText = typeof I18n !== 'undefined' ? I18n.t('kundali.lagna') : 'Lagna:';
        const rashiText = typeof I18n !== 'undefined' ? I18n.t('kundali.rashi') : 'Rashi:';
        const nakshatraText = typeof I18n !== 'undefined' ? I18n.t('kundali.nakshatra') : 'Nakshatra:';

        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: homeText, href: '#home' },
                    { label: titleText }
                ])}

                ${Components.sectionHeader(
                    titleText,
                    descText,
                    { h1: true }
                )}

                <div class="grid-2">
                    <!-- Form Section -->
                    <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
                        ${ProfileManager.renderProfileSelector('kundaliProfileSelect', 'KundaliPage.loadProfile')}
                        <h3 style="margin-bottom: var(--space-4)">${enterDetailsText}</h3>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label class="form-label" style="display: block; margin-bottom: var(--space-2)">${nameText}</label>
                            <input type="text" id="k-name" class="form-input" placeholder="E.g., Rahul Koul" style="width: 100%;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label class="form-label" style="display: block; margin-bottom: var(--space-2)">${dobText}</label>
                            <input type="date" id="k-date" class="form-input" style="width: 100%; color-scheme: dark;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label class="form-label" style="display: block; margin-bottom: var(--space-2)">${tobText}</label>
                            <input type="time" id="k-time" class="form-input" style="width: 100%; color-scheme: dark;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-6)">
                            <label class="form-label" style="display: block; margin-bottom: var(--space-2)">${cityText}</label>
                            <input type="text" id="k-city" class="form-control" placeholder="${cityPlaceholder}" autocomplete="off">
                            <ul id="k-city-results"></ul>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%; padding: var(--space-3); font-size: var(--text-lg)" onclick="KundaliPage.generateChart()">
                            ${generateText}
                        </button>
                    </div>

                    <!-- Result Section -->
                    <div id="kundaliResult" style="display: none; grid-column: 1 / -1;">
                        <div class="card card-glass" style="padding: var(--space-6);">
                            <div style="text-align: center; margin-bottom: var(--space-6)">
                                <h2 id="res-name" style="margin-bottom: var(--space-2); color: var(--color-secondary)"></h2>
                                <p id="res-details" style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-4)"></p>
                                <button class="btn btn-outline" style="margin-bottom: var(--space-4);" onclick="PDFGenerator.generatePDF('kundaliResult', 'Kundali_Report.pdf', 'Kundali Report')">
                                    ${printText}
                                </button>
                                
                                <div style="display: flex; justify-content: center; gap: var(--space-4); flex-wrap: wrap;">
                                    <div class="badge badge-primary">${lagnaText} <span id="res-lagna"></span></div>
                                    <div class="badge badge-secondary">${rashiText} <span id="res-rashi"></span></div>
                                    <div class="badge" style="background: var(--bg-tertiary)">${nakshatraText} <span id="res-nakshatra"></span></div>
                                </div>
                            </div>
                            
                            <!-- Premium Insights -->
                            <div id="simple-overview-container" style="background: rgba(212, 175, 55, 0.05); border: 1px solid var(--color-secondary); border-radius: var(--radius-md); padding: var(--space-6); margin-bottom: var(--space-8);">
                                <div style="display: flex; justify-content: center; margin-bottom: var(--space-4);">
                                    <h3 style="color: var(--color-secondary); border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 2px;">${typeof I18n !== 'undefined' ? I18n.t('kundali.premium_insights', 'Premium Astrological Insights') : 'Premium Astrological Insights'}</h3>
                                </div>
                                <div style="margin-bottom: var(--space-6);">
                                    <strong style="color: var(--color-primary); font-size: var(--text-lg); display: block; border-left: 3px solid var(--color-primary); padding-left: var(--space-2); margin-bottom: var(--space-3);">${typeof I18n !== 'undefined' ? I18n.t('kundali.your_ascendant', 'Your Ascendant (Rising Sign)') : 'Your Ascendant (Rising Sign)'}</strong>
                                    <div id="simple-lagna-text" style="color: var(--text-secondary); font-size: var(--text-base); line-height: 1.7;"></div>
                                </div>
                                <div>
                                    <strong style="color: var(--color-primary); font-size: var(--text-lg); display: block; border-left: 3px solid var(--color-primary); padding-left: var(--space-2); margin-bottom: var(--space-3);">${typeof I18n !== 'undefined' ? I18n.t('kundali.your_moon_sign', 'Your Moon Sign (Emotions)') : 'Your Moon Sign (Emotions)'}</strong>
                                    <div id="simple-moon-text" style="color: var(--text-secondary); font-size: var(--text-base); line-height: 1.7;"></div>
                                </div>
                            </div>
                            
                            <!-- Charts Container -->
                            <div class="grid-2" style="margin-bottom: var(--space-8); gap: var(--space-6)">
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('kundali.d1') : 'Lagna Chart (D1)'}</h3>
                                    <div id="chart-d1-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('kundali.d9') : 'Navamsa Chart (D9)'}</h3>
                                    <div id="chart-d9-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('kundali.d10') : 'Dasamsa Chart (D10)'}</h3>
                                    <div id="chart-d10-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('kundali.d7') : 'Saptamsa Chart (D7)'}</h3>
                                    <div id="chart-d7-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('kundali.chalit') : 'Bhava Chalit Chart'}</h3>
                                    <div id="chart-chalit-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                            </div>
                            
                            <!-- Birth Panchang -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.panchang') : 'Birth Panchang'}</h3>
                            <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); padding: var(--space-4); margin-bottom: var(--space-8); display: flex; flex-wrap: wrap; gap: var(--space-6); justify-content: space-between;">
                                <div><span style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">${typeof I18n !== 'undefined' ? I18n.t('kundali.vaar', 'Vaar (Day)') : 'Vaar (Day)'}</span><div id="panchang-vaar" style="font-weight: bold; color: var(--color-secondary);"></div></div>
                                <div><span style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">${typeof I18n !== 'undefined' ? I18n.t('kundali.tithi', 'Tithi') : 'Tithi'}</span><div id="panchang-tithi" style="font-weight: bold; color: var(--color-secondary);"></div></div>
                                <div><span style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">${typeof I18n !== 'undefined' ? I18n.t('kundali.yoga', 'Yoga') : 'Yoga'}</span><div id="panchang-yoga" style="font-weight: bold; color: var(--color-secondary);"></div></div>
                                <div><span style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">${typeof I18n !== 'undefined' ? I18n.t('kundali.karana', 'Karana') : 'Karana'}</span><div id="panchang-karana" style="font-weight: bold; color: var(--color-secondary);"></div></div>
                            </div>
                            
                            <!-- Doshas -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.doshas') : 'Astrological Doshas'}</h3>
                            <div id="dosha-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
                            </div>
                            
                            <!-- Planetary Details Table -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.planets') : 'Planetary Positions'}</h3>
                            <div style="overflow-x: auto; margin-bottom: var(--space-8);">
                                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                                    <thead>
                                        <tr style="border-bottom: 1px solid var(--color-secondary);">
                                            <th style="padding: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.tbl_planet', 'Planet') : 'Planet'}</th>
                                            <th style="padding: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.tbl_rashi', 'Sign (Rashi)') : 'Sign (Rashi)'}</th>
                                            <th style="padding: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.tbl_degree', 'Degree') : 'Degree'}</th>
                                            <th style="padding: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.tbl_nakshatra', 'Nakshatra') : 'Nakshatra'}</th>
                                            <th style="padding: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.tbl_dignity', 'Dignity & State') : 'Dignity & State'}</th>
                                        </tr>
                                    </thead>
                                    <tbody id="planetary-table-body">
                                    </tbody>
                                </table>
                            </div>

                            <!-- Sarvashtakavarga (SAV) Points -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.sav') : 'Ashtakavarga (SAV) Points'}</h3>
                            <div style="margin-bottom: var(--space-8); display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: var(--space-2);">
                                <div id="sav-container" style="display: contents;"></div>
                            </div>

                            <!-- Vimshottari Dasha Timeline -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('kundali.dasha') : 'Vimshottari Dasha (Mahadasha & Antardasha)'}</h3>
                            <div id="dasha-timeline" style="display: flex; flex-direction: column; gap: var(--space-3);">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        if (typeof CityAPI !== 'undefined') {
            CityAPI.initCityAutocomplete('k-city', 'k-city-results');
        }
        setTimeout(() => Components.initScrollReveal(), 100);
        if (typeof Astronomy === 'undefined') {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.astronomy_load_error', 'Astronomy Engine library failed to load. Please check your internet connection.') : 'Astronomy Engine library failed to load. Please check your internet connection.', 'error');
        }
    }

    function drawChartSVG(houses, lagnaSign) {
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

    function generateChart() {
        if (typeof Astronomy === 'undefined') {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.wait_astronomy', 'Please wait for the astronomy engine to load.') : 'Please wait for the astronomy engine to load.', 'error');
            return;
        }

        const name = document.getElementById('k-name').value;
        const date = document.getElementById('k-date').value;
        const time = document.getElementById('k-time').value;
        const cityName = document.getElementById('k-city').value;

        if (!name || !date || !time || !cityName) {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.fill_all', 'Please fill all fields') : 'Please fill all fields', 'error');
            return;
        }

        let cityObj;
        const cityInput = document.getElementById('k-city');
        
        if (cityInput.dataset.lat) {
            const tzOffset = typeof CityAPI !== 'undefined' ? 
                CityAPI.getTzOffset(cityInput.dataset.tzStr, `${date}T${time}:00`) : 5.5;
                
            cityObj = {
                name: cityName,
                lat: parseFloat(cityInput.dataset.lat),
                lon: parseFloat(cityInput.dataset.lon),
                tz: tzOffset
            };
        } else {
            cityObj = typeof CityDatabase !== 'undefined' ? 
                CityDatabase.find(c => c.name.toLowerCase() === cityName.toLowerCase()) : null;
        }

        if (!cityObj) {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.invalid_city', 'Please select a valid city from the search dropdown') : 'Please select a valid city from the search dropdown', 'error');
            return;
        }

        try {
            const chartData = AstroCalc.generateKundali(date, time, cityObj);
            
            document.getElementById('res-name').textContent = `${name} - ${typeof I18n !== 'undefined' ? I18n.t('kundali.kundali_suffix', 'Kundali') : 'Kundali'}`;
            document.getElementById('res-details').textContent = `${date} ${typeof I18n !== 'undefined' ? I18n.t('match.at', 'at') : 'at'} ${time} | ${cityName}`;
            
            document.getElementById('res-lagna').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.lagnaName || 'Unknown') : (chartData.lagnaName || 'Unknown');
            document.getElementById('res-rashi').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.moonSign || 'Unknown') : (chartData.moonSign || 'Unknown');
            document.getElementById('res-nakshatra').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.moonNakshatra || 'Unknown') : (chartData.moonNakshatra || 'Unknown');
            
            // Populate Premium Insights
            if (typeof AstroInterpretations !== 'undefined') {
                const lagnaKey = chartData.lagnaName || 'Unknown';
                const moonKey = chartData.moonSign || 'Unknown';
                document.getElementById('simple-lagna-text').innerHTML = AstroInterpretations.lagna[lagnaKey] || AstroInterpretations.lagna['Unknown'];
                document.getElementById('simple-moon-text').innerHTML = AstroInterpretations.moon[moonKey] || AstroInterpretations.moon['Unknown'];
            }
            
            
            document.getElementById('chart-d1-container').innerHTML = drawChartSVG(chartData.houses, chartData.lagnaRashi);
            document.getElementById('chart-d9-container').innerHTML = drawChartSVG(chartData.navamsaHouses, chartData.lagnaNavamsaRashi);
            document.getElementById('chart-d10-container').innerHTML = drawChartSVG(chartData.dasamsaHouses, chartData.lagnaDasamsaRashi);
            document.getElementById('chart-d7-container').innerHTML = drawChartSVG(chartData.saptamsaHouses, chartData.lagnaSaptamsaRashi);
            document.getElementById('chart-chalit-container').innerHTML = drawChartSVG(chartData.chalitHouses, chartData.lagnaRashi);
            
            // Populate Panchang
            document.getElementById('panchang-vaar').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.panchang.vaar) : chartData.panchang.vaar;
            document.getElementById('panchang-tithi').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.panchang.tithi) : chartData.panchang.tithi;
            document.getElementById('panchang-yoga').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.panchang.yoga) : chartData.panchang.yoga;
            document.getElementById('panchang-karana').textContent = typeof I18n !== 'undefined' ? I18n.tAstro(chartData.panchang.karana) : chartData.panchang.karana;
            
            // Populate Doshas
            const doshaContainer = document.getElementById('dosha-container');
            doshaContainer.innerHTML = chartData.doshas.map(d => `
                <div style="background: rgba(${d.severe ? '163,38,38' : '46,92,58'}, 0.1); border: 1px solid rgba(${d.severe ? '163,38,38' : '46,92,58'}, 0.3); border-radius: var(--radius-sm); padding: var(--space-4);">
                    <div style="font-weight: bold; color: var(--text-primary); margin-bottom: var(--space-2);">${d.name}</div>
                    <div style="font-size: var(--text-sm); color: var(--text-secondary);">${d.desc}</div>
                </div>
            `).join('');
            
            // Populate SAV Points
            const savContainer = document.getElementById('sav-container');
            savContainer.innerHTML = chartData.sav.map(s => {
                let color = s.points >= 28 ? 'var(--color-primary)' : (s.points < 25 ? 'var(--error-color, #e74c3c)' : 'var(--text-primary)');
                return `
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--surface-border); border-radius: var(--radius-sm); padding: var(--space-2); text-align: center;">
                        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 2px;">H${s.house}</div>
                        <div style="font-weight: bold; color: ${color};">${s.points}</div>
                    </div>
                `;
            }).join('');
            
            // Populate Table
            const tbody = document.getElementById('planetary-table-body');
            tbody.innerHTML = chartData.planets.map(p => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: var(--space-3) var(--space-2); font-weight: bold; color: var(--color-secondary)">${p.name}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.rashiName) : p.rashiName}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${p.degreeStr}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.nakshatra) : p.nakshatra} (${typeof I18n !== 'undefined' ? I18n.t('common.pada', 'Pada') : 'Pada'} ${p.pada})</td>
                    <td style="padding: var(--space-3) var(--space-2);">${p.dignity}</td>
                </tr>
            `).join('');

            // Populate Dasha
            const dashaContainer = document.getElementById('dasha-timeline');
            dashaContainer.innerHTML = chartData.dashas.map(md => `
                <details style="background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border); border-radius: var(--radius-sm);">
                    <summary style="padding: var(--space-3); cursor: pointer; font-weight: bold; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between;">
                        <span>${md.lord} ${typeof I18n !== 'undefined' ? I18n.t('common.mahadasha', 'Mahadasha') : 'Mahadasha'}</span>
                        <span style="font-size: var(--text-sm); color: var(--text-muted); font-weight: normal;">${md.startStr.substring(0,4)} ${typeof I18n !== 'undefined' ? I18n.t('common.to', 'to') : 'to'} ${md.endStr.substring(0,4)}</span>
                    </summary>
                    <div style="padding: 0 var(--space-3) var(--space-3) var(--space-3); display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-2);">
                        ${md.antardashas.map(ad => `
                            <div style="background: rgba(0,0,0,0.2); padding: var(--space-2); border-radius: var(--radius-sm); border-left: 2px solid var(--color-secondary);">
                                <div style="font-weight: bold; font-size: var(--text-sm); color: var(--text-primary); margin-bottom: 2px;">${md.lord} - ${ad.lord}</div>
                                <div style="font-size: var(--text-xs); color: var(--text-muted);">${ad.startStr} ${typeof I18n !== 'undefined' ? I18n.t('common.to', 'to') : 'to'} ${ad.endStr}</div>
                            </div>
                        `).join('')}
                    </div>
                </details>
            `).join('');
            
            const resultDiv = document.getElementById('kundaliResult');
            resultDiv.style.display = 'block';
            
            // Smooth scroll down to results so user knows it generated
            setTimeout(() => {
                const y = resultDiv.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 150);

            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.generated_success', 'Advanced Kundali Generated!') : 'Advanced Kundali Generated!', 'success');
        } catch (e) {
            console.error(e);
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('kundali.generate_error', 'Error generating chart. Check input data.') : 'Error generating chart. Check input data.', 'error');
        }
    }

    function loadProfile(id) {
        if (!id) return;
        const profile = ProfileManager.getProfileById(id);
        if (profile) {
            document.getElementById('k-name').value = profile.name || '';
            document.getElementById('k-date').value = profile.dob || '';
            document.getElementById('k-time').value = profile.time || '';
            
            // Reconstruct a mock city to fill the input
            document.getElementById('k-city').value = `${typeof I18n !== 'undefined' ? I18n.t('kundali.auto_filled', 'Auto-filled') : 'Auto-filled'} (${profile.lat}, ${profile.lng})`;
            
            // Temporarily store the exact coords on the input element for generateChart to read
            document.getElementById('k-city').dataset.lat = profile.lat;
            document.getElementById('k-city').dataset.lng = profile.lng;
            document.getElementById('k-city').dataset.tz = profile.tz;
            
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('profile.loaded_success', 'Profile loaded successfully!') : 'Profile loaded successfully!', 'success');
        }
    }

    return { render, afterRender, generateChart, loadProfile };
})();
