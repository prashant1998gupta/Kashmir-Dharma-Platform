/* ============================================
   Vedic Astrology Annual Horoscope Engine
   Varshphal / Tajika System — Professional Grade
   ============================================ */

const VarshphalCalc = (() => {

    const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const LORDS_MAP = { 1:'Mars', 2:'Venus', 3:'Mercury', 4:'Moon', 5:'Sun', 6:'Mercury', 7:'Venus', 8:'Mars', 9:'Jupiter', 10:'Saturn', 11:'Saturn', 12:'Jupiter' };
    const WEEKDAY_LORDS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];

    /**
     * Find exact Solar Return time (Varshapravesh)
     */
    function findSolarReturn(natalSunLon, birthDate, targetYear, byear) {
        const yearsDiff = targetYear - byear;
        let approxTime = birthDate.getTime() + (yearsDiff * 365.25636 * 24 * 60 * 60 * 1000);
        let testDate = new Date(approxTime);
        let diff = 999, iterations = 0;
        
        while (Math.abs(diff) > 0.0001 && iterations < 25) {
            const testYear = testDate.getUTCFullYear();
            const ayanamsa = AstroCalc.getAyanamsa(testYear);
            let currentSunLon = (AstroCalc.getPlanetLongitude('Sun', testDate) - ayanamsa) % 360;
            if (currentSunLon < 0) currentSunLon += 360;
            diff = currentSunLon - natalSunLon;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            const daysCorrection = diff / 0.9856;
            approxTime -= (daysCorrection * 24 * 60 * 60 * 1000);
            testDate = new Date(approxTime);
            iterations++;
        }
        return testDate;
    }

    /**
     * Calculate Muntha
     */
    function calculateMuntha(natalLagnaRashi, ageInYears) {
        let muntha = (natalLagnaRashi + ageInYears) % 12;
        if (muntha === 0) muntha = 12;
        return muntha;
    }

    /**
     * Calculate Muntha House (relative to Varsha Lagna)
     */
    function getMunthaHouse(munthaRashi, varshaLagnaRashi) {
        let house = munthaRashi - varshaLagnaRashi;
        if (house < 0) house += 12;
        return house + 1;
    }

    /**
     * Pancha-Adhikari (5 Year Lords) Calculation
     */
    function calculatePanchadhikari(natalChart, varshaChart, returnDate, munthaRashi, tz) {
        const lords = [];
        
        // 1. Muntha Lord
        lords.push({ title: 'Muntha Lord (मुंठा अधिपति)', planet: LORDS_MAP[munthaRashi], desc: 'Lord of the sign where Muntha is placed. Primary influence on the year.' });
        
        // 2. Janma Lagna Lord (Natal Ascendant Lord)
        lords.push({ title: 'Janma Lagna Lord (जन्म लग्नाधिपति)', planet: LORDS_MAP[natalChart.lagnaRashi], desc: 'Lord of your birth Ascendant. Represents your fundamental nature and life path.' });
        
        // 3. Varsha Lagna Lord (Annual Ascendant Lord)
        lords.push({ title: 'Varsha Lagna Lord (वर्ष लग्नाधिपति)', planet: LORDS_MAP[varshaChart.lagnaRashi], desc: 'Lord of the Annual chart Ascendant. Governs events specifically during this year.' });
        
        // 4. Tri-Rashi Pati (Lord of Dreshkana where Sun is placed)
        const sunInVarsha = varshaChart.planets.find(p => p.id === 'Sun');
        const sunDegInSign = sunInVarsha ? (sunInVarsha.longitude % 30) : 0;
        let triRashiLord;
        if (sunDegInSign < 10) triRashiLord = LORDS_MAP[sunInVarsha.rashi];
        else if (sunDegInSign < 20) triRashiLord = LORDS_MAP[((sunInVarsha.rashi + 3) % 12) + 1] || LORDS_MAP[sunInVarsha.rashi];
        else triRashiLord = LORDS_MAP[((sunInVarsha.rashi + 7) % 12) + 1] || LORDS_MAP[sunInVarsha.rashi];
        lords.push({ title: 'Tri-Rashi Pati (त्रिराशि पति)', planet: triRashiLord, desc: 'Lord of the Dreshkana (1/3rd division) of the sign where the Sun is placed in the Annual chart.' });
        
        // 5. Dina Lord (Day Lord of the Solar Return)
        const localReturnDate = new Date(returnDate.getTime() + tz * 3600000);
        const dayIndex = localReturnDate.getUTCDay();
        lords.push({ title: 'Dina Lord (दिनाधिपति)', planet: WEEKDAY_LORDS[dayIndex], desc: `Lord of the weekday (${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayIndex]}) when the Solar Return occurred.` });
        
        // Determine Varsheshvara (strongest lord)
        // In simplified Tajika: The lord that appears most frequently among the 5, or the one with the highest dignity in the Varsha chart
        const lordCounts = {};
        lords.forEach(l => { lordCounts[l.planet] = (lordCounts[l.planet] || 0) + 1; });
        let varsheshvara = lords[0].planet;
        let maxCount = 0;
        Object.entries(lordCounts).forEach(([planet, count]) => {
            if (count > maxCount) { maxCount = count; varsheshvara = planet; }
        });
        
        return { lords, varsheshvara };
    }

    /**
     * Tajika Yoga Detection
     */
    function detectTajikaYogas(varshaChart) {
        const yogas = [];
        const planets = varshaChart.planets;
        
        // Helper: get house number from rashi
        const getHouse = (rashi) => {
            let h = rashi - varshaChart.lagnaRashi;
            if (h < 0) h += 12;
            return h + 1;
        };
        
        // 1. Ikbaal Yoga (Fortification) - Lagna Lord in Kendra (1,4,7,10) from Lagna
        const lagnaLord = LORDS_MAP[varshaChart.lagnaRashi];
        const lagnaLordPlanet = planets.find(p => p.name === lagnaLord || p.id === lagnaLord);
        if (lagnaLordPlanet) {
            const llHouse = getHouse(lagnaLordPlanet.rashi);
            if ([1,4,7,10].includes(llHouse)) {
                yogas.push({ name: 'Ikbaal Yoga (इक़बाल)', planets: lagnaLord, desc: `The Varsha Lagna Lord (${lagnaLord}) is strongly placed in a Kendra house (House ${llHouse}). This is an extremely auspicious yoga indicating success, fame, and fulfillment of desires during this year. The native will experience confidence, authority, and recognition.`, impact: 'Highly Positive' });
            }
        }
        
        // 2. Ithasala Yoga - Two planets approaching conjunction or aspect
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                if (['Rahu','Ketu'].includes(planets[i].id) || ['Rahu','Ketu'].includes(planets[j].id)) continue;
                const diff = Math.abs(planets[i].longitude - planets[j].longitude);
                const normalDiff = diff > 180 ? 360 - diff : diff;
                // Check if within orb of applying conjunction (within 5 degrees)
                if (normalDiff < 5) {
                    yogas.push({ name: 'Ithasala Yoga (इत्थशाल)', planets: `${planets[i].name} & ${planets[j].name}`, desc: `${planets[i].name} and ${planets[j].name} are in close conjunction (within ${normalDiff.toFixed(1)}°), forming an Ithasala Yoga. This indicates that the matters governed by these planets will come to fruition during this year. Active cooperation between these planetary energies will produce positive results.`, impact: 'Positive' });
                    break; // Only report the closest one to avoid noise
                }
            }
            if (yogas.filter(y => y.name.includes('Ithasala')).length >= 2) break;
        }
        
        // 3. Induvara Yoga - All Kendras occupied by planets
        const kendras = [1,4,7,10];
        const kendrasOccupied = kendras.filter(k => {
            return planets.some(p => getHouse(p.rashi) === k);
        });
        if (kendrasOccupied.length === 4) {
            yogas.push({ name: 'Induvara Yoga (इंदुवार)', planets: 'Multiple', desc: 'All four Kendra houses (1st, 4th, 7th, 10th) are occupied by planets. This is a powerful Tajika Yoga indicating an exceptionally successful and fulfilling year. The native will experience progress in career, happiness at home, success in partnerships, and public recognition.', impact: 'Highly Positive' });
        }
        
        // 4. Ishraaf Yoga - Planet separating from another (past aspect)
        const sun = planets.find(p => p.id === 'Sun');
        const moon = planets.find(p => p.id === 'Moon');
        if (sun && moon) {
            const sunMoonDiff = Math.abs(sun.longitude - moon.longitude);
            const normalSMDiff = sunMoonDiff > 180 ? 360 - sunMoonDiff : sunMoonDiff;
            if (normalSMDiff > 5 && normalSMDiff < 30) {
                yogas.push({ name: 'Ishraaf Yoga (इश्राफ)', planets: 'Sun & Moon', desc: `The Sun and Moon are separating (${normalSMDiff.toFixed(1)}° apart), forming an Ishraaf Yoga. This suggests that an important matter initiated earlier may not fully materialize or may face delays. The native should exercise patience and not rush important decisions.`, impact: 'Mixed' });
            }
        }
        
        // 5. Nakta Yoga - Moon in the 12th from Lagna Lord
        if (moon && lagnaLordPlanet) {
            const moonFromLL = getHouse(moon.rashi) - getHouse(lagnaLordPlanet.rashi);
            if ((moonFromLL + 12) % 12 === 11) { // 12th house = index 11
                yogas.push({ name: 'Nakta Yoga (नक्त)', planets: 'Moon', desc: 'The Moon is placed in the 12th house from the Varsha Lagna Lord, forming Nakta Yoga. This indicates hidden expenses, possible foreign travel, or spiritual inclinations during the year. While not negative, it suggests directing energy toward internal growth rather than external pursuits.', impact: 'Neutral' });
            }
        }
        
        // 6. Yamaya Yoga - All benefics in Upachaya (3, 6, 10, 11)
        const benefics = planets.filter(p => ['Jupiter','Venus','Mercury','Moon'].includes(p.id));
        const upachaya = [3,6,10,11];
        const beneficsInUpachaya = benefics.filter(p => upachaya.includes(getHouse(p.rashi)));
        if (beneficsInUpachaya.length >= 3) {
            yogas.push({ name: 'Yamaya Yoga (यमय)', planets: beneficsInUpachaya.map(p => p.name).join(', '), desc: 'Multiple benefic planets are placed in Upachaya houses (3rd, 6th, 10th, 11th). This is a yoga of growth and progress. The native will experience improvement in career, overcoming of enemies, and financial gains as the year progresses.', impact: 'Positive' });
        }

        // 7. Khallasara Yoga - All planets in 6, 8, or 12 from Lagna
        const dusthana = [6,8,12];
        const planetsInDusthana = planets.filter(p => !['Rahu','Ketu'].includes(p.id) && dusthana.includes(getHouse(p.rashi)));
        if (planetsInDusthana.length >= 5) {
            yogas.push({ name: 'Khallasara Yoga (खल्लसार)', planets: planetsInDusthana.map(p => p.name).join(', '), desc: 'Multiple planets are concentrated in Dusthana houses (6th, 8th, 12th). This is a challenging yoga indicating obstacles, health issues, and increased expenses. The native should exercise caution in financial matters and health, and perform protective remedies.', impact: 'Challenging' });
        }
        
        if (yogas.length === 0) {
            yogas.push({ name: 'Sadhana Yoga (साधन)', planets: 'General', desc: 'No extreme Tajika Yogas are formed in this annual chart. This indicates a stable, moderate year without extreme highs or lows. The native should focus on steady progress and personal development. Results will be proportional to effort invested.', impact: 'Neutral' });
        }
        
        return yogas;
    }

    /**
     * House-by-House Annual Predictions
     */
    function generateHousePredictions(varshaChart, munthaHouse) {
        const predictions = [];
        const HOUSE_TOPICS = [
            { house: 1, name: 'Self & Personality', icon: '👤', areas: 'health, appearance, confidence, new beginnings' },
            { house: 2, name: 'Wealth & Family', icon: '💰', areas: 'finances, savings, family harmony, speech' },
            { house: 3, name: 'Courage & Siblings', icon: '💪', areas: 'short travels, communication, siblings, courage' },
            { house: 4, name: 'Home & Happiness', icon: '🏠', areas: 'mother, property, vehicles, domestic peace' },
            { house: 5, name: 'Children & Education', icon: '📚', areas: 'children, education, romance, creativity, speculation' },
            { house: 6, name: 'Health & Enemies', icon: '⚔️', areas: 'diseases, debts, enemies, competition, service' },
            { house: 7, name: 'Marriage & Partnership', icon: '💑', areas: 'spouse, business partnerships, foreign travel' },
            { house: 8, name: 'Transformation & Longevity', icon: '🔮', areas: 'sudden events, inheritance, occult, obstacles' },
            { house: 9, name: 'Fortune & Dharma', icon: '🙏', areas: 'luck, father, long journeys, higher learning, spirituality' },
            { house: 10, name: 'Career & Status', icon: '🏆', areas: 'profession, achievements, authority, public image' },
            { house: 11, name: 'Gains & Aspirations', icon: '🌟', areas: 'income, profits, friendships, fulfillment of desires' },
            { house: 12, name: 'Expenditure & Liberation', icon: '🌊', areas: 'expenses, losses, foreign lands, spirituality, sleep' }
        ];
        
        const getHouse = (rashi) => {
            let h = rashi - varshaChart.lagnaRashi;
            if (h < 0) h += 12;
            return h + 1;
        };
        
        HOUSE_TOPICS.forEach(ht => {
            const planetsInHouse = varshaChart.planets.filter(p => getHouse(p.rashi) === ht.house);
            const planetNames = planetsInHouse.map(p => p.name);
            const isMunthaHere = munthaHouse === ht.house;
            
            let prediction = '';
            
            // Base prediction based on planets present
            if (planetsInHouse.length === 0 && !isMunthaHere) {
                prediction = `No planets occupy this house in the annual chart. The matters of ${ht.areas} will remain stable without major changes. The results will depend on the transiting planets during the year.`;
            } else {
                if (isMunthaHere) {
                    if ([1,2,3,5,9,10,11].includes(ht.house)) {
                        prediction = `Muntha is activated in this auspicious house, bringing special focus and positive energy to ${ht.areas}. This is an excellent placement indicating growth and favorable developments in these areas. `;
                    } else {
                        prediction = `Muntha is placed in a challenging house position. Extra caution is advised regarding ${ht.areas}. Remedial measures for the Muntha Lord will help mitigate difficulties. `;
                    }
                }
                
                planetNames.forEach(pName => {
                    const planet = planetsInHouse.find(p => p.name === pName);
                    if (!planet) return;
                    
                    const isBenefic = ['Jupiter','Venus','Mercury','Moon'].includes(planet.id);
                    const isExalted = planet.dignity && planet.dignity.includes('Exalted');
                    const isDebilitated = planet.dignity && planet.dignity.includes('Debilitated');
                    
                    if (isBenefic || isExalted) {
                        prediction += `${pName}${isExalted ? ' (Exalted)' : ''} in this house brings favorable results for ${ht.areas}. Expect positive developments and support in these matters. `;
                    } else if (isDebilitated) {
                        prediction += `${pName} is debilitated here, indicating challenges related to ${ht.areas}. Extra effort and remedies for ${pName} are recommended. `;
                    } else {
                        prediction += `${pName} influences this house, bringing its energy to ${ht.areas}. Results will depend on ${pName}'s overall strength in the chart. `;
                    }
                });
            }
            
            predictions.push({
                ...ht,
                planets: planetNames,
                hasMuntha: isMunthaHere,
                prediction: prediction.trim()
            });
        });
        
        return predictions;
    }

    /**
     * Generate Favorable/Unfavorable Month Guidance
     */
    function getMonthlyGuidance(varshaChart) {
        const months = [];
        const lagnaLord = LORDS_MAP[varshaChart.lagnaRashi];
        const beneficSigns = [];
        
        // Find signs where benefics are placed
        varshaChart.planets.forEach(p => {
            if (['Jupiter','Venus','Mercury'].includes(p.id)) {
                beneficSigns.push(p.rashi);
            }
        });
        
        // Approximate: Sun transits through each sign for ~30 days
        for (let i = 0; i < 12; i++) {
            const signNum = ((varshaChart.lagnaRashi - 1 + i) % 12) + 1;
            const isFavorable = beneficSigns.includes(signNum) || [1,5,9].includes(i + 1);
            const isChallenging = [6,8,12].includes(i + 1);
            
            months.push({
                month: i + 1,
                sign: RASHIS[signNum - 1],
                favorable: isFavorable && !isChallenging,
                period: `Month ${i + 1}`
            });
        }
        return months;
    }

    /**
     * Get Remedies for the Year
     */
    function getYearRemedies(varsheshvara, munthaRashi, munthaHouse) {
        const remedies = [];
        
        const planetRemedies = {
            'Sun': { mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namaha', gemstone: 'Ruby (Manik)', deity: 'Lord Surya', day: 'Sunday', color: 'Red/Orange', donation: 'Wheat, jaggery, red cloth' },
            'Moon': { mantra: 'Om Shraam Shreem Shraum Sah Chandramasay Namaha', gemstone: 'Pearl (Moti)', deity: 'Lord Shiva', day: 'Monday', color: 'White', donation: 'Rice, milk, white cloth' },
            'Mars': { mantra: 'Om Kraam Kreem Kraum Sah Bhaumaaya Namaha', gemstone: 'Red Coral (Moonga)', deity: 'Lord Hanuman', day: 'Tuesday', color: 'Red', donation: 'Lentils (Masoor), red cloth, copper' },
            'Mercury': { mantra: 'Om Braam Breem Braum Sah Budhaya Namaha', gemstone: 'Emerald (Panna)', deity: 'Lord Vishnu', day: 'Wednesday', color: 'Green', donation: 'Moong dal, green cloth, bronze' },
            'Jupiter': { mantra: 'Om Graam Greem Graum Sah Gurave Namaha', gemstone: 'Yellow Sapphire (Pukhraj)', deity: 'Lord Brihaspati/Vishnu', day: 'Thursday', color: 'Yellow', donation: 'Chana dal, turmeric, yellow cloth, gold' },
            'Venus': { mantra: 'Om Draam Dreem Draum Sah Shukraaya Namaha', gemstone: 'Diamond (Heera)', deity: 'Goddess Lakshmi', day: 'Friday', color: 'White/Pink', donation: 'Ghee, white rice, silk cloth' },
            'Saturn': { mantra: 'Om Praam Preem Praum Sah Shanaishcharaya Namaha', gemstone: 'Blue Sapphire (Neelam)', deity: 'Lord Shani Dev', day: 'Saturday', color: 'Black/Dark Blue', donation: 'Sesame (til), mustard oil, black cloth, iron' }
        };
        
        const vRemedy = planetRemedies[varsheshvara] || planetRemedies['Jupiter'];
        
        remedies.push({ title: `Strengthen Year Lord (${varsheshvara})`, items: [
            `Chant "${vRemedy.mantra}" — 108 times daily, especially on ${vRemedy.day}`,
            `Wear ${vRemedy.gemstone} on the ring/index finger (consult astrologer for finger and metal)`,
            `Worship ${vRemedy.deity} regularly during this year`,
            `Wear ${vRemedy.color} colored clothes on ${vRemedy.day}`,
            `Donate ${vRemedy.donation} on ${vRemedy.day}`
        ]});
        
        if ([6,8,12].includes(munthaHouse)) {
            const mLord = LORDS_MAP[munthaRashi];
            const mRemedy = planetRemedies[mLord] || planetRemedies['Jupiter'];
            remedies.push({ title: `Muntha Dosha Remedy (Muntha in House ${munthaHouse})`, items: [
                `Chant "${mRemedy.mantra}" — 108 times daily`,
                `Perform Navagraha Shanti Puja within the first 3 months of the year`,
                `Feed Brahmins on every Amavasya (New Moon day)`,
                `Donate ${mRemedy.donation}`
            ]});
        }
        
        remedies.push({ title: 'General Yearly Remedies', items: [
            'Perform Satyanarayan Katha on every Purnima (Full Moon)',
            'Recite Hanuman Chalisa daily for protection against obstacles',
            'Light a ghee lamp at the temple every Thursday',
            'Practice regular meditation and pranayama for mental clarity',
            'Perform Pitru Tarpan during Shradh period for ancestral blessings'
        ]});
        
        return remedies;
    }

    /**
     * Main: Generate Complete Varshphal Report Data
     */
    function generateVarshphal(birthDateStr, birthTimeStr, cityObj, targetYear) {
        // 1. Natal Chart
        const natalChart = AstroCalc.generateKundali(birthDateStr, birthTimeStr, cityObj);
        const natalSunLon = natalChart.planets.find(p => p.id === 'Sun').longitude;
        const natalLagnaRashi = natalChart.lagnaRashi;
        
        // 2. Solar Return
        const [byear, bmonth, bday] = birthDateStr.split('-').map(Number);
        const [bhh, bmm] = birthTimeStr.split(':').map(Number);
        const birthDateUTC = new Date(Date.UTC(byear, bmonth - 1, bday, bhh, bmm) - cityObj.tz * 3600000);
        const returnDate = findSolarReturn(natalSunLon, birthDateUTC, parseInt(targetYear), byear);
        
        // 3. Varsha Chart
        const localReturnDate = new Date(returnDate.getTime() + cityObj.tz * 3600000);
        const yr = localReturnDate.getUTCFullYear();
        const mo = String(localReturnDate.getUTCMonth() + 1).padStart(2, '0');
        const da = String(localReturnDate.getUTCDate()).padStart(2, '0');
        const hr = String(localReturnDate.getUTCHours()).padStart(2, '0');
        const mi = String(localReturnDate.getUTCMinutes()).padStart(2, '0');
        const varshaChart = AstroCalc.generateKundali(`${yr}-${mo}-${da}`, `${hr}:${mi}`, cityObj);
        
        // 4. Age & Muntha
        const age = parseInt(targetYear) - byear;
        const munthaRashi = calculateMuntha(natalLagnaRashi, age);
        const munthaHouse = getMunthaHouse(munthaRashi, varshaChart.lagnaRashi);
        const munthaLord = LORDS_MAP[munthaRashi];
        
        // 5. Pancha-Adhikari
        const panchadhikari = calculatePanchadhikari(natalChart, varshaChart, returnDate, munthaRashi, cityObj.tz);
        
        // 6. Tajika Yogas
        const tajikaYogas = detectTajikaYogas(varshaChart);
        
        // 7. House Predictions
        const housePredictions = generateHousePredictions(varshaChart, munthaHouse);
        
        // 8. Monthly Guidance
        const monthlyGuidance = getMonthlyGuidance(varshaChart);
        
        // 9. Remedies
        const remedies = getYearRemedies(panchadhikari.varsheshvara, munthaRashi, munthaHouse);

        // 10. Dasha sequence during this year
        const dashaForYear = getDashaForYear(natalChart, returnDate);
        
        return {
            natalChart,
            varshaChart,
            returnDate,
            age,
            munthaRashi,
            munthaRashiName: RASHIS[munthaRashi - 1],
            munthaHouse,
            munthaLord,
            panchadhikari,
            yearLord: panchadhikari.varsheshvara,
            tajikaYogas,
            housePredictions,
            monthlyGuidance,
            remedies,
            dashaForYear
        };
    }

    /**
     * Get Dasha periods active during this year
     */
    function getDashaForYear(natalChart, returnDate) {
        if (!natalChart || !natalChart.dashas) return [];
        
        const yearStart = returnDate;
        const yearEnd = new Date(yearStart.getTime() + 365.25 * 24 * 60 * 60 * 1000);
        const yearStartStr = yearStart.toISOString().split('T')[0];
        const yearEndStr = yearEnd.toISOString().split('T')[0];
        
        const periods = [];
        
        const DASHA_EFFECTS = {
            'Sun': { theme: 'Authority, father, government, health, confidence', good: 'Recognition, promotion, paternal support', challenge: 'Ego conflicts, health of father, eye issues' },
            'Moon': { theme: 'Mind, mother, emotions, public, travel', good: 'Emotional satisfaction, property gains, popularity', challenge: 'Mental restlessness, mother\'s health, fluid-related issues' },
            'Mars': { theme: 'Energy, property, siblings, courage, conflict', good: 'Property acquisition, physical strength, decisive actions', challenge: 'Accidents, disputes, blood pressure, anger issues' },
            'Mercury': { theme: 'Communication, business, intelligence, education', good: 'Business success, intellectual growth, new skills', challenge: 'Nervous disorders, skin issues, communication gaps' },
            'Jupiter': { theme: 'Wisdom, wealth, children, spirituality, expansion', good: 'Spiritual growth, financial gains, birth of children', challenge: 'Over-expansion, liver issues, weight gain, false promises' },
            'Venus': { theme: 'Love, marriage, arts, luxury, vehicles', good: 'Marriage, romantic bliss, artistic success, luxury purchases', challenge: 'Relationship complications, kidney issues, overindulgence' },
            'Saturn': { theme: 'Discipline, karma, delays, longevity, service', good: 'Career stability, karmic rewards, discipline development', challenge: 'Delays, obstacles, joint pains, isolation, depression' },
            'Rahu': { theme: 'Ambition, foreign, unconventional, technology', good: 'Foreign opportunities, technological gains, breaking barriers', challenge: 'Confusion, deception, phobias, unconventional problems' },
            'Ketu': { theme: 'Spirituality, detachment, moksha, past karma', good: 'Spiritual awakening, occult knowledge, liberation', challenge: 'Sudden losses, mysterious ailments, detachment from loved ones' }
        };
        
        for (const md of natalChart.dashas) {
            if (md.endStr < yearStartStr || md.startStr > yearEndStr) continue;
            
            // This Mahadasha overlaps with our year
            for (const ad of md.antardashas) {
                if (ad.endStr < yearStartStr || ad.startStr > yearEndStr) continue;
                
                // This AD is active during our year
                const adStart = ad.startStr > yearStartStr ? ad.startStr : yearStartStr;
                const adEnd = ad.endStr < yearEndStr ? ad.endStr : yearEndStr;
                const effect = DASHA_EFFECTS[ad.lord] || DASHA_EFFECTS['Saturn'];
                const mdEffect = DASHA_EFFECTS[md.lord] || DASHA_EFFECTS['Saturn'];
                
                periods.push({
                    mahadasha: md.lord,
                    antardasha: ad.lord,
                    startDate: adStart,
                    endDate: adEnd,
                    theme: `${mdEffect.theme.split(',')[0]} × ${effect.theme.split(',')[0]}`,
                    interpretation: `During ${md.lord}-${ad.lord} period (${adStart} to ${adEnd}), the combined energy of ${md.lord} (Mahadasha) and ${ad.lord} (Antardasha) will influence your life. ${md.lord}'s overarching theme of "${mdEffect.theme}" combines with ${ad.lord}'s energy of "${effect.theme}". Favorable aspects: ${effect.good}. Areas requiring attention: ${effect.challenge}. Strengthening ${ad.lord} during this sub-period through mantras and donations will enhance positive outcomes.`
                });
            }
        }
        
        return periods;
    }

    return { generateVarshphal, RASHIS };
})();

