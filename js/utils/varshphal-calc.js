/* ============================================
   Vedic Astrology Annual Horoscope Engine (Varshphal / Tajika)
   Uses Astronomy Engine (CDN)
   ============================================ */

const VarshphalCalc = (() => {

    /**
     * Find exact Solar Return time (Varshapravesh)
     * natalSunLon: Sidereal longitude of Natal Sun
     * targetYear: Year to calculate return for
     */
    function findSolarReturn(natalSunLon, birthDate, targetYear) {
        // Approximate time: Birth date + difference in years
        // Sun takes roughly 365.25636 days to complete a sidereal year.
        const yearsDiff = targetYear - birthDate.getFullYear();
        let approxTime = birthDate.getTime() + (yearsDiff * 365.25636 * 24 * 60 * 60 * 1000);
        let testDate = new Date(approxTime);
        
        // Binary search / fine-tuning to find exact time when Sun matches natalSunLon
        // Note: AstroCalc.getPlanetLongitude gives tropical longitude, so we need sidereal.
        // Let's use the AstroCalc.getPlanetLongitude and AstroCalc.getAyanamsa
        
        let bestDate = testDate;
        let diff = 999;
        let iterations = 0;
        
        while (Math.abs(diff) > 0.0001 && iterations < 20) {
            const ayanamsa = AstroCalc.getAyanamsa(testDate.getFullYear());
            let currentSunLon = (AstroCalc.getPlanetLongitude('Sun', testDate) - ayanamsa) % 360;
            if (currentSunLon < 0) currentSunLon += 360;
            
            diff = currentSunLon - natalSunLon;
            
            // Handle wrap around 360/0
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            
            // Sun moves about 0.9856 degrees per day
            const daysCorrection = diff / 0.9856;
            approxTime -= (daysCorrection * 24 * 60 * 60 * 1000);
            testDate = new Date(approxTime);
            bestDate = testDate;
            iterations++;
        }
        
        return bestDate;
    }

    /**
     * Calculate Muntha
     * Muntha = (Natal Lagna Sign + Age) % 12
     */
    function calculateMuntha(natalLagnaRashi, ageInYears) {
        let muntha = (natalLagnaRashi + ageInYears) % 12;
        if (muntha === 0) muntha = 12;
        return muntha; // 1 to 12
    }

    /**
     * Generate Varshphal Chart Data
     */
    function generateVarshphal(birthDateStr, birthTimeStr, cityObj, targetYear) {
        // 1. Get Natal Chart Data
        const natalChart = AstroCalc.generateKundali(birthDateStr, birthTimeStr, cityObj);
        const natalSunLon = natalChart.planets.find(p => p.id === 'Sun').longitude;
        const natalLagnaRashi = natalChart.lagnaRashi;
        
        // 2. Find Varshapravesh (Solar Return) Date/Time
        const birthDateObj = new Date(`${birthDateStr}T${birthTimeStr}:00`);
        const returnDate = findSolarReturn(natalSunLon, birthDateObj, parseInt(targetYear));
        
        // 3. Generate Varshphal Chart at the exact return moment
        // We temporarily create a string format to pass to generateKundali
        const yr = returnDate.getFullYear();
        const mo = String(returnDate.getMonth() + 1).padStart(2, '0');
        const da = String(returnDate.getDate()).padStart(2, '0');
        const hr = String(returnDate.getHours()).padStart(2, '0');
        const mi = String(returnDate.getMinutes()).padStart(2, '0');
        
        const varshaChart = AstroCalc.generateKundali(`${yr}-${mo}-${da}`, `${hr}:${mi}`, cityObj);
        
        // 4. Calculate Age & Muntha
        const age = parseInt(targetYear) - birthDateObj.getFullYear();
        const munthaRashi = calculateMuntha(natalLagnaRashi, age);
        
        // 5. Determine Varsheshvara (Year Lord)
        // Simplified Logic: The lord of the Muntha sign
        const lordsMap = {
            1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
            7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
        };
        const munthaLord = lordsMap[munthaRashi];
        const yearLord = munthaLord; // In full Tajika, it's evaluated via Panchadhikari (5 lords) and highest bala. For V1 we use Muntha Lord which is a primary candidate.
        
        return {
            natalChart,
            varshaChart,
            returnDate,
            age,
            munthaRashi,
            munthaLord,
            yearLord
        };
    }

    return {
        generateVarshphal
    };
})();
