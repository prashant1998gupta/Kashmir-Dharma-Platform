/* ============================================
   Muhurat Finder Page
   ============================================ */

const MuhuratPage = (() => {
    let muhuratData = null;
    let selectedEvent = null;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Muhurat Finder' }
                ])}

                ${Components.sectionHeader(
                    'Muhurat Finder',
                    'Identify auspicious dates and timings for important life events based on traditional Panchang guidelines',
                    { h1: true }
                )}

                <div id="muhuratContent">
                    <div class="skeleton skeleton-card" style="height: 300px"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        App.loadData('muhurat-data').then(data => {
            muhuratData = data;
            renderContent();
        });
    }

    function renderContent() {
        if (!muhuratData) return;
        const container = document.getElementById('muhuratContent');
        if (!container) return;

        container.innerHTML = `
            <!-- Event Type Selection -->
            <h3 style="margin-bottom: var(--space-4)">Select Event Type</h3>
            <div class="grid-3 mb-8">
                ${muhuratData.eventTypes.map(et => `
                    <div class="card card-interactive shine-effect ${selectedEvent === et.id ? 'card-featured' : ''}" 
                         onclick="MuhuratPage.selectEvent('${et.id}')"
                         id="event-${et.id}">
                        <div class="flex items-center gap-3">
                            <span style="font-size: 2rem">${et.icon}</span>
                            <div>
                                <h4 style="margin: 0; font-size: var(--text-base)">${et.name}</h4>
                                <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0">${et.description}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Date Range Picker (shown after event selection) -->
            <div id="muhuratDatePicker" class="${selectedEvent ? '' : 'hidden'}">
                ${Components.card(`
                    <h3 style="margin-bottom: var(--space-4)">📅 Select Date Range</h3>
                    <div class="grid-2" style="max-width: 500px">
                        <div class="form-group">
                            <label class="form-label" for="muhuratStart">From Date</label>
                            <input type="date" class="form-input" id="muhuratStart" 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="muhuratEnd">To Date</label>
                            <input type="date" class="form-input" id="muhuratEnd"
                                   value="${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <button class="btn btn-primary mt-4" onclick="MuhuratPage.findMuhurat()">
                        🌟 Find Auspicious Dates
                    </button>
                `, { glass: true })}
            </div>

            <!-- Results -->
            <div id="muhuratResults" class="mt-8"></div>

            <!-- Disclaimer -->
            <div class="mt-8">
                ${Components.card(`
                    <div class="flex items-center gap-3">
                        <span style="font-size: 2rem">🙏</span>
                        <div>
                            <h4 style="margin: 0 0 var(--space-2) 0">Scholar Guidance Recommended</h4>
                            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
                                ${muhuratData.disclaimer}
                            </p>
                        </div>
                    </div>
                `, { compact: true })}
            </div>

            <!-- General Guidelines -->
            <div class="mt-6">
                <h3 style="margin-bottom: var(--space-4)">📋 General Guidelines</h3>
                ${Components.card(`
                    <ul style="list-style: none">
                        ${muhuratData.generalGuidelines.map(g => `
                            <li style="padding: var(--space-2) 0; color: var(--text-secondary); font-size: var(--text-sm)">
                                ✦ ${g}
                            </li>
                        `).join('')}
                    </ul>
                `)}
            </div>
        `;
    }

    function selectEvent(eventId) {
        selectedEvent = eventId;
        
        // Update card styles
        document.querySelectorAll('[id^="event-"]').forEach(el => {
            el.classList.remove('card-featured');
        });
        const selected = document.getElementById(`event-${eventId}`);
        if (selected) selected.classList.add('card-featured');

        // Show date picker
        const picker = document.getElementById('muhuratDatePicker');
        if (picker) picker.classList.remove('hidden');

        // Clear previous results
        const results = document.getElementById('muhuratResults');
        if (results) results.innerHTML = '';
    }

    function findMuhurat() {
        if (!selectedEvent || !muhuratData) return;

        const startInput = document.getElementById('muhuratStart');
        const endInput = document.getElementById('muhuratEnd');
        
        if (!startInput.value || !endInput.value) {
            Components.showToast('Please select both dates', 'warning');
            return;
        }

        const startDate = new Date(startInput.value);
        const endDate = new Date(endInput.value);
        
        if (endDate <= startDate) {
            Components.showToast('End date must be after start date', 'warning');
            return;
        }

        if ((endDate - startDate) / (1000 * 60 * 60 * 24) > 90) {
            Components.showToast('Please select a range of 90 days or less', 'warning');
            return;
        }

        // Find auspicious dates
        const auspiciousDates = CalendarCalc.findAuspiciousDates(startDate, endDate, selectedEvent);
        
        // Get event-specific recommendations
        const eventRecs = muhuratData.dayRecommendations[selectedEvent];
        const eventInfo = muhuratData.eventTypes.find(e => e.id === selectedEvent);

        const resultsContainer = document.getElementById('muhuratResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="reveal">
                ${Components.ornamentalDivider('🌟')}
                
                <h2 style="margin-bottom: var(--space-2)">
                    ${eventInfo.icon} Auspicious Dates for ${eventInfo.name}
                </h2>
                <p class="text-muted mb-6">
                    ${startDate.toLocaleDateString('en-IN')} — ${endDate.toLocaleDateString('en-IN')}
                    · Found ${auspiciousDates.length} favorable date(s)
                </p>

                ${eventRecs ? `
                    ${Components.card(`
                        <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📝 Traditional Guidance</h4>
                        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-3)">${eventRecs.notes}</p>
                        <div class="flex gap-4 flex-wrap">
                            <div>
                                <span class="text-muted" style="font-size: var(--text-xs)">FAVORABLE DAYS</span>
                                <div class="tag-group mt-2">
                                    ${eventRecs.goodDays.map(d => `<span class="tag active">${d}</span>`).join('')}
                                </div>
                            </div>
                            <div>
                                <span class="text-muted" style="font-size: var(--text-xs)">AVOID</span>
                                <div class="tag-group mt-2">
                                    ${eventRecs.avoidDays.map(d => `<span class="tag" style="border-color: rgba(139,26,26,0.3); color: var(--color-primary-light)">${d}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `, { compact: true })}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${auspiciousDates.length > 0 ? `
                    <div class="flex flex-col gap-4">
                        ${auspiciousDates.slice(0, 15).map((ad, i) => Components.card(`
                            <div class="flex items-center justify-between flex-wrap gap-4">
                                <div class="flex items-center gap-4">
                                    <div style="text-align: center; min-width: 60px">
                                        <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-secondary)">
                                            ${ad.date.getDate()}
                                        </div>
                                        <div style="font-size: var(--text-xs); color: var(--text-muted)">
                                            ${ad.date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: var(--space-1)">
                                            ${ad.dayOfWeek}, ${ad.date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div style="font-size: var(--text-sm); color: var(--text-secondary)">
                                            ${ad.tithi.name} (${ad.tithi.pakshaIndex === 0 ? 'Shukla' : 'Krishna'}) · ${ad.nakshatra.name}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div style="font-size: var(--text-sm); color: var(--color-secondary); font-weight: 600">
                                        ${ad.score}/${ad.maxScore}
                                    </div>
                                    ${Components.badge(ad.score >= 7 ? 'Highly Favorable' : 'Favorable', ad.score >= 7 ? 'accent' : 'secondary')}
                                </div>
                            </div>
                            <div class="mt-3" style="font-size: var(--text-xs)">
                                ${ad.reasons.map(r => `<div style="padding: 2px 0; color: var(--text-muted)">${r}</div>`).join('')}
                            </div>
                        `, { compact: true, featured: i === 0 })).join('')}
                    </div>
                ` : `
                    ${Components.emptyState('📅', 'No highly auspicious dates found', 
                        'Try expanding the date range or consult with a scholar for guidance.')}
                `}
            </div>
        `;

        setTimeout(() => Components.initScrollReveal(), 100);
    }

    return { render, afterRender, selectEvent, findMuhurat };
})();
