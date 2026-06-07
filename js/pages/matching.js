/* ============================================
   Kundali Matching Page — Professional Report
   ============================================ */

const MatchingPage = (() => {
    const PREMIUM_PRODUCT = {
        name: 'Professional Kundali Matching PDF',
        priceLabel: '₹299',
        altPriceLabel: '$5',
        storageKey: 'kdp_paid_match_unlocks',
        funnelKey: 'kdp_paid_match_funnel_events',
        paymentUrl: '', // Add your Razorpay/Paddle payment link here when ready to launch.
        whatsappNumber: '', // Optional, digits only with country code. Example: 919876543210
        upiId: '', // Optional fallback for manual UPI collection.
        supportEmail: ''
    };

    let currentReport = null;

    function t(key, fallback) {
        return typeof I18n !== 'undefined' ? I18n.t(key, fallback) : fallback;
    }

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('match.title', 'Kundali Matching') : 'Kundali Matching' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('match.header', 'Ashtakoot Kundali Matching') : 'Ashtakoot Kundali Matching',
                    typeof I18n !== 'undefined' ? I18n.t('match.desc', 'Discover marriage compatibility using the advanced 36-point Guna Milan system with detailed interpretations, dosha analysis, and remedies.') : 'Discover marriage compatibility using the advanced 36-point Guna Milan system with detailed interpretations, dosha analysis, and remedies.',
                    { h1: true }
                )}

                <div class="card card-glass no-print" style="padding: var(--space-6); margin-bottom: var(--space-8); border: 1px solid rgba(212,175,55,0.35);">
                    <div class="grid-2" style="gap: var(--space-6); align-items: center;">
                        <div>
                            <div style="color: var(--color-secondary); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: var(--text-xs); margin-bottom: var(--space-2);">${t('match.paid_badge', 'Founding paid report test')}</div>
                            <h2 style="font-family: var(--font-heading); color: var(--text-heading); margin-bottom: var(--space-3);">${t('match.paid_headline', 'Sell one clean compatibility PDF first')}</h2>
                            <p style="color: var(--text-secondary); line-height: 1.7; margin: 0;">${t('match.paid_desc', 'Users get the compatibility score preview free. The detailed 10-section PDF unlocks after payment so you can test whether strangers will pay before building subscriptions or a marketplace.')}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: var(--space-5);">
                            <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 4px;">${t('match.launch_price', 'Launch price')}</div>
                            <div style="font-size: 2rem; font-weight: 800; color: var(--color-secondary); line-height: 1;">${PREMIUM_PRODUCT.priceLabel}</div>
                            <div style="color: var(--text-muted); font-size: var(--text-sm); margin-top: 4px;">${t('match.diaspora_price', 'or {price} for diaspora buyers').replace('{price}', PREMIUM_PRODUCT.altPriceLabel)}</div>
                            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-4);">
                                <span class="badge badge-primary">${t('match.pdf_ready', 'PDF-ready')}</span>
                                <span class="badge badge-secondary">${t('match.manual_unlock_mvp', 'Manual unlock MVP')}</span>
                                <span class="badge badge-secondary">${t('match.no_backend_yet', 'No backend yet')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid-2">
                    <!-- Boy's Details -->
                    <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
                        <h3 style="color: var(--color-primary); margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('match.boy_details', "Boy's Details") : "Boy's Details"}</h3>
                        <div class="form-group">
                            <label class="form-label" for="boy-name">${typeof I18n !== 'undefined' ? I18n.t('match.name', 'Name') : 'Name'}</label>
                            <input type="text" id="boy-name" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('match.enter_name', 'Enter name') : 'Enter name'}">
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label class="form-label" for="boy-date">${typeof I18n !== 'undefined' ? I18n.t('match.dob', 'Date of Birth') : 'Date of Birth'}</label>
                                <input type="date" id="boy-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="boy-time">${typeof I18n !== 'undefined' ? I18n.t('match.tob', 'Time of Birth') : 'Time of Birth'}</label>
                                <input type="time" id="boy-time" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="boy-city">${typeof I18n !== 'undefined' ? I18n.t('match.city', 'City of Birth') : 'City of Birth'}</label>
                            <input type="text" id="boy-city" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('match.search_city', 'Search global cities...') : 'Search global cities...'}" autocomplete="off">
                            <ul id="boy-city-results"></ul>
                        </div>
                    </div>

                    <!-- Girl's Details -->
                    <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
                        <h3 style="color: var(--color-secondary); margin-bottom: var(--space-4); border-bottom: 1px solid var(--surface-border); padding-bottom: var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('match.girl_details', "Girl's Details") : "Girl's Details"}</h3>
                        <div class="form-group">
                            <label class="form-label" for="girl-name">${typeof I18n !== 'undefined' ? I18n.t('match.name', 'Name') : 'Name'}</label>
                            <input type="text" id="girl-name" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('match.enter_name', 'Enter name') : 'Enter name'}">
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label class="form-label" for="girl-date">${typeof I18n !== 'undefined' ? I18n.t('match.dob', 'Date of Birth') : 'Date of Birth'}</label>
                                <input type="date" id="girl-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="girl-time">${typeof I18n !== 'undefined' ? I18n.t('match.tob', 'Time of Birth') : 'Time of Birth'}</label>
                                <input type="time" id="girl-time" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="girl-city">${typeof I18n !== 'undefined' ? I18n.t('match.city', 'City of Birth') : 'City of Birth'}</label>
                            <input type="text" id="girl-city" class="form-control" placeholder="${typeof I18n !== 'undefined' ? I18n.t('match.search_city', 'Search global cities...') : 'Search global cities...'}" autocomplete="off">
                            <ul id="girl-city-results"></ul>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin: var(--space-8) 0;">
                    <button class="btn btn-primary" style="padding: var(--space-4) var(--space-8); font-size: 1.1rem; border-radius: var(--radius-full);" onclick="MatchingPage.generateMatch()">
                        ${typeof I18n !== 'undefined' ? I18n.t('match.calc_btn', '✨ Calculate Compatibility Match') : '✨ Calculate Compatibility Match'}
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
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('match.missing_details', 'Please fill all birth details for both individuals') : 'Please fill all birth details for both individuals', 'error');
            return;
        }

        const bCityObj = resolveCityObj('boy-city', bDate, bTime);
        const gCityObj = resolveCityObj('girl-city', gDate, gTime);
        if (!bCityObj || !gCityObj) { Components.showToast(typeof I18n !== 'undefined' ? I18n.t('match.invalid_city', 'Please select valid cities from the dropdown') : 'Please select valid cities from the dropdown', 'error'); return; }

        try {
            const bChart = AstroCalc.generateKundali(bDate, bTime, bCityObj);
            const gChart = AstroCalc.generateKundali(gDate, gTime, gCityObj);
            const bMoon = bChart.planets.find(p => p.id === 'Moon');
            const gMoon = gChart.planets.find(p => p.id === 'Moon');
            if (!bMoon || !gMoon) throw new Error("Could not calculate Moon positions");

            const boy = { rashi: bMoon.rashi, nakshatra: bMoon.nakshatraIndex };
            const girl = { rashi: gMoon.rashi, nakshatra: gMoon.nakshatraIndex };
            const result = MatchCalc.calculateGunaMilan(boy, girl, bChart, gChart);

            cacheAndRenderPreview(bName, gName, bDate, bTime, gDate, gTime, bCityObj, gCityObj, bChart, gChart, result);
        } catch (e) {
            console.error(e);
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('match.calc_error', 'Error calculating match. Please check inputs.') : 'Error calculating match. Please check inputs.', 'error');
        }
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    }

    function makeReportId(bName, gName, bDate, gDate) {
        const raw = `${bName}|${gName}|${bDate}|${gDate}`.toLowerCase();
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash) + raw.charCodeAt(i);
            hash |= 0;
        }
        return `KDP-${Math.abs(hash).toString(36).toUpperCase()}`;
    }

    function getPaymentConfig() {
        return {
            paymentUrl: localStorage.getItem('kdp_match_payment_link') || PREMIUM_PRODUCT.paymentUrl,
            whatsappNumber: localStorage.getItem('kdp_sales_whatsapp') || PREMIUM_PRODUCT.whatsappNumber,
            upiId: localStorage.getItem('kdp_sales_upi') || PREMIUM_PRODUCT.upiId,
            supportEmail: localStorage.getItem('kdp_sales_email') || PREMIUM_PRODUCT.supportEmail
        };
    }

    function getUnlockedReports() {
        try {
            return JSON.parse(localStorage.getItem(PREMIUM_PRODUCT.storageKey) || '{}');
        } catch (e) {
            return {};
        }
    }

    function isReportUnlocked(reportId) {
        return !!getUnlockedReports()[reportId];
    }

    function markReportUnlocked(reportId, paymentRef) {
        const unlocked = getUnlockedReports();
        unlocked[reportId] = {
            paymentRef,
            unlockedAt: new Date().toISOString()
        };
        localStorage.setItem(PREMIUM_PRODUCT.storageKey, JSON.stringify(unlocked));
    }

    function recordFunnelEvent(type, details = {}) {
        try {
            const events = JSON.parse(localStorage.getItem(PREMIUM_PRODUCT.funnelKey) || '[]');
            events.push({
                type,
                reportId: currentReport ? currentReport.reportId : null,
                at: new Date().toISOString(),
                details
            });
            localStorage.setItem(PREMIUM_PRODUCT.funnelKey, JSON.stringify(events.slice(-100)));
        } catch (e) {
            console.warn('Could not record monetization event', e);
        }
    }

    function cacheAndRenderPreview(bName, gName, bDate, bTime, gDate, gTime, bCity, gCity, bChart, gChart, result) {
        currentReport = {
            reportId: makeReportId(bName, gName, bDate, gDate),
            bName,
            gName,
            bDate,
            bTime,
            gDate,
            gTime,
            bCity,
            gCity,
            bChart,
            gChart,
            result
        };

        recordFunnelEvent('preview_generated', {
            total: result.total,
            verdict: result.recommendation.level
        });

        if (isReportUnlocked(currentReport.reportId)) {
            renderFullReport(bName, gName, bDate, bTime, gDate, gTime, bCity, gCity, bChart, gChart, result);
            return;
        }

        renderPreviewReport();
    }

    function renderPreviewReport() {
        if (!currentReport) return;

        const { reportId, bName, gName, result } = currentReport;
        const rec = result.recommendation;
        const pct = (result.total / 36) * 100;
        const kootas = ['varna', 'vashya', 'tara', 'yoni', 'graha', 'gana', 'bhakoot', 'nadi'];
        const concerns = rec.concerns.length > 0 ? rec.concerns.slice(0, 2) : [t('match.no_preview_concern', 'No major concern surfaced in the free preview.')];
        const strengths = rec.strengths.length > 0 ? rec.strengths.slice(0, 2) : [t('match.preview_strength_default', 'The charts show workable compatibility indicators.')];

        const html = `<div class="card card-glass" style="padding: var(--space-6);">
            <div class="no-print" style="display:flex; justify-content:space-between; gap:var(--space-4); align-items:flex-start; margin-bottom:var(--space-6); flex-wrap:wrap;">
                <div>
                    <div style="color:var(--color-secondary); font-size:var(--text-xs); text-transform:uppercase; letter-spacing:2px; font-weight:700; margin-bottom:var(--space-2);">${t('match.free_preview', 'Free preview')}</div>
                    <h2 style="margin:0 0 var(--space-2) 0; color:var(--text-heading);">${t('match.preview_for', 'Kundali Match Preview for')} ${escapeHtml(bName)} & ${escapeHtml(gName)}</h2>
                    <div style="color:var(--text-muted); font-size:var(--text-sm);">${t('match.report_id', 'Report ID')}: ${reportId}</div>
                </div>
                <button class="btn btn-primary" style="padding:var(--space-3) var(--space-5);" onclick="MatchingPage.openPaymentModal()">${t('match.unlock_full_pdf_price', 'Unlock Full PDF - {price}').replace('{price}', PREMIUM_PRODUCT.priceLabel)}</button>
            </div>

            <div class="grid-2" style="gap:var(--space-6); align-items:center; margin-bottom:var(--space-8);">
                <div style="display:flex; justify-content:center;">
                    <div style="position:relative; width:190px; height:190px; border-radius:50%; background:conic-gradient(${rec.color} ${pct}%, rgba(255,255,255,0.06) 0); display:flex; justify-content:center; align-items:center; box-shadow:0 12px 34px rgba(0,0,0,0.35);">
                        <div style="width:154px; height:154px; border-radius:50%; background:var(--bg-card); display:flex; flex-direction:column; justify-content:center; align-items:center;">
                            <span style="font-size:3rem; font-weight:bold; color:var(--text-primary); line-height:1;">${result.total}</span>
                            <span style="font-size:1rem; color:var(--text-muted);">${t('match.out_of_36', 'out of 36')}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div style="font-size:var(--text-xl); font-weight:800; color:${rec.color}; margin-bottom:var(--space-3);">${rec.emoji} ${rec.level}</div>
                    <p style="color:var(--text-secondary); line-height:1.7;">${t('match.preview_paid_desc', 'This free preview gives the headline compatibility signal. The paid PDF includes the detailed Koota interpretation, D1/D9 charts, Manglik analysis, Dasha timing, marriage yogas, Navamsa cross-analysis, remedies, and print-ready formatting.')}</p>
                    <div style="display:flex; flex-wrap:wrap; gap:var(--space-3); margin-top:var(--space-4);">
                        <button class="btn btn-primary" onclick="MatchingPage.openPaymentModal()">${t('match.buy_full_report', 'Buy Full Report')}</button>
                        <button class="btn btn-outline" onclick="MatchingPage.openUnlockModal()">${t('match.already_paid', 'I already paid')}</button>
                    </div>
                </div>
            </div>

            <div class="grid-2" style="gap:var(--space-6); margin-bottom:var(--space-8);">
                <div style="background:rgba(46,204,113,0.08); border:1px solid rgba(46,204,113,0.22); border-radius:var(--radius-md); padding:var(--space-5);">
                    <h3 style="color:#2ecc71; margin-bottom:var(--space-3);">${t('match.strengths_visible', 'Strengths visible now')}</h3>
                    <ul style="margin:0; padding-left:18px; color:var(--text-secondary); line-height:1.7;">
                        ${strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                    </ul>
                </div>
                <div style="background:rgba(201,169,89,0.08); border:1px solid rgba(201,169,89,0.28); border-radius:var(--radius-md); padding:var(--space-5);">
                    <h3 style="color:var(--color-secondary); margin-bottom:var(--space-3);">${t('match.needs_deeper_analysis', 'Needs deeper analysis')}</h3>
                    <ul style="margin:0; padding-left:18px; color:var(--text-secondary); line-height:1.7;">
                        ${concerns.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div style="overflow:auto; margin-bottom:var(--space-8);">
                <table style="width:100%; border-collapse:collapse; min-width:680px;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--color-secondary);">
                            <th style="padding:var(--space-3); text-align:left;">${t('match.koota', 'Koota')}</th>
                            <th style="padding:var(--space-3); text-align:left;">${t('match.aspect', 'Aspect')}</th>
                            <th style="padding:var(--space-3); text-align:center;">${t('match.score', 'Score')}</th>
                            <th style="padding:var(--space-3); text-align:center;">${t('match.max', 'Max')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${kootas.map(k => {
                            const d = result[k];
                            const clr = d.scored === 0 ? '#e74c3c' : (d.scored === d.max ? '#2ecc71' : '#c9a959');
                            return `<tr style="border-bottom:1px solid var(--surface-border);">
                                <td style="padding:var(--space-3); font-weight:bold;">${typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? (d.nameHindi || d.name) : d.name}</td>
                                <td style="padding:var(--space-3); color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.koota_desc_'+d.name.replace(/\\s+/g,''), d.desc) : d.desc}</td>
                                <td style="padding:var(--space-3); text-align:center; color:${clr}; font-weight:bold;">${d.scored}</td>
                                <td style="padding:var(--space-3); text-align:center; color:var(--text-muted);">${d.max}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div style="background:rgba(163,38,38,0.08); border:1px solid rgba(163,38,38,0.25); border-radius:var(--radius-md); padding:var(--space-6); display:flex; gap:var(--space-5); align-items:center; justify-content:space-between; flex-wrap:wrap;">
                <div>
                    <h3 style="margin:0 0 var(--space-2) 0; color:var(--text-heading);">${t('match.locked_pdf_title', 'Locked: full professional PDF')}</h3>
                    <p style="margin:0; color:var(--text-secondary); line-height:1.7;">${t('match.locked_pdf_desc', '10 report sections, printable layout, charts, doshas, timing compatibility, remedies, and disclaimer.')}</p>
                </div>
                <button class="btn btn-primary" style="padding:var(--space-3) var(--space-6);" onclick="MatchingPage.openPaymentModal()">${t('match.unlock_for_price', 'Unlock for {price}').replace('{price}', PREMIUM_PRODUCT.priceLabel)}</button>
            </div>
        </div>`;

        const resultEl = document.getElementById('matchResult');
        resultEl.innerHTML = html;
        resultEl.style.display = 'block';
        setTimeout(() => {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function openPaymentModal() {
        if (!currentReport) {
            Components.showToast(t('match.generate_preview_first', 'Generate a preview first.'), 'error');
            return;
        }

        recordFunnelEvent('checkout_opened');
        const config = getPaymentConfig();
        const whatsappText = encodeURIComponent(`${t('match.whatsapp_buy_text', 'Namaskar, I want to buy the {product} ({price}). Report ID: {id}').replace('{product}', t('match.product_name', PREMIUM_PRODUCT.name)).replace('{price}', PREMIUM_PRODUCT.priceLabel).replace('{id}', currentReport.reportId)}`);
        const whatsappUrl = config.whatsappNumber ? `https://wa.me/${config.whatsappNumber}?text=${whatsappText}` : '';

        Components.openModal(`
            <div style="padding: var(--space-2);">
                <div style="color: var(--color-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: var(--space-2);">${t('match.checkout_mvp', 'Checkout MVP')}</div>
                <h2 style="margin-bottom: var(--space-3);">${t('match.product_name', PREMIUM_PRODUCT.name)}</h2>
                <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-5);">${t('match.pay_to_unlock_desc', 'Pay {price} to unlock the full PDF for report {id}. This validation version supports payment-link checkout plus manual payment reference unlock.').replace('{price}', PREMIUM_PRODUCT.priceLabel).replace('{id}', `<strong>${currentReport.reportId}</strong>`)}</p>
                
                <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-5);">
                    <div style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: 4px;">${t('match.amount', 'Amount')}</div>
                    <div style="font-size: 2rem; font-weight: 800; color: var(--color-secondary);">${PREMIUM_PRODUCT.priceLabel}</div>
                    <div style="font-size: var(--text-sm); color: var(--text-muted);">${t('match.diaspora_test_price', 'Diaspora test price: {price}').replace('{price}', PREMIUM_PRODUCT.altPriceLabel)}</div>
                </div>

                <div style="display:flex; flex-direction:column; gap: var(--space-3); margin-bottom: var(--space-5);">
                    ${config.paymentUrl ? `<button class="btn btn-primary" onclick="MatchingPage.continueToCheckout()">${t('match.continue_payment', 'Continue to secure payment')}</button>` : ''}
                    ${whatsappUrl ? `<a class="btn btn-outline" style="text-align:center; text-decoration:none;" href="${whatsappUrl}" target="_blank" rel="noopener" onclick="MatchingPage.recordPaymentClick('whatsapp')">${t('match.order_whatsapp', 'Order on WhatsApp')}</a>` : ''}
                    ${config.upiId ? `<div style="border:1px dashed var(--surface-border); border-radius:var(--radius-md); padding:var(--space-4); color:var(--text-secondary);">${t('match.upi_id', 'UPI ID')}: <strong style="color:var(--text-primary);">${escapeHtml(config.upiId)}</strong><br><span style="font-size:var(--text-sm); color:var(--text-muted);">${t('match.upi_note', 'Use report ID {id} in notes, then unlock with your UPI reference.').replace('{id}', currentReport.reportId)}</span></div>` : ''}
                    ${!config.paymentUrl && !whatsappUrl && !config.upiId ? `<div style="border:1px solid rgba(231,76,60,0.35); background:rgba(231,76,60,0.08); border-radius:var(--radius-md); padding:var(--space-4); color:var(--text-secondary); line-height:1.7;">${t('match.payment_not_configured', 'Payment is not configured yet. Add a Razorpay/Paddle payment URL in PREMIUM_PRODUCT.paymentUrl inside js/pages/matching.js, or temporarily save one in this browser with localStorage.setItem.')}</div>` : ''}
                </div>

                <div style="display:flex; gap:var(--space-3); flex-wrap:wrap;">
                    <button class="btn btn-outline" onclick="MatchingPage.openUnlockModal()">${t('match.have_paid_unlock', 'I have paid / unlock PDF')}</button>
                    <button class="btn btn-outline" onclick="Components.closeModal()">${t('common.close', 'Close')}</button>
                </div>
            </div>
        `);
    }

    function continueToCheckout() {
        const config = getPaymentConfig();
        if (!config.paymentUrl) {
            Components.showToast(t('match.payment_link_missing', 'Payment link is not configured yet.'), 'error');
            return;
        }

        recordFunnelEvent('checkout_clicked', { method: 'payment_link' });
        window.open(config.paymentUrl, '_blank', 'noopener');
    }

    function recordPaymentClick(method) {
        recordFunnelEvent('checkout_clicked', { method });
    }

    function openUnlockModal() {
        if (!currentReport) {
            Components.showToast(t('match.generate_preview_first', 'Generate a preview first.'), 'error');
            return;
        }

        Components.openModal(`
            <div style="padding: var(--space-2);">
                <div style="color: var(--color-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: var(--space-2);">${t('match.manual_unlock', 'Manual unlock')}</div>
                <h2 style="margin-bottom: var(--space-3);">${t('match.unlock_full_pdf', 'Unlock full PDF')}</h2>
                <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-5);">${t('match.unlock_desc', 'Enter the payment reference after you verify the payment. This is intentionally simple for the first demand test; replace it with payment webhooks after customers prove they pay.')}</p>
                <div class="form-group">
                    <label class="form-label" for="match-payment-ref">${t('match.payment_reference', 'Payment reference / order ID')}</label>
                    <input id="match-payment-ref" class="form-control" placeholder="${t('match.payment_reference_placeholder', 'Example: pay_ABC123 or UPI reference')}">
                </div>
                <div style="display:flex; gap:var(--space-3); flex-wrap:wrap; margin-top:var(--space-4);">
                    <button class="btn btn-primary" onclick="MatchingPage.confirmPaidUnlock()">${t('match.unlock_full_pdf_btn', 'Unlock Full PDF')}</button>
                    <button class="btn btn-outline" onclick="Components.closeModal()">${t('gita.btn_cancel', 'Cancel')}</button>
                </div>
            </div>
        `);
    }

    function confirmPaidUnlock() {
        if (!currentReport) return;

        const refInput = document.getElementById('match-payment-ref');
        const paymentRef = refInput ? refInput.value.trim() : '';
        if (paymentRef.length < 6) {
            Components.showToast(t('match.valid_payment_reference', 'Please enter a valid payment reference.'), 'error');
            return;
        }

        markReportUnlocked(currentReport.reportId, paymentRef);
        recordFunnelEvent('report_unlocked', { paymentRef });
        Components.closeModal();
        renderFullReport(
            currentReport.bName,
            currentReport.gName,
            currentReport.bDate,
            currentReport.bTime,
            currentReport.gDate,
            currentReport.gTime,
            currentReport.bCity,
            currentReport.gCity,
            currentReport.bChart,
            currentReport.gChart,
            currentReport.result
        );
        Components.showToast(t('match.unlocked_success', 'Full PDF unlocked. You can now download or print it.'), 'success');
    }

    function renderPlanetTable(chart) {
        return `<table style="width:100%; text-align:left; border-collapse:collapse; font-size: var(--text-sm);">
            <thead><tr style="border-bottom:2px solid var(--color-secondary);">
                <th style="padding:var(--space-2);">Planet</th><th style="padding:var(--space-2);">Sign</th><th style="padding:var(--space-2);">Degree</th><th style="padding:var(--space-2);">Nakshatra</th><th style="padding:var(--space-2);">Dignity</th>
            </tr></thead><tbody>
            ${chart.planets.map(p => `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:var(--space-2); font-weight:bold; color:var(--color-secondary);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.name) : p.name}</td>
                <td style="padding:var(--space-2);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.rashiName) : p.rashiName}</td>
                <td style="padding:var(--space-2);">${p.degreeStr}</td>
                <td style="padding:var(--space-2);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.nakshatra) : p.nakshatra} (Pada ${p.pada})</td>
                <td style="padding:var(--space-2);">${typeof I18n !== 'undefined' ? I18n.tAstro(p.dignity) : p.dignity}</td>
            </tr>`).join('')}
            </tbody></table>`;
    }

    function renderManglikCard(manglik, personName) {
        let statusText = 'Non-Manglik';
        let color = '#2ecc71';
        let icon = '✅';
        
        if (manglik.isManglik) {
            statusText = 'Manglik';
            color = '#e74c3c';
            icon = '🔴';
        } else if (manglik.cancelled) {
            statusText = 'Cancelled Manglik';
            color = '#f1c40f';
            icon = '⚠️';
        } else if (manglik.isMoonManglik) {
            statusText = 'Chandra Manglik (Mild)';
            color = '#f1c40f';
            icon = '⚠️';
        }
        
        const isBgRed = statusText === 'Manglik';
        const isBgYellow = statusText === 'Cancelled Manglik' || statusText === 'Chandra Manglik (Mild)';
        const bgRgba = isBgRed ? '163,38,38' : (isBgYellow ? '241,196,15' : '46,92,58');
        
        return `<div style="background:rgba(${bgRgba},0.08); border:1px solid rgba(${bgRgba},0.3); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4);">
            <div style="font-weight:bold; font-size:var(--text-lg); margin-bottom:var(--space-2); color:${color};">${icon} ${personName} — ${typeof I18n !== 'undefined' ? I18n.t(`match.status_${statusText.toLowerCase().replace(/[\s\(\)]+/g, '_')}`, statusText) : statusText}</div>
            <div style="color:var(--text-secondary); line-height:1.6; display:flex; flex-direction:column; gap:4px;">
                <div>${typeof I18n !== 'undefined' ? I18n.t('match.mars_in_house', 'Mars in House') : 'Mars in House'} ${manglik.marsHouseFromLagna} ${typeof I18n !== 'undefined' ? I18n.t('match.from_lagna', 'from Lagna, House') : 'from Lagna, House'} ${manglik.marsHouseFromMoon} ${typeof I18n !== 'undefined' ? I18n.t('match.from_moon', 'from Moon') : 'from Moon'}</div>
                <div>${typeof I18n !== 'undefined' ? I18n.t('match.severity', 'Severity:') : 'Severity:'} <strong>${manglik.severity}</strong></div>
                ${manglik.cancellations.length > 0 ? `<div style="margin-top:var(--space-2); color:#f1c40f; font-weight:500;">${typeof I18n !== 'undefined' ? I18n.t('match.cancellations_found', 'Cancellations Found:') : 'Cancellations Found:'} ${manglik.cancellations.join(', ')}</div>` : ''}
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
                <button class="btn btn-primary" style="padding:var(--space-2) var(--space-5);" onclick="PDFGenerator.generatePDF('matchResult','Kundali_Matching_Report.pdf','Kundali Matching Report')">📥 ${typeof I18n !== 'undefined' ? I18n.t('match.download_pdf', 'Download PDF') : 'Download PDF'}</button>
                <button class="btn btn-outline" onclick="PDFGenerator.generatePDF('matchResult','Kundali_Matching_Report.pdf','Kundali Matching Report')">🖨️ ${typeof I18n !== 'undefined' ? I18n.t('match.print', 'Print') : 'Print'}</button>
            </div>

            <!-- ═══════ PAGE 1: TITLE & SUMMARY ═══════ -->
            <div class="report-section print-avoid-break" style="text-align:center; margin-bottom:var(--space-8); padding:var(--space-8) 0; border-bottom:2px solid var(--color-secondary);">
                <div style="font-size:0.9rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:3px; margin-bottom:var(--space-2);">${typeof I18n !== 'undefined' ? I18n.t('match.app_name', 'Kashmir Dharma Companion') : 'Kashmir Dharma Companion'}</div>
                <h1 style="color:var(--color-secondary); font-size:2rem; margin-bottom:var(--space-4);">${typeof I18n !== 'undefined' ? I18n.t('match.report_title', 'Kundali Matching Report') : 'Kundali Matching Report'}</h1>
                <h2 style="color:var(--text-primary); font-size:1.5rem; margin-bottom:var(--space-2);">${bName} & ${gName}</h2>
                <p style="color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.generated_on', 'Generated on') : 'Generated on'} ${now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} ${typeof I18n !== 'undefined' ? I18n.t('match.at', 'at') : 'at'} ${now.toLocaleTimeString('en-IN')}</p>
            </div>

            <!-- Score Gauge -->
            <div style="display:flex; justify-content:center; align-items:center; margin-bottom:var(--space-8); flex-direction:column;">
                <div class="score-gauge-print" style="position:relative; width:200px; height:200px; border-radius:50%; background:conic-gradient(${rec.color} ${pct}%, rgba(255,255,255,0.05) 0); display:flex; justify-content:center; align-items:center; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                    <div style="width:165px; height:165px; border-radius:50%; background:var(--bg-card); display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <span style="font-size:3rem; font-weight:bold; color:var(--text-primary); line-height:1;">${result.total}</span>
                        <span style="font-size:1rem; color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.out_of_36', 'out of 36') : 'out of 36'}</span>
                    </div>
                </div>
                <div style="margin-top:var(--space-4); font-size:var(--text-xl); font-weight:bold; color:${rec.color};">${rec.emoji} ${rec.level}</div>
            </div>

            <!-- Premium Compatibility Summary -->
            <div style="background: rgba(212, 175, 55, 0.05); border: 1px solid var(--color-secondary); border-radius: var(--radius-md); padding: var(--space-6); margin-bottom: var(--space-8);">
                <div style="display: flex; justify-content: center; margin-bottom: var(--space-4);">
                    <h3 style="color: var(--color-secondary); border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 2px;">${typeof I18n !== 'undefined' ? I18n.t('match.premium_compatibility_insights', 'Premium Compatibility Insights') : 'Premium Compatibility Insights'}</h3>
                </div>
                <div id="premium-match-text" style="margin-bottom: var(--space-6);">
                    ${typeof AstroInterpretations !== 'undefined' ? AstroInterpretations.getMatchVerdict(result.total) : rec.level}
                </div>
                
                <div style="display: flex; justify-content: center; margin-bottom: var(--space-4);">
                    <h3 style="color: var(--color-secondary); border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: var(--space-2); text-transform: uppercase; letter-spacing: 2px;">${typeof I18n !== 'undefined' ? I18n.t('match.individual_emotional_resonance', 'Individual Emotional Resonance') : 'Individual Emotional Resonance'}</h3>
                </div>
                
                <div style="margin-bottom: var(--space-6);">
                    <strong style="color: var(--color-primary); font-size: var(--text-lg); display: block; border-left: 3px solid var(--color-primary); padding-left: var(--space-2); margin-bottom: var(--space-3);">${bName}'s ${typeof I18n !== 'undefined' ? I18n.t('match.emotional_nature', 'Emotional Nature') : 'Emotional Nature'} (${gChart.moonSign} ${typeof I18n !== 'undefined' ? I18n.t('match.moon', 'Moon') : 'Moon'})</strong>
                    <div style="color: var(--text-secondary); font-size: var(--text-base); line-height: 1.7;">
                        ${typeof AstroInterpretations !== 'undefined' ? (AstroInterpretations.moon[bChart.moonSign] || AstroInterpretations.moon['Unknown']) : ''}
                    </div>
                </div>

                <div>
                    <strong style="color: var(--color-primary); font-size: var(--text-lg); display: block; border-left: 3px solid var(--color-primary); padding-left: var(--space-2); margin-bottom: var(--space-3);">${gName}'s ${typeof I18n !== 'undefined' ? I18n.t('match.emotional_nature', 'Emotional Nature') : 'Emotional Nature'} (${gChart.moonSign} ${typeof I18n !== 'undefined' ? I18n.t('match.moon', 'Moon') : 'Moon'})</strong>
                    <div style="color: var(--text-secondary); font-size: var(--text-base); line-height: 1.7;">
                        ${typeof AstroInterpretations !== 'undefined' ? (AstroInterpretations.moon[gChart.moonSign] || AstroInterpretations.moon['Unknown']) : ''}
                    </div>
                </div>
            </div>

            <!-- Quick Summary Table -->
            <div class="print-avoid-break" style="margin-bottom:var(--space-8);">
                <table style="width:100%; border-collapse:collapse; margin-bottom:var(--space-4);">
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted); width:40%;">${typeof I18n !== 'undefined' ? I18n.t('match.boy_moon_sign', "Boy's Moon Sign (Rashi)") : "Boy's Moon Sign (Rashi)"}</td>
                        <td style="padding:var(--space-3); font-weight:bold; color:var(--color-primary);">${typeof I18n !== 'undefined' ? I18n.tAstro(result.boyRashiName) : result.boyRashiName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.boy_nakshatra', "Boy's Nakshatra") : "Boy's Nakshatra"}</td>
                        <td style="padding:var(--space-3); font-weight:bold;">${typeof I18n !== 'undefined' ? I18n.tAstro(result.boyNakshatraName) : result.boyNakshatraName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.girl_moon_sign', "Girl's Moon Sign (Rashi)") : "Girl's Moon Sign (Rashi)"}</td>
                        <td style="padding:var(--space-3); font-weight:bold; color:var(--color-secondary);">${typeof I18n !== 'undefined' ? I18n.tAstro(result.girlRashiName) : result.girlRashiName}</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--surface-border);">
                        <td style="padding:var(--space-3); color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.girl_nakshatra', "Girl's Nakshatra") : "Girl's Nakshatra"}</td>
                        <td style="padding:var(--space-3); font-weight:bold;">${typeof I18n !== 'undefined' ? I18n.tAstro(result.girlNakshatraName) : result.girlNakshatraName}</td>
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
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Lagna (Ascendant)</td><td style="padding:var(--space-2); font-weight:bold; color:var(--color-primary);">${typeof I18n !== 'undefined' ? I18n.tAstro(bChart.lagnaName) : bChart.lagnaName}</td></tr>
                    <tr style="border-bottom:1px solid var(--surface-border);"><td style="padding:var(--space-2); color:var(--text-muted);">Moon Sign (Rashi)</td><td style="padding:var(--space-2); font-weight:bold;">${typeof I18n !== 'undefined' ? I18n.tAstro(bChart.moonSign) : bChart.moonSign}</td></tr>
                    <tr><td style="padding:var(--space-2); color:var(--text-muted);">Moon Nakshatra</td><td style="padding:var(--space-2); font-weight:bold;">${typeof I18n !== 'undefined' ? I18n.tAstro(bChart.moonNakshatra) : bChart.moonNakshatra}</td></tr>
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
                            <td style="padding:var(--space-3); font-weight:bold;">${typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? (d.nameHindi || d.name) : d.name}</td>
                            <td style="padding:var(--space-3); font-size:var(--text-sm); color:var(--text-muted);">${typeof I18n !== 'undefined' ? I18n.t('match.koota_desc_'+d.name.replace(/\\s+/g,''), d.desc) : d.desc}</td>
                            <td style="padding:var(--space-3); text-align:center;">${d.boyValue ? (typeof I18n !== 'undefined' ? I18n.tAstro(d.boyValue) : d.boyValue) : '—'}</td>
                            <td style="padding:var(--space-3); text-align:center;">${d.girlValue ? (typeof I18n !== 'undefined' ? I18n.tAstro(d.girlValue) : d.girlValue) : '—'}</td>
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
                                <span style="font-weight:bold; font-size:1.1em; color:var(--text-primary);">${typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? (d.nameHindi || d.name) : d.name}</span>
                                ${typeof I18n !== 'undefined' && I18n.getLanguage() !== 'hi' ? `<span style="color:var(--text-muted); margin-left:var(--space-2);">(${d.nameHindi})</span>` : ''}
                                <span style="color:var(--text-muted); margin-left:var(--space-2); font-size:var(--text-sm);">— ${typeof I18n !== 'undefined' ? I18n.t('match.koota_desc_'+d.name.replace(/\\s+/g,''), d.desc) : d.desc}</span>
                            </div>
                            <div style="font-size:1.4em; font-weight:bold; color:${clr};">${d.scored} <span style="font-size:0.6em; color:var(--text-muted); font-weight:normal;">/ ${d.max}</span></div>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); border-radius:var(--radius-full); height:8px; margin-bottom:var(--space-3); overflow:hidden;">
                            <div style="width:${barPct}%; height:100%; background:${clr}; border-radius:var(--radius-full); transition:width 0.6s;"></div>
                        </div>
                        <p style="color:var(--text-secondary); line-height:1.7; font-size:var(--text-sm);">${typeof I18n !== 'undefined' ? I18n.tAstro(d.interpretation) : d.interpretation}</p>
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

    return {
        render,
        afterRender,
        generateMatch,
        openPaymentModal,
        continueToCheckout,
        recordPaymentClick,
        openUnlockModal,
        confirmPaidUnlock
    };
})();
