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

    const NAKSHATRAS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    const DASHA_PERIODS = [
        { lord: "Ketu", years: 7 },
        { lord: "Venus", years: 20 },
        { lord: "Sun", years: 6 },
        { lord: "Moon", years: 10 },
        { lord: "Mars", years: 7 },
        { lord: "Rahu", years: 18 },
        { lord: "Jupiter", years: 16 },
        { lord: "Saturn", years: 19 },
        { lord: "Mercury", years: 17 }
    ];

    function getNakshatraData(siderealLon) {
        let normalized = siderealLon % 360;
        if (normalized < 0) normalized += 360;
        const nakshatraSize = 13 + (20/60);
        const totalIndex = normalized / nakshatraSize;
        const index = Math.floor(totalIndex);
        const remainder = totalIndex - index;
        const pada = Math.floor(remainder * 4) + 1;
        const lordIndex = index % 9;
        
        return {
            name: NAKSHATRAS[index],
            pada: pada,
            lord: DASHA_PERIODS[lordIndex].lord,
            percentRemaining: 1 - remainder
        };
    }

    function getNavamsa(siderealLon) {
        let normalized = siderealLon % 360;
        if (normalized < 0) normalized += 360;
        const rashi = Math.floor(normalized / 30) + 1;
        const rashiDeg = normalized % 30;
        const navamsaSize = 3 + (20/60);
        const navamsaIndex = Math.floor(rashiDeg / navamsaSize);
        
        let startRashi = 1;
        if (rashi % 4 === 1) startRashi = 1;
        else if (rashi % 4 === 2) startRashi = 10;
        else if (rashi % 4 === 3) startRashi = 7;
        else if (rashi % 4 === 0) startRashi = 4;
        
        let navamsaRashi = startRashi + navamsaIndex;
        if (navamsaRashi > 12) navamsaRashi = navamsaRashi % 12;
        if (navamsaRashi === 0) navamsaRashi = 12;
        return navamsaRashi;
    }

    function formatDegree(lon) {
        const degInRashi = lon % 30;
        const d = Math.floor(degInRashi);
        const m = Math.floor((degInRashi - d) * 60);
        return `${d}° ${m}'`;
    }

    function calculateDasha(moonSiderealLon, birthDateObj) {
        let normalized = moonSiderealLon % 360;
        if (normalized < 0) normalized += 360;
        const nakshatraSize = 13 + (20/60);
        const totalIndex = normalized / nakshatraSize;
        const index = Math.floor(totalIndex);
        const remainder = totalIndex - index;
        const startLordIndex = index % 9;
        const startLord = DASHA_PERIODS[startLordIndex];
        
        const totalDays = startLord.years * 365.25;
        const balanceDays = totalDays * (1 - remainder);
        
        let currentDashaStart = new Date(birthDateObj.getTime());
        let currentDashaEnd = new Date(birthDateObj.getTime() + balanceDays * 86400000);
        
        const dashas = [];
        dashas.push({
            lord: startLord.lord,
            startYear: currentDashaStart.getFullYear(),
            endYear: currentDashaEnd.getFullYear()
        });
        
        let dashaDate = new Date(currentDashaEnd);
        let currentIndex = (startLordIndex + 1) % 9;
        
        for(let i = 0; i < 9; i++) {
            let lord = DASHA_PERIODS[currentIndex];
            let endDasha = new Date(dashaDate.getTime() + (lord.years * 365.25 * 86400000));
            dashas.push({
                lord: lord.lord,
                startYear: dashaDate.getFullYear(),
                endYear: endDasha.getFullYear()
            });
            dashaDate = new Date(endDasha);
            currentIndex = (currentIndex + 1) % 9;
        }
        return dashas;
    }

    /**
     * Generate the complete Kundali chart data
     */
    function generateKundali(birthDate, birthTime, cityObj) {
        const [hh, mm] = birthTime.split(':').map(Number);
        const [year, month, day] = birthDate.split('-').map(Number);
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
            houses: {}, // D1
            navamsaHouses: {}, // D9
            dashas: []
        };

        for (let i = 1; i <= 12; i++) {
            chart.houses[i] = [];
            chart.navamsaHouses[i] = [];
        }

        let sunSiderealLon = 0;
        let moonSiderealLon = 0;

        PLANETS.forEach(p => {
            let tropLon = getPlanetLongitude(p.id, calcDate);
            let siderealLon = tropLon - ayanamsa;
            if (siderealLon < 0) siderealLon += 360;
            
            if (p.id === 'Sun') sunSiderealLon = siderealLon;
            if (p.id === 'Moon') moonSiderealLon = siderealLon;

            let rashi = getRashiFromLongitude(siderealLon);
            let navamsaRashi = getNavamsa(siderealLon);
            let nakData = getNakshatraData(siderealLon);
            
            chart.planets.push({
                ...p,
                longitude: siderealLon,
                degreeStr: formatDegree(siderealLon),
                rashi: rashi,
                rashiName: RASHIS[rashi - 1],
                navamsaRashi: navamsaRashi,
                nakshatra: nakData.name,
                pada: nakData.pada
            });
        });

        let rahuLon = getRahuLongitude(calcDate) - ayanamsa;
        if (rahuLon < 0) rahuLon += 360;
        let ketuLon = (rahuLon + 180) % 360;

        [ {id:'Rahu', name:'Rahu', symbol:'Ra', lon:rahuLon}, 
          {id:'Ketu', name:'Ketu', symbol:'Ke', lon:ketuLon} ].forEach(node => {
            let r = getRashiFromLongitude(node.lon);
            let nr = getNavamsa(node.lon);
            let nd = getNakshatraData(node.lon);
            chart.planets.push({
                ...node, longitude: node.lon, degreeStr: formatDegree(node.lon),
                rashi: r, rashiName: RASHIS[r - 1], navamsaRashi: nr,
                nakshatra: nd.name, pada: nd.pada
            });
        });

        const lagnaSign = calculateLagna(calcDate, sunSiderealLon, cityObj.lat, cityObj.lon);
        chart.lagnaRashi = lagnaSign;
        chart.lagnaName = RASHIS[lagnaSign - 1];
        
        // Approximate Lagna degree based on time since sunrise (very simplified)
        // 1 sign = 30 degrees = 2 hours. So 1 hour = 15 degrees.
        const hoursSinceSunrise = (calcDate.getHours() + (calcDate.getMinutes()/60)) - 6.0;
        const lagnaDegreeWithinRashi = ((hoursSinceSunrise % 2) / 2) * 30;
        const lagnaAbsoluteLon = ((lagnaSign - 1) * 30) + lagnaDegreeWithinRashi;
        const lagnaNavamsaRashi = getNavamsa(lagnaAbsoluteLon);
        chart.lagnaNavamsaRashi = lagnaNavamsaRashi;

        // Map D1 Houses
        chart.planets.forEach(p => {
            let houseOffset = p.rashi - lagnaSign;
            if (houseOffset < 0) houseOffset += 12;
            chart.houses[houseOffset + 1].push(p.symbol);
        });

        // Map D9 Houses
        chart.planets.forEach(p => {
            let houseOffset = p.navamsaRashi - lagnaNavamsaRashi;
            if (houseOffset < 0) houseOffset += 12;
            chart.navamsaHouses[houseOffset + 1].push(p.symbol);
        });

        const moon = chart.planets.find(p => p.id === 'Moon');
        if (moon) {
            chart.moonSign = moon.rashiName;
            chart.moonNakshatra = `${moon.nakshatra} (Pada ${moon.pada})`;
        }

        chart.dashas = calculateDasha(moonSiderealLon, calcDate);

        return chart;
    }

    return { generateKundali, RASHIS };
})();
