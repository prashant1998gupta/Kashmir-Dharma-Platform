/* ============================================
   Panchang Calculation Core
   Shared canonical rules for Panchang elements
   ============================================ */

const PanchangCore = (() => {
    const TITHIS = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ];

    const PAKSHA = ['Shukla Paksha', 'Krishna Paksha'];

    const NAKSHATRAS = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
        'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
        'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
        'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    const RASHIS = [
        'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
        'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
        'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)',
        'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
    ];

    const YOGAS = [
        'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
        'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
        'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
        'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
        'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
        'Indra', 'Vaidhriti'
    ];

    const MOVABLE_KARANAS = [
        'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'
    ];

    const WEEKDAYS = [
        'Sunday (Ravivaar)',
        'Monday (Somvaar)',
        'Tuesday (Mangalvaar)',
        'Wednesday (Budhvaar)',
        'Thursday (Guruvaar)',
        'Friday (Shukravaar)',
        'Saturday (Shanivaar)'
    ];

    function normalizeDegrees(value) {
        const normalized = value % 360;
        return normalized < 0 ? normalized + 360 : normalized;
    }

    function clampIndex(index, max) {
        return Math.max(0, Math.min(max, index));
    }

    function getTithiFromLongitudes(sunLongitude, moonLongitude) {
        const angle = normalizeDegrees(moonLongitude - sunLongitude);
        const index = clampIndex(Math.floor(angle / 12), 29);
        const number = (index % 15) + 1;
        const pakshaIndex = index < 15 ? 0 : 1;
        const progress = (angle - (index * 12)) / 12;

        return {
            index,
            number,
            name: TITHIS[index],
            paksha: PAKSHA[pakshaIndex],
            pakshaIndex,
            angle,
            progress,
            display: `${TITHIS[index]} (${PAKSHA[pakshaIndex]})`
        };
    }

    function getNakshatraFromMoon(moonLongitude) {
        const longitude = normalizeDegrees(moonLongitude);
        const span = 360 / 27;
        const index = clampIndex(Math.floor(longitude / span), 26);
        const withinNakshatra = longitude - (index * span);
        const pada = clampIndex(Math.floor(withinNakshatra / (span / 4)), 3) + 1;
        const progress = withinNakshatra / span;

        return {
            index,
            name: NAKSHATRAS[index],
            pada,
            longitude,
            progress
        };
    }

    function getRashiFromLongitude(longitude) {
        const normalized = normalizeDegrees(longitude);
        const index = clampIndex(Math.floor(normalized / 30), 11);

        return {
            index,
            number: index + 1,
            name: RASHIS[index],
            longitude: normalized,
            degreesInRashi: normalized % 30
        };
    }

    function getYogaFromLongitudes(sunLongitude, moonLongitude) {
        const angle = normalizeDegrees(sunLongitude + moonLongitude);
        const span = 360 / 27;
        const index = clampIndex(Math.floor(angle / span), 26);

        return {
            index,
            number: index + 1,
            name: YOGAS[index],
            angle,
            progress: (angle - (index * span)) / span
        };
    }

    function getKaranaFromLongitudes(sunLongitude, moonLongitude) {
        const angle = normalizeDegrees(moonLongitude - sunLongitude);
        const index = clampIndex(Math.floor(angle / 6), 59);
        let name;

        if (index === 0) {
            name = 'Kimstughna';
        } else if (index === 57) {
            name = 'Shakuni';
        } else if (index === 58) {
            name = 'Chatushpada';
        } else if (index === 59) {
            name = 'Naga';
        } else {
            name = MOVABLE_KARANAS[(index - 1) % MOVABLE_KARANAS.length];
        }

        return {
            index,
            number: index + 1,
            name,
            angle,
            progress: (angle - (index * 6)) / 6
        };
    }

    function getWeekday(weekdayIndex) {
        const index = ((weekdayIndex % 7) + 7) % 7;
        return {
            index,
            name: WEEKDAYS[index]
        };
    }

    function getPanchangFromLongitudes(sunLongitude, moonLongitude, weekdayIndex = null) {
        const panchang = {
            tithi: getTithiFromLongitudes(sunLongitude, moonLongitude),
            nakshatra: getNakshatraFromMoon(moonLongitude),
            rashi: getRashiFromLongitude(moonLongitude),
            yoga: getYogaFromLongitudes(sunLongitude, moonLongitude),
            karana: getKaranaFromLongitudes(sunLongitude, moonLongitude),
            longitudes: {
                sun: normalizeDegrees(sunLongitude),
                moon: normalizeDegrees(moonLongitude)
            }
        };

        if (weekdayIndex !== null && weekdayIndex !== undefined) {
            panchang.vaar = getWeekday(weekdayIndex);
        }

        return panchang;
    }

    return {
        TITHIS,
        PAKSHA,
        NAKSHATRAS,
        RASHIS,
        YOGAS,
        WEEKDAYS,
        normalizeDegrees,
        getTithiFromLongitudes,
        getNakshatraFromMoon,
        getRashiFromLongitude,
        getYogaFromLongitudes,
        getKaranaFromLongitudes,
        getWeekday,
        getPanchangFromLongitudes
    };
})();
