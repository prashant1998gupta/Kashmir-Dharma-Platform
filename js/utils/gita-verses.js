/* ============================================
   Bhagavad Gita Verse Library
   Local grounding for Gita guidance
   ============================================ */

const GitaVerseLibrary = (() => {
    const verses = [
        {
            id: '2.47',
            chapter: 2,
            verse: 47,
            tags: ['karma', 'duty', 'future', 'career', 'anxiety', 'results', 'work'],
            sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
            transliteration: 'karmany-evadhikaras te ma phaleshu kadachana\nma karma-phala-hetur bhur ma te sango stv akarmani',
            meaning: {
                en: 'You have a right to your action, but never to the fruits of action. Do not make the result your motive, and do not become attached to inaction.',
                hi: 'तुम्हारा अधिकार कर्म पर है, फल पर कभी नहीं। फल को ही प्रेरणा मत बनाओ और अकर्मण्यता से भी मत जुड़ो।'
            },
            practice: {
                en: 'Choose one duty you can do cleanly today, then release the need to control how others respond.',
                hi: 'आज एक कर्तव्य चुनें जिसे आप ईमानदारी से कर सकते हैं, फिर दूसरों की प्रतिक्रिया को नियंत्रित करने की चाह छोड़ें।'
            }
        },
        {
            id: '2.48',
            chapter: 2,
            verse: 48,
            tags: ['balance', 'success', 'failure', 'equanimity', 'stress', 'decision'],
            sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
            transliteration: 'yoga-sthah kuru karmani sangam tyaktva dhananjaya\nsiddhy-asiddhyoh samo bhutva samatvam yoga uchyate',
            meaning: {
                en: 'Established in yoga, perform your work without attachment. Remain balanced in success and failure; such balance is called yoga.',
                hi: 'योग में स्थित होकर आसक्ति छोड़कर कर्म करो। सफलता और असफलता में समान रहो; यही समत्व योग कहलाता है।'
            },
            practice: {
                en: 'Before acting, write the right action in one line and the outcome you must surrender in another.',
                hi: 'कर्म से पहले एक पंक्ति में सही कर्म लिखें और दूसरी पंक्ति में वह फल लिखें जिसे आपको समर्पित करना है।'
            }
        },
        {
            id: '2.14',
            chapter: 2,
            verse: 14,
            tags: ['pain', 'grief', 'emotion', 'patience', 'change', 'resilience'],
            sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
            transliteration: 'matra-sparsas tu kaunteya sitoshna-sukha-duhkha-dah\nagamapayino nityas tams titikshasva bharata',
            meaning: {
                en: 'The contact of senses with objects gives heat and cold, pleasure and pain. They come and go; they are impermanent. Endure them with steadiness.',
                hi: 'इंद्रियों के विषयों से संपर्क सुख-दुख, शीत-उष्ण देता है। वे आते-जाते हैं और अनित्य हैं। उन्हें धैर्य से सहो।'
            },
            practice: {
                en: 'Name the feeling without becoming it: “This is passing through me.” Then take three slow breaths.',
                hi: 'भावना को पहचानें पर उससे अपनी पहचान न बनाएं: “यह मेरे भीतर से गुजर रही है।” फिर तीन धीमी सांसें लें।'
            }
        },
        {
            id: '3.19',
            chapter: 3,
            verse: 19,
            tags: ['discipline', 'service', 'karma', 'purpose', 'work', 'habit'],
            sanskrit: 'तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥',
            transliteration: 'tasmad asaktah satatam karyam karma samachara\nasakto hy acharan karma param apnoti purushah',
            meaning: {
                en: 'Therefore, perform the work that ought to be done, without attachment. By acting without attachment, a person attains the highest.',
                hi: 'इसलिए आसक्ति रहित होकर अपना कर्तव्य करते रहो। आसक्ति रहित कर्म से मनुष्य श्रेष्ठ अवस्था को प्राप्त करता है।'
            },
            practice: {
                en: 'Turn one responsibility into service: ask, “Who is helped if I do this well?”',
                hi: 'एक जिम्मेदारी को सेवा बनाएं: पूछें, “यदि मैं इसे अच्छे से करूं तो किसका हित होगा?”'
            }
        },
        {
            id: '4.7',
            chapter: 4,
            verse: 7,
            tags: ['dharma', 'hope', 'crisis', 'justice', 'faith', 'protection'],
            sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
            transliteration: 'yada yada hi dharmasya glanir bhavati bharata\nabhyutthanam adharmasya tadatmanam srijamy aham',
            meaning: {
                en: 'Whenever dharma declines and adharma rises, the Divine manifests to restore balance.',
                hi: 'जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब दिव्य चेतना संतुलन स्थापित करने के लिए प्रकट होती है।'
            },
            practice: {
                en: 'Find the smallest dharmic action available now. Restoration often begins with one clear step.',
                hi: 'अभी उपलब्ध सबसे छोटा धर्मपूर्ण कदम खोजें। संतुलन अक्सर एक स्पष्ट कदम से शुरू होता है।'
            }
        },
        {
            id: '6.5',
            chapter: 6,
            verse: 5,
            tags: ['self', 'confidence', 'discipline', 'growth', 'mind', 'depression'],
            sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
            transliteration: 'uddhared atmanatmanam natmanam avasadayet\natmaiva hy atmano bandhur atmaiva ripur atmanah',
            meaning: {
                en: 'Lift yourself by your own self; do not degrade yourself. The self can be one’s friend, and the self can be one’s enemy.',
                hi: 'अपने द्वारा अपना उत्थान करो, स्वयं को गिराओ मत। मनुष्य स्वयं अपना मित्र भी है और स्वयं अपना शत्रु भी।'
            },
            practice: {
                en: 'Speak to yourself today as you would speak to someone you are responsible for protecting.',
                hi: 'आज स्वयं से ऐसे बात करें जैसे आप किसी प्रिय व्यक्ति की रक्षा करने की जिम्मेदारी निभा रहे हों।'
            }
        },
        {
            id: '6.26',
            chapter: 6,
            verse: 26,
            tags: ['mind', 'meditation', 'focus', 'overthinking', 'anxiety', 'practice'],
            sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥',
            transliteration: 'yato yato nishcharati manas chanchalam asthiram\ntatas tato niyamyaitad atmany eva vasham nayet',
            meaning: {
                en: 'Whenever the restless, unsteady mind wanders, bring it back under the guidance of the Self.',
                hi: 'चंचल और अस्थिर मन जहां-जहां भटके, उसे बार-बार आत्मा के नियंत्रण में वापस लाओ।'
            },
            practice: {
                en: 'When the mind wanders, return gently to one anchor: breath, mantra, or the next right action.',
                hi: 'जब मन भटके, उसे धीरे से एक आधार पर लौटाएं: सांस, मंत्र, या अगला सही कर्म।'
            }
        },
        {
            id: '9.22',
            chapter: 9,
            verse: 22,
            tags: ['devotion', 'trust', 'fear', 'faith', 'support', 'surrender'],
            sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
            transliteration: 'ananyas chintayanto mam ye janah paryupasate\ntesham nityabhiyuktanam yoga-kshemam vahamy aham',
            meaning: {
                en: 'Those who remember the Divine with single-pointed devotion are cared for; what they lack is brought, and what they have is protected.',
                hi: 'जो एकाग्र भक्ति से दिव्य का स्मरण करते हैं, उनके योगक्षेम का वहन स्वयं दिव्य करता है।'
            },
            practice: {
                en: 'Offer one fear into prayer, then act on the one responsibility still in your hands.',
                hi: 'एक भय को प्रार्थना में समर्पित करें, फिर जो जिम्मेदारी आपके हाथ में है उस पर कर्म करें।'
            }
        },
        {
            id: '12.13-14',
            chapter: 12,
            verse: 13,
            tags: ['relationship', 'anger', 'forgiveness', 'compassion', 'ego', 'devotion'],
            sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥',
            transliteration: 'adveshta sarva-bhutanam maitrah karuna eva cha\nnirmamo nirahankarah sama-duhkha-sukhah kshami',
            meaning: {
                en: 'One dear to the Divine bears no hatred, is friendly and compassionate, free from possessiveness and ego, balanced in joy and sorrow, and forgiving.',
                hi: 'जो द्वेष रहित, मैत्रीपूर्ण, करुणामय, ममता और अहंकार से मुक्त, सुख-दुख में सम और क्षमाशील है, वह दिव्य को प्रिय है।'
            },
            practice: {
                en: 'In one difficult relationship, practice firmness without hatred and kindness without self-erasure.',
                hi: 'एक कठिन रिश्ते में द्वेष रहित दृढ़ता और स्वयं को मिटाए बिना करुणा का अभ्यास करें।'
            }
        },
        {
            id: '18.66',
            chapter: 18,
            verse: 66,
            tags: ['surrender', 'guilt', 'confusion', 'faith', 'liberation', 'fear'],
            sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
            transliteration: 'sarva-dharman parityajya mam ekam sharanam vraja\naham tvam sarva-papebhyo mokshayishyami ma shuchah',
            meaning: {
                en: 'Let go of all lesser shelters and take refuge in the Divine alone. You will be freed from all bondage; do not grieve.',
                hi: 'सभी छोटे आश्रयों को छोड़कर केवल दिव्य शरण में आओ। तुम बंधनों से मुक्त किए जाओगे; शोक मत करो।'
            },
            practice: {
                en: 'When guilt overwhelms you, make repair where possible, then return to surrender rather than self-punishment.',
                hi: 'जब अपराधबोध भारी हो, जहां संभव हो सुधार करें, फिर आत्म-दंड के बजाय समर्पण में लौटें।'
            }
        }
    ];

    function normalize(text) {
        return String(text || '').toLowerCase().replace(/[^\p{L}\p{N}\s.-]/gu, ' ');
    }

    function getLanguage() {
        return typeof I18n !== 'undefined' ? I18n.getLanguage() : 'en';
    }

    function textFor(verse, field, language = getLanguage()) {
        const value = verse[field];
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[language] || value.en || '';
    }

    function formatReference(verse) {
        return `${verse.chapter}.${verse.verse}${verse.id.includes('-') ? '-' + verse.id.split('-')[1] : ''}`;
    }

    function getDailyVerse(date = new Date()) {
        const start = new Date(date.getFullYear(), 0, 0);
        const day = Math.floor((date - start) / 86400000);
        return verses[day % verses.length];
    }

    function search(query, limit = 3) {
        const normalized = normalize(query);
        const terms = normalized.split(/\s+/).filter(Boolean);
        const scored = verses.map(verse => {
            const haystack = normalize([
                verse.id,
                verse.tags.join(' '),
                verse.transliteration,
                verse.sanskrit,
                verse.meaning.en,
                verse.meaning.hi,
                verse.practice.en,
                verse.practice.hi
            ].join(' '));

            let score = 0;
            verse.tags.forEach(tag => {
                if (normalized.includes(tag)) score += 4;
            });
            terms.forEach(term => {
                if (term.length > 2 && haystack.includes(term)) score += 1;
            });

            return { verse, score };
        });

        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.verse);
    }

    return {
        verses,
        getDailyVerse,
        search,
        textFor,
        formatReference
    };
})();

window.GitaVerseLibrary = GitaVerseLibrary;
