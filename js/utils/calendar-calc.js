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

    /**
     * Get Sun longitude in degrees for a given JD
     */
    function getSunLongitude(jd) {
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
        return sunLong;
    }

    /**
     * Get Moon longitude in degrees for a given JD
     */
    function getMoonLongitude(jd) {
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
        return moonLong;
    }

    /**
     * Calculate Tithi from Moon-Sun angle difference
     * Each tithi spans 12 degrees
     */
    function calculateTithi(jd) {
        const sunLong = getSunLongitude(jd);
        const moonLong = getMoonLongitude(jd);
        let diff = moonLong - sunLong;
        if (diff < 0) diff += 360;
        const tithiIndex = Math.floor(diff / 12);
        return {
            index: tithiIndex,
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
        const nakshatraIndex = Math.floor(moonLong / (360 / 27));
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
        const rashiIndex = Math.floor(moonLong / 30);
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
        const monthIndex = Math.floor(sunLong / 30);
        // Solar month to lunar month mapping (approximate)
        return {
            index: monthIndex,
            name: HINDU_MONTHS[monthIndex]
        };
    }

    /**
     * Complete Hindu calendar info for a Gregorian date
     */
    function getHinduDate(year, month, day, hour = 12, minute = 0) {
        const dayFraction = (hour + minute / 60) / 24;
        const jd = gregorianToJD(year, month, day) + dayFraction;
        
        const tithi = calculateTithi(jd);
        const nakshatra = calculateNakshatra(jd);
        const rashi = calculateRashi(jd);
        const hinduMonth = calculateHinduMonth(jd);

        return {
            tithi,
            nakshatra,
            rashi,
            hinduMonth,
            jd
        };
    }

    /**
     * Find dates in a year where the tithi matches the birth tithi
     * (for Hindu birthday calculation)
     */
    function findJanmaTithiDates(birthYear, birthMonth, birthDay, targetYear) {
        const birthJD = gregorianToJD(birthYear, birthMonth, birthDay) + 0.5;
        const birthTithi = calculateTithi(birthJD);
        const birthHinduMonth = calculateHinduMonth(birthJD);
        
        const results = [];
        // Scan each day of the target year
        for (let m = 1; m <= 12; m++) {
            const daysInMonth = new Date(targetYear, m, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const jd = gregorianToJD(targetYear, m, d) + 0.5;
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
                    const jd = gregorianToJD(targetYear, m, d) + 0.5;
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
     * Determine if a date is auspicious based on basic Panchang rules
     */
    function isAuspicious(year, month, day, eventType) {
        const jd = gregorianToJD(year, month, day) + 0.5;
        const tithi = calculateTithi(jd);
        const nakshatra = calculateNakshatra(jd);
        const dayOfWeek = new Date(year, month - 1, day).getDay();

        // Generally auspicious tithis: 2, 3, 5, 7, 10, 11, 13
        const auspiciousTithis = [1, 2, 4, 6, 9, 10, 12]; // 0-indexed within paksha
        const tithiInPaksha = tithi.index % 15;
        
        // Generally auspicious nakshatras
        const auspiciousNakshatras = [0, 2, 3, 6, 7, 10, 11, 12, 16, 21, 24, 25, 26]; // indices

        const isTithiGood = auspiciousTithis.includes(tithiInPaksha);
        const isNakshatraGood = auspiciousNakshatras.includes(nakshatra.index);
        
        // Avoid Tuesdays and Saturdays for most events
        const isDayGood = ![2, 6].includes(dayOfWeek);

        let score = 0;
        if (isTithiGood) score += 3;
        if (isNakshatraGood) score += 3;
        if (isDayGood) score += 2;
        if (tithi.pakshaIndex === 0) score += 1; // Shukla paksha slightly preferred

        return {
            score,
            maxScore: 9,
            isRecommended: score >= 6,
            tithi,
            nakshatra,
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
            reasons: [
                isTithiGood ? `✅ ${tithi.name} is an auspicious tithi` : `⚠️ ${tithi.name} — consider another tithi`,
                isNakshatraGood ? `✅ ${nakshatra.name} nakshatra is favorable` : `⚠️ ${nakshatra.name} nakshatra — verify with scholar`,
                isDayGood ? `✅ Day is generally suitable` : `⚠️ This day is traditionally avoided for new beginnings`
            ]
        };
    }

    /**
     * Get auspicious dates in a date range for a given event type
     */
    function findAuspiciousDates(startDate, endDate, eventType) {
        const results = [];
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;
            const day = current.getDate();
            
            const result = isAuspicious(year, month, day, eventType);
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

    // Public API
    return {
        getHinduDate,
        findJanmaTithiDates,
        isAuspicious,
        findAuspiciousDates,
        HINDU_MONTHS,
        TITHIS,
        NAKSHATRAS,
        RASHIS,
        PAKSHA
    };
})();
