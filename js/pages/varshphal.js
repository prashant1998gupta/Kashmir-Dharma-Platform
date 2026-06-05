/* ============================================
   Annual Varshphal Page — Professional Report
   ============================================ */

const VarshphalPage = (() => {

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('varshphal.title', 'Annual Varshphal') : 'Annual Varshphal' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('varshphal.header', 'Tajika Varshphal') : 'Tajika Varshphal',
                    typeof I18n !== 'undefined' ? I18n.t('varshphal.desc', 'Generate your comprehensive Annual Horoscope with Solar Return chart, Tajika Yoga analysis, house-by-house predictions, and remedies.') : 'Generate your comprehensive Annual Horoscope with Solar Return chart, Tajika Yoga analysis, house-by-house predictions, and remedies.',
                    { h1: true }
                )}

                <div class="card card-glass" style="padding: var(--space-6); max-width: 800px; margin: 0 auto var(--space-8) auto; overflow: visible;">
                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label" for="v-name">${typeof I18n !== 'undefined' ? I18n.t('varshphal.name', 'Name') : 'Name'}</label>
                            <input type="text" id="v-name" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('varshphal.enter_name', 'Enter name') : 'Enter name'}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="v-target-year">${typeof I18n !== 'undefined' ? I18n.t('varshphal.target_year', 'Target Year (e.g. 2024)') : 'Target Year (e.g. 2024)'}</label>
                            <input type="number" id="v-target-year" class="form-control" placeholder="2024" min="1900" max="2100">
                        </div>
                    </div>
                    <div class="grid-2">
                        <div class="form-group">
                            <label class="form-label" for="v-date">${typeof I18n !== 'undefined' ? I18n.t('varshphal.dob', 'Date of Birth') : 'Date of Birth'}</label>
                            <input type="date" id="v-date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="v-time">${typeof I18n !== 'undefined' ? I18n.t('varshphal.tob', 'Time of Birth') : 'Time of Birth'}</label>
                            <input type="time" id="v-time" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="v-city">${typeof I18n !== 'undefined' ? I18n.t('varshphal.city', 'City of Birth') : 'City of Birth'}</label>
                        <input type="text" id="v-city" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('varshphal.search_city', 'Search global cities...') : 'Search global cities...'}" autocomplete="off">
                        <ul id="v-city-results"></ul>
                    </div>
                    <div style="text-align: center; margin-top: var(--space-6);">
                        <button class="btn btn-primary" style="padding: var(--space-4) var(--space-8); font-size: 1.1rem; border-radius: var(--radius-full);" onclick="VarshphalPage.generateVarshphal()">${typeof I18n !== 'undefined' ? I18n.t('varshphal.gen_btn', '🌟 Generate Annual Report') : '🌟 Generate Annual Report'}</button>
                    </div>
                </div>

                <div id="varshphalResult" style="display: none;"></div>
            </div>
        `;
    }

    function afterRender() {
        if (typeof CityAPI !== 'undefined') {
            CityAPI.initCityAutocomplete('v-city', 'v-city-results');
        }
        document.getElementById('v-target-year').value = new Date().getFullYear();
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
            </svg>`;
    }

    function renderPlanetTable(chart) {
        return `<table style="width:100%; text-align:left; border-collapse:collapse; font-size: var(--text-sm);">
            <thead><tr style="border-bottom:2px solid var(--color-secondary);">
                <th style="padding:var(--space-2);">Planet</th><th style="padding:var(--space-2);">Sign</th><th style="padding:var(--space-2);">Degree</th><th style="padding:var(--space-2);">Nakshatra</th><th style="padding:var(--space-2);">Dignity</th>
            </tr></thead><tbody>
            ${chart.planets.map(p => `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:var(--space-2); font-weight:bold; color:var(--color-secondary);">${p.name}</td>
                <td style="padding:var(--space-2);">${p.rashiName}</td>
                <td style="padding:var(--space-2);">${p.degreeStr}</td>
                <td style="padding:var(--space-2);">${p.nakshatra} (Pada ${p.pada})</td>
                <td style="padding:var(--space-2);">${p.dignity}</td>
            </tr>`).join('')}
            </tbody></table>`;
    }

    function generateVarshphal() {
        if (typeof VarshphalCalc === 'undefined') return;

        const name = document.getElementById('v-name').value || 'User';
        const date = document.getElementById('v-date').value;
        const time = document.getElementById('v-time').value;
        const targetYear = document.getElementById('v-target-year').value;
        const cityInput = document.getElementById('v-city');
        const cityName = cityInput.value;

        if (!date || !time || !cityName || !targetYear) {
            Components.showToast('Please fill all fields', 'error');
            return;
        }

        let cityObj;
        if (cityInput.dataset.lat) {
            cityObj = { name: cityName, lat: parseFloat(cityInput.dataset.lat), lon: parseFloat(cityInput.dataset.lon),
                tz: typeof CityAPI !== 'undefined' ? CityAPI.getTzOffset(cityInput.dataset.tzStr, `${date}T${time}:00`) : 5.5 };
        } else {
            cityObj = typeof CityDatabase !== 'undefined' ? CityDatabase.find(c => c.name.toLowerCase() === cityName.toLowerCase()) : null;
        }
        if (!cityObj) { Components.showToast('Please select a valid city', 'error'); return; }

        try {
            const result = VarshphalCalc.generateVarshphal(date, time, cityObj, targetYear);
            renderFullReport(name, date, time, cityName, targetYear, result);
        } catch (e) {
            console.error(e);
            Components.showToast('Error generating Varshphal. Check inputs.', 'error');
        }
    }

    function renderFullReport(name, birthDate, birthTime, cityName, targetYear, result) {
        const now = new Date();
        const rDate = result.returnDate;
        const rDateStr = `${rDate.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} at ${rDate.toLocaleTimeString('en-IN')}`;
        const RASHIS = VarshphalCalc.RASHIS;

        let html = `<div class="card card-glass" style="padding: var(--space-6);">
            <div class="no-print" style="text-align: right; margin-bottom: var(--space-4); display:flex; gap:var(--space-3); justify-content:flex-end;">
                <button class="btn btn-primary" style="padding:var(--space-2) var(--space-5);" onclick="PDFGenerator.generatePDF('varshphalResult','Varshphal_Report_${targetYear}.pdf','Annual Varshphal Report ${targetYear}')">📥 Download PDF</button>
                <button class="btn btn-outline" onclick="PDFGenerator.generatePDF('varshphalResult','Varshphal_Report_${targetYear}.pdf','Annual Varshphal Report ${targetYear}')">🖨️ Print</button>
            </div>

            <!-- ═══════ PAGE 1: TITLE & HIGHLIGHTS ═══════ -->
            <div class="report-section print-avoid-break" style="text-align:center; margin-bottom:var(--space-8); padding:var(--space-8) 0; border-bottom:2px solid var(--color-secondary);">
                <div style="font-size:0.9rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:3px; margin-bottom:var(--space-2);">Kashmir Dharma Companion</div>
                <h1 style="color:var(--color-secondary); font-size:2rem; margin-bottom:var(--space-4);">Annual Varshphal Report</h1>
                <h2 style="color:var(--text-primary); font-size:1.5rem; margin-bottom:var(--space-2);">${name} — Year ${targetYear}</h2>
                <p style="color:var(--text-muted);">Age: ${result.age} | Solar Return: ${rDateStr}</p>
                <p style="color:var(--text-muted); font-size:var(--text-sm);">Generated on ${now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
            </div>

            <!-- Key Highlights -->
            <div class="grid-3 print-avoid-break" style="margin-bottom:var(--space-8);">
                <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--surface-border);">
                    <div style="color:var(--text-muted); font-size:var(--text-sm); margin-bottom:4px;">Muntha Rashi</div>
                    <div style="font-size:var(--text-xl); font-weight:bold; color:var(--color-primary);">${result.munthaRashiName}</div>
                    <div style="font-size:var(--text-xs); color:var(--text-muted);">House ${result.munthaHouse}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--surface-border);">
                    <div style="color:var(--text-muted); font-size:var(--text-sm); margin-bottom:4px;">Muntha Lord</div>
                    <div style="font-size:var(--text-xl); font-weight:bold; color:var(--color-primary);">${result.munthaLord}</div>
                </div>
                <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--color-secondary);">
                    <div style="color:var(--text-muted); font-size:var(--text-sm); margin-bottom:4px; text-transform:uppercase;">Varsheshvara (Year Lord)</div>
                    <div style="font-size:var(--text-xl); font-weight:bold; color:var(--color-secondary);">${result.yearLord}</div>
                </div>
            </div>

            <!-- Birth Details -->
            <div class="print-avoid-break" style="margin-bottom:var(--space-8);">
                <table style="width:100%; border-collapse:collapse;">
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted); width:35%;">Name</td><td style="padding:var(--space-2); font-weight:bold;">${name}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Date of Birth</td><td style="padding:var(--space-2);">${birthDate}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Time of Birth</td><td style="padding:var(--space-2);">${birthTime}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Place of Birth</td><td style="padding:var(--space-2);">${cityName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Solar Return (Varshapravesh)</td><td style="padding:var(--space-2); font-weight:bold; color:var(--color-secondary);">${rDateStr}</td></tr>
                    <tr><td style="padding:var(--space-2); color:var(--text-muted);">Natal Lagna / Varsha Lagna</td><td style="padding:var(--space-2); font-weight:bold;">${result.natalChart.lagnaName} / ${result.varshaChart.lagnaName}</td></tr>
                </table>
            </div>

            <!-- ═══════ PAGE 2: NATAL CHART ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-primary); border-bottom:2px solid var(--color-primary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">📋 Natal Birth Chart (Janma Kundali)</h2>
                <div class="grid-2" style="gap:var(--space-6); margin-bottom:var(--space-6);">
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">Natal Lagna Chart (D1)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(result.natalChart.houses, result.natalChart.lagnaRashi)}</div></div>
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">Natal Navamsa Chart (D9)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(result.natalChart.navamsaHouses, result.natalChart.lagnaNavamsaRashi)}</div></div>
                </div>
                <h3 style="margin-bottom:var(--space-3); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2);">Natal Planetary Positions</h3>
                ${renderPlanetTable(result.natalChart)}
            </div>

            <!-- ═══════ PAGE 3: SOLAR RETURN CHART ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🌞 Solar Return Chart (Varsha Kundali — ${targetYear})</h2>
                <div class="grid-2" style="gap:var(--space-6); margin-bottom:var(--space-6);">
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">Varsha Lagna Chart (D1)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(result.varshaChart.houses, result.varshaChart.lagnaRashi)}</div></div>
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">Varsha Navamsa (D9)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(result.varshaChart.navamsaHouses, result.varshaChart.lagnaNavamsaRashi)}</div></div>
                </div>
                <h3 style="margin-bottom:var(--space-3); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2);">Solar Return Planetary Positions</h3>
                ${renderPlanetTable(result.varshaChart)}
            </div>

            <!-- ═══════ PAGE 4: PANCHA-ADHIKARI ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">👑 Pancha-Adhikari (Five Year Lords)</h2>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:var(--space-6);">In the Tajika system, five lords govern the annual chart. The strongest among them becomes the Varsheshvara (Year Lord) who guides the overall theme and energy of the entire year.</p>
                
                ${result.panchadhikari.lords.map((lord, i) => `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-3); border-left:4px solid ${lord.planet === result.yearLord ? 'var(--color-secondary)' : 'var(--surface-border)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2);">
                            <span style="font-weight:bold; color:var(--text-primary);">${i + 1}. ${lord.title}</span>
                            <span style="font-weight:bold; font-size:1.1em; color:${lord.planet === result.yearLord ? 'var(--color-secondary)' : 'var(--color-primary)'};">${lord.planet} ${lord.planet === result.yearLord ? '👑' : ''}</span>
                        </div>
                        <p style="color:var(--text-muted); font-size:var(--text-sm); line-height:1.5;">${lord.desc}</p>
                    </div>
                `).join('')}

                <div style="background:rgba(201,169,89,0.1); border:1px solid rgba(201,169,89,0.3); border-radius:var(--radius-md); padding:var(--space-5); margin-top:var(--space-6);">
                    <div style="font-weight:bold; font-size:var(--text-lg); color:var(--color-secondary); margin-bottom:var(--space-2);">👑 Varsheshvara (Year Lord): ${result.yearLord}</div>
                    <p style="color:var(--text-secondary); line-height:1.6;">${result.yearLord} emerges as the dominant lord of this annual chart. This planet's strength, dignity, and house placement in both the natal and annual charts will significantly influence the overall trajectory of the year. Strengthening ${result.yearLord} through appropriate mantras, gemstones, and rituals is strongly recommended.</p>
                </div>
            </div>

            <!-- ═══════ PAGE 5: MUNTHA ANALYSIS ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🎯 Muntha Analysis</h2>
                
                <div class="grid-3 print-avoid-break" style="margin-bottom:var(--space-6);">
                    <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--surface-border);">
                        <div style="color:var(--text-muted); font-size:var(--text-xs); text-transform:uppercase;">Muntha Rashi</div>
                        <div style="font-size:var(--text-lg); font-weight:bold; color:var(--color-primary); margin-top:4px;">${result.munthaRashiName}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--surface-border);">
                        <div style="color:var(--text-muted); font-size:var(--text-xs); text-transform:uppercase;">House Position</div>
                        <div style="font-size:var(--text-lg); font-weight:bold; color:var(--color-primary); margin-top:4px;">House ${result.munthaHouse}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:var(--space-4); border-radius:var(--radius-md); text-align:center; border:1px solid var(--surface-border);">
                        <div style="color:var(--text-muted); font-size:var(--text-xs); text-transform:uppercase;">Muntha Lord</div>
                        <div style="font-size:var(--text-lg); font-weight:bold; color:var(--color-secondary); margin-top:4px;">${result.munthaLord}</div>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.2); border-radius:var(--radius-lg); padding:var(--space-5); border-left:4px solid ${[1,2,3,5,9,10,11].includes(result.munthaHouse) ? 'var(--success-color, #2ecc71)' : 'var(--error-color, #e74c3c)'};">
                    <h3 style="margin-bottom:var(--space-3); color:${[1,2,3,5,9,10,11].includes(result.munthaHouse) ? '#2ecc71' : '#e74c3c'};">
                        ${[1,2,3,5,9,10,11].includes(result.munthaHouse) ? '✅ Favorable Muntha Placement' : '⚠️ Challenging Muntha Placement'}
                    </h3>
                    <p style="color:var(--text-secondary); line-height:1.7;">
                        ${[1,2,3,5,9,10,11].includes(result.munthaHouse) 
                            ? `The Muntha is placed in House ${result.munthaHouse} in the sign of ${result.munthaRashiName}, which is an auspicious position. This indicates a year of progress, growth, and favorable developments in the matters governed by this house. The Muntha Lord ${result.munthaLord} should be strengthened through mantras to maximize the positive effects.`
                            : `The Muntha is placed in House ${result.munthaHouse} in the sign of ${result.munthaRashiName}, which is a challenging position. Houses 6, 8, and 12 are considered Dusthana (adverse) positions for Muntha. This may indicate obstacles, health concerns, or unexpected expenses. Remedial measures for the Muntha Lord ${result.munthaLord} are strongly recommended — see the Remedies section.`
                        }
                    </p>
                </div>
            </div>

            <!-- ═══════ PAGES 6-7: HOUSE PREDICTIONS ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🏠 House-by-House Annual Predictions</h2>
                
                ${result.housePredictions.map(hp => `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4); border-left:4px solid ${hp.hasMuntha ? 'var(--color-secondary)' : (hp.planets.length > 0 ? 'var(--color-primary)' : 'var(--surface-border)')};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2);">
                            <div>
                                <span style="font-size:1.2em; margin-right:var(--space-2);">${hp.icon}</span>
                                <span style="font-weight:bold; color:var(--text-primary);">House ${hp.house}: ${hp.name}</span>
                                ${hp.hasMuntha ? '<span style="background:var(--color-secondary); color:#000; font-size:0.7em; padding:2px 8px; border-radius:10px; margin-left:8px; font-weight:bold;">MUNTHA</span>' : ''}
                            </div>
                            <div style="font-size:var(--text-sm); color:var(--text-muted);">${hp.planets.length > 0 ? hp.planets.join(', ') : 'Empty'}</div>
                        </div>
                        <div style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:var(--space-2); text-transform:uppercase;">${hp.areas}</div>
                        <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${hp.prediction}</p>
                    </div>
                `).join('')}
            </div>

            <!-- ═══════ PAGE 8: TAJIKA YOGAS ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🔯 Tajika Yoga Analysis</h2>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:var(--space-6);">Tajika Yogas are special planetary combinations unique to the annual horoscope system. They provide deep insights into the specific events and themes that will unfold during this year.</p>
                
                ${result.tajikaYogas.map(yoga => {
                    const impactColor = yoga.impact === 'Highly Positive' ? '#2ecc71' : (yoga.impact === 'Positive' ? '#27ae60' : (yoga.impact === 'Challenging' ? '#e74c3c' : (yoga.impact === 'Mixed' ? '#f1c40f' : '#95a5a6')));
                    return `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-5); margin-bottom:var(--space-4); border-left:4px solid ${impactColor};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2);">
                            <span style="font-weight:bold; font-size:1.1em; color:var(--text-primary);">${yoga.name}</span>
                            <span style="font-size:var(--text-sm); padding:3px 10px; border-radius:var(--radius-full); background:rgba(${impactColor === '#2ecc71' || impactColor === '#27ae60' ? '46,204,113' : (impactColor === '#e74c3c' ? '231,76,60' : '241,196,15')},0.2); color:${impactColor};">${yoga.impact}</span>
                        </div>
                        <div style="font-size:var(--text-sm); color:var(--text-muted); margin-bottom:var(--space-2);">Planets: ${yoga.planets}</div>
                        <p style="color:var(--text-secondary); line-height:1.7; font-size:var(--text-sm);">${yoga.desc}</p>
                    </div>`;
                }).join('')}
            </div>

            <!-- ═══════ PAGE 8.5: DASHA FOR THE YEAR ═══════ -->
            ${(result.dashaForYear && result.dashaForYear.length > 0) ? `
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">⏰ Vimshottari Dasha Timeline for ${targetYear}</h2>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:var(--space-6);">The Vimshottari Dasha system divides your life into planetary periods. Below are the Mahadasha-Antardasha combinations active during this year, with their specific effects and timing.</p>
                
                ${result.dashaForYear.map((period, idx) => {
                    const colors = {'Sun':'#e67e22','Moon':'#3498db','Mars':'#e74c3c','Mercury':'#2ecc71','Jupiter':'#f1c40f','Venus':'#e91e90','Saturn':'#9b59b6','Rahu':'#7f8c8d','Ketu':'#d35400'};
                    const clr = colors[period.antardasha] || '#c9a959';
                    return `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-3); border-left:4px solid ${clr};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2); flex-wrap:wrap; gap:var(--space-2);">
                            <div>
                                <span style="font-weight:bold; color:var(--text-primary); font-size:1.1em;">${period.mahadasha} - ${period.antardasha}</span>
                                <span style="color:var(--text-muted); margin-left:var(--space-2); font-size:var(--text-sm);">| ${period.theme}</span>
                            </div>
                            <div style="font-size:var(--text-xs); padding:3px 10px; border-radius:var(--radius-full); background:rgba(201,169,89,0.15); color:var(--color-secondary);">${period.startDate} — ${period.endDate}</div>
                        </div>
                        <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${period.interpretation}</p>
                    </div>`;                    
                }).join('')}
            </div>
            ` : ''}

            <!-- ═══════ PAGE 9: REMEDIES ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">📿 Remedies & Guidance for ${targetYear}</h2>
                
                ${result.remedies.map(section => `
                    <div class="remedy-card-print print-avoid-break" style="background:rgba(201,169,89,0.08); border:1px solid rgba(201,169,89,0.3); border-radius:var(--radius-md); padding:var(--space-5); margin-bottom:var(--space-5);">
                        <h3 style="color:var(--color-secondary); margin-bottom:var(--space-3);">📿 ${section.title}</h3>
                        <ul style="list-style:none; padding:0;">
                            ${section.items.map(item => `<li style="padding:var(--space-2) 0; border-bottom:1px solid rgba(255,255,255,0.03); color:var(--text-secondary); line-height:1.6;">• ${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}

                <h3 style="margin-bottom:var(--space-4);">Monthly Overview</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:var(--space-2);">
                    ${result.monthlyGuidance.map(m => `
                        <div style="background:rgba(${m.favorable ? '46,204,113' : '231,76,60'},0.08); border:1px solid rgba(${m.favorable ? '46,204,113' : '231,76,60'},0.2); border-radius:var(--radius-sm); padding:var(--space-3); text-align:center;">
                            <div style="font-size:var(--text-xs); color:var(--text-muted);">${m.period}</div>
                            <div style="font-weight:bold; color:${m.favorable ? '#2ecc71' : '#e74c3c'}; font-size:var(--text-sm);">${m.sign}</div>
                            <div style="font-size:0.7em; color:${m.favorable ? '#2ecc71' : '#e74c3c'};">${m.favorable ? '✅ Favorable' : '⚠️ Caution'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- ═══════ PAGE 10: DISCLAIMER ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-4);">
                <h2 class="report-section-title" style="color:var(--text-muted); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2); margin-bottom:var(--space-4);">Disclaimer & Notes</h2>
                <div style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-5); color:var(--text-muted); font-size:var(--text-sm); line-height:1.8;">
                    <p><strong>1.</strong> This Annual Varshphal report is generated using the Tajika system of Vedic Astrology. The Solar Return (Varshapravesh) time is calculated using the Lahiri Ayanamsa and sidereal zodiac.</p>
                    <p style="margin-top:var(--space-2);"><strong>2.</strong> The Pancha-Adhikari (5 Year Lords) analysis determines the Varsheshvara based on the most frequently occurring lord. A full Tajika analysis would also consider Pancha-Vargiya Bala (five-fold strength).</p>
                    <p style="margin-top:var(--space-2);"><strong>3.</strong> Tajika Yoga analysis covers the most significant yogas. A comprehensive analysis by a qualified Jyotishi may reveal additional yogas and their interactions.</p>
                    <p style="margin-top:var(--space-2);"><strong>4.</strong> House predictions are based on planetary placements in the annual chart. Transit analysis and Dasha compatibility should also be considered for precise timing of events.</p>
                    <p style="margin-top:var(--space-2);"><strong>5.</strong> Remedies are based on traditional Vedic practices. Gemstone recommendations should be finalized only after consulting with a qualified astrologer, as incorrect usage can produce adverse effects.</p>
                </div>
                <div style="text-align:center; margin-top:var(--space-6); padding-top:var(--space-4); border-top:1px solid var(--surface-border);">
                    <div style="font-weight:bold; color:var(--color-secondary);">Kashmir Dharma Companion</div>
                    <div style="font-size:var(--text-sm); color:var(--text-muted);">Preserving Kashmiri Pandit Heritage Through Technology</div>
                </div>
            </div>
        </div>`;

        document.getElementById('varshphalResult').innerHTML = html;
        document.getElementById('varshphalResult').style.display = 'block';
        setTimeout(() => {
            document.getElementById('varshphalResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    return { render, afterRender, generateVarshphal };
})();
