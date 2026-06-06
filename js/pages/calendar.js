/* ============================================
   Festival Calendar Page
   ============================================ */

const CalendarPage = (() => {
    let festivals = [];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDateStr = null;

    const KASHMIRI_MONTHS = {
        en: {
            'Chaitra': 'Tsithr', 'Vaishakha': 'Vahakh', 'Jyeshtha': 'Zyeth', 'Ashadha': 'Har',
            'Shravana': 'Shravun', 'Bhadrapada': 'Bhedrepeth', 'Ashvina': 'Ashvin', 'Kartika': 'Kartik',
            'Margashirsha': 'Monjhor', 'Pausha': 'Poh', 'Magha': 'Mag', 'Phalguna': 'Phagun'
        },
        hi: {
            'Chaitra': 'त्सिथ्र', 'Vaishakha': 'वहख', 'Jyeshtha': 'ज़ेठ', 'Ashadha': 'हार',
            'Shravana': 'श्रावुन', 'Bhadrapada': 'भाद्रप्यथ', 'Ashvina': 'आश्विन', 'Kartika': 'कार्तिक',
            'Margashirsha': 'मंजहोर', 'Pausha': 'पोह', 'Magha': 'माग', 'Phalguna': 'फागुन'
        }
    };

    const KASHMIRI_TITHIS = {
        en: {
            'Pratipada': 'Okdoh', 'Dwitiya': 'Duyeh', 'Tritiya': 'Triyeh', 'Chaturthi': 'Tsodah',
            'Panchami': 'Panchem', 'Shashthi': 'Sheyam', 'Saptami': 'Satam', 'Ashtami': 'Atham',
            'Navami': 'Navam', 'Dashami': 'Dahim', 'Ekadashi': 'Kah', 'Dwadashi': 'Duvah',
            'Trayodashi': 'Truvah', 'Chaturdashi': 'Tsohda', 'Purnima': 'Punim', 'Amavasya': 'Mavas'
        },
        hi: {
            'Pratipada': 'ओकदोह', 'Dwitiya': 'दुयेह', 'Tritiya': 'त्रियेह', 'Chaturthi': 'त्सोदह',
            'Panchami': 'पंचेम', 'Shashthi': 'शेयम', 'Saptami': 'सतम', 'Ashtami': 'अठम',
            'Navami': 'नवम', 'Dashami': 'दहिम', 'Ekadashi': 'काह', 'Dwadashi': 'दुवाह',
            'Trayodashi': 'त्रुवाह', 'Chaturdashi': 'त्सोहदा', 'Purnima': 'पुनिम', 'Amavasya': 'मावास'
        }
    };

    const FULL_DAYS = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
    };

    function render() {
        const titleText = typeof I18n !== 'undefined' ? I18n.t('calendar.title') : 'Festival Calendar';
        const descText = typeof I18n !== 'undefined' ? I18n.t('calendar.desc') : 'Explore the complete calendar of Kashmiri Pandit festivals, observances, and celebrations';
        const homeText = typeof I18n !== 'undefined' ? I18n.t('nav.home') : 'Home';
        const prevText = typeof I18n !== 'undefined' ? I18n.t('calendar.previous') : 'Previous';
        const nextText = typeof I18n !== 'undefined' ? I18n.t('calendar.next') : 'Next';
        const allFestTitle = typeof I18n !== 'undefined' ? I18n.t('calendar.all_festivals') : 'All Festivals & Observances';
        const allFestDesc = typeof I18n !== 'undefined' ? I18n.t('calendar.all_festivals_desc') : 'Detailed guide to each festival';
        const searchPlaceholder = typeof I18n !== 'undefined' ? I18n.t('calendar.search') : 'Search festivals...';
        
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

                <!-- Calendar Navigation -->
                <div class="flex items-center justify-between mb-6" style="background: var(--bg-card); padding: var(--space-4) var(--space-6); border-radius: var(--radius-full); border: 1px solid var(--surface-border); box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <button class="btn btn-ghost" style="border-radius: var(--radius-full); padding: var(--space-2) var(--space-4);" onclick="CalendarPage.changeMonth(-1)">
                        <span style="font-size: 1.2rem; margin-right: 8px;">←</span> ${prevText}
                    </button>
                    <h3 id="calendarMonthTitle" style="margin: 0; font-family: var(--font-heading); font-size: 1.5rem; letter-spacing: 1px; color: var(--color-secondary);">
                        ${typeof I18n !== 'undefined' ? I18n.t('month.' + currentMonth) : monthNames[currentMonth]} ${currentYear}
                    </h3>
                    <button class="btn btn-ghost" style="border-radius: var(--radius-full); padding: var(--space-2) var(--space-4);" onclick="CalendarPage.changeMonth(1)">
                        ${nextText} <span style="font-size: 1.2rem; margin-left: 8px;">→</span>
                    </button>
                </div>

                <!-- Calendar & Panchang Layout Container -->
                <div class="calendar-layout-container mb-8">
                    <!-- Left: Calendar Month Grid -->
                    <div id="calendarGrid">
                        <div class="skeleton skeleton-card" style="height: 400px"></div>
                    </div>
                    
                    <!-- Right: Daily Panchang Card -->
                    <div id="panchangDetailsPanel">
                        <div class="skeleton skeleton-card" style="height: 400px"></div>
                    </div>
                </div>

                ${Components.ornamentalDivider('🪔')}

                <!-- All Festivals List -->
                ${Components.sectionHeader(allFestTitle, allFestDesc)}
                
                <!-- Search -->
                <div class="mb-6">
                    ${Components.searchBar(searchPlaceholder, 'CalendarPage.filterFestivals')}
                </div>

                <div id="festivalsGrid" class="grid-auto">
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                </div>
            </div>
        `;
    }

    function afterRender() {
        const today = new Date();
        if (!selectedDateStr) {
            selectedDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        App.loadData('festivals').then(data => {
            festivals = data || [];
            renderCalendar();
            renderPanchangDetails(selectedDateStr);
            renderFestivalCards(festivals);
        });
    }

    function renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const titleEl = document.getElementById('calendarMonthTitle');
        if (titleEl) titleEl.textContent = `${typeof I18n !== 'undefined' ? I18n.t('month.' + currentMonth) : monthNames[currentMonth]} ${currentYear}`;

        // Map festivals to calendar events (approximate positioning)
        const events = getCalendarEvents();
        
        const gridEl = document.getElementById('calendarGrid');
        if (gridEl) {
            gridEl.innerHTML = Components.calendarMonth(currentYear, currentMonth, events, selectedDateStr);
        }
    }

    function getCalendarEvents() {
        // Calculate exact Gregorian dates for the currentYear using the math engine
        const festivalRules = {
            'navreh': { month: 'Chaitra', paksha: 0, tithi: 'Pratipada' },
            'herath': { month: 'Phalguna', paksha: 1, tithi: 'Trayodashi' },
            'zyeth-atham': { month: 'Jyeshtha', paksha: 0, tithi: 'Ashtami' },
            'khetsrimavas': { month: 'Jyeshtha', paksha: 1, tithi: 'Amavasya' },
            'pan-festival': { month: 'Bhadrapada', paksha: 0, tithi: 'Chaturthi' },
            'janmashtami': { month: 'Bhadrapada', paksha: 1, tithi: 'Ashtami' },
            'ram-navami': { month: 'Chaitra', paksha: 0, tithi: 'Navami' },
            'sharika-jayanti': { month: 'Ashadha', paksha: 0, tithi: 'Navami' }
        };

        const events = [];
        festivals.forEach(f => {
            const rule = festivalRules[f.id];
            if (rule) {
                // Calculate exact date for currentYear
                const exactDate = CalendarCalc.findFestivalDate(currentYear, rule.month, rule.paksha, rule.tithi);
                
                if (exactDate) {
                    // Also update the festival object so the popup shows the exact date!
                    const locale = typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';
                    f.calculatedDate = exactDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
                    
                    if (exactDate.getMonth() === currentMonth) {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(exactDate.getDate()).padStart(2, '0')}`;
                        events.push({
                            name: f.name,
                            dateStr: dateStr,
                            type: f.type === 'Major Festival' ? 'festival' : 'observance'
                        });
                    }
                }
            }
        });

        return events;
    }

    function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        // Default to the first day of the new month
        selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        renderCalendar();
        renderPanchangDetails(selectedDateStr);
    }

    function filterFestivals(query) {
        const filtered = query
            ? festivals.filter(f =>
                f.name.toLowerCase().includes(query.toLowerCase()) ||
                f.description.toLowerCase().includes(query.toLowerCase()) ||
                (f.month && f.month.toLowerCase().includes(query.toLowerCase()))
            )
            : festivals;
        renderFestivalCards(filtered);
    }

    function renderFestivalCards(list) {
        const grid = document.getElementById('festivalsGrid');
        if (!grid) return;

        if (list.length === 0) {
            grid.innerHTML = Components.emptyState('📅', typeof I18n !== 'undefined' ? I18n.t('calendar.no_festivals') : 'No festivals found', typeof I18n !== 'undefined' ? I18n.t('calendar.try_different') : 'Try a different search term');
            return;
        }

        grid.innerHTML = list.map(f => Components.festivalCard(f)).join('');
    }

    function showFestivalDetail(id) {
        const festival = festivals.find(f => f.id === id);
        if (!festival) return;

        const dateDisplay = festival.calculatedDate ? 
            `<strong style="color: var(--color-primary)">${festival.calculatedDate}</strong> <br/><span style="font-size: var(--text-xs)">${festival.date}</span>` : 
            festival.date || '';

        const content = `
            <div style="padding: var(--space-8)">
                <div class="flex items-center gap-4 mb-6">
                    <span style="font-size: 3rem">${festival.icon || '🪔'}</span>
                    <div>
                        <h2 style="margin: 0">${festival.name}</h2>
                        <p class="text-muted" style="margin: var(--space-1) 0 0">${dateDisplay}</p>
                    </div>
                </div>

                <div class="flex gap-2 flex-wrap mb-6">
                    ${Components.badge(festival.type || 'Festival', 'primary')}
                    ${festival.month ? Components.badge(festival.month, 'secondary') : ''}
                </div>

                <p style="margin-bottom: var(--space-6)">${festival.description}</p>

                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📜 ${typeof I18n !== 'undefined' ? I18n.t('calendar.history', 'Historical Significance') : 'Historical Significance'}</h4>
                        <p style="margin-bottom: var(--space-6)">${festival.historicalSignificance}</p>
                    </div>
                    <div>
                        <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ ${typeof I18n !== 'undefined' ? I18n.t('calendar.spiritual', 'Spiritual Significance') : 'Spiritual Significance'}</h4>
                        <p style="margin-bottom: var(--space-6)">${festival.spiritualSignificance}</p>
                    </div>
                </div>

                <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📿 ${typeof I18n !== 'undefined' ? I18n.t('calendar.ritual', 'Ritual Procedure') : 'Ritual Procedure'}</h4>
                <p style="margin-bottom: var(--space-6)">${festival.ritualProcedure}</p>

                ${festival.preparations && festival.preparations.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📋 ${typeof I18n !== 'undefined' ? I18n.t('calendar.prep', 'Preparations Required') : 'Preparations Required'}</h4>
                    ${Components.checklist(festival.preparations, `fest-prep-${id}`)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${festival.traditionalFoods && festival.traditionalFoods.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🍲 ${typeof I18n !== 'undefined' ? I18n.t('calendar.foods', 'Traditional Foods') : 'Traditional Foods'}</h4>
                    <div class="tag-group mb-6">
                        ${festival.traditionalFoods.map(f => `<span class="tag">${f}</span>`).join('')}
                    </div>
                ` : ''}

                ${festival.prayers && festival.prayers.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🙏 ${typeof I18n !== 'undefined' ? I18n.t('calendar.prayers', 'Important Prayers') : 'Important Prayers'}</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${festival.prayers.map(p => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">• ${p}</li>`).join('')}
                    </ul>
                ` : ''}

                ${festival.faq && festival.faq.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">❓ ${typeof I18n !== 'undefined' ? I18n.t('rituals.faq', 'Frequently Asked Questions') : 'Frequently Asked Questions'}</h4>
                    ${Components.accordion(festival.faq, `fest-faq-${id}`)}
                ` : ''}
            </div>
        `;

        Components.openModal(content);
    }

    function getAuspiciousReasons(hDate, dayOfWeek, lang) {
        const tithiInPaksha = hDate.tithi.index % 15;
        const auspiciousTithis = [1, 2, 4, 6, 9, 10, 12];
        const isTithiGood = auspiciousTithis.includes(tithiInPaksha);
        
        const auspiciousNakshatras = [0, 2, 3, 6, 7, 10, 11, 12, 16, 21, 24, 25, 26];
        const isNakshatraGood = auspiciousNakshatras.includes(hDate.nakshatra.index);
        
        const isDayGood = ![2, 6].includes(dayOfWeek);
        const isDayBad = [2, 6].includes(dayOfWeek);
        
        const tithiName = typeof I18n !== 'undefined' ? I18n.t(`astro.tithi.${hDate.tithi.name}`) : hDate.tithi.name;
        const koshurTithi = KASHMIRI_TITHIS[lang][hDate.tithi.name] || '';
        const displayTithi = koshurTithi ? `${tithiName} (${koshurTithi})` : tithiName;
        
        const nakName = typeof I18n !== 'undefined' ? I18n.t(`astro.nakshatra.${hDate.nakshatra.name.replace(/\s+/g, '_')}`) : hDate.nakshatra.name;
        const dayName = FULL_DAYS[lang][dayOfWeek];
        
        if (lang === 'hi') {
            return [
                isTithiGood ? `✅ ${displayTithi} अत्यंत अनुकूल तिथि है` : `⚠️ ${displayTithi} सामान्य तिथि है`,
                isNakshatraGood ? `✅ ${nakName} नक्षत्र अनुकूल है` : `⚠️ ${nakName} नक्षत्र सामान्य है`,
                isDayGood ? `✅ ${dayName} एक उत्तम दिन है` : `🚫 ${dayName} को पारंपरिक रूप से टाला जाता है`
            ];
        } else {
            return [
                isTithiGood ? `✅ ${displayTithi} is a highly favorable tithi` : `⚠️ ${displayTithi} is a neutral tithi`,
                isNakshatraGood ? `✅ ${nakName} nakshatra is favorable` : `⚠️ ${nakName} nakshatra is neutral`,
                isDayGood ? `✅ ${dayName} is an excellent day` : `🚫 ${dayName} is traditionally avoided`
            ];
        }
    }

    function renderPanchangDetails(dateStr) {
        const panel = document.getElementById('panchangDetailsPanel');
        if (!panel) return;
        
        const lang = typeof I18n !== 'undefined' ? I18n.getLanguage() : 'en';
        const [year, month, day] = dateStr.split('-').map(Number);
        
        // Calculate Hindu date
        let hDate = null;
        let auspicious = null;
        try {
            if (typeof CalendarCalc !== 'undefined') {
                hDate = CalendarCalc.getHinduDate(year, month, day, 12, 0);
                auspicious = CalendarCalc.isAuspicious(year, month, day, null);
            }
        } catch(e) {
            console.error("Error calculating Hindu Date:", e);
        }
        
        if (!hDate || !auspicious) {
            panel.innerHTML = `<p class="text-muted" style="text-align: center; padding: var(--space-8)">${typeof I18n !== 'undefined' ? I18n.t('calendar.panchang_unavail', 'Panchang calculations unavailable') : 'Panchang calculations unavailable'}</p>`;
            return;
        }
        
        // Get day of the week
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        const displayDayOfWeek = FULL_DAYS[lang][dayOfWeek];
        
        // Format Gregorian Date
        const gregDateObj = new Date(year, month - 1, day);
        const gregDateFormatted = gregDateObj.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Kashmiri Names
        const koshurMonth = KASHMIRI_MONTHS[lang][hDate.hinduMonth.name] || hDate.hinduMonth.name;
        const koshurTithi = KASHMIRI_TITHIS[lang][hDate.tithi.name] || hDate.tithi.name;
        
        // Translated Names
        const tithiTrans = typeof I18n !== 'undefined' ? I18n.t(`astro.tithi.${hDate.tithi.name}`) : hDate.tithi.name;
        const monthTrans = typeof I18n !== 'undefined' ? I18n.t(`astro.month.${hDate.hinduMonth.name}`) : hDate.hinduMonth.name;
        const pakshaTrans = typeof I18n !== 'undefined' ? I18n.t(`astro.paksha.${hDate.tithi.pakshaIndex === 0 ? 'Sukla' : 'Krishna'}`) : (hDate.tithi.pakshaIndex === 0 ? 'Shukla' : 'Krishna');
        const nakshatraTrans = typeof I18n !== 'undefined' ? I18n.t(`astro.nakshatra.${hDate.nakshatra.name.replace(/\s+/g, '_')}`) : hDate.nakshatra.name;
        
        const baseRashiName = hDate.rashi.name.split(' ')[0];
        const rashiTrans = typeof I18n !== 'undefined' ? I18n.t(`astro.rashi.${baseRashiName}`) : hDate.rashi.name;
        
        // Auspiciousness Rating Info
        let auspiciousStatus = '';
        let badgeClass = '';
        if (auspicious.score >= 5) {
            auspiciousStatus = typeof I18n !== 'undefined' ? I18n.t('calendar.highly_auspicious', 'Highly Auspicious') : 'Highly Auspicious';
            badgeClass = 'favorable';
        } else if (auspicious.score >= 2) {
            auspiciousStatus = typeof I18n !== 'undefined' ? I18n.t('calendar.neutral_status', 'Auspicious / Neutral') : 'Auspicious / Neutral';
            badgeClass = 'neutral';
        } else {
            auspiciousStatus = typeof I18n !== 'undefined' ? I18n.t('calendar.avoid_status', 'Avoid / Unfavorable') : 'Avoid / Unfavorable';
            badgeClass = 'unfavorable';
        }
        
        const scorePercentage = Math.round((Math.max(0, auspicious.score + 3) / 12) * 100);
        const reasonsList = getAuspiciousReasons(hDate, dayOfWeek, lang);
        
        // Find if any festival matches this date
        const events = getCalendarEvents().filter(e => e.dateStr === dateStr);
        let festivalHTML = '';
        if (events.length > 0) {
            const festival = festivals.find(f => f.name === events[0].name);
            if (festival) {
                const viewRitualLabel = `🪔 ${typeof I18n !== 'undefined' ? I18n.t('calendar.view_rituals', 'View Rituals & Foods') : 'View Rituals & Foods'}`;
                const typeLabel = festival.type === 'Major Festival' ? 
                    (typeof I18n !== 'undefined' ? I18n.t('calendar.major_festival', 'Major Festival') : 'Major Festival') : 
                    (typeof I18n !== 'undefined' ? I18n.t('calendar.observance', 'Observance') : 'Observance');
                    
                festivalHTML = `
                    <div style="margin-top: var(--space-5); padding-top: var(--space-4); border-top: 1px solid rgba(255,255,255,0.05);">
                        <div class="card card-featured card-compact" style="margin-top: var(--space-2)">
                            <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3)">
                                <span style="font-size: 2rem">${festival.icon || '🪔'}</span>
                                <div>
                                    <h4 style="margin: 0; font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-secondary);">${festival.name}</h4>
                                    <span class="badge badge-primary" style="font-size: 10px; margin-top: 4px; display: inline-block;">${typeLabel}</span>
                                </div>
                            </div>
                            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin: 0 0 var(--space-4); line-height: 1.4;">${festival.description}</p>
                            <button class="btn btn-primary btn-sm w-full" onclick="CalendarPage.showFestivalDetail('${festival.id}')">
                                ${viewRitualLabel}
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        
        const labelKoshurDate = typeof I18n !== 'undefined' ? I18n.t('calendar.koshur_date', 'Kashmiri Lunar Date') : 'Kashmiri Lunar Date';
        const labelSanskritDate = typeof I18n !== 'undefined' ? I18n.t('calendar.sanskrit_date', 'Vedic Lunar Date') : 'Vedic Lunar Date';
        const labelGregorian = typeof I18n !== 'undefined' ? I18n.t('calendar.gregorian_date', 'Gregorian Date') : 'Gregorian Date';
        const labelVaar = typeof I18n !== 'undefined' ? I18n.t('calendar.vaar', 'Vaar (Weekday)') : 'Vaar (Weekday)';
        const labelTithi = typeof I18n !== 'undefined' ? I18n.t('calendar.tithi', 'Tithi') : 'Tithi';
        const labelNakshatra = typeof I18n !== 'undefined' ? I18n.t('calendar.nakshatra', 'Nakshatra') : 'Nakshatra';
        const labelRashi = typeof I18n !== 'undefined' ? I18n.t('calendar.rashi', 'Moon Rashi') : 'Moon Rashi';
        const labelPaksha = typeof I18n !== 'undefined' ? I18n.t('calendar.paksha', 'Paksha') : 'Paksha';
        const labelAuspiciousIndex = typeof I18n !== 'undefined' ? I18n.t('calendar.auspicious_index', 'Auspiciousness Index') : 'Auspiciousness Index';
        
        panel.innerHTML = `
            <div class="panchang-header">
                <h3 class="panchang-title">${displayDayOfWeek}</h3>
                <p class="panchang-subtitle">${gregDateFormatted}</p>
            </div>
            
            <div class="panchang-koshur-title">
                🌸 ${koshurMonth} ${koshurTithi}
            </div>
            
            <table class="panchang-table">
                <tr>
                    <td class="label">${labelKoshurDate}</td>
                    <td class="value">${koshurMonth} ${koshurTithi}</td>
                </tr>
                <tr>
                    <td class="label">${labelSanskritDate}</td>
                    <td class="value">${monthTrans} ${pakshaTrans} ${tithiTrans}</td>
                </tr>
                <tr>
                    <td class="label">${labelGregorian}</td>
                    <td class="value">${gregDateFormatted}</td>
                </tr>
                <tr>
                    <td class="label">${labelVaar}</td>
                    <td class="value">${displayDayOfWeek}</td>
                </tr>
                <tr>
                    <td class="label">${labelTithi}</td>
                    <td class="value">${tithiTrans} (${koshurTithi})</td>
                </tr>
                <tr>
                    <td class="label">${labelPaksha}</td>
                    <td class="value">${pakshaTrans}</td>
                </tr>
                <tr>
                    <td class="label">${labelNakshatra}</td>
                    <td class="value">${nakshatraTrans}</td>
                </tr>
                <tr>
                    <td class="label">${labelRashi}</td>
                    <td class="value">${rashiTrans}</td>
                </tr>
            </table>
            
            <div class="auspicious-container">
                <div class="auspicious-score-row">
                    <span class="auspicious-label">${labelAuspiciousIndex}</span>
                    <span class="auspicious-badge ${badgeClass}">${auspiciousStatus}</span>
                </div>
                <div class="auspicious-bar-bg">
                    <div class="auspicious-bar-fill ${badgeClass}" style="width: ${scorePercentage}%"></div>
                </div>
                <ul class="auspicious-reasons">
                    ${reasonsList.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            
            ${festivalHTML}
        `;
    }

    function onDayClick(dateStr) {
        selectedDateStr = dateStr;
        renderCalendar();
        renderPanchangDetails(dateStr);
    }

    return { render, afterRender, changeMonth, filterFestivals, showFestivalDetail, onDayClick };
})();
