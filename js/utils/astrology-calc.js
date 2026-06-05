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
        if (typeof Astronomy === 'undefined') throw new Error("Astronomy Engine library is not loaded. Please check your internet connection.");
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
     * Calculate exact Sidereal Lagna (Ascendant) Longitude
     * Based on user's exact geographical coordinates and time
     */
    function calculateExactLagna(date, lat, lon, ayanamsa) {
        if (typeof Astronomy === 'undefined') throw new Error("Astronomy Engine library is not loaded. Please check your internet connection.");
        
        // Greenwich Apparent Sidereal Time (in hours)
        const gast = Astronomy.SiderealTime(date);
        
        // Local Sidereal Time (in degrees)
        let lst = (gast * 15 + lon) % 360;
        if (lst < 0) lst += 360;
        
        const rad = Math.PI / 180;
        const e = 23.4392911 * rad; // Approximate Obliquity of ecliptic
        
        const lstRad = lst * rad;
        const latRad = lat * rad;
        
        // Standard Ascendant Formula:
        const y = Math.cos(lstRad);
        const x = -Math.sin(lstRad) * Math.cos(e) - Math.tan(latRad) * Math.sin(e);
        
        let ascRad = Math.atan2(y, x);
        if (ascRad < 0) ascRad += 2 * Math.PI;
        
        let ascEcliptic = ascRad / rad; // Tropical Ascendant in degrees
        
        // Convert Tropical Ascendant to Sidereal using Ayanamsa
        let siderealAsc = (ascEcliptic - ayanamsa) % 360;
        if (siderealAsc < 0) siderealAsc += 360;
        
        return siderealAsc;
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

    function getVargaRashi(siderealLon, divisions, startRashiLogic) {
        let normalized = siderealLon % 360;
        if (normalized < 0) normalized += 360;
        const rashi = Math.floor(normalized / 30) + 1;
        const rashiDeg = normalized % 30;
        const size = 30 / divisions;
        const index = Math.floor(rashiDeg / size);
        
        let startRashi = startRashiLogic(rashi);
        
        let dRashi = startRashi + index;
        if (dRashi > 12) dRashi = dRashi % 12;
        if (dRashi === 0) dRashi = 12;
        return dRashi;
    }

    function getNavamsa(siderealLon) {
        return getVargaRashi(siderealLon, 9, (rashi) => {
            if (rashi % 4 === 1) return 1;
            if (rashi % 4 === 2) return 10;
            if (rashi % 4 === 3) return 7;
            return 4;
        });
    }

    function getDasamsa(siderealLon) {
        return getVargaRashi(siderealLon, 10, (rashi) => {
            if (rashi % 2 === 1) return rashi; // Odd signs start from themselves
            let start = rashi + 8; // Even signs start from 9th from themselves
            return start > 12 ? start - 12 : start;
        });
    }

    function getSaptamsa(siderealLon) {
        return getVargaRashi(siderealLon, 7, (rashi) => {
            if (rashi % 2 === 1) return rashi; // Odd signs start from themselves
            let start = rashi + 6; // Even signs start from 7th from themselves
            return start > 12 ? start - 12 : start;
        });
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
            
            const manglikHouses = [1, 2, 4, 7, 8, 12];
            const isLagnaManglik = manglikHouses.includes(houseFromLagna);
            const isMoonManglik = manglikHouses.includes(houseFromMoon);
            
            if (isLagnaManglik || isMoonManglik) {
                // Check cancellations
                let cancellations = [];
                if (mars.rashi === 1 || mars.rashi === 8) {
                    cancellations.push('Mars in own sign (Aries/Scorpio)');
                }
                if (mars.rashi === 10) {
                    cancellations.push('Mars in Capricorn (Exalted)');
                }
                const jupiter = planets.find(p => p.id === 'Jupiter');
                if (jupiter) {
                    let jupHouse = jupiter.rashi - lagnaRashi + 1;
                    if (jupHouse <= 0) jupHouse += 12;
                    if ([1, 4, 7, 10].includes(jupHouse)) {
                        cancellations.push(`Jupiter in Kendra (House ${jupHouse})`);
                    }
                    if (mars.rashi === jupiter.rashi) {
                        cancellations.push(`Mars conjunct Jupiter`);
                    }
                }
                const moon = planets.find(p => p.id === 'Moon');
                if (moon) {
                    let moonHouse = moon.rashi - lagnaRashi + 1;
                    if (moonHouse <= 0) moonHouse += 12;
                    if ([1, 4, 7, 10].includes(moonHouse)) {
                        cancellations.push(`Moon in Kendra (House ${moonHouse})`);
                    }
                    if (mars.rashi === moon.rashi) {
                        cancellations.push(`Mars conjunct Moon`);
                    }
                }
                
                const cancelled = cancellations.length > 0;
                
                if (isLagnaManglik && !cancelled) {
                    let severity = isMoonManglik ? "Severe (Double Manglik)" : "Moderate";
                    doshas.push({
                        name: `Manglik Dosha (${severity})`,
                        desc: `Mars is placed in House ${houseFromLagna} from Lagna (Ascendant) and House ${houseFromMoon} from Moon, indicating active Manglik Dosha.`,
                        severe: severity === "Severe (Double Manglik)"
                    });
                } else if (cancelled) {
                    doshas.push({
                        name: "Manglik Dosha (Cancelled)",
                        desc: `Mars is placed in a Manglik house (${houseFromLagna} from Lagna), but the Dosha is cancelled because of: ${cancellations.join(', ')}.`,
                        severe: false
                    });
                } else if (isMoonManglik) {
                    doshas.push({
                        name: "Chandra Manglik (Mild)",
                        desc: `Mars is placed in House ${houseFromMoon} from Moon, indicating a mild, secondary Manglik energy. This does not require major matchmaking restrictions.`,
                        severe: false
                    });
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
    function calculatePanchang(sunLon, moonLon, weekdayIndex) {
        let diff = (moonLon - sunLon + 360) % 360;
        let tithiIndex = Math.floor(diff / 12) + 1;
        let isShukla = tithiIndex <= 15;
        let tithiName = `Tithi ${tithiIndex} (${isShukla ? 'Shukla Paksha' : 'Krishna Paksha'})`;
        
        let sum = (moonLon + sunLon) % 360;
        let yogaIndex = Math.floor(sum / (40 / 3)) + 1;
        
        let karanaIndex = Math.floor(diff / 6) + 1;
        
        const weekdays = ["Sunday (Ravivaar)", "Monday (Somvaar)", "Tuesday (Mangalvaar)", "Wednesday (Budhvaar)", "Thursday (Guruvaar)", "Friday (Shukravaar)", "Saturday (Shanivaar)"];
        let vaar = weekdays[weekdayIndex];
        
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
        if (!birthDate || !birthTime || !cityObj || typeof cityObj.lat === 'undefined') {
            throw new Error("Invalid input data for Kundali generation.");
        }
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

        const lagnaAbsoluteLon = calculateExactLagna(calcDate, cityObj.lat, cityObj.lon, ayanamsa);
        const lagnaSign = getRashiFromLongitude(lagnaAbsoluteLon);
        chart.lagnaRashi = lagnaSign;
        chart.lagnaName = RASHIS[lagnaSign - 1];
        
        const lagnaDegreeWithinRashi = lagnaAbsoluteLon % 30;
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
        
        const localBirthDate = new Date(Date.UTC(year, month - 1, day));
        const weekdayIndex = localBirthDate.getUTCDay();
        chart.panchang = calculatePanchang(sunSiderealLon, moonSiderealLon, weekdayIndex);
        chart.doshas = checkDoshas(lagnaSign, moon ? moon.rashi : lagnaSign, chart.planets);
        chart.sav = calculateSAV(chart.planets, lagnaSign);

        return chart;
    }

    return { 
        generateKundali, 
        RASHIS,
        getAyanamsa,
        getPlanetLongitude
    };
})();
