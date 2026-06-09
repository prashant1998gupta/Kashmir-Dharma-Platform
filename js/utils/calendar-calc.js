/* ============================================
   Calendar Calculation Utilities
   Hindu Lunar Calendar Conversions
   ============================================ */

const CalendarCalc = (() => {
    // Hindu month names
    const HINDU_MONTHS = [
        'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
        'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika',
        'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
    ];

    // Tithi names (1-30)
    const TITHIS = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ];

    // Paksha
    const PAKSHA = ['Shukla Paksha (Bright Half)', 'Krishna Paksha (Dark Half)'];

    // Nakshatra names (27)
    const NAKSHATRAS = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
        'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
        'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
        'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    // Rashi (zodiac) names
    const RASHIS = [
        'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
        'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
        'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)',
        'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
    ];

    // Nakshatra to Rashi mapping (each rashi spans 2.25 nakshatras)
    const NAKSHATRA_RASHI_MAP = [
        0, 0, 1, 1, 2, 2, 2, 3, 3, 4,
        4, 5, 5, 5, 6, 6, 7, 7, 8, 8,
        8, 9, 9, 10, 10, 11, 11
    ];

    /**
     * Calculate Julian Day Number from Gregorian date
     */
    function gregorianToJD(year, month, day) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (year + 4716)) +
               Math.floor(30.6001 * (month + 1)) +
               day + B - 1524.5;
    }

    function jdToDate(jd) {
        return new Date((jd - 2440587.5) * 86400000);
    }

    function getMeanLahiriAyanamsa(jd) {
        const date = jdToDate(jd);
        if (typeof AstroCalc !== 'undefined' && typeof AstroCalc.getAyanamsa === 'function') {
            return AstroCalc.getAyanamsa(date);
        }

        const yearsSinceJ2000 = (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / (86400000 * 365.24219052);
        return (23 + (51 / 60) + (11 / 3600)) + (yearsSinceJ2000 * (50.290966 / 3600));
    }

    /**
     * Fallback Sun longitude in degrees for a given JD.
     */
    function getApproxSunLongitude(jd) {
        const T = (jd - 2451545.0) / 36525.0;
        let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
        let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
        M = M * Math.PI / 180;
        const C = (1.914602 - 0.004817 * T) * Math.sin(M)
                + 0.019993 * Math.sin(2 * M)
                + 0.000289 * Math.sin(3 * M);
        let sunLong = L0 + C;
        // Normalize
        sunLong = sunLong % 360;
        if (sunLong < 0) sunLong += 360;

        // Convert to Sidereal (Lahiri Ayanamsa)
        const ayanamsa = getMeanLahiriAyanamsa(jd);
        sunLong = (sunLong - ayanamsa) % 360;
        if (sunLong < 0) sunLong += 360;

        return sunLong;
    }

    /**
     * Fallback Moon longitude in degrees for a given JD.
     */
    function getApproxMoonLongitude(jd) {
        const T = (jd - 2451545.0) / 36525.0;
        let Lp = 218.3165 + 481267.8813 * T;
        let D = 297.8502 + 445267.1115 * T;
        let M = 357.5291 + 35999.0503 * T;
        let Mp = 134.9634 + 477198.8676 * T;
        let F = 93.2720 + 483202.0175 * T;

        // Convert to radians
        const toRad = d => d * Math.PI / 180;
        D = toRad(D); M = toRad(M); Mp = toRad(Mp); F = toRad(F);

        let moonLong = Lp
            + 6.289 * Math.sin(Mp)
            + 1.274 * Math.sin(2 * D - Mp)
            + 0.658 * Math.sin(2 * D)
            + 0.214 * Math.sin(2 * Mp)
            - 0.186 * Math.sin(M)
            - 0.114 * Math.sin(2 * F);

        moonLong = moonLong % 360;
        if (moonLong < 0) moonLong += 360;

        // Convert to Sidereal (Lahiri Ayanamsa)
        const ayanamsa = getMeanLahiriAyanamsa(jd);
        moonLong = (moonLong - ayanamsa) % 360;
        if (moonLong < 0) moonLong += 360;

        return moonLong;
    }

    function getSiderealLongitude(body, jd, fallbackFn) {
        if (typeof AstroCalc !== 'undefined' && typeof AstroCalc.getPlanetLongitude === 'function' && typeof Astronomy !== 'undefined') {
            try {
                const date = jdToDate(jd);
                const tropicalLongitude = AstroCalc.getPlanetLongitude(body, date);
                const ayanamsa = AstroCalc.getAyanamsa(date);
                const normalized = typeof PanchangCore !== 'undefined'
                    ? PanchangCore.normalizeDegrees(tropicalLongitude - ayanamsa)
                    : ((tropicalLongitude - ayanamsa) % 360 + 360) % 360;
                return normalized;
            } catch (error) {
                console.warn(`Falling back to approximate ${body} longitude`, error);
            }
        }

        return fallbackFn(jd);
    }

    /**
     * Get sidereal Sun longitude in degrees for a given JD.
     */
    function getSunLongitude(jd) {
        return getSiderealLongitude('Sun', jd, getApproxSunLongitude);
    }

    /**
     * Get sidereal Moon longitude in degrees for a given JD.
     */
    function getMoonLongitude(jd) {
        return getSiderealLongitude('Moon', jd, getApproxMoonLongitude);
    }

    /**
     * Calculate Tithi from Moon-Sun angle difference
     * Each tithi spans 12 degrees
     */
    function calculateTithi(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        if (typeof PanchangCore !== 'undefined') {
            return PanchangCore.getTithiFromLongitudes(sunLong, moonLong);
        }

        let diff = moonLong - sunLong;
        if (diff < 0) diff += 360;
        const tithiIndex = Math.min(29, Math.floor(diff / 12));
        return {
            index: tithiIndex,
            number: (tithiIndex % 15) + 1,
            name: TITHIS[tithiIndex],
            paksha: tithiIndex < 15 ? PAKSHA[0] : PAKSHA[1],
            pakshaIndex: tithiIndex < 15 ? 0 : 1
        };
    }

    /**
     * Calculate Nakshatra from Moon longitude
     * Each nakshatra spans 13°20' (13.333...°)
     */
    function calculateNakshatra(jd) {
        const moonLong = getMoonLongitude(jd);
        if (typeof PanchangCore !== 'undefined') {
            return PanchangCore.getNakshatraFromMoon(moonLong);
        }

        const nakshatraIndex = Math.min(26, Math.floor(moonLong / (360 / 27)));
        return {
            index: nakshatraIndex,
            name: NAKSHATRAS[nakshatraIndex]
        };
    }

    /**
     * Calculate Rashi from Moon position
     */
    function calculateRashi(jd) {
        const moonLong = getMoonLongitude(jd);
        if (typeof PanchangCore !== 'undefined') {
            return PanchangCore.getRashiFromLongitude(moonLong);
        }

        const rashiIndex = Math.min(11, Math.floor(moonLong / 30));
        return {
            index: rashiIndex,
            name: RASHIS[rashiIndex]
        };
    }

    /**
     * Get approximate Hindu month from Sun longitude
     */
    function calculateHinduMonth(jd) {
        const sunLong = getSunLongitude(jd);
        // Solar to Lunar mapping: Lunar month relates to Sun transit + 1
        const monthIndex = (Math.floor(sunLong / 30) + 1) % 12;
        return {
            index: monthIndex,
            name: HINDU_MONTHS[monthIndex]
        };
    }

    function calculateYoga(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        if (typeof PanchangCore !== 'undefined') {
            return PanchangCore.getYogaFromLongitudes(sunLong, moonLong);
        }

        return {
            index: 0,
            number: 1,
            name: 'Vishkumbha'
        };
    }

    function calculateKarana(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        if (typeof PanchangCore !== 'undefined') {
            return PanchangCore.getKaranaFromLongitudes(sunLong, moonLong);
        }

        return {
            index: 0,
            number: 1,
            name: 'Kimstughna'
        };
    }

    /**
     * Complete Hindu calendar info for a Gregorian date
     */
    function getHinduDate(year, month, day, hour = 12, minute = 0) {
        const dayFraction = (hour + minute / 60) / 24;
        const jd = gregorianToJD(year, month, day) + dayFraction;
        const sunLongitude = getSunLongitude(jd);
        const moonLongitude = getMoonLongitude(jd);
        const monthIndex = (Math.floor(sunLongitude / 30) + 1) % 12;

        const panchang = typeof PanchangCore !== 'undefined'
            ? PanchangCore.getPanchangFromLongitudes(sunLongitude, moonLongitude)
            : null;

        const tithi = panchang ? panchang.tithi : calculateTithi(jd);
        const nakshatra = panchang ? panchang.nakshatra : calculateNakshatra(jd);
        const rashi = panchang ? panchang.rashi : calculateRashi(jd);
        const yoga = panchang ? panchang.yoga : calculateYoga(jd);
        const karana = panchang ? panchang.karana : calculateKarana(jd);
        const hinduMonth = {
            index: monthIndex,
            name: HINDU_MONTHS[monthIndex]
        };

        return {
            tithi,
            nakshatra,
            rashi,
            hinduMonth,
            yoga,
            karana,
            sunLongitude,
            moonLongitude,
            jd,
            calculationMode: typeof Astronomy !== 'undefined' ? 'Astronomy Engine + mean Lahiri ayanamsa' : 'Fallback approximate solar/lunar series'
        };
    }

    /**
     * Find dates in a year where the tithi matches the birth tithi
     * (for Hindu birthday calculation)
     */
    function findJanmaTithiDates(birthYear, birthMonth, birthDay, targetYear) {
        const birthJD = gregorianToJD(birthYear, birthMonth, birthDay);
        const birthTithi = calculateTithi(birthJD);
        const birthHinduMonth = calculateHinduMonth(birthJD);
        
        const results = [];
        // Scan each day of the target year
        for (let m = 1; m <= 12; m++) {
            const daysInMonth = new Date(targetYear, m, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const jd = gregorianToJD(targetYear, m, d);
                const tithi = calculateTithi(jd);
                const hinduMonth = calculateHinduMonth(jd);
                
                if (tithi.index === birthTithi.index && hinduMonth.index === birthHinduMonth.index) {
                    results.push({
                        gregorianDate: new Date(targetYear, m - 1, d),
                        tithi: tithi,
                        hinduMonth: hinduMonth
                    });
                }
            }
        }
        
        // If exact month+tithi not found, find closest tithi match
        if (results.length === 0) {
            for (let m = 1; m <= 12; m++) {
                const daysInMonth = new Date(targetYear, m, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    const jd = gregorianToJD(targetYear, m, d);
                    const tithi = calculateTithi(jd);
                    if (tithi.index === birthTithi.index) {
                        const hinduMonth = calculateHinduMonth(jd);
                        if (Math.abs(hinduMonth.index - birthHinduMonth.index) <= 1 ||
                            Math.abs(hinduMonth.index - birthHinduMonth.index) >= 11) {
                            results.push({
                                gregorianDate: new Date(targetYear, m - 1, d),
                                tithi: tithi,
                                hinduMonth: hinduMonth,
                                approximate: true
                            });
                        }
                    }
                }
            }
        }
        
        return results;
    }
    /**
     * Determine Sunrise and Sunset times using Astronomy Engine
     */
    function calculateSunriseSunset(date, lat, lon) {
        if (typeof Astronomy === 'undefined') return null;
        
        const observer = new Astronomy.Observer(lat, lon, 0);
        const nextSunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, date, 1);
        const nextSunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, 1);
        
        return {
            sunrise: nextSunrise ? nextSunrise.date : null,
            sunset: nextSunset ? nextSunset.date : null
        };
    }

    /**
     * Calculate Brahma Muhurat (96 minutes before sunrise, lasting 48 minutes)
     */
    function calculateBrahmaMuhurat(sunrise) {
        if (!sunrise) return null;
        const brahmaStart = new Date(sunrise.getTime() - (96 * 60000));
        const brahmaEnd = new Date(sunrise.getTime() - (48 * 60000));
        return { start: brahmaStart, end: brahmaEnd };
    }

    /**
     * Calculate Abhijit Muhurat (midday +/- 24 minutes)
     */
    function calculateAbhijitMuhurat(sunrise, sunset) {
        if (!sunrise || !sunset) return null;
        const daylightMs = sunset.getTime() - sunrise.getTime();
        const midday = new Date(sunrise.getTime() + (daylightMs / 2));
        const abhijitStart = new Date(midday.getTime() - (24 * 60000));
        const abhijitEnd = new Date(midday.getTime() + (24 * 60000));
        return { start: abhijitStart, end: abhijitEnd };
    }

    /**
     * Calculate Rahu Kalam based on day of week and exact Sunrise/Sunset
     */
    function calculateRahuKalam(sunrise, sunset, dayOfWeek) {
        if (!sunrise || !sunset) return null;
        
        // Duration of daylight in ms
        const daylightMs = sunset.getTime() - sunrise.getTime();
        const segmentMs = daylightMs / 8; // 8 segments of daylight
        
        // Rahu Kalam segment index (0 to 7) based on Day of Week
        // Sunday: 7, Monday: 1, Tuesday: 6, Wednesday: 4, Thursday: 5, Friday: 3, Saturday: 2
        const rahuSegments = [7, 1, 6, 4, 5, 3, 2];
        const segIndex = rahuSegments[dayOfWeek];
        
        const rahuStart = new Date(sunrise.getTime() + (segIndex * segmentMs));
        const rahuEnd = new Date(rahuStart.getTime() + segmentMs);
        
        return { start: rahuStart, end: rahuEnd };
    }

    /**
     * Calculate Daytime Choghadiya (8 segments of 1/8th daylight each)
     */
    function calculateChoghadiya(sunrise, sunset, dayOfWeek) {
        if (!sunrise || !sunset) return [];
        
        const daylightMs = sunset.getTime() - sunrise.getTime();
        const segmentMs = daylightMs / 8;
        
        const choghadiyaOrder = [
            ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Sun
            ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh'], // Mon
            ['Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Tue
            ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal'], // Wed
            ['Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal'], // Thu
            ['Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Fri
            ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit']  // Sat
        ];
        
        const order = choghadiyaOrder[dayOfWeek];
        const segments = [];
        
        for (let i = 0; i < 8; i++) {
            // 8th segment wraps around to the 1st
            const name = order[i % 7];
            const isGood = ['Amrit', 'Shubh', 'Labh'].includes(name);
            const isNeutral = ['Chal'].includes(name);
            const isBad = ['Rog', 'Udveg', 'Kaal'].includes(name);
            
            segments.push({
                name,
                start: new Date(sunrise.getTime() + (i * segmentMs)),
                end: new Date(sunrise.getTime() + ((i + 1) * segmentMs)),
                isGood, isNeutral, isBad
            });
        }
        
        return segments;
    }

    /**
     * Calculate Tara Bala (Star Strength)
     * birthNakshatra: 0-26, transitNakshatra: 0-26
     * Returns: score (1-9), isGood (boolean)
     */
    function calculateTaraBala(birthNakshatra, transitNakshatra) {
        let diff = (transitNakshatra - birthNakshatra);
        if (diff < 0) diff += 27;
        
        const taraBala = (diff % 9) + 1; // 1 to 9
        // 3 (Vipat), 5 (Pratyak), 7 (Naidhana) are bad
        const isGood = ![3, 5, 7].includes(taraBala);
        
        const names = ["Janma (Neutral)", "Sampat (Wealth)", "Vipat (Danger)", "Kshema (Prosperity)", "Pratyak (Obstacles)", "Sadhaka (Achievement)", "Naidhana (Severe Danger)", "Mitra (Friendly)", "Ati-Mitra (Very Friendly)"];
        
        return { score: taraBala, isGood, name: names[taraBala - 1] };
    }

    /**
     * Calculate Chandra Bala (Moon Strength)
     */
    function calculateChandraBala(birthRashi, transitRashi) {
        let diff = (transitRashi - birthRashi) + 1;
        if (diff <= 0) diff += 12;
        
        // 6, 8, 12 houses from birth moon are bad
        const isGood = ![6, 8, 12].includes(diff);
        return { position: diff, isGood };
    }

    /**
     * Determine if a date is auspicious based on event-specific Panchang rules, location, and user profile
     */
    function isAuspicious(year, month, day, eventRecs, cityObj = null, userProfile = null) {
        const jd = gregorianToJD(year, month, day);
        const tithi = calculateTithi(jd);
        const nakshatra = calculateNakshatra(jd);
        const dateObj = new Date(year, month - 1, day, 12, 0, 0); // Noon
        const dayOfWeek = dateObj.getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

        let isTithiGood = false;
        let isTithiBad = false;
        let isDayGood = false;
        let isDayBad = false;
        let reasons = [];

        if (eventRecs) {
            let baseTithiName = tithi.name;
            isTithiGood = eventRecs.preferredTithis.includes(baseTithiName);
            isTithiBad = eventRecs.avoidTithis.includes(baseTithiName);
            isDayGood = eventRecs.goodDays.includes(dayName);
            isDayBad = eventRecs.avoidDays.includes(dayName);
        } else {
            const auspiciousTithis = [1, 2, 4, 6, 9, 10, 12];
            const tithiInPaksha = tithi.index % 15;
            isTithiGood = auspiciousTithis.includes(tithiInPaksha);
            isDayGood = ![2, 6].includes(dayOfWeek);
            isDayBad = [2, 6].includes(dayOfWeek);
        }
        
        const auspiciousNakshatras = [0, 2, 3, 6, 7, 10, 11, 12, 16, 21, 24, 25, 26];
        const isNakshatraGood = auspiciousNakshatras.includes(nakshatra.index);

        const TITHI_LORE = {
            'Pratipada': 'the 1st lunar day, ruled by Agni (Fire). In practical terms, this gives a spark of high energy to your plans. It is like lighting a new lamp—perfect for starting something fresh that needs a lot of initial momentum.',
            'Dwitiya': 'the 2nd lunar day, ruled by Lord Brahma (the Creator). For you, this means any foundation you lay today will be rock-solid. It is an excellent day for building things that you want to last a lifetime.',
            'Tritiya': 'the 3rd lunar day, blessed by Goddess Parvati. This is incredibly auspicious for you because it brings the divine mother\'s protection. Whatever you begin today will enjoy a long life, endless prosperity, and bring immense peace to your family.',
            'Panchami': 'the 5th lunar day, protected by the Nagas (Divine Serpents). This day acts as a spiritual shield. If you start a journey or project today, it will be protected from hidden enemies, jealousy, and unforeseen obstacles.',
            'Saptami': 'the 7th lunar day, ruled by the Sun God (Surya). Just as the sun brings light, this day brings extreme clarity, leadership, and glowing success to your endeavors. It is perfect when you want your work to be recognized by others.',
            'Dashami': 'the 10th lunar day, associated with discipline and order. If you need to start a business, sign contracts, or do something that requires strict rules and success over competitors, the energy of this day will support you perfectly.',
            'Ekadashi': 'the 11th lunar day, deeply sacred to Lord Vishnu. This is a day of extreme purity. Any activity done today carries spiritual merit. It brings peaceful preservation, meaning whatever you acquire today will stay with you safely without causing stress.',
            'Trayodashi': 'the 13th lunar day, dedicated to Lord Shiva. This day is a destroyer of bad karma. It is exceptionally good for overcoming past failures and achieving a spiritual or material triumph when all odds are against you.',
            'Purnima': 'the Full Moon day. The moon is at its absolute brightest, radiating massive positive energy. This signifies 100% fullness and absolute completion, making it a highly blessed day for major life events and celebrations.',
            'Chaturthi': 'the 4th lunar day, ruled by Lord Ganesha. While Ganesha removes obstacles, this specific day is generally considered "empty" for material gains like buying items. It is better used for clearing out old debts or fighting off problems.',
            'Ashtami': 'the 8th lunar day. This day carries a very heavy, transformative energy. It is great for deep spiritual practices or ending bad habits, but it is traditionally avoided for happy, material beginnings like weddings or purchases.',
            'Navami': 'the 9th lunar day, ruled by Goddess Durga. This is an aggressive, fierce day. It is highly successful if you need to win a court case or defeat an adversary, but it is too sharp and aggressive for peaceful events like buying a home.',
            'Chaturdashi': 'the 14th lunar day, carrying fierce and unpredictable energy. In our tradition, this day is entirely avoided for gentle, happy, or long-term auspicious activities as it can bring sudden, unwanted changes.',
            'Amavasya': 'the New Moon day. The moon is completely hidden, meaning there is zero lunar energy available to nourish your new beginnings. This day is strictly reserved for honoring ancestors and meditating, not for worldly tasks.'
        };

        const DAY_LORE = {
            'Monday': 'ruled by the Moon (Chandra). The moon controls our emotions and peace of mind. Doing this today ensures that your decision will bring you emotional happiness, a steady flow of income, and a very calm, stress-free experience.',
            'Wednesday': 'ruled by Mercury (Budha), the planet of intelligence and communication. This means your plans today will be executed swiftly and smartly, without any confusion or miscommunication. It is perfect for paperwork and deals.',
            'Thursday': 'ruled by Jupiter (Brihaspati), the Guru of all planets. Jupiter is the ultimate planet of massive wealth, luck, and divine protection. Choosing Thursday almost guarantees supreme wisdom, financial growth, and blessings from above.',
            'Friday': 'ruled by Venus (Shukra), the planet of luxury, beauty, and love. If you are buying a vehicle, gold, or a home today, Venus ensures it will be beautiful, comfortable, and bring harmonious relationships into your life.',
            'Sunday': 'ruled by the Sun (Surya). The Sun brings steadfast authority and power. While it is good for government work or taking charge, its fiery heat can sometimes be too aggressive for very gentle, family-oriented events.',
            'Tuesday': 'ruled by Mars (Mangala), the planet of war and fire. Mars brings highly aggressive energy. While excellent for surgeries or taking bold risks, it is traditionally avoided for peaceful milestones to prevent arguments or accidents.',
            'Saturday': 'ruled by Saturn (Shani). Saturn is the slowest moving planet and represents delays, hard work, and heavy karmic lessons. Because it slows things down, we generally avoid starting fresh, happy things on Saturdays.'
        };

        const NAK_LORE = {
            'Rohini': 'a "fixed" star. Think of it like planting a massive Banyan tree. Whatever you start under Rohini will establish deep, unshakeable roots, making it absolutely perfect for long-lasting investments like property or marriage.',
            'Mrigashira': 'a "gentle" star that brings a very sweet, curious, and joyous energy. Starting things today ensures that your experience will be pleasant, stress-free, and filled with happy little moments rather than intense drama.',
            'Uttara Phalguni': 'a star that guarantees deep social success and patronage. If you start something today, you will receive immense support from your community, friends, and family, making it highly favored for weddings and social events.',
            'Hasta': 'represented by a "hand". This star gives you the dexterity and ability to literally "grasp" success. It brings quick manifestation, meaning your desires and plans will turn into reality very quickly and smoothly.',
            'Chitra': 'the star of beautiful design and opportunity. This brings extreme aesthetic brilliance to your endeavor. If you are buying a car, clothes, or a house today, they will turn out to be exceptionally beautiful and eye-catching.',
            'Anuradha': 'the star of friendship and devotion. It fosters extremely cooperative energy. If your event requires teamwork, partnerships, or bringing families together, Anuradha ensures everyone gets along perfectly without conflict.',
            'Uttara Ashadha': 'known as the "Universal Star of Undisputed Victory". It guarantees that no matter what obstacles come your way, you will win in the end. It provides a long-lasting, unshakeable success that cannot be easily broken.',
            'Revati': 'the very last star, ruled by the nourisher. It offers an incredibly sweet, gentle, and wealthy completion to your new beginnings. It ensures that your journey is safe, well-fed, and ends happily without any bumps.',
            'Ashwini': 'the star of the divine physicians. It brings miraculous, lightning-fast energy. If you need something done swiftly, or if you need rapid healing and movement, Ashwini provides the quick burst of horsepower you need.',
            'Pushya': 'widely considered the absolute best and most nourishing star in astrology. It acts like a caring mother. Anything started under Pushya is guaranteed to receive absolute divine care, flourishing growth, and extreme good luck.'
        };

        const getI18n = (key, fallback) => typeof I18n !== 'undefined' ? I18n.t(key, fallback) : fallback;

        let score = 0;
        let maxScore = 9;
        
        let tLore = getI18n('lore.tithi.' + tithi.name, TITHI_LORE[tithi.name] || 'bringing neutral lunar energy.');
        if (isTithiGood) { 
            score += 3; 
            reasons.push(`✅ <strong>${tithi.name} ${getI18n('lore.favorable', 'is highly favorable')}:</strong> ${tLore}`); 
        } else if (isTithiBad) { 
            score -= 3; 
            reasons.push(`🚫 <strong>${tithi.name} ${getI18n('lore.avoid', 'should be avoided')}:</strong> ${tLore}`); 
        } else { 
            reasons.push(`⚠️ <strong>${tithi.name} ${getI18n('lore.neutral', 'is neutral')}:</strong> ${tLore}`); 
        }
        
        let nLore = getI18n('lore.nak.' + nakshatra.name, NAK_LORE[nakshatra.name] || 'providing standard cosmic influences.');
        if (isNakshatraGood) { 
            score += 2; 
            reasons.push(`✅ <strong>${nakshatra.name} nakshatra ${getI18n('lore.favorable', 'is favorable')}:</strong> ${nLore}`); 
        } else { 
            reasons.push(`⚠️ <strong>${nakshatra.name} nakshatra ${getI18n('lore.neutral', 'is neutral')}:</strong> ${nLore}`); 
        }
        
        let dLore = getI18n('lore.day.' + dayName, DAY_LORE[dayName] || 'providing standard solar energy.');
        if (isDayGood) { 
            score += 3; 
            reasons.push(`✅ <strong>${dayName} ${getI18n('lore.excellent_day', 'is an excellent day')}:</strong> ${dLore}`); 
        } else if (isDayBad) { 
            score -= 3; 
            reasons.push(`🚫 <strong>${dayName} ${getI18n('lore.avoid_day', 'is traditionally avoided')}:</strong> ${dLore}`); 
        } else { 
            reasons.push(`⚠️ <strong>${dayName} ${getI18n('lore.acceptable', 'is acceptable')}:</strong> ${dLore}`); 
        }
        
        if (tithi.pakshaIndex === 0) { score += 1; }

        let choghadiya = [];
        let rahuKalam = null;
        
        // Exact daily timings
        if (cityObj) {
            const sunData = calculateSunriseSunset(dateObj, cityObj.lat, cityObj.lon);
            if (sunData && sunData.sunrise && sunData.sunset) {
                rahuKalam = calculateRahuKalam(sunData.sunrise, sunData.sunset, dayOfWeek);
                choghadiya = calculateChoghadiya(sunData.sunrise, sunData.sunset, dayOfWeek);
            }
        }
        
        // Personalization
        let personalCompat = null;
        if (userProfile && userProfile.nakshatraIndex !== undefined) {
            maxScore += 5; // Increase max score for personal checks
            
            const tara = calculateTaraBala(userProfile.nakshatraIndex, nakshatra.index);
            let rashiIndex = NAKSHATRA_RASHI_MAP[nakshatra.index] + 1; // 1-12
            const chandra = calculateChandraBala(userProfile.lagnaRashi || 1, rashiIndex); // Use rashi from profile or fallback
            
            personalCompat = { tara, chandra };
            
            if (tara.isGood) {
                score += 3;
                reasons.push(`🌟 Tara Bala: ${tara.name} (Excellent)`);
            } else {
                score -= 2;
                reasons.push(`⚠️ Tara Bala: ${tara.name} (Unfavorable)`);
            }
            
            if (chandra.isGood) {
                score += 2;
                reasons.push(`🌟 Chandra Bala: Favorable Moon Transit`);
            } else {
                score -= 2;
                reasons.push(`⚠️ Chandra Bala: Moon in ${chandra.position}th house (Unfavorable)`);
            }
        }

        // Adjust recommendation threshold based on maxScore
        const threshold = maxScore * 0.55;

        return {
            score,
            maxScore,
            isRecommended: score >= threshold && !isTithiBad && !isDayBad && (!personalCompat || (personalCompat.tara.isGood && personalCompat.chandra.isGood)),
            tithi,
            nakshatra,
            dayOfWeek: dayName,
            reasons,
            rahuKalam,
            choghadiya,
            personalCompat
        };
    }

    /**
     * Get auspicious dates in a date range for a given event type, optionally personalized
     */
    function findAuspiciousDates(startDate, endDate, eventRecs, cityObj = null, userProfile = null) {
        const results = [];
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;
            const day = current.getDate();
            
            const result = isAuspicious(year, month, day, eventRecs, cityObj, userProfile);
            if (result.isRecommended) {
                results.push({
                    date: new Date(current),
                    ...result
                });
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Find the Gregorian date for a specific Hindu festival in a given year
     * @param {number} targetYear 
     * @param {string} hinduMonthName (e.g., 'Chaitra')
     * @param {number} pakshaIndex 0 for Shukla, 1 for Krishna
     * @param {string} tithiName (e.g., 'Pratipada')
     */
    function findFestivalDate(targetYear, hinduMonthName, pakshaIndex, tithiName) {
        const targetMonthIndex = HINDU_MONTHS.findIndex(m => m.toLowerCase().includes(hinduMonthName.toLowerCase()) || hinduMonthName.toLowerCase().includes(m.toLowerCase()));
        
        let matches = [];

        for (let m = 1; m <= 12; m++) {
            const daysInMonth = new Date(targetYear, m, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const jd = gregorianToJD(targetYear, m, d);
                // Check both Sunrise (jd) and Noon (jd + 0.5) to catch Kshaya (skipped) Tithis
                const tithiSunrise = calculateTithi(jd);
                const tithiNoon = calculateTithi(jd + 0.5);
                const hinduMonth = calculateHinduMonth(jd);
                
                const matchesTithi = (tithiSunrise.pakshaIndex === pakshaIndex && tithiSunrise.name.toLowerCase() === tithiName.toLowerCase()) || 
                                     (tithiNoon.pakshaIndex === pakshaIndex && tithiNoon.name.toLowerCase() === tithiName.toLowerCase());

                if (matchesTithi) {
                    let diff = 0;
                    if (targetMonthIndex !== -1) {
                        diff = Math.abs(hinduMonth.index - targetMonthIndex);
                        if (diff === 11) diff = 1; // Wrap around for Phalguna/Chaitra
                    }
                    
                    if (diff <= 1) {
                        matches.push({
                            date: new Date(targetYear, m - 1, d),
                            diff: diff
                        });
                    }
                }
            }
        }

        if (matches.length > 0) {
            // Sort by exact month match first (diff = 0)
            matches.sort((a, b) => {
                if (a.diff !== b.diff) return a.diff - b.diff;
                return a.date - b.date;
            });
            return matches[0].date;
        }

        return null;
    }

    // Public API
    return {
        getHinduDate,
        findJanmaTithiDates,
        isAuspicious,
        findAuspiciousDates,
        findFestivalDate,
        calculateTithi,
        calculateNakshatra,
        calculateRashi,
        calculateYoga,
        calculateKarana,
        getSunLongitude,
        getMoonLongitude,
        calculateSunriseSunset,
        calculateBrahmaMuhurat,
        calculateAbhijitMuhurat,
        calculateRahuKalam,
        HINDU_MONTHS,
        TITHIS,
        NAKSHATRAS,
        RASHIS,
        PAKSHA
    };
})();
