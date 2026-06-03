/* ============================================
   Vedic Astrology Match Making Engine (Guna Milan)
   Ashtakoot System (36 Points) — Professional Grade
   ============================================ */

const MatchCalc = (() => {

    const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const NAKSHATRAS = [
        "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
        "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
        "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
        "Moola","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
        "Purva Bhadrapada","Uttara Bhadrapada","Revati"
    ];
    const LORDS = { 1:'Mars', 2:'Venus', 3:'Mercury', 4:'Moon', 5:'Sun', 6:'Mercury', 7:'Venus', 8:'Mars', 9:'Jupiter', 10:'Saturn', 11:'Saturn', 12:'Jupiter' };

    // ═══════════════════════════════════════
    // 1. VARNA (1 Point)
    // ═══════════════════════════════════════
    const VARNA = { 1:2, 2:3, 3:4, 4:1, 5:2, 6:3, 7:4, 8:1, 9:2, 10:3, 11:4, 12:1 };
    const VARNA_NAMES = { 1:'Brahmin', 2:'Kshatriya', 3:'Vaishya', 4:'Shudra' };
    
    function getVarnaPoints(boyRashi, girlRashi) {
        const b = VARNA[boyRashi], g = VARNA[girlRashi];
        return b <= g ? 1 : 0;
    }
    function getVarnaInterpretation(boyRashi, girlRashi, scored) {
        const bName = VARNA_NAMES[VARNA[boyRashi]], gName = VARNA_NAMES[VARNA[girlRashi]];
        if (scored === 1) {
            return `The boy's Varna is ${bName} and the girl's Varna is ${gName}. Since the boy's Varna is equal to or higher than the girl's, this Koota is fully satisfied. This indicates strong ego compatibility and mutual respect in the relationship. Both partners will be able to maintain their individuality while respecting each other's social and professional standing.`;
        }
        return `The boy's Varna is ${bName} and the girl's Varna is ${gName}. The girl's Varna is higher than the boy's, which results in 0 points for this Koota. This may lead to occasional ego conflicts or feelings of superiority/inferiority. However, Varna carries only 1 point and has minimal impact on overall compatibility. With mutual understanding and respect, this can be easily managed.`;
    }

    // ═══════════════════════════════════════
    // 2. VASHYA (2 Points)
    // ═══════════════════════════════════════
    const VASHYA_GROUP = { 1:1, 2:1, 3:2, 4:3, 5:4, 6:2, 7:2, 8:5, 9:1, 10:3, 11:2, 12:3 };
    const VASHYA_NAMES = { 1:'Chatushpada', 2:'Manav', 3:'Jalchar', 4:'Vanchar', 5:'Keeta' };
    const VASHYA_SCORE = [
        [2, 1, 1, 0, 1],
        [1, 2, 1, 1, 1],
        [1, 1, 2, 1, 1],
        [0, 0, 1, 2, 0],
        [1, 1, 1, 0, 2]
    ];
    function getVashyaPoints(boyRashi, girlRashi) {
        return VASHYA_SCORE[VASHYA_GROUP[boyRashi] - 1][VASHYA_GROUP[girlRashi] - 1];
    }
    function getVashyaInterpretation(boyRashi, girlRashi, scored) {
        const bName = VASHYA_NAMES[VASHYA_GROUP[boyRashi]], gName = VASHYA_NAMES[VASHYA_GROUP[girlRashi]];
        if (scored === 2) return `Both partners belong to the ${bName === gName ? 'same' : 'highly compatible'} Vashya group (Boy: ${bName}, Girl: ${gName}). Full score of 2 indicates excellent mutual attraction and natural magnetic pull between the partners. They will find it easy to influence each other positively and maintain harmony in the relationship. Physical and emotional bonding will be strong.`;
        if (scored === 1) return `The boy belongs to the ${bName} group and the girl to the ${gName} group. A score of 1 out of 2 indicates moderate mutual attraction. While the initial connection may not be instantaneous, the couple will develop a deeper bond over time. One partner may sometimes feel the need to make more effort to maintain the emotional connection.`;
        return `The boy belongs to the ${bName} group and the girl to the ${gName} group. A score of 0 indicates low natural attraction between these Vashya categories. The couple may need to put conscious effort into maintaining emotional and physical closeness. Communication and shared activities will be key to building and sustaining the bond.`;
    }

    // ═══════════════════════════════════════
    // 3. TARA (3 Points)
    // ═══════════════════════════════════════
    function getTaraPoints(boyNak, girlNak) {
        const b_to_g = ((girlNak - boyNak + 27) % 27) + 1;
        const g_to_b = ((boyNak - girlNak + 27) % 27) + 1;
        const b_tara = b_to_g % 9;
        const g_tara = g_to_b % 9;
        const b_val = (b_tara === 3 || b_tara === 5 || b_tara === 7) ? 0 : 1.5;
        const g_val = (g_tara === 3 || g_tara === 5 || g_tara === 7) ? 0 : 1.5;
        return b_val + g_val;
    }
    const TARA_NAMES = { 0:'Parama Mitra', 1:'Janma', 2:'Sampat', 3:'Vipat', 4:'Kshema', 5:'Pratyari', 6:'Sadhaka', 7:'Vadha', 8:'Mitra' };
    function getTaraInterpretation(boyNak, girlNak, scored) {
        const b_to_g = ((girlNak - boyNak + 27) % 27) + 1;
        const g_to_b = ((boyNak - girlNak + 27) % 27) + 1;
        const bTara = TARA_NAMES[b_to_g % 9] || 'Parama Mitra';
        const gTara = TARA_NAMES[g_to_b % 9] || 'Parama Mitra';
        if (scored === 3) return `Both Tara positions are auspicious (Boy→Girl: ${bTara}, Girl→Boy: ${gTara}). Full marks indicate mutual well-being, good health, and destined compatibility. The stars are aligned for this couple, and they are likely to experience prosperity and happiness together. Long-term health and fortune are well supported.`;
        if (scored >= 1.5) return `One Tara position is favorable and the other is inauspicious (Boy→Girl: ${bTara}, Girl→Boy: ${gTara}). This partial score suggests that while one partner brings good fortune to the other, the reverse may require some effort. The couple should pay attention to health matters and consult regarding auspicious timings for major life decisions.`;
        return `Both Tara positions are inauspicious (Boy→Girl: ${bTara}, Girl→Boy: ${gTara}). A score of 0 in Tara Koota is a cause for attention. It may indicate health challenges or financial instability at various stages. Remedial measures such as Nakshatra Shanti Puja are recommended. However, if the total Guna score is above 18, the impact of Tara is considerably reduced.`;
    }

    // ═══════════════════════════════════════
    // 4. YONI (4 Points)
    // ═══════════════════════════════════════
    const YONI = [1,2,3,4,4,5,6,3,6,7,7,8,9,10,9,10,11,11,5,12,13,12,14,1,14,8,2];
    const YONI_NAMES = { 1:'Ashwa (Horse)', 2:'Gaja (Elephant)', 3:'Mesha (Sheep)', 4:'Sarpa (Snake)', 5:'Shwana (Dog)', 6:'Marjara (Cat)', 7:'Mushaka (Rat)', 8:'Gau (Cow)', 9:'Mahisha (Buffalo)', 10:'Vyaghra (Tiger)', 11:'Mriga (Deer)', 12:'Vanara (Monkey)', 13:'Nakula (Mongoose)', 14:'Simha (Lion)' };
    const YONI_SCORE = [
        [4,2,2,3,2,2,2,1,0,1,3,3,2,1],
        [2,4,3,3,2,2,2,2,3,1,2,3,2,0],
        [2,3,4,2,1,2,1,3,3,1,2,0,3,1],
        [3,3,2,4,2,1,1,1,1,2,2,2,0,2],
        [2,2,1,2,4,2,1,2,2,1,0,2,1,1],
        [2,2,2,1,2,4,0,2,2,1,3,3,2,1],
        [2,2,1,1,1,0,4,2,2,2,2,2,1,2],
        [1,2,3,1,2,2,2,4,3,0,3,2,2,1],
        [0,3,3,1,2,2,2,3,4,1,2,2,2,1],
        [1,1,1,2,1,1,2,0,1,4,1,1,2,1],
        [3,2,2,2,0,3,2,3,2,1,4,2,2,1],
        [3,3,0,2,2,3,2,2,2,1,2,4,3,2],
        [2,2,3,0,1,2,1,2,2,2,2,3,4,2],
        [1,0,1,2,1,1,2,1,1,1,1,2,2,4]
    ];
    function getYoniPoints(boyNak, girlNak) {
        return YONI_SCORE[YONI[boyNak] - 1][YONI[girlNak] - 1];
    }
    function getYoniInterpretation(boyNak, girlNak, scored) {
        const bName = YONI_NAMES[YONI[boyNak]], gName = YONI_NAMES[YONI[girlNak]];
        if (scored === 4) return `The boy's Yoni is ${bName} and the girl's Yoni is ${gName}. A perfect score of 4 indicates exceptional sexual and intimate compatibility. The couple will share a deep physical connection and emotional bond. Their biological rhythms are naturally aligned, leading to a fulfilling and harmonious intimate life.`;
        if (scored >= 3) return `The boy's Yoni is ${bName} and the girl's Yoni is ${gName}. A score of ${scored} out of 4 indicates very good intimate compatibility. The couple will enjoy a satisfying physical relationship with minor differences that can be easily overcome through communication and understanding.`;
        if (scored >= 2) return `The boy's Yoni is ${bName} and the girl's Yoni is ${gName}. A score of ${scored} out of 4 indicates moderate intimate compatibility. While the physical connection exists, it may not always be effortless. The couple should focus on open communication about their needs and desires to maintain a healthy intimate relationship.`;
        if (scored >= 1) return `The boy's Yoni is ${bName} and the girl's Yoni is ${gName}. A low score of ${scored} indicates potential challenges in intimate compatibility. These animal energies are naturally at odds, which may manifest as differing desires or rhythms. However, with patience and understanding, the couple can work through these differences.`;
        return `The boy's Yoni is ${bName} and the girl's Yoni is ${gName}. A score of 0 represents enemy Yoni animals — these are natural adversaries. This indicates significant challenges in physical compatibility. However, if the overall Guna score is high (above 25), the strength of other Kootas can mitigate this issue substantially. Remedies include worship of Kamadev and performing Navagraha Shanti.`;
    }

    // ═══════════════════════════════════════
    // 5. GRAHA MAITRI (5 Points)
    // ═══════════════════════════════════════
    const RASHI_LORD = { 1:3, 2:6, 3:4, 4:2, 5:1, 6:4, 7:6, 8:3, 9:5, 10:7, 11:7, 12:5 };
    const LORD_NAMES = { 1:'Sun', 2:'Moon', 3:'Mars', 4:'Mercury', 5:'Jupiter', 6:'Venus', 7:'Saturn' };
    const GRAHA_MAITRI_SCORE = [
        [5, 5, 5, 4, 5, 0, 0],
        [5, 5, 5, 1, 4, 0.5, 0.5],
        [5, 5, 5, 0.5, 5, 3, 0.5],
        [4, 1, 0.5, 5, 0.5, 5, 4],
        [5, 4, 5, 0.5, 5, 0.5, 3],
        [0, 0.5, 3, 5, 0.5, 5, 5],
        [0, 0.5, 0.5, 4, 3, 5, 5]
    ];
    const FRIENDSHIP = {
        '55':'Sama (Neutral)','50':'Mitra (Friend)','05':'Mitra (Friend)',
        '54':'Shatru (Enemy)','45':'Shatru (Enemy)','40':'Shatru (Enemy)',
        '04':'Shatru (Enemy)','00':'Param Mitra (Best Friend)'
    };
    function getGrahaMaitriPoints(boyRashi, girlRashi) {
        return GRAHA_MAITRI_SCORE[RASHI_LORD[boyRashi] - 1][RASHI_LORD[girlRashi] - 1];
    }
    function getGrahaMaitriInterpretation(boyRashi, girlRashi, scored) {
        const bLord = LORD_NAMES[RASHI_LORD[boyRashi]], gLord = LORD_NAMES[RASHI_LORD[girlRashi]];
        if (scored === 5) return `The boy's Rashi Lord is ${bLord} and the girl's Rashi Lord is ${gLord}. These planets share a mutual friendship (Param Mitra or Mitra). A perfect score of 5 ensures exceptional mental and intellectual compatibility. The couple will naturally understand each other's thought processes, share similar value systems, and communicate effortlessly. Decision-making and conflict resolution will come naturally to them.`;
        if (scored >= 3) return `The boy's Rashi Lord is ${bLord} and the girl's Rashi Lord is ${gLord}. A score of ${scored} indicates good mental compatibility. While the lords are not best friends, they maintain a neutral or partially friendly relationship. The couple will generally agree on important life decisions but may have differing perspectives on some matters, which can actually enrich the relationship.`;
        if (scored >= 1) return `The boy's Rashi Lord is ${bLord} and the girl's Rashi Lord is ${gLord}. A lower score of ${scored} indicates that these planetary lords have a strained relationship. The couple may experience differences in thinking, decision-making styles, and philosophical outlook. Regular communication, mutual respect for differing opinions, and shared intellectual activities (like reading or travel) will help bridge this gap.`;
        return `The boy's Rashi Lord is ${bLord} and the girl's Rashi Lord is ${gLord}. These planets are enemies (Shatru). A score of 0 indicates significant challenges in mental and friendship compatibility. The couple may struggle to understand each other's reasoning and motivations. However, this is not insurmountable — conscious effort in communication and counseling can help. Remedies include strengthening both Rashi Lords through gemstones and mantras.`;
    }

    // ═══════════════════════════════════════
    // 6. GANA (6 Points)
    // ═══════════════════════════════════════
    const GANA = [1,2,3,2,1,2,1,1,3,3,2,2,1,3,1,3,1,3,3,2,2,1,3,3,2,2,1];
    const GANA_NAMES = { 1:'Deva (Divine)', 2:'Manushya (Human)', 3:'Rakshasa (Demon)' };
    const GANA_SCORE = [[6,6,1],[5,6,0],[1,0,6]];
    function getGanaPoints(boyNak, girlNak) {
        return GANA_SCORE[GANA[boyNak] - 1][GANA[girlNak] - 1];
    }
    function getGanaInterpretation(boyNak, girlNak, scored) {
        const bName = GANA_NAMES[GANA[boyNak]], gName = GANA_NAMES[GANA[girlNak]];
        if (scored === 6) return `The boy's Gana is ${bName} and the girl's Gana is ${gName}. A perfect score of 6 indicates excellent temperamental compatibility. Both partners share similar behavioral patterns, emotional responses, and social conduct. They will naturally understand each other's moods and reactions. Family gatherings, social events, and daily interactions will be smooth and harmonious.`;
        if (scored === 5) return `The boy's Gana is ${bName} and the girl's Gana is ${gName}. A score of 5 is very good — the slight difference in Gana actually adds a healthy dynamic to the relationship. The couple will mostly agree on social behavior and values while bringing complementary perspectives that enrich the partnership.`;
        if (scored === 1) return `The boy's Gana is ${bName} and the girl's Gana is ${gName}. A score of 1 indicates significant temperamental differences. One partner's intensity may sometimes overwhelm the other. This combination requires patience, tolerance, and willingness to accept each other's fundamental nature without trying to change it. Gana Dosha Nivarana Puja is recommended.`;
        return `The boy's Gana is ${bName} and the girl's Gana is ${gName}. A score of 0 represents a challenging Gana combination. The couple may frequently clash on basic behavioral expectations, social conduct, and emotional expression. This is considered a significant Dosha. Strong remedial measures including Gana Dosha Shanti Puja and recitation of Rudra Sukta are recommended. If total Guna points exceed 25, the severity is reduced.`;
    }

    // ═══════════════════════════════════════
    // 7. BHAKOOT (7 Points)
    // ═══════════════════════════════════════
    function getBhakootPoints(boyRashi, girlRashi) {
        const diff = ((girlRashi - boyRashi + 12) % 12) + 1;
        if (diff === 2 || diff === 12) return 0;
        if (diff === 5 || diff === 9) return 0;
        if (diff === 6 || diff === 8) return 0;
        return 7;
    }
    function checkBhakootCancellation(boyRashi, girlRashi) {
        const bLord = RASHI_LORD[boyRashi], gLord = RASHI_LORD[girlRashi];
        // Cancellation: If lords are same, mutual friends, or one is lord of both
        if (bLord === gLord) return true;
        const score = GRAHA_MAITRI_SCORE[bLord - 1][gLord - 1];
        return score >= 4; // Mutual friendship cancels Bhakoot Dosha
    }
    function getBhakootInterpretation(boyRashi, girlRashi, scored) {
        const diff = ((girlRashi - boyRashi + 12) % 12) + 1;
        const doshaType = (diff === 2 || diff === 12) ? 'Dhan-Vyaya (2/12)' : 
                          (diff === 5 || diff === 9) ? 'Sukh-Putra (5/9)' : 
                          (diff === 6 || diff === 8) ? 'Rog-Mrityu (6/8)' : null;
        if (scored === 7) return `The Rashi distance between the boy (${RASHIS[boyRashi-1]}) and the girl (${RASHIS[girlRashi-1]}) is ${diff}/13-${diff}. This is an auspicious combination with full 7 points. The couple will enjoy financial stability, good health, and harmonious family life. No Bhakoot Dosha is present.`;
        
        const cancelled = checkBhakootCancellation(boyRashi, girlRashi);
        let text = `The Rashi distance is ${diff}, forming the ${doshaType} Dosha combination. This is a Bhakoot Dosha — the most impactful of all Kootas carrying 7 points. `;
        if (doshaType === 'Dhan-Vyaya (2/12)') text += `This 2/12 combination indicates potential financial challenges and disagreements about money management. There may be periods of financial instability or differences in spending habits. `;
        else if (doshaType === 'Sukh-Putra (5/9)') text += `This 5/9 combination indicates potential challenges related to progeny, happiness, and spiritual compatibility. There may be delays or concerns regarding children, or differences in philosophical outlook. `;
        else text += `This 6/8 combination is the most serious, indicating potential health issues, accidents, or severe marital discord. It is sometimes called the "Mrityu Bhakoot" (death combination). `;
        
        if (cancelled) text += `\n\n✅ CANCELLATION FOUND: The Rashi Lords of both partners share a friendly relationship, which significantly reduces the severity of this Bhakoot Dosha. The negative effects will be substantially mitigated.`;
        else text += `\n\n⚠️ No natural cancellation is available for this Bhakoot Dosha. Remedial measures are strongly recommended — see the Remedies section below.`;
        return text;
    }

    // ═══════════════════════════════════════
    // 8. NADI (8 Points)
    // ═══════════════════════════════════════
    const NADI = [1,2,3,3,2,1,1,2,3,3,2,1,1,2,3,3,2,1,1,2,3,3,2,1,1,2,3];
    const NADI_NAMES = { 1:'Aadi (Vata)', 2:'Madhya (Pitta)', 3:'Antya (Kapha)' };
    function getNadiPoints(boyNak, girlNak) {
        return NADI[boyNak] === NADI[girlNak] ? 0 : 8;
    }
    function checkNadiCancellation(boyRashi, girlRashi) {
        // Cancellation: If both have same Rashi, the Nadi Dosha is cancelled
        if (boyRashi === girlRashi) return true;
        // Also cancelled if Rashis are 1/7 (opposite signs)
        const diff = Math.abs(boyRashi - girlRashi);
        return diff === 6;
    }
    function getNadiInterpretation(boyNak, girlNak, boyRashi, girlRashi, scored) {
        const bName = NADI_NAMES[NADI[boyNak]], gName = NADI_NAMES[NADI[girlNak]];
        if (scored === 8) return `The boy's Nadi is ${bName} and the girl's Nadi is ${gName}. Different Nadis score a full 8 points — the highest single Koota score. This indicates excellent genetic compatibility. The couple is likely to have healthy children and a balanced constitution in their household. The different Ayurvedic temperaments complement each other beautifully.`;
        
        const cancelled = checkNadiCancellation(boyRashi, girlRashi);
        let text = `Both the boy and girl have the same Nadi: ${bName}. This is a NADI DOSHA — the most critical Dosha in Kundali Matching, carrying the heaviest weight of 8 points. Same Nadi indicates similar Ayurvedic constitution (Prakriti), which traditionally suggests genetic incompatibility. This may indicate potential health issues for progeny, difficulty in conception, or constitutional imbalances. `;
        if (cancelled) text += `\n\n✅ CANCELLATION FOUND: Since both partners share the same Rashi or have opposite Rashis (1/7 axis), the Nadi Dosha is cancelled according to classical texts. The negative effects are significantly reduced.`;
        else text += `\n\n⚠️ No natural cancellation is present. This is a serious Dosha. Nadi Dosha Nivarana Puja, donation of gold and grains, and Mahamrityunjaya Jaap are strongly recommended before proceeding with the marriage.`;
        return text;
    }

    // ═══════════════════════════════════════
    // Manglik Dosha Detection
    // ═══════════════════════════════════════
    function checkManglikStatus(chart) {
        const mars = chart.planets.find(p => p.id === 'Mars');
        if (!mars) return { isManglik: false, isLagnaManglik: false, isMoonManglik: false, severity: 'None', houses: [], cancellations: [], cancelled: false };
        
        const lagnaSign = chart.lagnaRashi;
        let marsHouse = mars.rashi - lagnaSign;
        if (marsHouse < 0) marsHouse += 12;
        marsHouse += 1;
        
        const manglikHouses = [1, 2, 4, 7, 8, 12];
        const isLagnaManglik = manglikHouses.includes(marsHouse);
        
        // Check from Moon sign
        const moon = chart.planets.find(p => p.id === 'Moon');
        let marsFromMoon = mars.rashi - moon.rashi;
        if (marsFromMoon < 0) marsFromMoon += 12;
        marsFromMoon += 1;
        const isMoonManglik = manglikHouses.includes(marsFromMoon);

        let severity = 'None';
        if (isLagnaManglik && isMoonManglik) severity = 'Severe (Double Manglik)';
        else if (isLagnaManglik) severity = 'Moderate (Lagna Manglik)';
        else if (isMoonManglik) severity = 'Mild (Chandra Manglik)';
        
        // Cancellation checks
        let cancellations = [];
        if (mars.rashi === 1 || mars.rashi === 8) cancellations.push('Mars in own sign (Aries/Scorpio)');
        if (mars.rashi === 10) cancellations.push('Mars in Capricorn (Exalted)');
        const jupiter = chart.planets.find(p => p.id === 'Jupiter');
        if (jupiter) {
            let jupHouse = jupiter.rashi - lagnaSign;
            if (jupHouse < 0) jupHouse += 12;
            jupHouse += 1;
            if (jupHouse === 1 || jupHouse === 4 || jupHouse === 7) cancellations.push(`Jupiter in Kendra (House ${jupHouse})`);
        }
        
        const cancelled = cancellations.length > 0;
        const isActivelyManglik = isLagnaManglik && !cancelled;
        
        return {
            isManglik: isActivelyManglik,
            isLagnaManglik,
            isMoonManglik,
            marsHouseFromLagna: marsHouse,
            marsHouseFromMoon: marsFromMoon,
            severity: severity,
            cancellations: cancellations,
            cancelled: cancelled
        };
    }

    // ═══════════════════════════════════════
    // Overall Recommendation Engine
    // ═══════════════════════════════════════
    function getOverallRecommendation(total, kootas, boyManglik, girlManglik) {
        let level, color, emoji;
        if (total >= 28) { level = 'Uttama (Excellent Match)'; color = '#2ecc71'; emoji = '🟢'; }
        else if (total >= 22) { level = 'Shreshtha (Very Good Match)'; color = '#27ae60'; emoji = '🟢'; }
        else if (total >= 18) { level = 'Madhyama (Good / Average Match)'; color = '#f1c40f'; emoji = '🟡'; }
        else if (total >= 14) { level = 'Adhama (Below Average)'; color = '#e67e22'; emoji = '🟠'; }
        else { level = 'Not Recommended'; color = '#e74c3c'; emoji = '🔴'; }

        let strengths = [], concerns = [];
        
        if (kootas.nadi.scored === 8) strengths.push('Excellent genetic compatibility (Nadi)');
        if (kootas.bhakoot.scored === 7) strengths.push('Strong family and financial harmony (Bhakoot)');
        if (kootas.gana.scored >= 5) strengths.push('Compatible temperaments (Gana)');
        if (kootas.graha.scored >= 4) strengths.push('Strong mental connection (Graha Maitri)');
        if (kootas.yoni.scored >= 3) strengths.push('Good intimate compatibility (Yoni)');
        if (kootas.tara.scored >= 1.5) strengths.push('Favorable destiny alignment (Tara)');
        
        if (kootas.nadi.scored === 0) concerns.push('Nadi Dosha — genetic incompatibility risk');
        if (kootas.bhakoot.scored === 0) concerns.push('Bhakoot Dosha — family/financial challenges');
        if (kootas.gana.scored === 0) concerns.push('Gana Dosha — temperamental conflicts');
        if (kootas.yoni.scored <= 1) concerns.push('Low intimate compatibility');
        if (kootas.graha.scored <= 1) concerns.push('Mental wavelength mismatch');
        
        // Manglik cross check
        let manglikNote = '';
        if (boyManglik.isManglik && girlManglik.isManglik) {
            manglikNote = 'Both partners are Manglik, which cancels the Manglik Dosha for marriage purposes. This is a positive factor.';
        } else if (boyManglik.isManglik && !girlManglik.isManglik) {
            manglikNote = '⚠️ The boy is Manglik but the girl is not. This mismatch requires attention. Kumbh Vivah or Vishnu Vivah remedy is traditionally recommended for the Manglik partner before marriage.';
        } else if (!boyManglik.isManglik && girlManglik.isManglik) {
            manglikNote = '⚠️ The girl is Manglik but the boy is not. This mismatch requires attention. Kumbh Vivah remedy is traditionally recommended for the Manglik partner before marriage.';
        } else {
            manglikNote = 'Neither partner is Manglik. No Manglik-related concerns exist.';
        }
        
        let remedies = [];
        if (kootas.nadi.scored === 0) {
            remedies.push({ name: 'Nadi Dosha Nivarana', desc: 'Perform Mahamrityunjaya Jaap (1,25,000 times). Donate gold and grains in the name of both partners. Perform Nadi Dosha Shanti Puja at a Shiva temple.' });
        }
        if (kootas.bhakoot.scored === 0) {
            remedies.push({ name: 'Bhakoot Dosha Remedy', desc: 'Perform Graha Shanti Puja for both Rashi Lords. Chant the Beej Mantra of both Moon signs. Donate items related to the weaker Rashi Lord.' });
        }
        if (kootas.gana.scored === 0) {
            remedies.push({ name: 'Gana Dosha Shanti', desc: 'Perform Rudra Abhishek and recite Rudra Sukta. Both partners should chant "Om Namah Shivaya" 108 times daily for 40 days before marriage.' });
        }
        if (boyManglik.isManglik !== girlManglik.isManglik) {
            remedies.push({ name: 'Manglik Dosha Remedy', desc: 'The Manglik partner should perform Kumbh Vivah (symbolic marriage with a pot) or Vishnu Vivah before the actual marriage. Hanuman Chalisa recitation daily is also recommended.' });
        }
        if (total < 18) {
            remedies.push({ name: 'General Compatibility Enhancement', desc: 'Both partners should worship Lord Shiva and Goddess Parvati together. Perform Navagraha Shanti Puja. Visit Rameswaram or any Jyotirlinga temple before marriage. Regular Satyanarayan Katha is also beneficial.' });
        }
        if (remedies.length === 0) {
            remedies.push({ name: 'Blessings', desc: 'No specific remedies are required. The couple is blessed with a naturally compatible horoscope. Performing Gauri-Shankar Puja before marriage will enhance marital bliss.' });
        }

        return { level, color, emoji, strengths, concerns, manglikNote, remedies };
    }

    // ═══════════════════════════════════════
    // Dasha Compatibility Analysis
    // ═══════════════════════════════════════
    function analyzeDashaCompatibility(boyChart, girlChart) {
        if (!boyChart || !girlChart || !boyChart.dashas || !girlChart.dashas) {
            return { available: false };
        }

        const now = new Date();
        const nowStr = now.toISOString().split('T')[0];

        function findCurrentDasha(dashas) {
            for (const md of dashas) {
                if (nowStr >= md.startStr && nowStr <= md.endStr) {
                    let currentAD = null;
                    for (const ad of md.antardashas) {
                        if (nowStr >= ad.startStr && nowStr <= ad.endStr) {
                            currentAD = ad;
                            break;
                        }
                    }
                    return { mahadasha: md.lord, antardasha: currentAD ? currentAD.lord : md.lord, mdStart: md.startStr, mdEnd: md.endStr, adStart: currentAD ? currentAD.startStr : '', adEnd: currentAD ? currentAD.endStr : '' };
                }
            }
            return null;
        }

        const boyDasha = findCurrentDasha(boyChart.dashas);
        const girlDasha = findCurrentDasha(girlChart.dashas);

        if (!boyDasha || !girlDasha) return { available: false };

        // Compatibility of Dasha Lords
        const NATURAL_FRIENDS = {
            'Sun': ['Moon', 'Mars', 'Jupiter'],
            'Moon': ['Sun', 'Mercury'],
            'Mars': ['Sun', 'Moon', 'Jupiter'],
            'Mercury': ['Sun', 'Venus'],
            'Jupiter': ['Sun', 'Moon', 'Mars'],
            'Venus': ['Mercury', 'Saturn'],
            'Saturn': ['Mercury', 'Venus'],
            'Rahu': ['Saturn', 'Venus', 'Mercury'],
            'Ketu': ['Mars', 'Jupiter']
        };

        function areFriendly(p1, p2) {
            return (NATURAL_FRIENDS[p1] || []).includes(p2);
        }

        const mdCompatible = areFriendly(boyDasha.mahadasha, girlDasha.mahadasha);
        const adCompatible = areFriendly(boyDasha.antardasha, girlDasha.antardasha);

        let compatibility = 'Moderate';
        let interpretation = '';

        if (mdCompatible && adCompatible) {
            compatibility = 'Excellent';
            interpretation = `The boy is currently running ${boyDasha.mahadasha} Mahadasha with ${boyDasha.antardasha} Antardasha (${boyDasha.mdStart.substring(0,4)}-${boyDasha.mdEnd.substring(0,4)}), while the girl is running ${girlDasha.mahadasha} Mahadasha with ${girlDasha.antardasha} Antardasha (${girlDasha.mdStart.substring(0,4)}-${girlDasha.mdEnd.substring(0,4)}). These Dasha lords are naturally friendly planets, indicating that this is an excellent time for both to get married. The planetary periods support harmony, mutual growth, and marital bliss during this phase.`;
        } else if (mdCompatible || adCompatible) {
            compatibility = 'Good';
            interpretation = `The boy is running ${boyDasha.mahadasha}-${boyDasha.antardasha} Dasha, and the girl is running ${girlDasha.mahadasha}-${girlDasha.antardasha} Dasha. The Mahadasha lords are ${mdCompatible ? 'compatible' : 'neutral to each other'}, while the Antardasha lords are ${adCompatible ? 'compatible' : 'not naturally aligned'}. Overall, the current Dasha period is ${mdCompatible ? 'supportive' : 'manageable'} for marriage. The couple should be mindful of potential friction during the ${!adCompatible ? 'Antardasha' : 'Mahadasha'} transitions.`;
        } else {
            compatibility = 'Challenging';
            interpretation = `The boy is running ${boyDasha.mahadasha}-${boyDasha.antardasha} Dasha, and the girl is running ${girlDasha.mahadasha}-${girlDasha.antardasha} Dasha. These Dasha lords are not naturally friendly planets. Marriage during this period may face initial adjustment challenges. It is advisable to perform Navagraha Shanti Puja and strengthen both partners' current Dasha lords through appropriate remedies before and after marriage. The challenges are temporary and will ease as the Dasha periods evolve.`;
        }

        return {
            available: true,
            boyDasha, girlDasha,
            compatibility, interpretation,
            mdCompatible, adCompatible
        };
    }

    // ═══════════════════════════════════════
    // 7th House & Venus/Jupiter Deep Analysis
    // ═══════════════════════════════════════
    function analyzeMarriageYogas(chart, personName) {
        const analysis = [];
        const planets = chart.planets;
        const lagnaRashi = chart.lagnaRashi;

        function getHouse(rashi) {
            let h = rashi - lagnaRashi;
            if (h < 0) h += 12;
            return h + 1;
        }

        // 7th House Lord Analysis
        const seventhRashi = ((lagnaRashi + 5) % 12) + 1;
        const LORDS_MAP = { 1:'Mars', 2:'Venus', 3:'Mercury', 4:'Moon', 5:'Sun', 6:'Mercury', 7:'Venus', 8:'Mars', 9:'Jupiter', 10:'Saturn', 11:'Saturn', 12:'Jupiter' };
        const seventhLord = LORDS_MAP[seventhRashi];
        const seventhLordPlanet = planets.find(p => p.name.includes(seventhLord) || p.id === seventhLord);

        if (seventhLordPlanet) {
            const slHouse = getHouse(seventhLordPlanet.rashi);
            const dignity = seventhLordPlanet.dignity || 'Neutral';
            let text = `${personName}'s 7th House Lord is ${seventhLord}, placed in House ${slHouse} (${seventhLordPlanet.rashiName}) with ${dignity} dignity. `;
            if ([1,4,7,10].includes(slHouse)) {
                text += `Being in a Kendra house, the 7th lord is strongly positioned — indicating a good marriage, supportive spouse, and harmonious partnership.`;
            } else if ([5,9].includes(slHouse)) {
                text += `Placed in a Trikona (trine), the 7th lord indicates a spiritually compatible and fortunate marriage.`;
            } else if ([6,8,12].includes(slHouse)) {
                text += `Placed in a Dusthana house, the 7th lord may indicate some challenges in married life — delays, health concerns of spouse, or adjustment issues. Remedies for ${seventhLord} are recommended.`;
            } else {
                text += `The 7th lord in this position indicates a steady, moderate marriage experience.`;
            }
            if (dignity.includes('Exalted')) text += ` The fact that ${seventhLord} is exalted greatly enhances marital prospects.`;
            if (dignity.includes('Debilitated')) text += ` The debilitation of ${seventhLord} needs attention — strengthening this planet through gemstones or mantras is advised.`;
            analysis.push({ title: '7th House Lord', text });
        }

        // Venus Analysis (Karaka of Marriage)
        const venus = planets.find(p => p.id === 'Venus');
        if (venus) {
            const venusHouse = getHouse(venus.rashi);
            let text = `Venus (the natural significator of marriage) is at ${venus.degreeStr} in ${venus.rashiName} (House ${venusHouse}). `;
            if (venus.dignity.includes('Exalted') || venus.dignity.includes('Own Sign')) {
                text += `Venus is strong in ${personName}'s chart, blessing the native with natural charm, love for aesthetics, and a fulfilling romantic life.`;
            } else if (venus.dignity.includes('Debilitated')) {
                text += `Venus is debilitated, which may cause challenges in expressing affection or finding satisfaction in relationships. Wearing a Diamond or White Sapphire (after consultation) and chanting Venus mantra can help.`;
            } else {
                text += `Venus is in a neutral position, indicating a balanced approach to love and relationships.`;
            }
            analysis.push({ title: 'Venus (Marriage Karaka)', text });
        }

        // Jupiter Analysis (Karaka of Husband for female charts)
        const jupiter = planets.find(p => p.id === 'Jupiter');
        if (jupiter) {
            const jupHouse = getHouse(jupiter.rashi);
            let text = `Jupiter (Guru) is at ${jupiter.degreeStr} in ${jupiter.rashiName} (House ${jupHouse}). `;
            if (jupiter.dignity.includes('Exalted') || jupiter.dignity.includes('Own Sign')) {
                text += `Jupiter is strong, indicating wisdom, righteousness, and divine blessings in married life. The native will attract a knowledgeable and virtuous spouse.`;
            } else if ([1,4,7,10].includes(jupHouse)) {
                text += `Jupiter in a Kendra house creates Hamsa Mahapurusha Yoga, bestowing noble qualities and a fortunate marriage.`;
            } else {
                text += `Jupiter's placement is average — the native will benefit from seeking Jupiter's blessings through Thursday fasting and Guru mantra recitation.`;
            }
            analysis.push({ title: 'Jupiter (Wisdom & Dharma)', text });
        }

        return analysis;
    }

    // ═══════════════════════════════════════
    // Navamsa (D9) Marriage Cross-Analysis
    // ═══════════════════════════════════════
    function analyzeNavamsaCompatibility(boyChart, girlChart) {
        if (!boyChart || !girlChart) return null;

        const boyNavLagna = boyChart.lagnaNavamsaRashi;
        const girlNavLagna = girlChart.lagnaNavamsaRashi;
        const RASHIS_LOCAL = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

        let text = `The Navamsa (D9) chart is the most important divisional chart for marriage analysis.\n\n`;
        text += `Boy's Navamsa Lagna: ${RASHIS_LOCAL[(boyNavLagna || 1) - 1]} | Girl's Navamsa Lagna: ${RASHIS_LOCAL[(girlNavLagna || 1) - 1]}.\n\n`;

        if (boyNavLagna && girlNavLagna) {
            const diff = Math.abs(boyNavLagna - girlNavLagna);
            if (diff === 0) {
                text += `Both partners share the same Navamsa Lagna — this is an exceptionally rare and auspicious combination! It indicates deep soul-level compatibility and a marriage that is destined by karma. The couple will share similar spiritual paths and life purposes.`;
            } else if (diff === 6) {
                text += `The Navamsa Lagnas are in 7/7 opposition (facing each other), which is considered favorable for marriage. This indicates complementary energies — what one partner lacks, the other provides. The marriage will be a balanced partnership.`;
            } else if ([3,5,9,11].includes(diff) || [3,5,9,11].includes(12-diff)) {
                text += `The Navamsa Lagnas are in a harmonious trine or sextile relationship, indicating natural compatibility in the spiritual dimension of marriage. The couple will grow together spiritually.`;
            } else {
                text += `The Navamsa Lagnas are in a challenging aspect. This doesn't negate the marriage — it means the spiritual growth will come through overcoming challenges together. Shared spiritual practices like meditation or temple visits will strengthen the bond.`;
            }
        }

        return text;
    }

    // ═══════════════════════════════════════
    // Main Calculation Function
    // ═══════════════════════════════════════
    function calculateGunaMilan(boy, girl, boyChart, girlChart) {
        const varna = getVarnaPoints(boy.rashi, girl.rashi);
        const vashya = getVashyaPoints(boy.rashi, girl.rashi);
        const tara = getTaraPoints(boy.nakshatra, girl.nakshatra);
        const yoni = getYoniPoints(boy.nakshatra, girl.nakshatra);
        const graha = getGrahaMaitriPoints(boy.rashi, girl.rashi);
        const gana = getGanaPoints(boy.nakshatra, girl.nakshatra);
        const bhakoot = getBhakootPoints(boy.rashi, girl.rashi);
        const nadi = getNadiPoints(boy.nakshatra, girl.nakshatra);
        const total = varna + vashya + tara + yoni + graha + gana + bhakoot + nadi;

        const kootas = {
            varna: { max: 1, scored: varna, name: "Varna", nameHindi: "वर्ण", desc: "Work, Ego & Social Compatibility", interpretation: getVarnaInterpretation(boy.rashi, girl.rashi, varna), boyValue: VARNA_NAMES[VARNA[boy.rashi]], girlValue: VARNA_NAMES[VARNA[girl.rashi]] },
            vashya: { max: 2, scored: vashya, name: "Vashya", nameHindi: "वश्य", desc: "Mutual Attraction & Influence", interpretation: getVashyaInterpretation(boy.rashi, girl.rashi, vashya), boyValue: VASHYA_NAMES[VASHYA_GROUP[boy.rashi]], girlValue: VASHYA_NAMES[VASHYA_GROUP[girl.rashi]] },
            tara: { max: 3, scored: tara, name: "Tara", nameHindi: "तारा", desc: "Destiny, Health & Well-being", interpretation: getTaraInterpretation(boy.nakshatra, girl.nakshatra, tara) },
            yoni: { max: 4, scored: yoni, name: "Yoni", nameHindi: "योनि", desc: "Biological & Intimate Compatibility", interpretation: getYoniInterpretation(boy.nakshatra, girl.nakshatra, yoni), boyValue: YONI_NAMES[YONI[boy.nakshatra]], girlValue: YONI_NAMES[YONI[girl.nakshatra]] },
            graha: { max: 5, scored: graha, name: "Graha Maitri", nameHindi: "ग्रह मैत्री", desc: "Mental & Friendship Compatibility", interpretation: getGrahaMaitriInterpretation(boy.rashi, girl.rashi, graha), boyValue: LORD_NAMES[RASHI_LORD[boy.rashi]], girlValue: LORD_NAMES[RASHI_LORD[girl.rashi]] },
            gana: { max: 6, scored: gana, name: "Gana", nameHindi: "गण", desc: "Temperament & Behavior", interpretation: getGanaInterpretation(boy.nakshatra, girl.nakshatra, gana), boyValue: GANA_NAMES[GANA[boy.nakshatra]], girlValue: GANA_NAMES[GANA[girl.nakshatra]] },
            bhakoot: { max: 7, scored: bhakoot, name: "Bhakoot", nameHindi: "भकूट", desc: "Family, Finance & Life Compatibility", interpretation: getBhakootInterpretation(boy.rashi, girl.rashi, bhakoot), boyValue: RASHIS[boy.rashi-1], girlValue: RASHIS[girl.rashi-1] },
            nadi: { max: 8, scored: nadi, name: "Nadi", nameHindi: "नाड़ी", desc: "Genetic & Progeny Compatibility", interpretation: getNadiInterpretation(boy.nakshatra, girl.nakshatra, boy.rashi, girl.rashi, nadi), boyValue: NADI_NAMES[NADI[boy.nakshatra]], girlValue: NADI_NAMES[NADI[girl.nakshatra]] }
        };
        
        // Manglik analysis
        const boyManglik = boyChart ? checkManglikStatus(boyChart) : { isManglik: false, severity: 'None', cancellations: [] };
        const girlManglik = girlChart ? checkManglikStatus(girlChart) : { isManglik: false, severity: 'None', cancellations: [] };
        
        // Dasha compatibility
        const dashaAnalysis = analyzeDashaCompatibility(boyChart, girlChart);

        // Marriage yoga analysis
        const boyMarriageYogas = boyChart ? analyzeMarriageYogas(boyChart, 'Boy') : [];
        const girlMarriageYogas = girlChart ? analyzeMarriageYogas(girlChart, 'Girl') : [];

        // Navamsa compatibility
        const navamsaAnalysis = analyzeNavamsaCompatibility(boyChart, girlChart);

        // Overall recommendation
        const recommendation = getOverallRecommendation(total, kootas, boyManglik, girlManglik);

        return {
            ...kootas,
            total,
            boyManglik,
            girlManglik,
            dashaAnalysis,
            boyMarriageYogas,
            girlMarriageYogas,
            navamsaAnalysis,
            recommendation,
            boyRashiName: RASHIS[boy.rashi - 1],
            girlRashiName: RASHIS[girl.rashi - 1],
            boyNakshatraName: NAKSHATRAS[boy.nakshatra],
            girlNakshatraName: NAKSHATRAS[girl.nakshatra],
            boyLordName: LORD_NAMES[RASHI_LORD[boy.rashi]],
            girlLordName: LORD_NAMES[RASHI_LORD[girl.rashi]]
        };
    }

    return {
        calculateGunaMilan,
        checkManglikStatus,
        RASHIS, NAKSHATRAS, VARNA, VASHYA_GROUP, YONI, RASHI_LORD, GANA, NADI
    };
})();

