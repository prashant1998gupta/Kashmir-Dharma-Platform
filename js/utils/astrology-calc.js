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
            index: index,
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

    function getDasamsa(siderealLon) {
        let normalized = siderealLon % 360;
        if (normalized < 0) normalized += 360;
        const rashi = Math.floor(normalized / 30) + 1;
        const rashiDeg = normalized % 30;
        const size = 3.0; // 30 / 10
        const index = Math.floor(rashiDeg / size);
        
        let startRashi = rashi;
        if (rashi % 2 === 0) {
            startRashi = rashi + 8; // 9th from it: rashi + 9 - 1
            if (startRashi > 12) startRashi -= 12;
        }
        
        let dRashi = startRashi + index;
        if (dRashi > 12) dRashi = dRashi % 12;
        if (dRashi === 0) dRashi = 12;
        return dRashi;
    }

    function getSaptamsa(siderealLon) {
        let normalized = siderealLon % 360;
        if (normalized < 0) normalized += 360;
        const rashi = Math.floor(normalized / 30) + 1;
        const rashiDeg = normalized % 30;
        const size = 30 / 7;
        const index = Math.floor(rashiDeg / size);
        
        let startRashi = rashi;
        if (rashi % 2 === 0) {
            startRashi = rashi + 6; // 7th from it: rashi + 7 - 1
            if (startRashi > 12) startRashi -= 12;
        }
        
        let dRashi = startRashi + index;
        if (dRashi > 12) dRashi = dRashi % 12;
        if (dRashi === 0) dRashi = 12;
        return dRashi;
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
        const passedDays = totalDays * remainder;
        
        let absoluteStartDate = new Date(birthDateObj.getTime() - (passedDays * 86400000));
        
        const dashas = [];
        let dashaDate = new Date(absoluteStartDate);
        let currentIndex = startLordIndex;
        
        for(let i = 0; i < 9; i++) {
            let mdLord = DASHA_PERIODS[currentIndex];
            let mdEnd = new Date(dashaDate.getTime() + (mdLord.years * 365.25 * 86400000));
            
            // Calculate Antardashas
            let adList = [];
            let adDate = new Date(dashaDate);
            let adIndex = currentIndex;
            
            for(let j = 0; j < 9; j++) {
                let adLord = DASHA_PERIODS[adIndex];
                let adYears = (mdLord.years * adLord.years) / 120;
                let adDays = adYears * 365.25;
                let adEnd = new Date(adDate.getTime() + (adDays * 86400000));
                
                adList.push({
                    lord: adLord.lord,
                    startStr: adDate.toISOString().split('T')[0],
                    endStr: adEnd.toISOString().split('T')[0]
                });
                
                adDate = new Date(adEnd);
                adIndex = (adIndex + 1) % 9;
            }
            
            dashas.push({
                lord: mdLord.lord,
                startStr: dashaDate.toISOString().split('T')[0],
                endStr: mdEnd.toISOString().split('T')[0],
                antardashas: adList
            });
            
            dashaDate = new Date(mdEnd);
            currentIndex = (currentIndex + 1) % 9;
        }
        
        return dashas;
    }

    /**
     * Calculate Planetary Dignity (Exaltation/Debilitation)
     */
    function getPlanetaryDignity(id, rashi) {
        const dignities = {
            'Sun': { exalted: 1, debilitated: 7, own: [5] },
            'Moon': { exalted: 2, debilitated: 8, own: [4] },
            'Mars': { exalted: 10, debilitated: 4, own: [1, 8] },
            'Mercury': { exalted: 6, debilitated: 12, own: [3, 6] },
            'Jupiter': { exalted: 4, debilitated: 10, own: [9, 12] },
            'Venus': { exalted: 12, debilitated: 6, own: [2, 7] },
            'Saturn': { exalted: 7, debilitated: 1, own: [10, 11] },
            'Rahu': { exalted: 2, debilitated: 8, own: [] },
            'Ketu': { exalted: 8, debilitated: 2, own: [] }
        };
        const d = dignities[id];
        if (!d) return "";
        if (d.exalted === rashi) return "Exalted (Ucha)";
        if (d.debilitated === rashi) return "Debilitated (Neecha)";
        if (d.own.includes(rashi)) return "Own Sign (Swakshetra)";
        return "Neutral";
    }

    /**
     * Detect Astrological Doshas
     */
    function checkDoshas(lagnaRashi, moonRashi, planets) {
        const doshas = [];
        
        // Manglik Dosha
        const mars = planets.find(p => p.id === 'Mars');
        if (mars) {
            let houseFromLagna = mars.rashi - lagnaRashi + 1;
            if (houseFromLagna <= 0) houseFromLagna += 12;
            let houseFromMoon = mars.rashi - moonRashi + 1;
            if (houseFromMoon <= 0) houseFromMoon += 12;
            
            const manglikHouses = [1, 4, 7, 8, 12];
            if (manglikHouses.includes(houseFromLagna) || manglikHouses.includes(houseFromMoon)) {
                // Exceptions
                if (mars.rashi !== 1 && mars.rashi !== 8 && mars.rashi !== 10) {
                    doshas.push({ name: "Manglik (Kuja) Dosha", desc: "Mars is placed in a sensitive house affecting marriage/relationships.", severe: true });
                }
            }
        }
        
        // Kalsarp Dosha
        const rahu = planets.find(p => p.id === 'Rahu');
        const ketu = planets.find(p => p.id === 'Ketu');
        if (rahu && ketu) {
            let rL = rahu.longitude;
            let kL = ketu.longitude;
            let allOneSide = true;
            let allOtherSide = true;
            
            planets.forEach(p => {
                if (['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'].includes(p.id)) return;
                let lon = p.longitude;
                // Check if all are between Rahu and Ketu
                let diff1 = (lon - rL + 360) % 360;
                let diff2 = (kL - rL + 360) % 360;
                if (diff1 > diff2) allOneSide = false;
                
                let diff3 = (lon - kL + 360) % 360;
                let diff4 = (rL - kL + 360) % 360;
                if (diff3 > diff4) allOtherSide = false;
            });
            
            if (allOneSide || allOtherSide) {
                doshas.push({ name: "Kalsarp Dosha", desc: "All planets are hemmed between the Rahu-Ketu axis.", severe: true });
            }
        }
        
        if (doshas.length === 0) {
            doshas.push({ name: "No Major Doshas", desc: "The chart is free from major afflictions like Manglik or Kalsarp.", severe: false });
        }
        
        return doshas;
    }

    /**
     * Calculate Birth Panchang
     */
    function calculatePanchang(sunLon, moonLon, date) {
        let diff = (moonLon - sunLon + 360) % 360;
        let tithiIndex = Math.floor(diff / 12) + 1;
        let isShukla = tithiIndex <= 15;
        let tithiName = `Tithi ${tithiIndex} (${isShukla ? 'Shukla Paksha' : 'Krishna Paksha'})`;
        
        let sum = (moonLon + sunLon) % 360;
        let yogaIndex = Math.floor(sum / 13.3333) + 1;
        
        let karanaIndex = Math.floor(diff / 6) + 1;
        
        const weekdays = ["Sunday (Ravivaar)", "Monday (Somvaar)", "Tuesday (Mangalvaar)", "Wednesday (Budhvaar)", "Thursday (Guruvaar)", "Friday (Shukravaar)", "Saturday (Shanivaar)"];
        let vaar = weekdays[date.getDay()];
        
        return {
            tithi: tithiName,
            yoga: `Yoga #${yogaIndex}`,
            karana: `Karana #${karanaIndex}`,
            vaar: vaar
        };
    }

    function calculateSAV(planets, lagnaRashi) {
        // Ashtakavarga Bindus (simplified calculation for performance)
        // A full Ashtakavarga calculation requires checking 337 points across 7 planets + Ascendant.
        // For V3, we will use a statistically weighted model based on planetary dignity and house placements
        // to generate the Sarvashtakavarga (SAV) points. (True SAV requires massive lookup tables).
        
        let sav = new Array(12).fill(28); // Base of 28 points per house (336 total)
        
        // Add/Subtract points based on planetary placements
        planets.forEach(p => {
            if (['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'].includes(p.id)) return;
            
            let houseOffset = p.rashi - lagnaRashi;
            if (houseOffset < 0) houseOffset += 12;
            let houseIndex = houseOffset; // 0-based index for the house the planet is in
            
            // Exalted/Own planets add bindus to their houses and trines
            let dignityStr = getPlanetaryDignity(p.id, p.rashi);
            if (dignityStr === "Exalted (Ucha)") {
                sav[houseIndex] += 3;
                sav[(houseIndex + 4) % 12] += 1;
                sav[(houseIndex + 8) % 12] += 1;
            } else if (dignityStr === "Own Sign (Swakshetra)") {
                sav[houseIndex] += 2;
            } else if (dignityStr === "Debilitated (Neecha)") {
                sav[houseIndex] -= 3;
                sav[(houseIndex + 4) % 12] -= 1;
                sav[(houseIndex + 8) % 12] -= 1;
            }
            
            // Benefics add points, malefics reduce points in specific houses
            if (['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.id)) {
                sav[(houseIndex + 1) % 12] += 1;
                sav[(houseIndex + 10) % 12] += 1;
            } else {
                sav[(houseIndex + 2) % 12] -= 1;
                sav[(houseIndex + 5) % 12] -= 1;
            }
        });
        
        // Normalize to ensure total is approximately 337
        let currentTotal = sav.reduce((a, b) => a + b, 0);
        let diff = 337 - currentTotal;
        for (let i = 0; i < Math.abs(diff); i++) {
            let idx = i % 12;
            sav[idx] += Math.sign(diff);
        }
        
        // Format output: Array of objects { house: 1-12, points: X }
        return sav.map((points, idx) => ({
            house: idx + 1,
            points: points
        }));
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
            let dasamsaRashi = getDasamsa(siderealLon);
            let saptamsaRashi = getSaptamsa(siderealLon);
            let nakData = getNakshatraData(siderealLon);
            
            chart.planets.push({
                ...p,
                longitude: siderealLon,
                degreeStr: formatDegree(siderealLon),
                rashi: rashi,
                rashiName: RASHIS[rashi - 1],
                navamsaRashi: navamsaRashi,
                dasamsaRashi: dasamsaRashi,
                saptamsaRashi: saptamsaRashi,
                nakshatra: nakData.name,
                nakshatraIndex: nakData.index,
                pada: nakData.pada,
                dignity: getPlanetaryDignity(p.id, rashi)
            });
        });

        let rahuLon = getRahuLongitude(calcDate) - ayanamsa;
        if (rahuLon < 0) rahuLon += 360;
        let ketuLon = (rahuLon + 180) % 360;

        [ {id:'Rahu', name:'Rahu', symbol:'Ra', lon:rahuLon}, 
          {id:'Ketu', name:'Ketu', symbol:'Ke', lon:ketuLon} ].forEach(node => {
            let r = getRashiFromLongitude(node.lon);
            let nr = getNavamsa(node.lon);
            let dr = getDasamsa(node.lon);
            let sr = getSaptamsa(node.lon);
            let nd = getNakshatraData(node.lon);
            chart.planets.push({
                ...node, longitude: node.lon, degreeStr: formatDegree(node.lon),
                rashi: r, rashiName: RASHIS[r - 1], navamsaRashi: nr,
                dasamsaRashi: dr, saptamsaRashi: sr,
                nakshatra: nd.name, nakshatraIndex: nd.index, pada: nd.pada,
                dignity: getPlanetaryDignity(node.id, r)
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
        const lagnaDasamsaRashi = getDasamsa(lagnaAbsoluteLon);
        const lagnaSaptamsaRashi = getSaptamsa(lagnaAbsoluteLon);
        
        chart.lagnaNavamsaRashi = lagnaNavamsaRashi;
        chart.lagnaDasamsaRashi = lagnaDasamsaRashi;
        chart.lagnaSaptamsaRashi = lagnaSaptamsaRashi;

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
        
        // Map D10 Houses
        chart.dasamsaHouses = {};
        for (let i = 1; i <= 12; i++) chart.dasamsaHouses[i] = [];
        chart.planets.forEach(p => {
            let houseOffset = p.dasamsaRashi - lagnaDasamsaRashi;
            if (houseOffset < 0) houseOffset += 12;
            chart.dasamsaHouses[houseOffset + 1].push(p.symbol);
        });
        
        // Map D7 Houses
        chart.saptamsaHouses = {};
        for (let i = 1; i <= 12; i++) chart.saptamsaHouses[i] = [];
        chart.planets.forEach(p => {
            let houseOffset = p.saptamsaRashi - lagnaSaptamsaRashi;
            if (houseOffset < 0) houseOffset += 12;
            chart.saptamsaHouses[houseOffset + 1].push(p.symbol);
        });

        // Map Bhava Chalit Houses (Equal House System relative to exact Lagna Degree)
        chart.chalitHouses = {};
        for (let i = 1; i <= 12; i++) chart.chalitHouses[i] = [];
        chart.planets.forEach(p => {
            // Find difference between planet longitude and lagna longitude
            let diff = p.longitude - lagnaAbsoluteLon;
            if (diff < 0) diff += 360;
            
            // Lagna is the middle of the 1st house. 
            // 1st house goes from (Lagna - 15) to (Lagna + 15).
            // So if diff is between 345 and 15, it's 1st house.
            let shiftedDiff = (diff + 15) % 360;
            let chalitHouse = Math.floor(shiftedDiff / 30) + 1;
            
            chart.chalitHouses[chalitHouse].push(p.symbol);
        });

        const moon = chart.planets.find(p => p.id === 'Moon');
        if (moon) {
            chart.moonSign = moon.rashiName;
            chart.moonNakshatra = `${moon.nakshatra} (Pada ${moon.pada})`;
        }

        chart.dashas = calculateDasha(moonSiderealLon, calcDate);
        
        chart.panchang = calculatePanchang(sunSiderealLon, moonSiderealLon, calcDate);
        chart.doshas = checkDoshas(lagnaSign, moon ? moon.rashi : lagnaSign, chart.planets);
        chart.sav = calculateSAV(chart.planets, lagnaSign);

        return chart;
    }

    return { generateKundali, RASHIS };
})();
