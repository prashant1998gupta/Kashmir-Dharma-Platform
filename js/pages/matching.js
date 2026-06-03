/* ============================================
   Kundali Matching Page — Professional Report
   ============================================ */

const MatchingPage = (() => {

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Kundali Matching' }
                ])}

                ${Components.sectionHeader(
                    'Ashtakoot Kundali Matching',
                    'Discover marriage compatibility using the advanced 36-point Guna Milan system with detailed interpretations, dosha analysis, and remedies.',
                    { h1: true }
                )}

                <div class="grid-2">
                    <!-- Boy's Details -->
                    <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
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
                    <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
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

                <!-- Full Report Section -->
                <div id="matchResult" style="display: none; margin-top: var(--space-8);"></div>
            </div>
        `;
    }

    function afterRender() {
        if (typeof CityAPI !== 'undefined') {
            CityAPI.initCityAutocomplete('boy-city', 'boy-city-results');
            CityAPI.initCityAutocomplete('girl-city', 'girl-city-results');
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

    function resolveCityObj(inputId, dateVal, timeVal) {
        const el = document.getElementById(inputId);
        const name = el.value;
        if (el.dataset.lat) {
            return {
                name, lat: parseFloat(el.dataset.lat), lon: parseFloat(el.dataset.lon),
                tz: typeof CityAPI !== 'undefined' ? CityAPI.getTzOffset(el.dataset.tzStr, `${dateVal}T${timeVal}:00`) : 5.5
            };
        }
        return typeof CityDatabase !== 'undefined' ? CityDatabase.find(c => c.name.toLowerCase() === name.toLowerCase()) : null;
    }

    function generateMatch() {
        if (typeof AstroCalc === 'undefined' || typeof MatchCalc === 'undefined') return;

        const bName = document.getElementById('boy-name').value || 'Boy';
        const bDate = document.getElementById('boy-date').value;
        const bTime = document.getElementById('boy-time').value;
        const gName = document.getElementById('girl-name').value || 'Girl';
        const gDate = document.getElementById('girl-date').value;
        const gTime = document.getElementById('girl-time').value;

        if (!bDate || !bTime || !gDate || !gTime) {
            Components.showToast('Please fill all birth details for both individuals', 'error');
            return;
        }

        const bCityObj = resolveCityObj('boy-city', bDate, bTime);
        const gCityObj = resolveCityObj('girl-city', gDate, gTime);
        if (!bCityObj || !gCityObj) { Components.showToast('Please select valid cities from the dropdown', 'error'); return; }

        try {
            const bChart = AstroCalc.generateKundali(bDate, bTime, bCityObj);
            const gChart = AstroCalc.generateKundali(gDate, gTime, gCityObj);
            const bMoon = bChart.planets.find(p => p.id === 'Moon');
            const gMoon = gChart.planets.find(p => p.id === 'Moon');
            if (!bMoon || !gMoon) throw new Error("Could not calculate Moon positions");

            const boy = { rashi: bMoon.rashi, nakshatra: bMoon.nakshatraIndex };
            const girl = { rashi: gMoon.rashi, nakshatra: gMoon.nakshatraIndex };
            const result = MatchCalc.calculateGunaMilan(boy, girl, bChart, gChart);

            renderFullReport(bName, gName, bDate, bTime, gDate, gTime, bCityObj, gCityObj, bChart, gChart, result);
        } catch (e) {
            console.error(e);
            Components.showToast('Error calculating match. Please check inputs.', 'error');
        }
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

    function renderManglikCard(manglik, personName) {
        const color = manglik.isManglik ? (manglik.cancelled ? '#f1c40f' : '#e74c3c') : '#2ecc71';
        const icon = manglik.isManglik ? (manglik.cancelled ? '⚠️' : '🔴') : '✅';
        return `<div style="background:rgba(${manglik.isManglik ? '163,38,38' : '46,92,58'},0.1); border:1px solid rgba(${manglik.isManglik ? '163,38,38' : '46,92,58'},0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4);">
            <div style="font-weight:bold; font-size:var(--text-lg); margin-bottom:var(--space-2); color:${color};">${icon} ${personName} — ${manglik.isManglik ? 'Manglik' : 'Non-Manglik'}</div>
            <div style="color:var(--text-secondary); line-height:1.6;">
                <div>Mars in House ${manglik.marsHouseFromLagna} from Lagna, House ${manglik.marsHouseFromMoon} from Moon</div>
                <div>Severity: <strong>${manglik.severity}</strong></div>
                ${manglik.cancellations.length > 0 ? `<div style="margin-top:var(--space-2); color:#f1c40f;">Cancellations Found: ${manglik.cancellations.join(', ')}</div>` : ''}
            </div>
        </div>`;
    }

    function renderFullReport(bName, gName, bDate, bTime, gDate, gTime, bCity, gCity, bChart, gChart, result) {
        const pct = (result.total / 36) * 100;
        const rec = result.recommendation;
        const kootas = ['varna','vashya','tara','yoni','graha','gana','bhakoot','nadi'];
        const now = new Date();

        let html = `<div class="card card-glass" style="padding: var(--space-6);">
            <!-- Export Buttons -->
            <div class="no-print" style="text-align: right; margin-bottom: var(--space-4); display:flex; gap:var(--space-3); justify-content:flex-end;">
                <button class="btn btn-primary" style="padding:var(--space-2) var(--space-5);" onclick="PDFGenerator.generatePDF('matchResult','Kundali_Matching_Report.pdf','Kundali Matching Report')">📥 Download PDF</button>
                <button class="btn btn-outline" onclick="window.print()">🖨️ Print</button>
            </div>

            <!-- ═══════ PAGE 1: TITLE & SUMMARY ═══════ -->
            <div class="report-section print-avoid-break" style="text-align:center; margin-bottom:var(--space-8); padding:var(--space-8) 0; border-bottom:2px solid var(--color-secondary);">
                <div style="font-size:0.9rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:3px; margin-bottom:var(--space-2);">Kashmir Dharma Companion</div>
                <h1 style="color:var(--color-secondary); font-size:2rem; margin-bottom:var(--space-4);">Kundali Matching Report</h1>
                <h2 style="color:var(--text-primary); font-size:1.5rem; margin-bottom:var(--space-2);">${bName} & ${gName}</h2>
                <p style="color:var(--text-muted);">Generated on ${now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} at ${now.toLocaleTimeString('en-IN')}</p>
            </div>

            <!-- Score Gauge -->
            <div style="display:flex; justify-content:center; align-items:center; margin-bottom:var(--space-8); flex-direction:column;">
                <div class="score-gauge-print" style="position:relative; width:200px; height:200px; border-radius:50%; background:conic-gradient(${rec.color} ${pct}%, rgba(255,255,255,0.05) 0); display:flex; justify-content:center; align-items:center; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                    <div style="width:165px; height:165px; border-radius:50%; background:var(--bg-card); display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <div style="font-size:3rem; font-weight:bold; color:var(--text-primary);">${result.total}</div>
                        <div style="color:var(--text-muted); font-size:var(--text-sm);">Out of 36</div>
                    </div>
                </div>
                <div style="margin-top:var(--space-4); font-size:var(--text-xl); font-weight:bold; color:${rec.color};">${rec.emoji} ${rec.level}</div>
            </div>

            <!-- Quick Summary Table -->
            <div class="print-avoid-break" style="margin-bottom:var(--space-8);">
                <table style="width:100%; border-collapse:collapse; margin-bottom:var(--space-4);">
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted); width:40%;">Boy's Moon Sign (Rashi)</td>
                        <td style="padding:var(--space-3); font-weight:bold; color:var(--color-primary);">${result.boyRashiName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">Boy's Nakshatra</td>
                        <td style="padding:var(--space-3); font-weight:bold;">${result.boyNakshatraName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">Girl's Moon Sign (Rashi)</td>
                        <td style="padding:var(--space-3); font-weight:bold; color:var(--color-secondary);">${result.girlRashiName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">Girl's Nakshatra</td>
                        <td style="padding:var(--space-3); font-weight:bold;">${result.girlNakshatraName}</td>
                    </tr>
                    <tr>
                        <td style="padding:var(--space-3); color:var(--text-muted);">Compatibility Verdict</td>
                        <td style="padding:var(--space-3); font-weight:bold; color:${rec.color};">${rec.level}</td>
                    </tr>
                </table>
            </div>

            <!-- ═══════ PAGE 2: BOY'S BIRTH CHART ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-primary); border-bottom:2px solid var(--color-primary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">📋 ${bName}'s Birth Details</h2>
                <table style="width:100%; border-collapse:collapse; margin-bottom:var(--space-6);">
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted); width:30%;">Full Name</td><td style="padding:var(--space-2); font-weight:bold;">${bName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Date of Birth</td><td style="padding:var(--space-2);">${bDate}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Time of Birth</td><td style="padding:var(--space-2);">${bTime}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Place of Birth</td><td style="padding:var(--space-2);">${bCity.name}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Lagna (Ascendant)</td><td style="padding:var(--space-2); font-weight:bold; color:var(--color-primary);">${bChart.lagnaName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Moon Sign (Rashi)</td><td style="padding:var(--space-2); font-weight:bold;">${bChart.moonSign}</td></tr>
                    <tr><td style="padding:var(--space-2); color:var(--text-muted);">Moon Nakshatra</td><td style="padding:var(--space-2); font-weight:bold;">${bChart.moonNakshatra}</td></tr>
                </table>
                <div class="grid-2" style="gap:var(--space-6); margin-bottom:var(--space-6);">
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">${bName}'s Lagna Chart (D1)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(bChart.houses, bChart.lagnaRashi)}</div></div>
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">${bName}'s Navamsa Chart (D9)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(bChart.navamsaHouses, bChart.lagnaNavamsaRashi)}</div></div>
                </div>
                <h3 style="margin-bottom:var(--space-3); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2);">${bName}'s Planetary Positions</h3>
                ${renderPlanetTable(bChart)}
                <div style="margin-top:var(--space-6);">${renderManglikCard(result.boyManglik, bName)}</div>
            </div>

            <!-- ═══════ PAGE 3: GIRL'S BIRTH CHART ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">📋 ${gName}'s Birth Details</h2>
                <table style="width:100%; border-collapse:collapse; margin-bottom:var(--space-6);">
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted); width:30%;">Full Name</td><td style="padding:var(--space-2); font-weight:bold;">${gName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Date of Birth</td><td style="padding:var(--space-2);">${gDate}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Time of Birth</td><td style="padding:var(--space-2);">${gTime}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Place of Birth</td><td style="padding:var(--space-2);">${gCity.name}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Lagna (Ascendant)</td><td style="padding:var(--space-2); font-weight:bold; color:var(--color-secondary);">${gChart.lagnaName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Moon Sign (Rashi)</td><td style="padding:var(--space-2); font-weight:bold;">${gChart.moonSign}</td></tr>
                    <tr><td style="padding:var(--space-2); color:var(--text-muted);">Moon Nakshatra</td><td style="padding:var(--space-2); font-weight:bold;">${gChart.moonNakshatra}</td></tr>
                </table>
                <div class="grid-2" style="gap:var(--space-6); margin-bottom:var(--space-6);">
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">${gName}'s Lagna Chart (D1)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(gChart.houses, gChart.lagnaRashi)}</div></div>
                    <div class="print-avoid-break"><h3 style="text-align:center; margin-bottom:var(--space-3);">${gName}'s Navamsa Chart (D9)</h3><div style="max-width:350px; margin:0 auto;">${drawChartSVG(gChart.navamsaHouses, gChart.lagnaNavamsaRashi)}</div></div>
                </div>
                <h3 style="margin-bottom:var(--space-3); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2);">${gName}'s Planetary Positions</h3>
                ${renderPlanetTable(gChart)}
                <div style="margin-top:var(--space-6);">${renderManglikCard(result.girlManglik, gName)}</div>
            </div>

            <!-- ═══════ PAGES 4-5: ASHTAKOOT SUMMARY TABLE ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🔯 Ashtakoot Guna Milan — Detailed Analysis</h2>
                
                <!-- Summary Table -->
                <table style="width:100%; border-collapse:collapse; margin-bottom:var(--space-8);">
                    <thead><tr style="border-bottom:2px solid var(--color-secondary);">
                        <th style="padding:var(--space-3); text-align:left;">Koota</th>
                        <th style="padding:var(--space-3); text-align:left;">Aspect</th>
                        <th style="padding:var(--space-3); text-align:center;">Boy</th>
                        <th style="padding:var(--space-3); text-align:center;">Girl</th>
                        <th style="padding:var(--space-3); text-align:center;">Score</th>
                        <th style="padding:var(--space-3); text-align:center;">Max</th>
                    </tr></thead>
                    <tbody>
                    ${kootas.map(k => {
                        const d = result[k];
                        const clr = d.scored === 0 ? 'var(--error-color, #e74c3c)' : (d.scored === d.max ? 'var(--success-color, #2ecc71)' : 'var(--color-primary)');
                        return `<tr style="border-bottom:1px solid var(--surface-border);">
                            <td style="padding:var(--space-3); font-weight:bold;">${d.name} <span style="font-size:0.8em; color:var(--text-muted);">(${d.nameHindi})</span></td>
                            <td style="padding:var(--space-3); font-size:var(--text-sm); color:var(--text-muted);">${d.desc}</td>
                            <td style="padding:var(--space-3); text-align:center;">${d.boyValue || '—'}</td>
                            <td style="padding:var(--space-3); text-align:center;">${d.girlValue || '—'}</td>
                            <td style="padding:var(--space-3); text-align:center; font-weight:bold; color:${clr}; font-size:1.1em;">${d.scored}</td>
                            <td style="padding:var(--space-3); text-align:center; color:var(--text-muted);">${d.max}</td>
                        </tr>`;
                    }).join('')}
                    <tr style="border-top:2px solid var(--color-secondary); font-weight:bold; font-size:1.1em;">
                        <td colspan="4" style="padding:var(--space-3);">Total Guna Score</td>
                        <td style="padding:var(--space-3); text-align:center; color:${rec.color}; font-size:1.3em;">${result.total}</td>
                        <td style="padding:var(--space-3); text-align:center;">36</td>
                    </tr>
                    </tbody>
                </table>

                <!-- Detailed Interpretation for Each Koota -->
                ${kootas.map(k => {
                    const d = result[k];
                    const barPct = (d.scored / d.max) * 100;
                    const clr = d.scored === 0 ? '#e74c3c' : (d.scored === d.max ? '#2ecc71' : '#c9a959');
                    return `
                    <div class="koota-card-print print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-5); margin-bottom:var(--space-5); border-left:4px solid ${clr};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
                            <div>
                                <span style="font-weight:bold; font-size:1.1em; color:var(--text-primary);">${d.name}</span>
                                <span style="color:var(--text-muted); margin-left:var(--space-2);">(${d.nameHindi})</span>
                                <span style="color:var(--text-muted); margin-left:var(--space-2); font-size:var(--text-sm);">— ${d.desc}</span>
                            </div>
                            <div style="font-size:1.4em; font-weight:bold; color:${clr};">${d.scored} <span style="font-size:0.6em; color:var(--text-muted); font-weight:normal;">/ ${d.max}</span></div>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); border-radius:var(--radius-full); height:8px; margin-bottom:var(--space-3); overflow:hidden;">
                            <div style="width:${barPct}%; height:100%; background:${clr}; border-radius:var(--radius-full); transition:width 0.6s;"></div>
                        </div>
                        <p style="color:var(--text-secondary); line-height:1.7; font-size:var(--text-sm);">${d.interpretation}</p>
                    </div>`;
                }).join('')}
            </div>

            <!-- ═══════ PAGE 8: DOSHA ANALYSIS ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">⚠️ Dosha Analysis</h2>
                
                <h3 style="margin-bottom:var(--space-4);">Manglik Dosha Cross-Analysis</h3>
                ${renderManglikCard(result.boyManglik, bName)}
                ${renderManglikCard(result.girlManglik, gName)}
                <div style="background:rgba(201,169,89,0.1); border:1px solid rgba(201,169,89,0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-6);">
                    <div style="font-weight:bold; margin-bottom:var(--space-2); color:var(--color-secondary);">Manglik Cross-Compatibility</div>
                    <p style="color:var(--text-secondary); line-height:1.6;">${rec.manglikNote}</p>
                </div>

                ${result.bhakoot.scored === 0 ? `<div class="dosha-card-print" style="background:rgba(163,38,38,0.1); border:1px solid rgba(163,38,38,0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4);">
                    <div style="font-weight:bold; margin-bottom:var(--space-2); color:#e74c3c;">🔴 Bhakoot Dosha Present</div>
                    <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${result.bhakoot.interpretation}</p>
                </div>` : ''}

                ${result.nadi.scored === 0 ? `<div class="dosha-card-print" style="background:rgba(163,38,38,0.1); border:1px solid rgba(163,38,38,0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4);">
                    <div style="font-weight:bold; margin-bottom:var(--space-2); color:#e74c3c;">🔴 Nadi Dosha Present</div>
                    <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${result.nadi.interpretation}</p>
                </div>` : ''}

                ${result.bhakoot.scored === 7 && result.nadi.scored === 8 ? `<div style="background:rgba(46,204,113,0.1); border:1px solid rgba(46,204,113,0.3); border-radius:var(--radius-md); padding:var(--space-4);">
                    <div style="font-weight:bold; color:#2ecc71;">✅ No Major Doshas Found</div>
                    <p style="color:var(--text-secondary); margin-top:var(--space-2);">The horoscopes are free from Bhakoot Dosha and Nadi Dosha. This is a very positive indicator for the marriage.</p>
                </div>` : ''}
            </div>

            <!-- ═══════ PAGE 6: DASHA TIMING COMPATIBILITY ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">⏰ Dasha Timing Compatibility</h2>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:var(--space-4);">The Vimshottari Dasha system determines the planetary periods currently active for both individuals. Timing of marriage is considered auspicious when both partners are running compatible Dasha periods.</p>
                ${result.dashaAnalysis && result.dashaAnalysis.available ? `
                    <div class="grid-2" style="margin-bottom:var(--space-6);">
                        <div style="background:rgba(255,255,255,0.03); padding:var(--space-4); border-radius:var(--radius-md); border:1px solid var(--surface-border);">
                            <div style="color:var(--text-muted); font-size:var(--text-xs); text-transform:uppercase; margin-bottom:4px;">${bName}'s Current Dasha</div>
                            <div style="font-size:var(--text-lg); font-weight:bold; color:var(--color-primary);">${result.dashaAnalysis.boyDasha.mahadasha} - ${result.dashaAnalysis.boyDasha.antardasha}</div>
                            <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:2px;">Mahadasha: ${result.dashaAnalysis.boyDasha.mdStart} to ${result.dashaAnalysis.boyDasha.mdEnd}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.03); padding:var(--space-4); border-radius:var(--radius-md); border:1px solid var(--surface-border);">
                            <div style="color:var(--text-muted); font-size:var(--text-xs); text-transform:uppercase; margin-bottom:4px;">${gName}'s Current Dasha</div>
                            <div style="font-size:var(--text-lg); font-weight:bold; color:var(--color-secondary);">${result.dashaAnalysis.girlDasha.mahadasha} - ${result.dashaAnalysis.girlDasha.antardasha}</div>
                            <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:2px;">Mahadasha: ${result.dashaAnalysis.girlDasha.mdStart} to ${result.dashaAnalysis.girlDasha.mdEnd}</div>
                        </div>
                    </div>
                    <div style="background:rgba(${result.dashaAnalysis.compatibility === 'Excellent' ? '46,204,113' : (result.dashaAnalysis.compatibility === 'Challenging' ? '231,76,60' : '201,169,89')},0.1); border:1px solid rgba(${result.dashaAnalysis.compatibility === 'Excellent' ? '46,204,113' : (result.dashaAnalysis.compatibility === 'Challenging' ? '231,76,60' : '201,169,89')},0.3); border-radius:var(--radius-md); padding:var(--space-5);">
                        <div style="font-weight:bold; color:${result.dashaAnalysis.compatibility === 'Excellent' ? '#2ecc71' : (result.dashaAnalysis.compatibility === 'Challenging' ? '#e74c3c' : 'var(--color-secondary)')}; margin-bottom:var(--space-2);">Dasha Compatibility: ${result.dashaAnalysis.compatibility}</div>
                        <p style="color:var(--text-secondary); line-height:1.7; font-size:var(--text-sm);">${result.dashaAnalysis.interpretation}</p>
                    </div>
                ` : '<p style="color:var(--text-muted);">Dasha data could not be computed. This may be due to incomplete birth time information.</p>'}
            </div>

            <!-- ═══════ PAGE 7: MARRIAGE YOGA ANALYSIS ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">💍 Marriage Yoga Analysis (Personalized)</h2>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:var(--space-6);">Beyond the Ashtakoot system, individual chart analysis of the 7th House Lord, Venus (marriage karaka), and Jupiter provides deep insight into each person's marriage potential.</p>
                
                <h3 style="color:var(--color-primary); margin-bottom:var(--space-4);">${bName}'s Marriage Indicators</h3>
                ${(result.boyMarriageYogas || []).map(y => `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-3); border-left:4px solid var(--color-primary);">
                        <div style="font-weight:bold; color:var(--text-primary); margin-bottom:var(--space-2);">${y.title}</div>
                        <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${y.text}</p>
                    </div>
                `).join('')}

                <h3 style="color:var(--color-secondary); margin-top:var(--space-6); margin-bottom:var(--space-4);">${gName}'s Marriage Indicators</h3>
                ${(result.girlMarriageYogas || []).map(y => `
                    <div class="print-avoid-break" style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-3); border-left:4px solid var(--color-secondary);">
                        <div style="font-weight:bold; color:var(--text-primary); margin-bottom:var(--space-2);">${y.title}</div>
                        <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${y.text}</p>
                    </div>
                `).join('')}
            </div>

            <!-- ═══════ PAGE 7.5: NAVAMSA (D9) CROSS-ANALYSIS ═══════ -->
            ${result.navamsaAnalysis ? `
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">🔯 Navamsa (D9) Marriage Compatibility</h2>
                <div style="background:rgba(201,169,89,0.08); border:1px solid rgba(201,169,89,0.3); border-radius:var(--radius-md); padding:var(--space-5);">
                    <p style="color:var(--text-secondary); line-height:1.7; font-size:var(--text-sm); white-space:pre-line;">${result.navamsaAnalysis}</p>
                </div>
            </div>
            ` : ''}

            <!-- ═══════ PAGE 9: RECOMMENDATIONS & REMEDIES ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-8);">
                <h2 class="report-section-title" style="color:var(--color-secondary); border-bottom:2px solid var(--color-secondary); padding-bottom:var(--space-2); margin-bottom:var(--space-6);">📿 Recommendations & Remedies</h2>
                
                <div style="margin-bottom:var(--space-6);">
                    <h3 style="color:#2ecc71; margin-bottom:var(--space-3);">✅ Areas of Strength</h3>
                    ${rec.strengths.length > 0 ? `<ul style="list-style:none; padding:0;">
                        ${rec.strengths.map(s => `<li style="padding:var(--space-2) 0; border-bottom:1px solid rgba(255,255,255,0.03); color:var(--text-secondary);">✅ ${s}</li>`).join('')}
                    </ul>` : '<p style="color:var(--text-muted);">No specific areas of exceptional strength identified.</p>'}
                </div>

                <div style="margin-bottom:var(--space-6);">
                    <h3 style="color:#e74c3c; margin-bottom:var(--space-3);">⚠️ Areas of Concern</h3>
                    ${rec.concerns.length > 0 ? `<ul style="list-style:none; padding:0;">
                        ${rec.concerns.map(c => `<li style="padding:var(--space-2) 0; border-bottom:1px solid rgba(255,255,255,0.03); color:var(--text-secondary);">⚠️ ${c}</li>`).join('')}
                    </ul>` : '<p style="color:var(--text-muted);">No specific areas of concern identified. The match is harmonious.</p>'}
                </div>

                <h3 style="margin-bottom:var(--space-4);">Recommended Remedies</h3>
                ${rec.remedies.map(r => `
                    <div class="remedy-card-print" style="background:rgba(201,169,89,0.08); border:1px solid rgba(201,169,89,0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4);">
                        <div style="font-weight:bold; color:var(--color-secondary); margin-bottom:var(--space-2);">📿 ${r.name}</div>
                        <p style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-sm);">${r.desc}</p>
                    </div>
                `).join('')}
            </div>

            <!-- ═══════ PAGE 10: DISCLAIMER ═══════ -->
            <div class="print-page-break"></div>
            <div class="report-section" style="margin-bottom:var(--space-4);">
                <h2 class="report-section-title" style="color:var(--text-muted); border-bottom:1px solid var(--surface-border); padding-bottom:var(--space-2); margin-bottom:var(--space-4);">Disclaimer & Notes</h2>
                <div style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:var(--space-5); color:var(--text-muted); font-size:var(--text-sm); line-height:1.8;">
                    <p><strong>1.</strong> This report is generated using the Ashtakoot (8-fold) Guna Milan system based on Vedic Astrology (Jyotish Shastra). All calculations are performed using the Lahiri Ayanamsa.</p>
                    <p style="margin-top:var(--space-2);"><strong>2.</strong> Kundali Matching is one aspect of marriage compatibility assessment. Factors such as mutual understanding, respect, family values, education, and personal temperament also play critical roles in a successful marriage.</p>
                    <p style="margin-top:var(--space-2);"><strong>3.</strong> If the Guna score is below 18, it is generally advised to consult a qualified Vedic Astrologer (Jyotishi) who can analyze additional factors such as Navamsa charts, Dasha compatibility, and specific planetary yogas before making a decision.</p>
                    <p style="margin-top:var(--space-2);"><strong>4.</strong> The accuracy of this report depends on the correctness of the birth details (date, time, and place) provided. Even a few minutes' difference in birth time can alter the Lagna and house placements significantly.</p>
                    <p style="margin-top:var(--space-2);"><strong>5.</strong> Remedies suggested are based on traditional Vedic practices and are meant to be performed under the guidance of a qualified priest or astrologer.</p>
                </div>
                <div style="text-align:center; margin-top:var(--space-6); padding-top:var(--space-4); border-top:1px solid var(--surface-border);">
                    <div style="font-weight:bold; color:var(--color-secondary);">Kashmir Dharma Companion</div>
                    <div style="font-size:var(--text-sm); color:var(--text-muted);">Preserving Kashmiri Pandit Heritage Through Technology</div>
                </div>
            </div>
        </div>`;

        document.getElementById('matchResult').innerHTML = html;
        document.getElementById('matchResult').style.display = 'block';

        setTimeout(() => {
            document.getElementById('matchResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    return { render, afterRender, generateMatch };
})();
