/* ============================================
   Vedic Astrology Calculation Engine
   Uses Astronomy Engine (CDN)
   ============================================ */

const AstroCalc = (() => {
    
    // Constants
    const PLANETS = [
        { id: 'Sun', name: 'Sun (Surya)', symbol: 'Su' },
        { id: 'Moon', name: 'Moon (Chandra)', symbol: 'Mo' },
        { id: 'Mars', name: 'Mars (Mangal)', symbol: 'Ma' },
        { id: 'Mercury', name: 'Mercury (Budh)', symbol: 'Me' },
        { id: 'Jupiter', name: 'Jupiter (Guru)', symbol: 'Ju' },
        { id: 'Venus', name: 'Venus (Shukra)', symbol: 'Ve' },
        { id: 'Saturn', name: 'Saturn (Shani)', symbol: 'Sa' }
    ];

    const RASHIS = [
        "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
        "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", 
        "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
        "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
    ];

    /**
     * Approximate Lahiri Ayanamsa for a given year.
     * Formula: 23.85 + (Year - 2000) * (50.29 / 3600)
     */
    function getAyanamsa(year) {
        return 23.85 + ((year - 2000) * (50.29 / 3600));
    }

    /**
     * Get exact tropical longitude of a planet using Astronomy Engine (Geocentric)
     */
    function getPlanetLongitude(body, date) {
        if (typeof Astronomy === 'undefined') return 0;
        // Get the geocentric vector, then convert to ecliptic longitude
        const geoVec = Astronomy.GeoVector(body, date, true);
        const ecliptic = Astronomy.Ecliptic(geoVec);
        return ecliptic.elon;
    }

    /**
     * Calculate Rahu (North Node) longitude
     * Approximate calculation based on mean nodes
     */
    function getRahuLongitude(date) {
        // J2000 is Jan 1.5, 2000
        const d = (date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / 86400000;
        let rahuLon = 259.183275 - (0.0529532115 * d);
        rahuLon = rahuLon % 360;
        if (rahuLon < 0) rahuLon += 360;
        return rahuLon;
    }

    /**
     * Get Rashi (1-12) from sidereal longitude (0-360)
     */
    function getRashiFromLongitude(longitude) {
        let normalized = longitude % 360;
        if (normalized < 0) normalized += 360;
        return Math.floor(normalized / 30) + 1; // 1-indexed (1=Aries)
    }

    /**
     * Calculate approximate Lagna (Ascendant) Rashi
     * Based on Sun's sidereal position and time of birth
     */
    function calculateLagna(date, sunSiderealLon, lat, lon) {
        // This is a simplified Lagna approximation suitable for a V1 client-side engine.
        // In Vedic astrology, the Lagna advances roughly 1 sign every 2 hours.
        // At sunrise, the Lagna is in the same sign as the Sun.
        
        // Approximate local sunrise time to 6:00 AM local time
        const hour = date.getHours();
        const minute = date.getMinutes();
        const timeInHours = hour + (minute / 60);
        
        const hoursSinceSunrise = timeInHours - 6.0;
        
        const sunSign = getRashiFromLongitude(sunSiderealLon); // 1 to 12
        
        // Advance 1 sign every 2 hours
        const signsToAdvance = Math.floor(hoursSinceSunrise / 2);
        
        let lagnaSign = sunSign + signsToAdvance;
        
        // Wrap around 12
        lagnaSign = lagnaSign % 12;
        if (lagnaSign <= 0) lagnaSign += 12;
        
        return lagnaSign;
    }

    /**
     * Generate the complete Kundali chart data
     */
    function generateKundali(birthDate, birthTime, cityObj) {
        // 1. Create a UTC date object for calculations
        // Parse time: "HH:MM"
        const [hh, mm] = birthTime.split(':').map(Number);
        
        // Construct local date and convert to UTC taking the city's timezone into account
        // Note: JS Date assumes the browser's local timezone if we don't force UTC.
        const [year, month, day] = birthDate.split('-').map(Number);
        
        // This is the absolute time at the location
        const utcMs = Date.UTC(year, month - 1, day, hh, mm) - (cityObj.tz * 3600000);
        const calcDate = new Date(utcMs);
        
        const ayanamsa = getAyanamsa(year);

        const chart = {
            details: {
                date: birthDate,
                time: birthTime,
                city: cityObj.name,
                ayanamsa: ayanamsa.toFixed(4)
            },
            planets: [],
            houses: {} // 1 to 12 mapping to arrays of planets
        };

        // Initialize empty houses
        for (let i = 1; i <= 12; i++) chart.houses[i] = [];

        // 2. Calculate Planets
        let sunSiderealLon = 0;

        PLANETS.forEach(p => {
            let tropLon = getPlanetLongitude(p.id, calcDate);
            let siderealLon = tropLon - ayanamsa;
            if (siderealLon < 0) siderealLon += 360;
            
            if (p.id === 'Sun') sunSiderealLon = siderealLon;

            let rashi = getRashiFromLongitude(siderealLon);
            
            chart.planets.push({
                ...p,
                longitude: siderealLon,
                rashi: rashi,
                rashiName: RASHIS[rashi - 1]
            });
        });

        // 3. Add Rahu and Ketu
        let rahuLon = getRahuLongitude(calcDate) - ayanamsa;
        if (rahuLon < 0) rahuLon += 360;
        let ketuLon = (rahuLon + 180) % 360;

        let rahuRashi = getRashiFromLongitude(rahuLon);
        let ketuRashi = getRashiFromLongitude(ketuLon);

        chart.planets.push({ id: 'Rahu', name: 'Rahu', symbol: 'Ra', longitude: rahuLon, rashi: rahuRashi, rashiName: RASHIS[rahuRashi - 1] });
        chart.planets.push({ id: 'Ketu', name: 'Ketu', symbol: 'Ke', longitude: ketuLon, rashi: ketuRashi, rashiName: RASHIS[ketuRashi - 1] });

        // 4. Calculate Lagna (Ascendant)
        const lagnaSign = calculateLagna(calcDate, sunSiderealLon, cityObj.lat, cityObj.lon);
        chart.lagnaRashi = lagnaSign;
        chart.lagnaName = RASHIS[lagnaSign - 1];
        
        // 5. Map Planets to Houses based on Lagna
        // In North Indian Kundali, House 1 is always the Lagna Rashi.
        // House N corresponds to (Lagna Rashi + N - 1) % 12
        
        chart.planets.forEach(p => {
            // How many signs away from Lagna is this planet?
            let houseOffset = p.rashi - lagnaSign;
            if (houseOffset < 0) houseOffset += 12;
            
            let houseNumber = houseOffset + 1; // 1-indexed
            chart.houses[houseNumber].push(p.symbol);
        });

        // Find Moon Sign (Rashi) for user display
        const moon = chart.planets.find(p => p.id === 'Moon');
        if (moon) {
            chart.moonSign = moon.rashiName;
        }

        return chart;
    }

    return { generateKundali, RASHIS };
})();
