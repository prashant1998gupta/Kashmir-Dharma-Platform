/* ============================================
   Festival Calendar Page
   ============================================ */

const CalendarPage = (() => {
    let festivals = [];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    function render() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Festival Calendar' }
                ])}

                ${Components.sectionHeader(
                    'Festival Calendar',
                    'Explore the complete calendar of Kashmiri Pandit festivals, observances, and celebrations',
                    { h1: true }
                )}

                <!-- Calendar Navigation -->
                <div class="flex items-center justify-between mb-6">
                    <button class="btn btn-ghost" onclick="CalendarPage.changeMonth(-1)">← Previous</button>
                    <h3 id="calendarMonthTitle">${monthNames[currentMonth]} ${currentYear}</h3>
                    <button class="btn btn-ghost" onclick="CalendarPage.changeMonth(1)">Next →</button>
                </div>

                <!-- Calendar Grid -->
                <div id="calendarGrid" class="mb-8">
                    <div class="skeleton skeleton-card" style="height: 400px"></div>
                </div>

                ${Components.ornamentalDivider('🪔')}

                <!-- All Festivals List -->
                ${Components.sectionHeader('All Festivals & Observances', 'Detailed guide to each festival')}
                
                <!-- Search -->
                <div class="mb-6">
                    ${Components.searchBar('Search festivals...', 'CalendarPage.filterFestivals')}
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
        App.loadData('festivals').then(data => {
            festivals = data || [];
            renderCalendar();
            renderFestivalCards(festivals);
        });
    }

    function renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const titleEl = document.getElementById('calendarMonthTitle');
        if (titleEl) titleEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Map festivals to calendar events (approximate positioning)
        const events = getCalendarEvents();
        
        const gridEl = document.getElementById('calendarGrid');
        if (gridEl) {
            gridEl.innerHTML = Components.calendarMonth(currentYear, currentMonth, events);
        }
    }

    function getCalendarEvents() {
        // Map festivals to approximate Gregorian dates for display
        const festivalDates = {
            'navreh': { month: 2, day: 22 },       // March
            'herath': { month: 1, day: 26 },        // February
            'zyeth-atham': { month: 7, day: 22 },   // August
            'khetsrimavas': { month: 5, day: 6 },   // June
            'pan-festival': { month: 7, day: 15 },  // August
            'janmashtami': { month: 7, day: 26 },   // August
            'ram-navami': { month: 3, day: 6 },     // April
            'sharika-jayanti': { month: 9, day: 2 }  // October
        };

        const events = [];
        festivals.forEach(f => {
            const dateInfo = festivalDates[f.id];
            if (dateInfo && dateInfo.month === currentMonth) {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dateInfo.day).padStart(2, '0')}`;
                events.push({
                    name: f.name,
                    dateStr: dateStr,
                    type: f.type === 'Major Festival' ? 'festival' : 'observance'
                });
            }
        });

        return events;
    }

    function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar();
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
            grid.innerHTML = Components.emptyState('📅', 'No festivals found', 'Try a different search term');
            return;
        }

        grid.innerHTML = list.map(f => Components.festivalCard(f)).join('');
    }

    function showFestivalDetail(id) {
        const festival = festivals.find(f => f.id === id);
        if (!festival) return;

        const content = `
            <div style="padding: var(--space-8)">
                <div class="flex items-center gap-4 mb-6">
                    <span style="font-size: 3rem">${festival.icon || '🪔'}</span>
                    <div>
                        <h2 style="margin: 0">${festival.name}</h2>
                        <p class="text-muted" style="margin: var(--space-1) 0 0">${festival.date || ''}</p>
                    </div>
                </div>

                <div class="flex gap-2 flex-wrap mb-6">
                    ${Components.badge(festival.type || 'Festival', 'primary')}
                    ${festival.month ? Components.badge(festival.month, 'secondary') : ''}
                </div>

                <p style="margin-bottom: var(--space-6)">${festival.description}</p>

                ${festival.historicalSignificance ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📜 Historical Significance</h4>
                    <p style="margin-bottom: var(--space-6)">${festival.historicalSignificance}</p>
                ` : ''}

                ${festival.spiritualSignificance ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">🕉️ Spiritual Significance</h4>
                    <p style="margin-bottom: var(--space-6)">${festival.spiritualSignificance}</p>
                ` : ''}

                ${festival.ritualProcedure ? `
                    <h4 style="margin-bottom: var(--space-2); color: var(--color-secondary)">📿 Ritual Procedure</h4>
                    <p style="margin-bottom: var(--space-6)">${festival.ritualProcedure}</p>
                ` : ''}

                ${festival.preparations && festival.preparations.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">📋 Preparations Required</h4>
                    ${Components.checklist(festival.preparations, `festival-prep-${id}`)}
                    <div style="margin-bottom: var(--space-6)"></div>
                ` : ''}

                ${festival.traditionalFoods && festival.traditionalFoods.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🍲 Traditional Foods</h4>
                    <div class="tag-group mb-6">
                        ${festival.traditionalFoods.map(f => `<span class="tag">${f}</span>`).join('')}
                    </div>
                ` : ''}

                ${festival.prayers && festival.prayers.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">🙏 Important Prayers</h4>
                    <ul style="list-style: none; margin-bottom: var(--space-6)">
                        ${festival.prayers.map(p => `<li style="padding: var(--space-1) 0; color: var(--text-secondary)">• ${p}</li>`).join('')}
                    </ul>
                ` : ''}

                ${festival.faqs && festival.faqs.length ? `
                    <h4 style="margin-bottom: var(--space-3); color: var(--color-secondary)">❓ Frequently Asked Questions</h4>
                    ${Components.accordion(festival.faqs, `faq-${id}`)}
                ` : ''}
            </div>
        `;

        Components.openModal(content);
    }

    function onDayClick(dateStr) {
        const events = getCalendarEvents().filter(e => e.dateStr === dateStr);
        if (events.length > 0) {
            const festival = festivals.find(f => f.name === events[0].name);
            if (festival) showFestivalDetail(festival.id);
        }
    }

    return { render, afterRender, changeMonth, filterFestivals, showFestivalDetail, onDayClick };
})();
