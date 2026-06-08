/* ============================================
   Muhurat Finder Page
   ============================================ */

const MuhuratPage = (() => {
    let muhuratData = null;
    let selectedEvent = null;

    const dayNameHi = {
        'Monday': 'सोमवार', 'Tuesday': 'मंगलवार', 'Wednesday': 'बुधवार',
        'Thursday': 'गुरुवार', 'Friday': 'शुक्रवार', 'Saturday': 'शनिवार', 'Sunday': 'रविवार'
    };
    function tDay(d) {
        return (typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? (dayNameHi[d] || d) : d;
    }

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('muhurat.title', 'Muhurat Finder') : 'Muhurat Finder' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('muhurat.title', 'Muhurat Finder') : 'Muhurat Finder',
                    typeof I18n !== 'undefined' ? I18n.t('muhurat.desc', 'Identify auspicious dates and timings for important life events based on traditional Panchang guidelines') : 'Identify auspicious dates and timings for important life events based on traditional Panchang guidelines',
                    { h1: true }
                )}

                <div id="muhuratContent">
                    <div class="skeleton skeleton-card" style="height: 300px"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        if (typeof CityAPI !== 'undefined') {
            CityAPI.initCityAutocomplete('m-city', 'm-city-results');
        }
        App.loadData('muhurat-data').then(data => {
            muhuratData = data;
            renderContent();
        });
    }

    function onProfileSelect(profileId) {
        if (!profileId) return;
        if (typeof ProfileManager !== 'undefined') {
            const profile = ProfileManager.getProfileById(profileId);
            if (profile && profile.cityName) {
                const cityInput = document.getElementById('m-city');
                if (cityInput) {
                    cityInput.value = profile.cityName;
                    cityInput.dataset.lat = profile.lat;
                    cityInput.dataset.lon = profile.lng;
                    cityInput.dataset.tz = profile.tz;
                    Components.showToast(typeof I18n !== 'undefined' ? I18n.t('profile.loaded_success', 'Profile loaded successfully!') : 'Profile loaded successfully!', 'success');
                }
            }
        }
    }

    function renderContent() {
        if (!muhuratData) return;
        const container = document.getElementById('muhuratContent');
        if (!container) return;

        container.innerHTML = `
            <!-- Personalization & Location -->
            <div class="grid-2 mb-8">
                <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
                    <h3 style="margin-bottom: var(--space-4)">👤 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.personal_profile', 'Personal Profile') : 'Personal Profile'}</h3>
                    <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-4)">
                        ${typeof I18n !== 'undefined' ? I18n.t('muhurat.personal_desc', 'Select a profile to personalize dates using Tara Bala and Chandra Bala (Optional).') : 'Select a profile to personalize dates using Tara Bala and Chandra Bala (Optional).'}
                    </p>
                    ${ProfileManager.renderProfileSelector('muhuratProfile', 'MuhuratPage.onProfileSelect')}
                </div>
                <div class="card card-glass" style="padding: var(--space-6); overflow: visible;">
                    <h3 style="margin-bottom: var(--space-4)">📍 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.exact_location', 'Exact Location') : 'Exact Location'}</h3>
                    <p style="font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-4)">
                        ${typeof I18n !== 'undefined' ? I18n.t('muhurat.location_desc', 'Location is required to calculate accurate Choghadiya and Rahu Kalam.') : 'Location is required to calculate accurate Choghadiya and Rahu Kalam.'}
                    </p>
                    <div class="form-group" style="position: relative; margin-bottom: 0;">
                        <input type="text" class="form-input" id="m-city" placeholder="${typeof I18n !== 'undefined' ? I18n.t('muhurat.search_city', 'Search city (e.g. Srinagar)...') : 'Search city (e.g. Srinagar)...'}" autocomplete="off">
                        <div id="m-city-results" class="autocomplete-results" style="display: none;"></div>
                    </div>
                </div>
            </div>

            <!-- Event Type Selection -->
            <h3 style="margin-bottom: var(--space-4)">${typeof I18n !== 'undefined' ? I18n.t('muhurat.select_event', 'Select Event Type') : 'Select Event Type'}</h3>
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
                    <h3 style="margin-bottom: var(--space-4)">📅 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.select_range', 'Select Date Range') : 'Select Date Range'}</h3>
                    <div class="grid-2" style="max-width: 500px">
                        <div class="form-group">
                            <label class="form-label" for="muhuratStart">${typeof I18n !== 'undefined' ? I18n.t('muhurat.from_date', 'From Date') : 'From Date'}</label>
                            <input type="date" class="form-input" id="muhuratStart" 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="muhuratEnd">${typeof I18n !== 'undefined' ? I18n.t('muhurat.to_date', 'To Date') : 'To Date'}</label>
                            <input type="date" class="form-input" id="muhuratEnd"
                                   value="${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <button class="btn btn-primary mt-4" onclick="MuhuratPage.findMuhurat()">
                        ${typeof I18n !== 'undefined' ? I18n.t('muhurat.find_btn', '🌟 Find Auspicious Dates') : '🌟 Find Auspicious Dates'}
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
                            <h4 style="margin: 0 0 var(--space-2) 0">${typeof I18n !== 'undefined' ? I18n.t('muhurat.scholar_guidance', 'Scholar Guidance Recommended') : 'Scholar Guidance Recommended'}</h4>
                            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
                                ${muhuratData.disclaimer}
                            </p>
                        </div>
                    </div>
                `, { compact: true })}
            </div>

            <!-- General Guidelines -->
            <div class="mt-6">
                <h3 style="margin-bottom: var(--space-4)">📋 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.general_guidelines', 'General Guidelines') : 'General Guidelines'}</h3>
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

        // Show date picker and smooth scroll to it
        const picker = document.getElementById('muhuratDatePicker');
        if (picker) {
            picker.classList.remove('hidden');
            setTimeout(() => {
                picker.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Clear previous results
        const results = document.getElementById('muhuratResults');
        if (results) results.innerHTML = '';
    }

    function findMuhurat() {
        if (!selectedEvent || !muhuratData) return;

        const startInput = document.getElementById('muhuratStart');
        const endInput = document.getElementById('muhuratEnd');
        
        if (!startInput.value || !endInput.value) {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('muhurat.select_both_dates', 'Please select both dates') : 'Please select both dates', 'warning');
            return;
        }

        const startDate = new Date(startInput.value);
        const endDate = new Date(endInput.value);
        
        if (endDate <= startDate) {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('muhurat.end_after_start', 'End date must be after start date') : 'End date must be after start date', 'warning');
            return;
        }

        if ((endDate - startDate) / (1000 * 60 * 60 * 24) > 90) {
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('muhurat.max_range', 'Please select a range of 90 days or less') : 'Please select a range of 90 days or less', 'warning');
            return;
        }

        // Personalization and Location extraction
        const cityName = document.getElementById('m-city')?.value;
        const cityInput = document.getElementById('m-city');
        let cityObj = null;
        if (cityName) {
            if (cityInput.dataset.lat) {
                cityObj = {
                    name: cityName,
                    lat: parseFloat(cityInput.dataset.lat),
                    lon: parseFloat(cityInput.dataset.lon || cityInput.dataset.lng)
                };
            } else if (typeof CityDatabase !== 'undefined') {
                cityObj = CityDatabase.find(c => c.name.toLowerCase() === cityName.toLowerCase());
            }
        }

        const profileId = document.getElementById('muhuratProfile')?.value;
        let userProfile = null;
        if (profileId && typeof ProfileManager !== 'undefined') {
            userProfile = ProfileManager.getProfileById(profileId);
        }

        // Get event-specific recommendations
        const eventRecs = muhuratData.dayRecommendations[selectedEvent];
        const eventInfo = muhuratData.eventTypes.find(e => e.id === selectedEvent);

        // Find auspicious dates using the specific rules
        const auspiciousDates = CalendarCalc.findAuspiciousDates(startDate, endDate, eventRecs, cityObj, userProfile);

        const resultsContainer = document.getElementById('muhuratResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="reveal">
                ${Components.ornamentalDivider('🌟')}
                
                <h2 style="margin-bottom: var(--space-2)">
                    ${eventInfo.icon} ${typeof I18n !== 'undefined' ? I18n.t('muhurat.auspicious_dates_for', 'Auspicious Dates for') : 'Auspicious Dates for'} ${eventInfo.name}
                </h2>
                <p class="text-muted mb-6">
                    ${startDate.toLocaleDateString('en-IN')} — ${endDate.toLocaleDateString('en-IN')}
                    · ${typeof I18n !== 'undefined' ? I18n.t('muhurat.found', 'Found') : 'Found'} ${auspiciousDates.length} ${typeof I18n !== 'undefined' ? I18n.t('muhurat.favorable_dates', 'favorable date(s)') : 'favorable date(s)'}
                </p>

                ${eventRecs ? `
                    ${Components.card(`
                        <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📝 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.traditional_guidance', 'Traditional Guidance') : 'Traditional Guidance'}</h4>
                        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-3)">${eventRecs.notes}</p>
                        <div class="flex gap-4 flex-wrap">
                            <div>
                                <span class="text-muted" style="font-size: var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('muhurat.favorable_days', 'FAVORABLE DAYS') : 'FAVORABLE DAYS'}</span>
                                <div class="tag-group mt-2">
                                    ${eventRecs.goodDays.map(d => `<span class="tag active">${tDay(d)}</span>`).join('')}
                                </div>
                            </div>
                            <div>
                                <span class="text-muted" style="font-size: var(--text-xs)">${typeof I18n !== 'undefined' ? I18n.t('muhurat.avoid', 'AVOID') : 'AVOID'}</span>
                                <div class="tag-group mt-2">
                                    ${eventRecs.avoidDays.map(d => `<span class="tag" style="border-color: rgba(139,26,26,0.3); color: var(--color-primary-light)">${tDay(d)}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `, { compact: true })}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${auspiciousDates.length > 0 ? `
                    <div class="flex flex-col gap-4">
                        ${auspiciousDates.slice(0, 15).map((ad, i) => `
                            ${Components.card(`
                                <div class="flex items-center justify-between flex-wrap gap-4">
                                    <div class="flex items-center gap-4">
                                        <div style="text-align: center; min-width: 60px">
                                            <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-secondary)">
                                                ${ad.date.getDate()}
                                            </div>
                                            <div style="font-size: var(--text-xs); color: var(--text-muted)">
                                                ${ad.date.toLocaleDateString((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div style="font-weight: 600; margin-bottom: var(--space-1)">
                                                ${tDay(ad.dayOfWeek)}, ${ad.date.toLocaleDateString((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'hi-IN' : 'en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div style="font-size: var(--text-sm); color: var(--text-secondary)">
                                                ${ad.tithi.name} (${ad.tithi.pakshaIndex === 0 ? ((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'शुक्ल' : 'Shukla') : ((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'कृष्ण' : 'Krishna')}) · ${ad.nakshatra.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end gap-1">
                                        <div class="flex items-center gap-2">
                                            <div style="font-size: var(--text-sm); color: var(--color-secondary); font-weight: 600">
                                                ${Math.round(ad.score)}/${ad.maxScore}
                                            </div>
                                            ${Components.badge(ad.score >= (ad.maxScore * 0.75) ? ((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'अत्यंत अनुकूल' : 'Highly Favorable') : ((typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi') ? 'अनुकूल' : 'Favorable'), ad.score >= (ad.maxScore * 0.75) ? 'accent' : 'secondary')}
                                        </div>
                                        ${ad.personalCompat ? `
                                            <div style="font-size: 10px; color: ${ad.personalCompat.tara.isGood ? 'var(--color-secondary)' : 'var(--text-muted)'}; text-transform: uppercase; font-weight: bold; margin-top: 4px;">
                                                ⭐ ${ad.personalCompat.tara.name}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>

                                <!-- Deep Scholarly Timings (Choghadiya & Rahu Kalam) -->
                                ${ad.rahuKalam && ad.choghadiya ? `
                                    <div class="mt-4 pt-4" style="border-top: 1px solid var(--border-color)">
                                        <h5 style="margin-bottom: var(--space-2); font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase;">${typeof I18n !== 'undefined' ? I18n.t('muhurat.exact_timings', 'Exact Daily Timings') : 'Exact Daily Timings'}</h5>
                                        <div class="flex items-center gap-4 flex-wrap">
                                            <div style="flex: 1; min-width: 200px;">
                                                <div style="display: flex; height: 8px; border-radius: 4px; overflow: hidden;">
                                                    ${ad.choghadiya.map(c => `
                                                        <div style="flex: 1; background: ${c.isGood ? 'var(--color-secondary)' : c.isBad ? 'rgba(239, 68, 68, 0.7)' : 'var(--bg-tertiary)'};" title="${c.name} (${c.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})"></div>
                                                    `).join('')}
                                                </div>
                                                <div class="flex justify-between mt-1" style="font-size: 10px; color: var(--text-muted)">
                                                    <span>${typeof I18n !== 'undefined' ? I18n.t('muhurat.sunrise', 'Sunrise') : 'Sunrise'}</span>
                                                    <span>${typeof I18n !== 'undefined' ? I18n.t('muhurat.sunset', 'Sunset') : 'Sunset'}</span>
                                                </div>
                                            </div>
                                            <div style="font-size: var(--text-xs); background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.2);">
                                                <strong>🚫 ${typeof I18n !== 'undefined' ? I18n.t('muhurat.rahu_kalam', 'Rahu Kalam') : 'Rahu Kalam'}:</strong> ${ad.rahuKalam.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${ad.rahuKalam.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        
                                        <!-- Best Time Windows -->
                                        <div class="mt-3 tag-group">
                                            <span style="font-size: 10px; color: var(--text-muted); margin-right: 4px;">${typeof I18n !== 'undefined' ? I18n.t('muhurat.best_hours', 'Best Hours') : 'Best Hours'}:</span>
                                            ${ad.choghadiya.filter(c => c.isGood).map(c => `
                                                <span class="tag" style="font-size: 10px; padding: 2px 6px; border-color: var(--color-secondary); color: var(--color-secondary)">
                                                    ${c.name}: ${c.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                <div class="mt-3" style="font-size: var(--text-xs)">
                                    ${ad.reasons.map(r => `<div style="padding: 2px 0; color: var(--text-muted)">${r}</div>`).join('')}
                                </div>
                            `, { compact: true, featured: i === 0 })}
                        `).join('')}
                    </div>
                ` : `
                    ${Components.emptyState('📅', 'No highly auspicious dates found', 
                        'Try expanding the date range or consult with a scholar for guidance.')}
                `}
            </div>
        `;

        setTimeout(() => {
            Components.initScrollReveal();
            const y = resultsContainer.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({top: y, behavior: 'smooth'});
        }, 150);
    }

    return { render, afterRender, selectEvent, findMuhurat, onProfileSelect };
})();

window.MuhuratPage = MuhuratPage;
