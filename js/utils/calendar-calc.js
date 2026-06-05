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

        // Convert to Sidereal (Lahiri Ayanamsa)
        const ayanamsa = 23.85 + (T * 1.397);
        sunLong = (sunLong - ayanamsa) % 360;
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

        // Convert to Sidereal (Lahiri Ayanamsa)
        const ayanamsa = 23.85 + (T * 1.397);
        moonLong = (moonLong - ayanamsa) % 360;
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
        // Solar to Lunar mapping: Lunar month relates to Sun transit + 1
        const monthIndex = (Math.floor(sunLong / 30) + 1) % 12;
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

        let score = 0;
        let maxScore = 9;
        
        if (isTithiGood) { score += 3; reasons.push(`✅ ${tithi.name} is highly favorable`); }
        else if (isTithiBad) { score -= 3; reasons.push(`🚫 ${tithi.name} should be avoided`); }
        else { reasons.push(`⚠️ ${tithi.name} is neutral`); }
        
        if (isNakshatraGood) { score += 2; reasons.push(`✅ ${nakshatra.name} nakshatra is favorable`); }
        else { reasons.push(`⚠️ ${nakshatra.name} nakshatra is neutral`); }
        
        if (isDayGood) { score += 3; reasons.push(`✅ ${dayName} is an excellent day`); }
        else if (isDayBad) { score -= 3; reasons.push(`🚫 ${dayName} is traditionally avoided`); }
        else { reasons.push(`⚠️ ${dayName} is acceptable`); }
        
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
        HINDU_MONTHS,
        TITHIS,
        NAKSHATRAS,
        RASHIS,
        PAKSHA
    };
})();
