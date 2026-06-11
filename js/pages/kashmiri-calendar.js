/* ============================================
   Kashmiri Calendar Data Page
   ============================================ */

const KashmiriCalendarPage = (() => {
    const DAILY_FILES = ['20_21', '21_22', '22_23', '23_24', '24_25', '25_26', '26_27'];
    const MONTH_FILES = ['22_23', '23_24', '24_25', '25_26', '26_27'];
    const SOURCE_NOTE = 'Source: 2020-2026 data from KashmiriCalendar app assets; 2026-27 verified against Kashmiri Hindu Calendar 2026-27 based on Vijayshwar Punchang.';

    let dailyEvents = [];
    let monthRanges = [];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDateStr = null;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function render() {
        return `
            <div class="page-enter kashmiri-calendar-page">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Kashmiri Calendar' }
                ])}

                ${Components.sectionHeader(
                    'Kashmiri Calendar',
                    'Daily Kashmiri tithi, sankranti, panchak, and festival data from 2020-2027.',
                    { h1: true }
                )}

                <div class="kcal-toolbar">
                    <button class="btn btn-ghost" onclick="KashmiriCalendarPage.changeMonth(-1)">Previous</button>
                    <div>
                        <h3 id="kcalMonthTitle" class="kcal-month-title">Loading...</h3>
                        <p class="kcal-range-note">${SOURCE_NOTE}</p>
                    </div>
                    <button class="btn btn-ghost" onclick="KashmiriCalendarPage.changeMonth(1)">Next</button>
                </div>

                <div class="kcal-layout">
                    <section class="kcal-calendar-shell" aria-label="Kashmiri calendar month">
                        <div id="kcalGrid" class="kcal-loading">Loading calendar data...</div>
                    </section>

                    <aside class="kcal-side-panel" aria-label="Selected date details">
                        <div id="kcalDayDetails" class="kcal-loading">Select a date to view details.</div>
                    </aside>
                </div>

                <div class="kcal-section-row">
                    <section class="card">
                        <h3 class="kcal-panel-title">Month & Paksha Ranges</h3>
                        <div id="kcalMonthRanges" class="kcal-range-list"></div>
                    </section>

                    <section class="card">
                        <h3 class="kcal-panel-title">Important Events</h3>
                        <div class="mb-4">
                            ${Components.searchBar('Search Kashmiri calendar events...', 'KashmiriCalendarPage.filterEvents', 'kcalSearchInput')}
                        </div>
                        <div id="kcalEventsList" class="kcal-event-list"></div>
                    </section>
                </div>
            </div>
        `;
    }

    async function afterRender() {
        const [dailySets, rangeSets] = await Promise.all([
            Promise.all(DAILY_FILES.map(file => App.loadData(`kashmiri-calendar/${file}`))),
            Promise.all(MONTH_FILES.map(file => App.loadData(`kashmiri-calendar/months_${file}`)))
        ]);

        dailyEvents = mergeByKey(
            dailySets.flatMap(data => Array.isArray(data) ? data.map(normalizeDailyEvent) : []),
            'dateStr'
        ).sort((a, b) => a.dateObj - b.dateObj);

        monthRanges = mergeByKey(
            rangeSets.flatMap(data => Array.isArray(data) ? data.map(normalizeRange) : []),
            row => `${row.startDate}|${row.endDate}|${row.monthName}`
        ).sort((a, b) => a.startObj - b.startObj);

        const today = new Date();
        const dataStart = getDataStart();
        const dataEnd = getDataEnd();
        const safeToday = today >= dataStart && today <= dataEnd ? today : dataEnd;

        currentYear = safeToday.getFullYear();
        currentMonth = safeToday.getMonth();
        selectedDateStr = toIsoDate(safeToday);

        renderCalendar();
        renderDayDetails(selectedDateStr);
        renderMonthRanges();
        renderEventsList(getImportantEvents());
    }

    function normalizeDailyEvent(row) {
        return {
            ...row,
            dateObj: parseDmy(row.date),
            dateStr: dmyToIso(row.date),
            eventParts: String(row.events || '').split(',').map(part => part.trim()).filter(Boolean)
        };
    }

    function mergeByKey(rows, key) {
        const map = new Map();
        rows.forEach(row => {
            const value = typeof key === 'function' ? key(row) : row[key];
            if (value) map.set(value, row);
        });
        return Array.from(map.values());
    }

    function getDataStart() {
        return dailyEvents[0]?.dateObj || new Date(2020, 2, 1);
    }

    function getDataEnd() {
        return dailyEvents[dailyEvents.length - 1]?.dateObj || new Date(2027, 3, 30);
    }

    function getDataRangeText() {
        const start = dailyEvents[0]?.date || '01-03-2020';
        const end = dailyEvents[dailyEvents.length - 1]?.date || '30-04-2027';
        return `${start} to ${end}`;
    }

    function normalizeRange(row) {
        return {
            ...row,
            startObj: parseDmy(row.startDate),
            endObj: parseDmy(row.endDate)
        };
    }

    function parseDmy(value) {
        const [day, month, year] = String(value).split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function dmyToIso(value) {
        const [day, month, year] = String(value).split('-');
        return `${year}-${month}-${day}`;
    }

    function toIsoDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function sameMonth(date, year, month) {
        return date.getFullYear() === year && date.getMonth() === month;
    }

    function findDay(dateStr) {
        return dailyEvents.find(row => row.dateStr === dateStr);
    }

    function renderCalendar() {
        const title = document.getElementById('kcalMonthTitle');
        if (title) title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const grid = document.getElementById('kcalGrid');
        if (!grid) return;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        let html = '<div class="kcal-grid">';

        dayNames.forEach(day => {
            html += `<div class="kcal-header-cell">${day}</div>`;
        });

        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="kcal-cell other-month"><span>${daysInPrevMonth - i}</span></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = toIsoDate(date);
            const row = findDay(dateStr);
            const isSelected = selectedDateStr === dateStr;
            const isToday = toIsoDate(new Date()) === dateStr;
            const isOutsideData = date < getDataStart() || date > getDataEnd();
            const primary = row ? row.eventParts[row.eventParts.length - 1] : '';
            const specials = row ? row.eventParts.filter(part => !isTithiName(part)) : [];

            html += `
                <button class="kcal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isOutsideData ? 'disabled' : ''}"
                        ${isOutsideData ? 'disabled' : ''}
                        onclick="KashmiriCalendarPage.onDayClick('${dateStr}')">
                    <span class="kcal-date-number">${day}</span>
                    ${primary ? `<span class="kcal-tithi">${primary}</span>` : ''}
                    ${specials.slice(0, 2).map(label => `<span class="kcal-special">${label}</span>`).join('')}
                </button>
            `;
        }

        const totalCells = firstDay + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="kcal-cell other-month"><span>${i}</span></div>`;
        }

        html += '</div>';
        grid.innerHTML = html;
    }

    function renderDayDetails(dateStr) {
        const panel = document.getElementById('kcalDayDetails');
        if (!panel) return;

        const row = findDay(dateStr);
        if (!row) {
            panel.innerHTML = Components.emptyState('KC', 'No data for this date', `Available data range: ${getDataRangeText()}.`);
            return;
        }

        const ranges = monthRanges.filter(range => row.dateObj >= range.startObj && row.dateObj <= range.endObj);
        const normalRanges = ranges.filter(range => range.monthName !== 'Panchak');
        const panchak = ranges.some(range => range.monthName === 'Panchak');
        const mainTithi = row.eventParts[row.eventParts.length - 1] || row.events;
        const specialEvents = row.eventParts.filter(part => !isTithiName(part));

        panel.innerHTML = `
            <div class="kcal-detail-date">${row.date}</div>
            <h3 class="kcal-detail-title">${mainTithi}</h3>
            <div class="kcal-detail-tags">
                ${normalRanges.map(range => Components.badge(range.monthName, 'secondary')).join('')}
                ${panchak ? Components.badge('Panchak', 'primary') : ''}
            </div>
            ${specialEvents.length ? `
                <div class="kcal-detail-block">
                    <h4>Events</h4>
                    ${specialEvents.map(event => `<div class="kcal-detail-event">${event}</div>`).join('')}
                </div>
            ` : ''}
            <div class="kcal-detail-block">
                <h4>Full Day Entry</h4>
                <p>${row.events}</p>
            </div>
        `;
    }

    function renderMonthRanges() {
        const list = document.getElementById('kcalMonthRanges');
        if (!list) return;

        const visible = monthRanges.filter(range =>
            sameMonth(range.startObj, currentYear, currentMonth)
            || sameMonth(range.endObj, currentYear, currentMonth)
            || (range.startObj <= new Date(currentYear, currentMonth, 1)
                && range.endObj >= new Date(currentYear, currentMonth + 1, 0))
        );

        list.innerHTML = visible.map(range => `
            <div class="kcal-range-item ${range.monthName === 'Panchak' ? 'panchak' : ''}">
                <div class="kcal-range-name">${range.monthName}</div>
                <div class="kcal-range-dates">${range.startDate} to ${range.endDate}</div>
            </div>
        `).join('') || Components.emptyState('KC', 'No ranges', 'No month or panchak ranges for this view.');
    }

    function getImportantEvents() {
        return dailyEvents.filter(row =>
            row.imp
            || row.eventParts.some(part => !isTithiName(part) && part !== 'Sankranti')
        );
    }

    function renderEventsList(list) {
        const container = document.getElementById('kcalEventsList');
        if (!container) return;

        container.innerHTML = list.map(row => `
            <button class="kcal-list-event" onclick="KashmiriCalendarPage.jumpToDate('${row.dateStr}')">
                <span class="kcal-list-date">${row.date}</span>
                <span class="kcal-list-name">${row.events}</span>
            </button>
        `).join('') || Components.emptyState('KC', 'No events found', 'Try a different search term.');
    }

    function filterEvents(query) {
        const term = String(query || '').toLowerCase().trim();
        const list = getImportantEvents().filter(row =>
            !term || row.events.toLowerCase().includes(term) || row.date.includes(term)
        );
        renderEventsList(list);
    }

    function isTithiName(label) {
        return [
            'Amavasya', 'Okdoh', 'Dwitya', 'Tritya', 'Choram', 'Paancham', 'Shishthi', 'Satam',
            'Ashtami', 'Navum', 'Dhashmi', 'Ekadashi', 'Dwadashi', 'Triyodashi', 'Chaturdashi', 'Poornima'
        ].includes(label);
    }

    function changeMonth(delta) {
        const next = new Date(currentYear, currentMonth + delta, 1);
        const minMonth = new Date(getDataStart().getFullYear(), getDataStart().getMonth(), 1);
        const maxMonth = new Date(getDataEnd().getFullYear(), getDataEnd().getMonth(), 1);
        if (next < minMonth || next > maxMonth) {
            Components.showToast(`No Kashmiri calendar data outside ${getDataRangeText()}.`, 'warning');
            return;
        }

        currentYear = next.getFullYear();
        currentMonth = next.getMonth();
        selectedDateStr = toIsoDate(next);
        renderCalendar();
        renderDayDetails(selectedDateStr);
        renderMonthRanges();
    }

    function onDayClick(dateStr) {
        selectedDateStr = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
    }

    function jumpToDate(dateStr) {
        const row = findDay(dateStr);
        if (!row) return;
        currentYear = row.dateObj.getFullYear();
        currentMonth = row.dateObj.getMonth();
        selectedDateStr = dateStr;
        renderCalendar();
        renderDayDetails(dateStr);
        renderMonthRanges();
        document.getElementById('kcalGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return { render, afterRender, changeMonth, onDayClick, jumpToDate, filterEvents };
})();
