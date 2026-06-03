/* ============================================
   Hindu Birthday (Janma Tithi) Finder Page
   ============================================ */

const BirthdayPage = (() => {
    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Janma Tithi Finder' }
                ])}

                ${Components.sectionHeader(
                    'Hindu Birthday (Janma Tithi) Finder',
                    'Find your Hindu birthday based on the traditional lunar calendar. Enter your birth details to discover your Tithi, Nakshatra, and Rashi.',
                    { h1: true }
                )}

                <div class="grid-2" style="align-items: start">
                    <!-- Input Form -->
                    ${Components.card(`
                        ${ProfileManager.renderProfileSelector('birthdayProfileSelect', 'BirthdayPage.loadProfile')}
                        <h3 style="margin-bottom: var(--space-6)">🎂 Enter Your Birth Details</h3>
                        
                        <div class="form-group mb-4">
                            <label class="form-label" for="birthDate">Date of Birth</label>
                            <input type="date" class="form-input" id="birthDate" required>
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="birthTime">Time of Birth (optional)</label>
                            <input type="time" class="form-input" id="birthTime" value="12:00">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="birthPlace">Place of Birth (optional)</label>
                            <input type="text" class="form-input" id="birthPlace" placeholder="e.g., Srinagar, Jammu, Delhi">
                        </div>

                        <div class="form-group mb-6">
                            <label class="form-label" for="targetYear">Show Hindu Birthday For Year</label>
                            <input type="number" class="form-input" id="targetYear" value="${new Date().getFullYear()}" min="2000" max="2050">
                        </div>

                        <button class="btn btn-primary w-full" onclick="BirthdayPage.calculate()">
                            🔍 Find My Janma Tithi
                        </button>
                    `, { glass: true })}

                    <!-- Info Card -->
                    ${Components.card(`
                        <h3 style="margin-bottom: var(--space-4)">📖 What is Janma Tithi?</h3>
                        <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                            In the Hindu tradition, birthdays are often celebrated according to the <strong style="color: var(--color-secondary)">lunar calendar (Panchang)</strong> rather than the Gregorian calendar.
                        </p>
                        <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                            Your <strong style="color: var(--color-secondary)">Janma Tithi</strong> is the lunar day on which you were born. The Hindu birthday falls on the same Tithi each year, but the corresponding Gregorian date changes.
                        </p>
                        <div class="accordion">
                            <div class="accordion-item" id="info-tithi">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-tithi')">
                                    <span>What is a Tithi?</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        A Tithi is a lunar day — the time it takes for the Moon to gain 12° over the Sun. There are 30 Tithis in a lunar month, 15 in Shukla Paksha (waxing) and 15 in Krishna Paksha (waning).
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" id="info-nakshatra">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-nakshatra')">
                                    <span>What is a Nakshatra?</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        Nakshatras are 27 lunar mansions or star constellations through which the Moon travels. Your birth Nakshatra is determined by the Moon's position at the time of your birth.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" id="info-rashi">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-rashi')">
                                    <span>What is a Rashi?</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        Rashi is your zodiac sign based on the Moon's position at birth (not the Sun sign used in Western astrology). There are 12 Rashis, each spanning 30° of the zodiac.
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)}
                </div>

                <!-- Results -->
                <div id="birthdayResults" class="mt-8"></div>
            </div>
        `;
    }

    function afterRender() {}

    function calculate() {
        const dateInput = document.getElementById('birthDate');
        const timeInput = document.getElementById('birthTime');
        const targetYearInput = document.getElementById('targetYear');
        
        if (!dateInput.value) {
            Components.showToast('Please enter your date of birth', 'warning');
            return;
        }

        const [year, month, day] = dateInput.value.split('-').map(Number);
        const [hour, minute] = (timeInput.value || '12:00').split(':').map(Number);
        const targetYear = parseInt(targetYearInput.value) || new Date().getFullYear();

        // Calculate Hindu date info
        const hinduDate = CalendarCalc.getHinduDate(year, month, day, hour, minute);
        
        // Find Janma Tithi dates in the target year
        const janmaTithiDates = CalendarCalc.findJanmaTithiDates(year, month, day, targetYear);

        // Render results
        const resultsContainer = document.getElementById('birthdayResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="reveal">
                ${Components.ornamentalDivider('🎂')}
                
                <h2 style="margin-bottom: var(--space-6); text-align: center">Your Hindu Birth Details</h2>

                <!-- Birth Details Cards -->
                <div class="grid-4 mb-8">
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">🌙</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${hinduDate.tithi.name}</div>
                            <div class="stat-label">Janma Tithi</div>
                            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-2)">${hinduDate.tithi.paksha}</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">⭐</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${hinduDate.nakshatra.name}</div>
                            <div class="stat-label">Birth Nakshatra</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">♈</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${hinduDate.rashi.name}</div>
                            <div class="stat-label">Moon Rashi</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">📅</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${hinduDate.hinduMonth.name}</div>
                            <div class="stat-label">Hindu Month</div>
                        </div>
                    `)}
                </div>

                <!-- Hindu Birthday Dates -->
                <h3 style="margin-bottom: var(--space-4)">🎂 Hindu Birthday in ${targetYear}</h3>
                ${janmaTithiDates.length > 0 ? `
                    <div class="grid-auto">
                        ${janmaTithiDates.map((jt, i) => Components.card(`
                            <div class="flex items-center gap-4">
                                <div style="font-size: 2rem">🎂</div>
                                <div>
                                    <div style="font-size: var(--text-lg); font-weight: 700; color: var(--color-secondary)">
                                        ${jt.gregorianDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div style="font-size: var(--text-sm); color: var(--text-secondary)">
                                        ${jt.hinduMonth.name} ${jt.tithi.paksha} ${jt.tithi.name}
                                    </div>
                                    ${jt.approximate ? '<span class="badge badge-primary mt-2">Approximate</span>' : ''}
                                </div>
                            </div>
                        `, { featured: i === 0 })).join('')}
                    </div>
                ` : `
                    ${Components.card(`
                        <p style="text-align: center; color: var(--text-secondary)">
                            Could not determine exact Hindu birthday for ${targetYear}. 
                            Please consult with a Panchang expert for accurate calculation.
                        </p>
                    `)}
                `}

                <!-- Disclaimer -->
                <div class="mt-6">
                    ${Components.card(`
                        <div class="flex items-center gap-3">
                            <span style="font-size: 1.5rem">⚠️</span>
                            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
                                <strong>Note:</strong> These calculations are based on astronomical algorithms and may have slight variations 
                                from traditional Panchang calculations. For precise results, especially for important ceremonies, 
                                please consult with a knowledgeable Kashmiri Pandit priest or astrologer.
                            </p>
                        </div>
                    `, { compact: true })}
                </div>
            </div>
        `;

        setTimeout(() => Components.initScrollReveal(), 100);
    }

    function loadProfile(id) {
        if (!id) return;
        const profile = ProfileManager.getProfileById(id);
        if (profile) {
            document.getElementById('birthDate').value = profile.dob || '';
            document.getElementById('birthTime').value = profile.time || '';
            document.getElementById('birthPlace').value = `Auto-filled (${profile.lat}, ${profile.lng})`;
            Components.showToast('Profile loaded successfully!', 'success');
        }
    }

    return { render, afterRender, calculate, loadProfile };
})();
