/* ============================================
   Kundali Generator Page
   ============================================ */

const KundaliPage = (() => {
    
    function render() {
        // Generate options for cities
        const cityOptions = (typeof CityDatabase !== 'undefined' ? CityDatabase : [])
            .map(c => `<option value="${c.name}">${c.name}</option>`)
            .join('');

        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Kundali Generator' }
                ])}

                ${Components.sectionHeader(
                    'Kundali Generator',
                    'Generate your Vedic Birth Chart locally and privately. No data is sent to any server.',
                    { h1: true }
                )}

                <div class="grid-2">
                    <!-- Form Section -->
                    <div class="card card-glass" style="padding: var(--space-6)">
                        <h3 style="margin-bottom: var(--space-4)">Enter Birth Details</h3>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label style="display: block; margin-bottom: var(--space-2)">Name</label>
                            <input type="text" id="k-name" placeholder="E.g., Rahul Koul" style="width: 100%; padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); background: var(--bg-card); color: var(--text-primary);">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label style="display: block; margin-bottom: var(--space-2)">Date of Birth</label>
                            <input type="date" id="k-date" style="width: 100%; padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); background: var(--bg-card); color: var(--text-primary); color-scheme: dark;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-4)">
                            <label style="display: block; margin-bottom: var(--space-2)">Time of Birth</label>
                            <input type="time" id="k-time" style="width: 100%; padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); background: var(--bg-card); color: var(--text-primary); color-scheme: dark;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: var(--space-6)">
                            <label style="display: block; margin-bottom: var(--space-2)">City of Birth</label>
                            <select id="k-city" style="width: 100%; padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); background: var(--bg-card); color: var(--text-primary); color-scheme: dark;">
                                <option value="">Select a city...</option>
                                ${cityOptions}
                            </select>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%; padding: var(--space-3); font-size: var(--text-lg)" onclick="KundaliPage.generateChart()">
                            Generate Kundali ✨
                        </button>
                    </div>

                    <!-- Result Section -->
                    <div id="kundaliResult" style="display: none; grid-column: 1 / -1;">
                        <div class="card card-glass" style="padding: var(--space-6);">
                            <div style="text-align: center; margin-bottom: var(--space-6)">
                                <h2 id="res-name" style="margin-bottom: var(--space-2); color: var(--color-secondary)"></h2>
                                <p id="res-details" style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-4)"></p>
                                
                                <div style="display: flex; justify-content: center; gap: var(--space-4); flex-wrap: wrap;">
                                    <div class="badge badge-primary">Lagna: <span id="res-lagna"></span></div>
                                    <div class="badge badge-secondary">Rashi: <span id="res-rashi"></span></div>
                                    <div class="badge" style="background: var(--bg-tertiary)">Nakshatra: <span id="res-nakshatra"></span></div>
                                </div>
                            </div>
                            
                            <!-- Charts Container -->
                            <div class="grid-2" style="margin-bottom: var(--space-8); gap: var(--space-6)">
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">Lagna Chart (D1)</h3>
                                    <div id="chart-d1-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                                <div>
                                    <h3 style="text-align: center; margin-bottom: var(--space-4)">Navamsa Chart (D9)</h3>
                                    <div id="chart-d9-container" style="max-width: 400px; margin: 0 auto;"></div>
                                </div>
                            </div>
                            
                            <!-- Planetary Details Table -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">Planetary Positions</h3>
                            <div style="overflow-x: auto; margin-bottom: var(--space-8);">
                                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                                    <thead>
                                        <tr style="border-bottom: 1px solid var(--color-secondary);">
                                            <th style="padding: var(--space-2);">Planet</th>
                                            <th style="padding: var(--space-2);">Sign (Rashi)</th>
                                            <th style="padding: var(--space-2);">Degree</th>
                                            <th style="padding: var(--space-2);">Nakshatra</th>
                                        </tr>
                                    </thead>
                                    <tbody id="planetary-table-body">
                                    </tbody>
                                </table>
                            </div>

                            <!-- Vimshottari Dasha Timeline -->
                            <h3 style="margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">Vimshottari Dasha (Mahadasha)</h3>
                            <div id="dasha-timeline" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-3);">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        setTimeout(() => Components.initScrollReveal(), 100);
        if (typeof Astronomy === 'undefined') {
            Components.showToast('Astronomy Engine library failed to load. Please check your internet connection.', 'error');
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
            Components.showToast('Please wait for the astronomy engine to load.', 'error');
            return;
        }

        const name = document.getElementById('k-name').value;
        const date = document.getElementById('k-date').value;
        const time = document.getElementById('k-time').value;
        const cityName = document.getElementById('k-city').value;

        if (!name || !date || !time || !cityName) {
            Components.showToast('Please fill all fields', 'error');
            return;
        }

        const cityObj = CityDatabase.find(c => c.name === cityName);
        if (!cityObj) return;

        try {
            const chartData = AstroCalc.generateKundali(date, time, cityObj);
            
            document.getElementById('res-name').textContent = `${name}'s Kundali`;
            document.getElementById('res-details').textContent = `${date} at ${time} | ${cityName}`;
            
            document.getElementById('res-lagna').textContent = chartData.lagnaName || 'Unknown';
            document.getElementById('res-rashi').textContent = chartData.moonSign || 'Unknown';
            document.getElementById('res-nakshatra').textContent = chartData.moonNakshatra || 'Unknown';
            
            document.getElementById('chart-d1-container').innerHTML = drawChartSVG(chartData.houses, chartData.lagnaRashi);
            document.getElementById('chart-d9-container').innerHTML = drawChartSVG(chartData.navamsaHouses, chartData.lagnaNavamsaRashi);
            
            // Populate Table
            const tbody = document.getElementById('planetary-table-body');
            tbody.innerHTML = chartData.planets.map(p => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: var(--space-3) var(--space-2); font-weight: bold; color: var(--color-secondary)">${p.name}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${p.rashiName}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${p.degreeStr}</td>
                    <td style="padding: var(--space-3) var(--space-2);">${p.nakshatra} (Pada ${p.pada})</td>
                </tr>
            `).join('');

            // Populate Dasha
            const dashaContainer = document.getElementById('dasha-timeline');
            dashaContainer.innerHTML = chartData.dashas.map(d => `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--surface-border); border-radius: var(--radius-sm); padding: var(--space-3); text-align: center;">
                    <div style="font-weight: bold; color: var(--color-primary); margin-bottom: 4px;">${d.lord}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">${d.startYear} - ${d.endYear}</div>
                </div>
            `).join('');
            
            document.getElementById('kundaliResult').style.display = 'block';
            
            if (window.innerWidth < 768) {
                document.getElementById('kundaliResult').scrollIntoView({ behavior: 'smooth' });
            }

            Components.showToast('Advanced Kundali Generated!', 'success');
        } catch (e) {
            console.error(e);
            Components.showToast('Error generating chart. Check input data.', 'error');
        }
    }

    return { render, afterRender, generateChart };
})();
