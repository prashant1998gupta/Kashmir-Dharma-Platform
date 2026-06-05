/* ============================================
   Reusable UI Components
   ============================================ */

const Components = (() => {

    /**
     * Render a glassmorphism card
     */
    function card(content, options = {}) {
        const classes = ['card'];
        if (options.featured) classes.push('card-featured');
        if (options.compact) classes.push('card-compact');
        if (options.interactive) classes.push('card-interactive', 'shine-effect');
        if (options.glass) classes.push('card-glass');
        if (options.className) classes.push(options.className);

        const attrs = options.id ? ` id="${options.id}"` : '';
        const onclick = options.onclick ? ` onclick="${options.onclick}"` : '';
        
        return `<div class="${classes.join(' ')}"${attrs}${onclick}>${content}</div>`;
    }

    /**
     * Render an audio player
     */
    function audioPlayer(url, title, subtitle) {
        return `
            <div class="audio-player card-glass" style="padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-4);">
                <button class="btn-icon" style="background: var(--color-primary); color: white; border-radius: 50%; width: 48px; height: 48px; flex-shrink: 0; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px var(--color-primary-glow);" onclick="this.nextElementSibling.paused ? this.nextElementSibling.play() : this.nextElementSibling.pause(); this.innerHTML = this.nextElementSibling.paused ? '▶' : '⏸';">
                    ▶
                </button>
                <audio src="${url}" onplay="this.previousElementSibling.innerHTML='⏸'" onpause="this.previousElementSibling.innerHTML='▶'"></audio>
                <div style="flex: 1;">
                    <div style="font-size: var(--text-base); font-weight: 500; color: var(--text-primary); margin-bottom: 2px;">${title}</div>
                    ${subtitle ? `<div style="font-size: var(--text-xs); color: var(--color-secondary);">${subtitle}</div>` : ''}
                </div>
                <div style="font-size: 1.5rem; opacity: 0.5;">🎵</div>
            </div>
        `;
    }

    /**
     * Render a section header with ornamental divider
     */
    function sectionHeader(title, description, options = {}) {
        const tag = options.h1 ? 'h1' : 'h2';
        return `
            <div class="section-header ${options.className || ''}">
                <${tag}>${title}</${tag}>
                <div class="section-divider"></div>
                ${description ? `<p class="section-description">${description}</p>` : ''}
            </div>
        `;
    }

    /**
     * Render a breadcrumb navigation
     */
    function breadcrumb(items) {
        return `
            <nav class="breadcrumb" aria-label="Breadcrumb">
                ${items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    const separator = isLast ? '' : '<span class="breadcrumb-separator">›</span>';
                    if (isLast) {
                        return `<span class="breadcrumb-item active">${item.label}</span>`;
                    }
                    return `<span class="breadcrumb-item"><a href="${item.href}">${item.label}</a></span>${separator}`;
                }).join('')}
            </nav>
        `;
    }

    /**
     * Render a timeline
     */
    function timeline(items) {
        return `
            <div class="timeline">
                ${items.map((item, i) => `
                    <div class="timeline-item reveal" style="transition-delay: ${i * 0.1}s">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.title}</div>
                            <div class="timeline-description">${item.description}</div>
                            ${item.extra || ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render an accordion
     */
    function accordion(items, id = 'accordion') {
        return `
            <div class="accordion" id="${id}">
                ${items.map((item, i) => `
                    <div class="accordion-item" id="${id}-item-${i}">
                        <button class="accordion-header" onclick="Components.toggleAccordion('${id}-item-${i}')">
                            <span>${item.question || item.title}</span>
                            <span class="accordion-arrow">▼</span>
                        </button>
                        <div class="accordion-body">
                            <div class="accordion-content">${item.answer || item.content}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function toggleAccordion(itemId) {
        const item = document.getElementById(itemId);
        if (item) {
            item.classList.toggle('open');
        }
    }

    /**
     * Render tabs
     */
    function tabs(tabItems, activeId, onClickFn) {
        return `
            <div class="tabs" role="tablist">
                ${tabItems.map(tab => `
                    <button class="tab ${tab.id === activeId ? 'active' : ''}" 
                            role="tab" 
                            aria-selected="${tab.id === activeId}"
                            onclick="${onClickFn}('${tab.id}')">
                        ${tab.icon ? `<span>${tab.icon}</span>` : ''}
                        ${tab.label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render a search bar
     */
    function searchBar(placeholder, onInputFn, id = 'searchInput') {
        return `
            <div class="search-container">
                <span class="search-icon">🔍</span>
                <input type="text" 
                       class="search-input" 
                       id="${id}"
                       placeholder="${placeholder}" 
                       oninput="${onInputFn}(this.value)"
                       autocomplete="off">
            </div>
        `;
    }

    /**
     * Render a checklist with localStorage persistence
     */
    function checklist(items, checklistId) {
        const savedState = Storage.getChecklist(checklistId);
        return `
            <div class="checklist" id="checklist-${checklistId}">
                ${items.map((item, i) => {
                    const itemId = `${checklistId}-${i}`;
                    const checked = savedState[itemId] || false;
                    return `
                        <label class="checklist-item">
                            <input type="checkbox" 
                                   class="checklist-checkbox" 
                                   ${checked ? 'checked' : ''}
                                   onchange="Storage.setChecklistItem('${checklistId}', '${itemId}', this.checked)">
                            <span class="checklist-label">${item}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render a badge
     */
    function badge(text, variant = 'secondary') {
        return `<span class="badge badge-${variant}">${text}</span>`;
    }

    /**
     * Render a stat card
     */
    function statCard(value, label, icon) {
        return card(`
            <div class="stat-card">
                ${icon ? `<div style="font-size: 2rem; margin-bottom: var(--space-3)">${icon}</div>` : ''}
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            </div>
        `);
    }

    /**
     * Render a feature card (for home page)
     */
    function featureCard(icon, title, description, href) {
        return `
            <a href="${href}" class="card card-interactive shine-effect" style="text-decoration:none">
                <div style="font-size: 2.5rem; margin-bottom: var(--space-4)">${icon}</div>
                <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-2); color: var(--text-heading)">${title}</h3>
                <p style="font-size: var(--text-sm); color: var(--text-secondary); margin: 0">${description}</p>
            </a>
        `;
    }

    /**
     * Render a festival card
     */
    function festivalCard(festival) {
        return card(`
            <div class="flex items-center gap-3 mb-4">
                <span style="font-size: 1.8rem">${festival.icon || '🪔'}</span>
                <div>
                    <h3 style="font-size: var(--text-lg); margin: 0">${festival.name}</h3>
                    <span class="text-muted" style="font-size: var(--text-xs)">${festival.date || ''}</span>
                </div>
            </div>
            <p style="font-size: var(--text-sm); margin-bottom: var(--space-3)">${festival.description}</p>
            <div class="flex gap-2 flex-wrap">
                ${badge(festival.type || 'Festival', 'primary')}
                ${festival.month ? badge(festival.month, 'secondary') : ''}
            </div>
        `, {
            interactive: true,
            onclick: `CalendarPage.showFestivalDetail('${festival.id}')`
        });
    }

    /**
     * Render a ritual card
     */
    function ritualCard(ritual) {
        return card(`
            <div class="flex items-center gap-3 mb-4">
                <span style="font-size: 1.8rem">${ritual.icon || '🕉️'}</span>
                <div>
                    <h3 style="font-size: var(--text-lg); margin: 0">${ritual.name}</h3>
                    ${badge(ritual.category, 'secondary')}
                </div>
            </div>
            <p style="font-size: var(--text-sm); margin-bottom: var(--space-3)">${ritual.purpose || ritual.description}</p>
            <button class="btn btn-outline btn-sm" onclick="RitualsPage.showRitualDetail('${ritual.id}')">
                ${typeof I18n !== 'undefined' ? I18n.t('common.learn_more', 'Learn More') : 'Learn More'} →
            </button>
        `, { interactive: true });
    }

    /**
     * Render ornamental divider
     */
    function ornamentalDivider(symbol = '❖') {
        return `
            <div class="ornamental-divider">
                <span class="ornament">${symbol}</span>
            </div>
        `;
    }

    /**
     * Render an empty state
     */
    function emptyState(icon, title, text) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <div class="empty-state-title">${title}</div>
                <div class="empty-state-text">${text}</div>
            </div>
        `;
    }

    /**
     * Show a toast notification
     */
    function showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</span> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Open the modal with content
     */
    function openModal(content) {
        const overlay = document.getElementById('modalOverlay');
        const body = document.getElementById('modalBody');
        body.innerHTML = content;
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the modal
     */
    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }




    /**
     * Render a calendar month grid
     */
    function calendarMonth(year, month, events = [], selectedDateStr = null) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        let html = '<div class="calendar-grid">';
        
        // Header
        dayNames.forEach((d, index) => {
            const translatedDay = typeof I18n !== 'undefined' ? I18n.t('day.' + index) : d;
            html += `<div class="calendar-header-cell">${translatedDay}</div>`;
        });

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="calendar-cell other-month"><span class="calendar-date">${day}</span></div>`;
        }

        // Kashmiri tithi names local mapping for tooltip
        const localKashmiriTithis = {
            'Pratipada': 'Okdoh/ओकदोह', 'Dwitiya': 'Duyeh/दुयेह', 'Tritiya': 'Triyeh/त्रियेह',
            'Chaturthi': 'Tsodah/त्सोदह', 'Panchami': 'Panchem/पंचेम', 'Shashthi': 'Sheyam/शेयम',
            'Saptami': 'Satam/सतम', 'Ashtami': 'Atham/अठम', 'Navami': 'Navam/नवम',
            'Dashami': 'Dahim/दहिम', 'Ekadashi': 'Kah/काह', 'Dwadashi': 'Duvah/दुवाह',
            'Trayodashi': 'Truvah/त्रुवाह', 'Chaturdashi': 'Tsohda/त्सोहदा', 'Purnima': 'Punim/पुनिम',
            'Amavasya': 'Mavas/मावास'
        };

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDateStr;
            const dayEvents = events.filter(e => e.dateStr === dateStr);
            
            // Calculate Tithi for the cell if CalendarCalc is available
            let tithiHTML = '';
            let auspiciousHTML = '';
            let extraHTML = '';
            try {
                if (typeof CalendarCalc !== 'undefined') {
                    const hDate = CalendarCalc.getHinduDate(year, month + 1, d, 12, 0);
                    const paksha = hDate.tithi.pakshaIndex === 0 ? 'S' : 'K';
                    const tithiNum = (hDate.tithi.index % 15) + 1;
                    
                    const tithiNameTranslated = typeof I18n !== 'undefined' ? I18n.t(`astro.tithi.${hDate.tithi.name}`) : hDate.tithi.name;
                    const pakshaTranslated = typeof I18n !== 'undefined' ? I18n.t(`astro.paksha.${hDate.tithi.pakshaIndex === 0 ? 'Sukla' : 'Krishna'}`) : (hDate.tithi.pakshaIndex === 0 ? 'Shukla' : 'Krishna');
                    const koshurTithi = localKashmiriTithis[hDate.tithi.name] || '';
                    
                    let moonIcon = '';
                    if (hDate.tithi.pakshaIndex === 0) {
                        if (tithiNum <= 5) moonIcon = '🌒';
                        else if (tithiNum <= 9) moonIcon = '🌓';
                        else if (tithiNum <= 14) moonIcon = '🌔';
                        else moonIcon = '🌕'; // Purnima
                    } else {
                        if (tithiNum <= 5) moonIcon = '🌖';
                        else if (tithiNum <= 9) moonIcon = '🌗';
                        else if (tithiNum <= 14) moonIcon = '🌘';
                        else moonIcon = '🌑'; // Amavasya
                    }
                    
                    const tooltip = `${pakshaTranslated} ${tithiNameTranslated} (${koshurTithi})`;
                    
                    tithiHTML = `<span class="calendar-tithi" title="${tooltip}"><span class="moon-icon">${moonIcon}</span> ${paksha}${tithiNum}</span>`;

                    // Check if auspicious (general rules)
                    const ausp = CalendarCalc.isAuspicious(year, month + 1, d, null);
                    if (ausp && ausp.isGood) {
                        auspiciousHTML = `<div class="calendar-auspicious-indicator" title="Auspicious Day">✦</div>`;
                    }

                    // Nakshatra and Hindu Month info
                    const nakshatraKey = hDate.nakshatra.name.replace(/ /g, '_');
                    const nakshatraNameTranslated = typeof I18n !== 'undefined' ? (I18n.t(`astro.nakshatra.${nakshatraKey}`) || hDate.nakshatra.name) : hDate.nakshatra.name;
                    
                    extraHTML += `<div class="calendar-nakshatra" title="Nakshatra: ${nakshatraNameTranslated}">${nakshatraNameTranslated.substring(0, 3)}</div>`;
                    
                    if (tithiNum === 1 && hDate.tithi.pakshaIndex === 0) {
                        // Shukla Pratipada (start of lunar month)
                        const kMonthTranslated = typeof I18n !== 'undefined' ? (I18n.t(`astro.month.${hDate.hinduMonth.name}`) || hDate.hinduMonth.name) : hDate.hinduMonth.name;
                        extraHTML += `<div class="calendar-hindu-month" title="Start of new lunar month">${kMonthTranslated}</div>`;
                    }
                }
            } catch(e) {}
            
            html += `<div class="calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="CalendarPage.onDayClick('${dateStr}')">`;
            html += `<div class="calendar-date-wrapper">`;
            html += `<span class="calendar-date">${d}</span>`;
            html += auspiciousHTML;
            html += `</div>`;
            html += tithiHTML;
            html += extraHTML;
            dayEvents.forEach(e => {
                html += `<div class="calendar-event ${e.type}">${e.name}</div>`;
            });
            html += '</div>';
        }

        // Next month days to fill grid
        const totalCells = firstDay + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="calendar-cell other-month"><span class="calendar-date">${i}</span></div>`;
        }

        html += '</div>';
        return html;
    }

    /**
     * Initialize scroll reveal observer
     */
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
            observer.observe(el);
        });
    }

    return {
        card,
        sectionHeader,
        breadcrumb,
        timeline,
        accordion,
        toggleAccordion,
        tabs,
        searchBar,
        checklist,
        badge,
        statCard,
        featureCard,
        festivalCard,
        ritualCard,
        ornamentalDivider,
        emptyState,
        showToast,
        openModal,
        closeModal,
        calendarMonth,
        initScrollReveal,
        audioPlayer
    };
})();
