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
                            <select id="k-city" style="width: 100%; padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--surface-border); background: var(--bg-card); color: var(--text-primary);">
                                <option value="">Select a city...</option>
                                ${cityOptions}
                            </select>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%; padding: var(--space-3); font-size: var(--text-lg)" onclick="KundaliPage.generateChart()">
                            Generate Kundali ✨
                        </button>
                    </div>

                    <!-- Result Section -->
                    <div id="kundaliResult" style="display: none;">
                        <div class="card card-glass" style="padding: var(--space-6); text-align: center; height: 100%;">
                            <h3 id="res-name" style="margin-bottom: var(--space-2); color: var(--color-secondary)"></h3>
                            <p id="res-details" style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-6)"></p>
                            
                            <!-- North Indian Chart SVG Container -->
                            <div id="chart-container" style="max-width: 400px; margin: 0 auto; position: relative;">
                                <!-- SVG will be injected here -->
                            </div>
                            
                            <div style="margin-top: var(--space-6); display: flex; justify-content: center; gap: var(--space-4)">
                                <div style="background: rgba(255,255,255,0.05); padding: var(--space-3) var(--space-5); border-radius: var(--radius-lg)">
                                    <div style="font-size: var(--text-xs); color: var(--text-muted)">Lagna (Ascendant)</div>
                                    <div id="res-lagna" style="font-weight: bold; color: var(--text-primary)"></div>
                                </div>
                                <div style="background: rgba(255,255,255,0.05); padding: var(--space-3) var(--space-5); border-radius: var(--radius-lg)">
                                    <div style="font-size: var(--text-xs); color: var(--text-muted)">Rashi (Moon Sign)</div>
                                    <div id="res-rashi" style="font-weight: bold; color: var(--text-primary)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        setTimeout(() => Components.initScrollReveal(), 100);
        
        // Error handling if library failed to load
        if (typeof Astronomy === 'undefined') {
            Components.showToast('Astronomy Engine library failed to load. Please check your internet connection.', 'error');
        }
    }

    function drawChartSVG(houses) {
        // Draw a North Indian Chart (Diamond)
        // House 1 is top diamond, numbers go counter-clockwise
        
        // Helper to format planets in a house
        const p = (h) => (houses[h] && houses[h].length > 0) ? houses[h].join(' ') : '';
        
        // Coordinates for the 12 houses (approximate center points for text)
        // Size: 400x400 viewBox
        return `
            <svg viewBox="0 0 400 400" width="100%" height="100%" style="background: var(--bg-tertiary); border: 2px solid var(--color-secondary); border-radius: var(--radius-sm);">
                <!-- Outer Square -->
                <rect x="0" y="0" width="400" height="400" fill="none" stroke="var(--color-secondary)" stroke-width="4"/>
                
                <!-- Diagonals -->
                <line x1="0" y1="0" x2="400" y2="400" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="0" y1="400" x2="400" y2="0" stroke="var(--color-secondary)" stroke-width="2"/>
                
                <!-- Inner Diamond -->
                <line x1="200" y1="0" x2="400" y2="200" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="400" y1="200" x2="200" y2="400" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="200" y1="400" x2="0" y2="200" stroke="var(--color-secondary)" stroke-width="2"/>
                <line x1="0" y1="200" x2="200" y2="0" stroke="var(--color-secondary)" stroke-width="2"/>
                
                <!-- Text / Planets (Centers of each house) -->
                <!-- H1 --> <text x="200" y="100" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(1)}</text>
                <!-- H2 --> <text x="100" y="50" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(2)}</text>
                <!-- H3 --> <text x="50" y="100" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(3)}</text>
                <!-- H4 --> <text x="100" y="200" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(4)}</text>
                <!-- H5 --> <text x="50" y="300" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(5)}</text>
                <!-- H6 --> <text x="100" y="350" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(6)}</text>
                <!-- H7 --> <text x="200" y="300" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(7)}</text>
                <!-- H8 --> <text x="300" y="350" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(8)}</text>
                <!-- H9 --> <text x="350" y="300" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(9)}</text>
                <!-- H10 --> <text x="300" y="200" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(10)}</text>
                <!-- H11 --> <text x="350" y="100" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(11)}</text>
                <!-- H12 --> <text x="300" y="50" fill="var(--text-primary)" font-size="14" text-anchor="middle" font-weight="bold">${p(12)}</text>
                
                <!-- House Numbers (Small text in corners of each section) -->
                <text x="200" y="20" fill="var(--color-secondary)" font-size="10" text-anchor="middle">1</text>
                <text x="100" y="15" fill="var(--color-secondary)" font-size="10" text-anchor="middle">2</text>
                <text x="15" y="100" fill="var(--color-secondary)" font-size="10" text-anchor="middle">3</text>
                <text x="50" y="200" fill="var(--color-secondary)" font-size="10" text-anchor="middle">4</text>
                <text x="15" y="300" fill="var(--color-secondary)" font-size="10" text-anchor="middle">5</text>
                <text x="100" y="385" fill="var(--color-secondary)" font-size="10" text-anchor="middle">6</text>
                <text x="200" y="385" fill="var(--color-secondary)" font-size="10" text-anchor="middle">7</text>
                <text x="300" y="385" fill="var(--color-secondary)" font-size="10" text-anchor="middle">8</text>
                <text x="385" y="300" fill="var(--color-secondary)" font-size="10" text-anchor="middle">9</text>
                <text x="350" y="200" fill="var(--color-secondary)" font-size="10" text-anchor="middle">10</text>
                <text x="385" y="100" fill="var(--color-secondary)" font-size="10" text-anchor="middle">11</text>
                <text x="300" y="15" fill="var(--color-secondary)" font-size="10" text-anchor="middle">12</text>
            </svg>
        `;
    }

    function generateChart() {
        if (typeof Astronomy === 'undefined') {
            Components.showToast('Please wait for the astronomy engine to load, or check your internet.', 'error');
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
            // Calculate Kundali
            const chartData = AstroCalc.generateKundali(date, time, cityObj);
            
            // Populate UI
            document.getElementById('res-name').textContent = `${name}'s Kundali`;
            document.getElementById('res-details').textContent = `${date} at ${time} | ${cityName}`;
            
            document.getElementById('res-lagna').textContent = chartData.lagnaName || 'Unknown';
            document.getElementById('res-rashi').textContent = chartData.moonSign || 'Unknown';
            
            document.getElementById('chart-container').innerHTML = drawChartSVG(chartData.houses);
            
            // Show result
            document.getElementById('kundaliResult').style.display = 'block';
            
            // Scroll to it on mobile
            if (window.innerWidth < 768) {
                document.getElementById('kundaliResult').scrollIntoView({ behavior: 'smooth' });
            }

            Components.showToast('Kundali Generated successfully!', 'success');
        } catch (e) {
            console.error(e);
            Components.showToast('Error generating chart. Check input data.', 'error');
        }
    }

    return { render, afterRender, generateChart };
})();
