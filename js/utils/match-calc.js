/* ============================================
   Vedic Astrology Match Making Engine (Guna Milan)
   Ashtakoot System (36 Points)
   ============================================ */

const MatchCalc = (() => {

    // 1. VARNA (1 Point) - Based on Rashi
    // 1: Aries, 2: Taurus, 3: Gemini, 4: Cancer, 5: Leo, 6: Virgo, 7: Libra, 8: Scorpio, 9: Sagittarius, 10: Capricorn, 11: Aquarius, 12: Pisces
    const VARNA = {
        1: 2, 2: 3, 3: 4, 4: 1, // Ar: Kshatriya(2), Ta: Vaishya(3), Ge: Shudra(4), Ca: Brahmin(1)
        5: 2, 6: 3, 7: 4, 8: 1, // Le: Kshatriya(2), Vi: Vaishya(3), Li: Shudra(4), Sc: Brahmin(1)
        9: 2, 10: 3, 11: 4, 12: 1 // Sa: Kshatriya(2), Ca: Vaishya(3), Aq: Shudra(4), Pi: Brahmin(1)
    };
    // Brahmin = 1, Kshatriya = 2, Vaishya = 3, Shudra = 4
    function getVarnaPoints(boyRashi, girlRashi) {
        const b = VARNA[boyRashi];
        const g = VARNA[girlRashi];
        if (b <= g) return 1; // Lower number means higher caste. Boy should be equal or higher.
        return 0;
    }

    // 2. VASHYA (2 Points) - Based on Rashi (simplified, ignoring exact degree halves for V1)
    // 1: Chatushpada (Aries, Taurus, 2nd half Sagi, 1st half Cap) -> using generic whole sign
    // 2: Manav (Gemini, Virgo, Libra, Aquarius, 1st half Sagi)
    // 3: Jalchar (Cancer, Pisces, 2nd half Cap)
    // 4: Vanchar (Leo)
    // 5: Keeta (Scorpio)
    // For simplicity without exact degrees: 1,2=1, 3,6,7,11=2, 4,12=3, 5=4, 8=5, 9=1(mostly), 10=3(mostly)
    const VASHYA_GROUP = {
        1: 1, 2: 1, 3: 2, 4: 3, 5: 4, 6: 2, 7: 2, 8: 5, 9: 1, 10: 3, 11: 2, 12: 3
    };
    const VASHYA_SCORE = [
        // Boy \ Girl -> 1(Chatush), 2(Manav), 3(Jal), 4(Van), 5(Keeta)
        /* 1 */ [2, 1, 1, 0, 1],
        /* 2 */ [1, 2, 1, 1, 1],
        /* 3 */ [1, 1, 2, 1, 1],
        /* 4 */ [0, 0, 1, 2, 0],
        /* 5 */ [1, 1, 1, 0, 2]
    ];
    function getVashyaPoints(boyRashi, girlRashi) {
        const b = VASHYA_GROUP[boyRashi] - 1;
        const g = VASHYA_GROUP[girlRashi] - 1;
        return VASHYA_SCORE[b][g];
    }

    // 3. TARA (3 Points) - Based on Nakshatra
    function getTaraPoints(boyNak, girlNak) { // Nakshatra index 0 to 26
        const b_to_g = ((girlNak - boyNak + 27) % 27) + 1;
        const g_to_b = ((boyNak - girlNak + 27) % 27) + 1;
        
        const b_tara = b_to_g % 9;
        const g_tara = g_to_b % 9;
        
        // 3, 5, 7 are bad (Vipat, Pratyari, Vadha)
        const b_good = (b_tara !== 3 && b_tara !== 5 && b_tara !== 7 && b_tara !== 0); // 0 is 9 (Ati Mitra) which is good, wait. 9%9 is 0. So 0 is good.
        const b_val = (b_tara === 3 || b_tara === 5 || b_tara === 7) ? 0 : 1.5;
        const g_val = (g_tara === 3 || g_tara === 5 || g_tara === 7) ? 0 : 1.5;
        
        return b_val + g_val;
    }

    // 4. YONI (4 Points) - Based on Nakshatra
    // 1: Ashwa, 2: Gaja, 3: Mesha, 4: Sarpa, 5: Shwana, 6: Marjara, 7: Mushaka, 8: Gau, 9: Mahisha, 10: Vyaghra, 11: Mriga, 12: Vanara, 13: Nakula, 14: Simha
    const YONI = [
        1, 2, 3, 4, 4, 5, 6, 3, 6, 7, // 0 to 9
        7, 8, 9, 10, 9, 10, 11, 11, 5, 12, // 10 to 19
        13, 12, 14, 1, 14, 8, 2 // 20 to 26
    ];
    
    // Matrix of scores 14x14
    const YONI_SCORE = [
        // 1  2  3  4  5  6  7  8  9 10 11 12 13 14
        [ 4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1], // 1
        [ 2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0], // 2
        [ 2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1], // 3
        [ 3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2], // 4
        [ 2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1], // 5
        [ 2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1], // 6
        [ 2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2], // 7
        [ 1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1], // 8
        [ 0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1], // 9
        [ 1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1], // 10
        [ 3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1], // 11
        [ 3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2], // 12
        [ 2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2], // 13
        [ 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4]  // 14
    ];
    function getYoniPoints(boyNak, girlNak) {
        const b = YONI[boyNak] - 1;
        const g = YONI[girlNak] - 1;
        return YONI_SCORE[b][g];
    }

    // 5. GRAHA MAITRI (5 Points) - Based on Rashi Lord
    const RASHI_LORD = {
        1: 3, 2: 6, 3: 4, 4: 2, 5: 1, 6: 4, 7: 6, 8: 3, 9: 5, 10: 7, 11: 7, 12: 5
    };
    // Lords: 1=Sun, 2=Moon, 3=Mars, 4=Mercury, 5=Jupiter, 6=Venus, 7=Saturn
    const GRAHA_MAITRI_SCORE = [
        // S  M  Ma Me J  V  Sa
        [ 5, 5, 5, 4, 5, 0, 0], // Sun
        [ 5, 5, 5, 1, 4, 0.5, 0.5], // Moon
        [ 5, 5, 5, 0.5, 5, 3, 0.5], // Mars
        [ 4, 1, 0.5, 5, 0.5, 5, 4], // Mercury
        [ 5, 4, 5, 0.5, 5, 0.5, 3], // Jupiter
        [ 0, 0.5, 3, 5, 0.5, 5, 5], // Venus
        [ 0, 0.5, 0.5, 4, 3, 5, 5]  // Saturn
    ];
    function getGrahaMaitriPoints(boyRashi, girlRashi) {
        const b = RASHI_LORD[boyRashi] - 1;
        const g = RASHI_LORD[girlRashi] - 1;
        return GRAHA_MAITRI_SCORE[b][g];
    }

    // 6. GANA (6 Points) - Based on Nakshatra
    // 1: Deva, 2: Manushya, 3: Rakshasa
    const GANA = [
        1, 2, 3, 2, 1, 2, 1, 1, 3, 3, // 0 to 9
        2, 2, 1, 3, 1, 3, 1, 3, 3, 2, // 10 to 19
        2, 1, 3, 3, 2, 2, 1 // 20 to 26
    ];
    const GANA_SCORE = [
        // Deva, Manushya, Rakshasa
        [ 6, 6, 1], // Deva Boy
        [ 5, 6, 0], // Manushya Boy
        [ 1, 0, 6]  // Rakshasa Boy
    ];
    function getGanaPoints(boyNak, girlNak) {
        const b = GANA[boyNak] - 1;
        const g = GANA[girlNak] - 1;
        return GANA_SCORE[b][g];
    }

    // 7. BHAKOOT (7 Points) - Based on Rashi Distance
    function getBhakootPoints(boyRashi, girlRashi) {
        const diff = ((girlRashi - boyRashi + 12) % 12) + 1;
        // Bad combinations: 2/12, 5/9, 6/8
        if (diff === 2 || diff === 12) return 0;
        if (diff === 5 || diff === 9) return 0;
        if (diff === 6 || diff === 8) return 0;
        return 7;
    }

    // 8. NADI (8 Points) - Based on Nakshatra
    // 1: Aadi, 2: Madhya, 3: Antya
    const NADI = [
        1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 
        2, 1, 1, 2, 3, 3, 2, 1, 1, 2, 
        3, 3, 2, 1, 1, 2, 3
    ];
    function getNadiPoints(boyNak, girlNak) {
        const b = NADI[boyNak];
        const g = NADI[girlNak];
        if (b === g) return 0; // Same Nadi is a dosha (0 points)
        return 8;
    }

    /**
     * Calculate Ashtakoot Guna Milan
     * Requires boy and girl objects with: { rashi: 1-12, nakshatra: 0-26 }
     */
    function calculateGunaMilan(boy, girl) {
        const varna = getVarnaPoints(boy.rashi, girl.rashi);
        const vashya = getVashyaPoints(boy.rashi, girl.rashi);
        const tara = getTaraPoints(boy.nakshatra, girl.nakshatra);
        const yoni = getYoniPoints(boy.nakshatra, girl.nakshatra);
        const graha = getGrahaMaitriPoints(boy.rashi, girl.rashi);
        const gana = getGanaPoints(boy.nakshatra, girl.nakshatra);
        const bhakoot = getBhakootPoints(boy.rashi, girl.rashi);
        const nadi = getNadiPoints(boy.nakshatra, girl.nakshatra);

        const total = varna + vashya + tara + yoni + graha + gana + bhakoot + nadi;

        return {
            varna: { max: 1, scored: varna, name: "Varna", desc: "Work & Ego Compatibility" },
            vashya: { max: 2, scored: vashya, name: "Vashya", desc: "Mutual Attraction" },
            tara: { max: 3, scored: tara, name: "Tara", desc: "Destiny & Health" },
            yoni: { max: 4, scored: yoni, name: "Yoni", desc: "Biological & Intimate Compatibility" },
            graha: { max: 5, scored: graha, name: "Graha Maitri", desc: "Mental & Friendship Compatibility" },
            gana: { max: 6, scored: gana, name: "Gana", desc: "Temperament & Behavior" },
            bhakoot: { max: 7, scored: bhakoot, name: "Bhakoot", desc: "Family & Life Compatibility" },
            nadi: { max: 8, scored: nadi, name: "Nadi", desc: "Genetic & Progeny Compatibility" },
            total: total,
            isManglikBoy: false, // Will be injected if full birth data is passed
            isManglikGirl: false
        };
    }

    return {
        calculateGunaMilan,
        VARNA, VASHYA_GROUP, YONI, RASHI_LORD, GANA, NADI
    };
})();
