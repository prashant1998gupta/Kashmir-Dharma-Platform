/* ============================================
   Hindu Birthday (Janma Tithi) Finder Page
   ============================================ */

const BirthdayPage = (() => {
    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: typeof I18n !== 'undefined' ? I18n.t('nav.home', 'Home') : 'Home', href: '#home' },
                    { label: typeof I18n !== 'undefined' ? I18n.t('birthday.title', 'Janma Tithi Finder') : 'Janma Tithi Finder' }
                ])}

                ${Components.sectionHeader(
                    typeof I18n !== 'undefined' ? I18n.t('birthday.header', 'Hindu Birthday (Janma Tithi) Finder') : 'Hindu Birthday (Janma Tithi) Finder',
                    typeof I18n !== 'undefined' ? I18n.t('birthday.desc', 'Find your Hindu birthday based on the traditional lunar calendar. Enter your birth details to discover your Tithi, Nakshatra, and Rashi.') : 'Find your Hindu birthday based on the traditional lunar calendar. Enter your birth details to discover your Tithi, Nakshatra, and Rashi.',
                    { h1: true }
                )}

                <div class="grid-2" style="align-items: start">
                    <!-- Input Form -->
                    ${Components.card(`
                        ${ProfileManager.renderProfileSelector('birthdayProfileSelect', 'BirthdayPage.loadProfile')}
                        <h3 style="margin-bottom: var(--space-6)">🎂 ${typeof I18n !== 'undefined' ? I18n.t('birthday.enter_details', 'Enter Your Birth Details') : 'Enter Your Birth Details'}</h3>
                        
                        <div class="form-group mb-4">
                            <label class="form-label" for="birthDate">${typeof I18n !== 'undefined' ? I18n.t('birthday.dob', 'Date of Birth') : 'Date of Birth'}</label>
                            <input type="date" class="form-input" id="birthDate" required>
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="birthTime">${typeof I18n !== 'undefined' ? I18n.t('birthday.tob', 'Time of Birth (optional)') : 'Time of Birth (optional)'}</label>
                            <input type="time" class="form-input" id="birthTime" value="12:00">
                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="birthPlace">${typeof I18n !== 'undefined' ? I18n.t('birthday.place', 'Place of Birth (optional)') : 'Place of Birth (optional)'}</label>
                            <input type="text" class="form-input" id="birthPlace" placeholder="${typeof I18n !== 'undefined' ? I18n.t('birthday.place_placeholder', 'e.g., Srinagar, Jammu, Delhi') : 'e.g., Srinagar, Jammu, Delhi'}">
                        </div>

                        <div class="form-group mb-6">
                            <label class="form-label" for="targetYear">${typeof I18n !== 'undefined' ? I18n.t('birthday.year', 'Show Hindu Birthday For Year') : 'Show Hindu Birthday For Year'}</label>
                            <input type="number" class="form-input" id="targetYear" value="${new Date().getFullYear()}" min="2000" max="2050">
                        </div>

                        <button class="btn btn-primary w-full" onclick="BirthdayPage.calculate()">
                            ${typeof I18n !== 'undefined' ? I18n.t('birthday.find_btn', '🔍 Find My Janma Tithi') : '🔍 Find My Janma Tithi'}
                        </button>
                    `, { glass: true })}

                    <!-- Info Card -->
                    ${Components.card(`
                        <h3 style="margin-bottom: var(--space-4)">📖 ${typeof I18n !== 'undefined' ? I18n.t('birthday.what_is', 'What is Janma Tithi?') : 'What is Janma Tithi?'}</h3>
                        <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                            ${typeof I18n !== 'undefined' ? I18n.t('birthday.what_is_p1', 'In the Hindu tradition, birthdays are often celebrated according to the lunar calendar (Panchang) rather than the Gregorian calendar.') : 'In the Hindu tradition, birthdays are often celebrated according to the lunar calendar (Panchang) rather than the Gregorian calendar.'}
                        </p>
                        <p style="font-size: var(--text-sm); margin-bottom: var(--space-4)">
                            ${typeof I18n !== 'undefined' ? I18n.t('birthday.what_is_p2', 'Your Janma Tithi is the lunar day on which you were born. The Hindu birthday falls on the same Tithi each year, but the corresponding Gregorian date changes.') : 'Your Janma Tithi is the lunar day on which you were born. The Hindu birthday falls on the same Tithi each year, but the corresponding Gregorian date changes.'}
                        </p>
                        <div class="accordion">
                            <div class="accordion-item" id="info-tithi">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-tithi')">
                                    <span>${typeof I18n !== 'undefined' ? I18n.t('birthday.what_tithi', 'What is a Tithi?') : 'What is a Tithi?'}</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        ${typeof I18n !== 'undefined' ? I18n.t('birthday.tithi_desc', 'A Tithi is a lunar day, the time it takes for the Moon to gain 12 degrees over the Sun. There are 30 Tithis in a lunar month, 15 in Shukla Paksha and 15 in Krishna Paksha.') : 'A Tithi is a lunar day, the time it takes for the Moon to gain 12 degrees over the Sun. There are 30 Tithis in a lunar month, 15 in Shukla Paksha and 15 in Krishna Paksha.'}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" id="info-nakshatra">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-nakshatra')">
                                    <span>${typeof I18n !== 'undefined' ? I18n.t('birthday.what_nakshatra', 'What is a Nakshatra?') : 'What is a Nakshatra?'}</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        ${typeof I18n !== 'undefined' ? I18n.t('birthday.nakshatra_desc', 'Nakshatras are 27 lunar mansions or star constellations through which the Moon travels. Your birth Nakshatra is determined by the Moon position at the time of your birth.') : 'Nakshatras are 27 lunar mansions or star constellations through which the Moon travels. Your birth Nakshatra is determined by the Moon position at the time of your birth.'}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" id="info-rashi">
                                <button class="accordion-header" onclick="Components.toggleAccordion('info-rashi')">
                                    <span>${typeof I18n !== 'undefined' ? I18n.t('birthday.what_rashi', 'What is a Rashi?') : 'What is a Rashi?'}</span>
                                    <span class="accordion-arrow">▼</span>
                                </button>
                                <div class="accordion-body">
                                    <div class="accordion-content">
                                        ${typeof I18n !== 'undefined' ? I18n.t('birthday.rashi_desc', 'Rashi is your zodiac sign based on the Moon position at birth, not the Sun sign used in Western astrology. There are 12 Rashis, each spanning 30 degrees of the zodiac.') : 'Rashi is your zodiac sign based on the Moon position at birth, not the Sun sign used in Western astrology. There are 12 Rashis, each spanning 30 degrees of the zodiac.'}
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
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('birthday.enter_dob_warning', 'Please enter your date of birth') : 'Please enter your date of birth', 'warning');
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
                
                <h2 style="margin-bottom: var(--space-6); text-align: center">${typeof I18n !== 'undefined' ? I18n.t('birthday.results_title', 'Your Hindu Birth Details') : 'Your Hindu Birth Details'}</h2>

                <!-- Birth Details Cards -->
                <div class="grid-4 mb-8">
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">🌙</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${typeof I18n !== 'undefined' ? I18n.tAstro(hinduDate.tithi.name) : hinduDate.tithi.name}</div>
                            <div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('birthday.janma_tithi', 'Janma Tithi') : 'Janma Tithi'}</div>
                            <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-2)">${typeof I18n !== 'undefined' ? I18n.tAstro(hinduDate.tithi.paksha) : hinduDate.tithi.paksha}</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">⭐</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${typeof I18n !== 'undefined' ? I18n.tAstro(hinduDate.nakshatra.name) : hinduDate.nakshatra.name}</div>
                            <div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('birthday.birth_nakshatra', 'Birth Nakshatra') : 'Birth Nakshatra'}</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">♈</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${typeof I18n !== 'undefined' ? I18n.tAstro(hinduDate.rashi.name) : hinduDate.rashi.name}</div>
                            <div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('birthday.moon_rashi', 'Moon Rashi') : 'Moon Rashi'}</div>
                        </div>
                    `)}
                    ${Components.card(`
                        <div class="stat-card">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2)">📅</div>
                            <div class="stat-value" style="font-size: var(--text-xl)">${typeof I18n !== 'undefined' ? I18n.tAstro(hinduDate.hinduMonth.name) : hinduDate.hinduMonth.name}</div>
                            <div class="stat-label">${typeof I18n !== 'undefined' ? I18n.t('birthday.hindu_month', 'Hindu Month') : 'Hindu Month'}</div>
                        </div>
                    `)}
                </div>

                <!-- Hindu Birthday Dates -->
                <h3 style="margin-bottom: var(--space-4)">🎂 ${typeof I18n !== 'undefined' ? I18n.t('birthday.hindu_birthday_in', 'Hindu Birthday in') : 'Hindu Birthday in'} ${targetYear}</h3>
                ${janmaTithiDates.length > 0 ? `
                    <div class="grid-auto">
                        ${janmaTithiDates.map((jt, i) => Components.card(`
                            <div class="flex items-center gap-4">
                                <div style="font-size: 2rem">🎂</div>
                                <div>
                                    <div style="font-size: var(--text-lg); font-weight: 700; color: var(--color-secondary)">
                                        ${jt.gregorianDate.toLocaleDateString(typeof I18n !== 'undefined' && I18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div style="font-size: var(--text-sm); color: var(--text-secondary)">
                                        ${typeof I18n !== 'undefined' ? I18n.tAstro(jt.hinduMonth.name) : jt.hinduMonth.name} ${typeof I18n !== 'undefined' ? I18n.tAstro(jt.tithi.paksha) : jt.tithi.paksha} ${typeof I18n !== 'undefined' ? I18n.tAstro(jt.tithi.name) : jt.tithi.name}
                                    </div>
                                    ${jt.approximate ? `<span class="badge badge-primary mt-2">${typeof I18n !== 'undefined' ? I18n.t('birthday.approximate', 'Approximate') : 'Approximate'}</span>` : ''}
                                </div>
                            </div>
                        `, { featured: i === 0 })).join('')}
                    </div>
                ` : `
                    ${Components.card(`
                        <p style="text-align: center; color: var(--text-secondary)">
                            ${(typeof I18n !== 'undefined' ? I18n.t('birthday.not_found', 'Could not determine exact Hindu birthday for {year}. Please consult with a Panchang expert for accurate calculation.') : 'Could not determine exact Hindu birthday for {year}. Please consult with a Panchang expert for accurate calculation.').replace('{year}', targetYear)}
                        </p>
                    `)}
                `}

                <!-- Disclaimer -->
                <div class="mt-6">
                    ${Components.card(`
                        <div class="flex items-center gap-3">
                            <span style="font-size: 1.5rem">⚠️</span>
                            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
                                ${typeof I18n !== 'undefined' ? I18n.t('birthday.note', '<strong>Note:</strong> These calculations are based on astronomical algorithms and may have slight variations from traditional Panchang calculations. For precise results, especially for important ceremonies, please consult with a knowledgeable Kashmiri Pandit priest or astrologer.') : '<strong>Note:</strong> These calculations are based on astronomical algorithms and may have slight variations from traditional Panchang calculations. For precise results, especially for important ceremonies, please consult with a knowledgeable Kashmiri Pandit priest or astrologer.'}
                            </p>
                        </div>
                    `, { compact: true })}
                </div>
            </div>
        `;

        setTimeout(() => {
            Components.initScrollReveal();
            const res = document.getElementById('birthdayResults');
            if (res) {
                const y = res.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        }, 150);
    }

    function loadProfile(id) {
        if (!id) return;
        const profile = ProfileManager.getProfileById(id);
        if (profile) {
            document.getElementById('birthDate').value = profile.dob || '';
            document.getElementById('birthTime').value = profile.time || '';
            document.getElementById('birthPlace').value = `${typeof I18n !== 'undefined' ? I18n.t('kundali.auto_filled', 'Auto-filled') : 'Auto-filled'} (${profile.lat}, ${profile.lng})`;
            Components.showToast(typeof I18n !== 'undefined' ? I18n.t('profile.loaded_success', 'Profile loaded successfully!') : 'Profile loaded successfully!', 'success');
        }
    }

    return { render, afterRender, calculate, loadProfile };
})();
