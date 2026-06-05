/**
 * Localization (i18n) Engine
 * Manages language switching and dictionary lookups.
 */

const I18n = (() => {
    // Dictionary of translations
    const translations = {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.calendar': 'Festival Calendar',
            'nav.rituals': 'Ritual Library',
            'nav.wedding': 'Wedding Guide',
            'nav.tithi': 'Janma Tithi',
            'nav.kundali': 'Kundali Generator',
            'nav.matching': 'Kundali Matching',
            'nav.muhurat': 'Muhurat Finder',
            'nav.varshphal': 'Annual Varshphal',
            'nav.heritage': 'Family Heritage',
            'nav.profiles': 'Saved Profiles',
            'nav.knowledge': 'Knowledge Archive',
            'nav.audio': 'Audio & Wanwun',
            'nav.sharada': 'Learn Sharada',
            'nav.guide': 'Knowledge Guide',
            'nav.scholar': 'Scholar Validated',
            'nav.logo_title': 'Kashmir',
            'nav.logo_subtitle': 'Dharma Companion',
            'nav.logo_mobile': 'Kashmir Dharma',
            'nav.loading': 'Loading sacred knowledge...',
            
            // Home Page
            'home.mantra': 'Om Namah Shivaya',
            'home.mantra_highlight': 'Har Har Mahadev',
            'home.mantra_meaning': 'May the divine grace of Lord Shiva bring peace, wisdom, and strength to your spiritual journey.',
            'home.presence_title': 'Today\'s Presence',
            'home.highlights_title': 'Highlights',
            'home.cosmic_title': 'Current Cosmic Energy',
            'home.quick_tools': 'Quick Tools',
            'home.quick_tools_desc': 'Access your spiritual utilities',
            'home.explore_knowledge': 'Explore Knowledge',
            'home.explore_knowledge_desc': 'Deep dive into our rich spiritual heritage',
            'home.card_cal_desc': 'Explore Kashmiri Pandit festivals',
            'home.card_kundali_desc': 'Generate your Vedic Birth Chart',
            'home.card_muhurat_desc': 'Identify auspicious dates & timings',
            'home.card_rituals_desc': 'Comprehensive encyclopedia of rituals',
            'home.card_wedding_desc': 'Your companion for KP weddings',
            'home.card_sharada_desc': 'Learn the ancient sacred script',
            'home.festival': 'FESTIVAL',
            
            // Festivals
            'fest.navreh.name': 'Navreh',
            'fest.navreh.date': 'Chaitra Shukla Pratipada (March/April)',
            'fest.herath.name': 'Herath (Maha Shivaratri)',
            'fest.herath.date': 'Phalguna Krishna Trayodashi (February/March)',
            'fest.zyeth-atham.name': 'Zyeth Atham',
            'fest.zyeth-atham.date': 'Jyeshtha Shukla Ashtami (May/June)',
            'fest.khetsrimavas.name': 'Khetsrimavas',
            'fest.khetsrimavas.date': 'Jyeshtha Amavasya (May/June)',
            'fest.pan-festival.name': 'Pan (Pann)',
            'fest.pan-festival.date': 'Bhadrapada (August/September)',
            'fest.janmashtami.name': 'Janmashtami',
            'fest.janmashtami.date': 'Bhadrapada Krishna Ashtami (August/September)',
            'fest.ram-navami.name': 'Ram Navami',
            'fest.ram-navami.date': 'Chaitra Shukla Navami (March/April)',
            'fest.sharika-jayanti.name': 'Sharika Jayanti',
            'fest.sharika-jayanti.date': 'Ashadha Shukla Navami (July)',
            'home.sunrise': 'Sunrise',
            'home.sunset': 'Sunset',
            'home.local': 'Local',
            'home.srinagar': 'Srinagar',
            'home.tithi': 'Tithi',
            'home.nakshatra': 'Nakshatra',
            'home.rashi': 'Rashi',
            'home.festival': 'FESTIVAL',
            'home.moon_in': 'The Moon is in',
            // Calendar Page
            'calendar.title': 'Festival Calendar',
            'calendar.desc': 'Explore the complete calendar of Kashmiri Pandit festivals, observances, and celebrations',
            'calendar.previous': 'Previous',
            'calendar.next': 'Next',
            'calendar.all_festivals': 'All Festivals & Observances',
            'calendar.all_festivals_desc': 'Detailed guide to each festival',
            'calendar.search': 'Search festivals...',
            'calendar.no_festivals': 'No festivals found',
            'calendar.try_different': 'Try a different search term',
            'month.0': 'January', 'month.1': 'February', 'month.2': 'March', 'month.3': 'April',
            'month.4': 'May', 'month.5': 'June', 'month.6': 'July', 'month.7': 'August',
            'month.8': 'September', 'month.9': 'October', 'month.10': 'November', 'month.11': 'December',
            'day.0': 'Sun', 'day.1': 'Mon', 'day.2': 'Tue', 'day.3': 'Wed', 'day.4': 'Thu', 'day.5': 'Fri', 'day.6': 'Sat',

            // Kundali Page
            'kundali.title': 'Kundali Generator',
            'kundali.desc': 'Generate your Vedic Birth Chart locally and privately. No data is sent to any server.',
            'kundali.enter_details': 'Enter Birth Details',
            'kundali.name': 'Name',
            'kundali.dob': 'Date of Birth',
            'kundali.tob': 'Time of Birth',
            'kundali.city': 'City of Birth (Searchable)',
            'kundali.city_placeholder': 'Type to search global cities...',
            'kundali.generate': 'Generate Kundali ✨',
            'kundali.print': '🖨️ Print / Save as PDF',
            'kundali.lagna': 'Lagna:',
            'kundali.rashi': 'Rashi:',
            'kundali.nakshatra': 'Nakshatra:',
            'kundali.d1': 'Lagna Chart (D1)',
            'kundali.d9': 'Navamsa Chart (D9)',
            'kundali.d10': 'Dasamsa Chart (D10)',
            'kundali.d7': 'Saptamsa Chart (D7)',
            'kundali.chalit': 'Bhava Chalit Chart',
            'kundali.panchang': 'Birth Panchang',
            'kundali.doshas': 'Astrological Doshas',
            'kundali.planets': 'Planetary Positions',
            'kundali.sav': 'Ashtakavarga (SAV) Points',
            'kundali.dasha': 'Vimshottari Dasha (Mahadasha & Antardasha)',
            'kundali.simple_overview': 'Simple Overview (For Beginners)',

            // Astrological
            'astro.tithi.Pratipada': 'Pratipada',
            'astro.tithi.Dwitiya': 'Dwitiya',
            'astro.tithi.Tritiya': 'Tritiya',
            'astro.tithi.Chaturthi': 'Chaturthi',
            'astro.tithi.Panchami': 'Panchami',
            'astro.tithi.Shashthi': 'Shashthi',
            'astro.tithi.Saptami': 'Saptami',
            'astro.tithi.Ashtami': 'Ashtami',
            'astro.tithi.Navami': 'Navami',
            'astro.tithi.Dashami': 'Dashami',
            'astro.tithi.Ekadashi': 'Ekadashi',
            'astro.tithi.Dwadashi': 'Dwadashi',
            'astro.tithi.Trayodashi': 'Trayodashi',
            'astro.tithi.Chaturdashi': 'Chaturdashi',
            'astro.tithi.Amavasya': 'Amavasya',
            'astro.tithi.Purnima': 'Purnima',
            'astro.paksha.Sukla': 'Sukla',
            'astro.paksha.Krishna': 'Krishna',
            'astro.paksha.word': 'Paksha',

            'astro.rashi.Mesha': 'Mesha (Aries)',
            'astro.rashi.Vrishabha': 'Vrishabha (Taurus)',
            'astro.rashi.Mithuna': 'Mithuna (Gemini)',
            'astro.rashi.Karka': 'Karka (Cancer)',
            'astro.rashi.Simha': 'Simha (Leo)',
            'astro.rashi.Kanya': 'Kanya (Virgo)',
            'astro.rashi.Tula': 'Tula (Libra)',
            'astro.rashi.Vrishchika': 'Vrishchika (Scorpio)',
            'astro.rashi.Dhanu': 'Dhanu (Sagittarius)',
            'astro.rashi.Makara': 'Makara (Capricorn)',
            'astro.rashi.Kumbha': 'Kumbha (Aquarius)',
            'astro.rashi.Meena': 'Meena (Pisces)',
            
            // Astrological (Months & Nakshatras)
            'astro.month.Chaitra': 'Chaitra',
            'astro.month.Vaisakha': 'Vaisakha',
            'astro.month.Jyeshtha': 'Jyeshtha',
            'astro.month.Ashadha': 'Ashadha',
            'astro.month.Shravana': 'Shravana',
            'astro.month.Bhadrapada': 'Bhadrapada',
            'astro.month.Ashvina': 'Ashvina',
            'astro.month.Kartika': 'Kartika',
            'astro.month.Margashirsha': 'Margashirsha',
            'astro.month.Pausha': 'Pausha',
            'astro.month.Magha': 'Magha',
            'astro.month.Phalguna': 'Phalguna',
            
            'astro.nakshatra.Ashwini': 'Ashwini',
            'astro.nakshatra.Bharani': 'Bharani',
            'astro.nakshatra.Krittika': 'Krittika',
            'astro.nakshatra.Rohini': 'Rohini',
            'astro.nakshatra.Mrigashira': 'Mrigashira',
            'astro.nakshatra.Ardra': 'Ardra',
            'astro.nakshatra.Punarvasu': 'Punarvasu',
            'astro.nakshatra.Pushya': 'Pushya',
            'astro.nakshatra.Ashlesha': 'Ashlesha',
            'astro.nakshatra.Magha': 'Magha',
            'astro.nakshatra.Purva_Phalguni': 'Purva Phalguni',
            'astro.nakshatra.Uttara_Phalguni': 'Uttara Phalguni',
            'astro.nakshatra.Hasta': 'Hasta',
            'astro.nakshatra.Chitra': 'Chitra',
            'astro.nakshatra.Swati': 'Swati',
            'astro.nakshatra.Vishakha': 'Vishakha',
            'astro.nakshatra.Anuradha': 'Anuradha',
            'astro.nakshatra.Jyeshtha': 'Jyeshtha',
            'astro.nakshatra.Mula': 'Mula',
            'astro.nakshatra.Purva_Ashadha': 'Purva Ashadha',
            'astro.nakshatra.Uttara_Ashadha': 'Uttara Ashadha',
            'astro.nakshatra.Shravana': 'Shravana',
            'astro.nakshatra.Dhanishta': 'Dhanishta',
            'astro.nakshatra.Shatabhisha': 'Shatabhisha',
            'astro.nakshatra.Purva_Bhadrapada': 'Purva Bhadrapada',
            'astro.nakshatra.Uttara_Bhadrapada': 'Uttara Bhadrapada',
            'astro.nakshatra.Revati': 'Revati',
            
            // Cosmic Energy Descriptions
            'home.cosmic.Mesh': 'A time of dynamic energy and initiation. Focus on taking bold steps forward and leading with courage.',
            'home.cosmic.Vrish': 'A period of grounding and stability. Excellent for focusing on finances, sensual comforts, and building solid foundations.',
            'home.cosmic.Mithun': 'A time of communication and curiosity. Connect with others, exchange ideas, and satisfy your intellectual pursuits.',
            'home.cosmic.Karka': 'A phase of emotional depth and nurturing. Ideal for focusing on home, family, and inner spiritual peace.',
            'home.cosmic.Simh': 'A period of creativity and self-expression. Step into the spotlight and let your natural leadership shine.',
            'home.cosmic.Kanya': 'A time for organization and service. Focus on details, health routines, and practical improvements in your daily life.',
            'home.cosmic.Tula': 'A phase of balance and relationships. Seek harmony in partnerships and appreciate beauty in all its forms.',
            'home.cosmic.Vrishchik': 'A time of transformation and intensity. Delve deep into mysteries and embrace profound emotional connections.',
            'home.cosmic.Dhanu': 'A period of expansion and philosophy. Embrace optimism, travel, and the search for higher wisdom.',
            'home.cosmic.Makar': 'A phase of discipline and ambition. Focus on your career, responsibilities, and long-term goals.',
            'home.cosmic.Kumbh': 'A time of innovation and community. Connect with groups, embrace your uniqueness, and champion humanitarian causes.',
            'home.cosmic.Meen': 'A period of intuition and spirituality. Rest, reflect, and connect with the divine through art and meditation.',

            // Settings
            'settings.title': 'Settings',
            'settings.theme': 'Theme Preference',
            'settings.theme_light': 'Light Mode',
            'settings.theme_dark': 'Dark Mode',
            'settings.language': 'Language / भाषा',
            'settings.save': 'Save Preferences',

            // Astrological Lore (Muhurat)
            'lore.tithi.Pratipada': 'the 1st lunar day, ruled by Agni (Fire). In practical terms, this gives a spark of high energy to your plans. It is like lighting a new lamp—perfect for starting something fresh that needs a lot of initial momentum.',
            'lore.tithi.Dwitiya': 'the 2nd lunar day, ruled by Lord Brahma (the Creator). For you, this means any foundation you lay today will be rock-solid. It is an excellent day for building things that you want to last a lifetime.',
            'lore.tithi.Tritiya': 'the 3rd lunar day, blessed by Goddess Parvati. This is incredibly auspicious for you because it brings the divine mother\'s protection. Whatever you begin today will enjoy a long life, endless prosperity, and bring immense peace to your family.',
            'lore.tithi.Panchami': 'the 5th lunar day, protected by the Nagas (Divine Serpents). This day acts as a spiritual shield. If you start a journey or project today, it will be protected from hidden enemies, jealousy, and unforeseen obstacles.',
            'lore.tithi.Saptami': 'the 7th lunar day, ruled by the Sun God (Surya). Just as the sun brings light, this day brings extreme clarity, leadership, and glowing success to your endeavors. It is perfect when you want your work to be recognized by others.',
            'lore.tithi.Dashami': 'the 10th lunar day, associated with discipline and order. If you need to start a business, sign contracts, or do something that requires strict rules and success over competitors, the energy of this day will support you perfectly.',
            'lore.tithi.Ekadashi': 'the 11th lunar day, deeply sacred to Lord Vishnu. This is a day of extreme purity. Any activity done today carries spiritual merit. It brings peaceful preservation, meaning whatever you acquire today will stay with you safely without causing stress.',
            'lore.tithi.Trayodashi': 'the 13th lunar day, dedicated to Lord Shiva. This day is a destroyer of bad karma. It is exceptionally good for overcoming past failures and achieving a spiritual or material triumph when all odds are against you.',
            'lore.tithi.Purnima': 'the Full Moon day. The moon is at its absolute brightest, radiating massive positive energy. This signifies 100% fullness and absolute completion, making it a highly blessed day for major life events and celebrations.',
            'lore.tithi.Chaturthi': 'the 4th lunar day, ruled by Lord Ganesha. While Ganesha removes obstacles, this specific day is generally considered "empty" for material gains like buying items. It is better used for clearing out old debts or fighting off problems.',
            'lore.tithi.Ashtami': 'the 8th lunar day. This day carries a very heavy, transformative energy. It is great for deep spiritual practices or ending bad habits, but it is traditionally avoided for happy, material beginnings like weddings or purchases.',
            'lore.tithi.Navami': 'the 9th lunar day, ruled by Goddess Durga. This is an aggressive, fierce day. It is highly successful if you need to win a court case or defeat an adversary, but it is too sharp and aggressive for peaceful events like buying a home.',
            'lore.tithi.Chaturdashi': 'the 14th lunar day, carrying fierce and unpredictable energy. In our tradition, this day is entirely avoided for gentle, happy, or long-term auspicious activities as it can bring sudden, unwanted changes.',
            'lore.tithi.Amavasya': 'the New Moon day. The moon is completely hidden, meaning there is zero lunar energy available to nourish your new beginnings. This day is strictly reserved for honoring ancestors and meditating, not for worldly tasks.',

            'lore.day.Monday': 'ruled by the Moon (Chandra). The moon controls our emotions and peace of mind. Doing this today ensures that your decision will bring you emotional happiness, a steady flow of income, and a very calm, stress-free experience.',
            'lore.day.Wednesday': 'ruled by Mercury (Budha), the planet of intelligence and communication. This means your plans today will be executed swiftly and smartly, without any confusion or miscommunication. It is perfect for paperwork and deals.',
            'lore.day.Thursday': 'ruled by Jupiter (Brihaspati), the Guru of all planets. Jupiter is the ultimate planet of massive wealth, luck, and divine protection. Choosing Thursday almost guarantees supreme wisdom, financial growth, and blessings from above.',
            'lore.day.Friday': 'ruled by Venus (Shukra), the planet of luxury, beauty, and love. If you are buying a vehicle, gold, or a home today, Venus ensures it will be beautiful, comfortable, and bring harmonious relationships into your life.',
            'lore.day.Sunday': 'ruled by the Sun (Surya). The Sun brings steadfast authority and power. While it is good for government work or taking charge, its fiery heat can sometimes be too aggressive for very gentle, family-oriented events.',
            'lore.day.Tuesday': 'ruled by Mars (Mangala), the planet of war and fire. Mars brings highly aggressive energy. While excellent for surgeries or taking bold risks, it is traditionally avoided for peaceful milestones to prevent arguments or accidents.',
            'lore.day.Saturday': 'ruled by Saturn (Shani). Saturn is the slowest moving planet and represents delays, hard work, and heavy karmic lessons. Because it slows things down, we generally avoid starting fresh, happy things on Saturdays.',

            'lore.nak.Rohini': 'a "fixed" star. Think of it like planting a massive Banyan tree. Whatever you start under Rohini will establish deep, unshakeable roots, making it absolutely perfect for long-lasting investments like property or marriage.',
            'lore.nak.Mrigashira': 'a "gentle" star that brings a very sweet, curious, and joyous energy. Starting things today ensures that your experience will be pleasant, stress-free, and filled with happy little moments rather than intense drama.',
            'lore.nak.Uttara Phalguni': 'a star that guarantees deep social success and patronage. If you start something today, you will receive immense support from your community, friends, and family, making it highly favored for weddings and social events.',
            'lore.nak.Hasta': 'represented by a "hand". This star gives you the dexterity and ability to literally "grasp" success. It brings quick manifestation, meaning your desires and plans will turn into reality very quickly and smoothly.',
            'lore.nak.Chitra': 'the star of beautiful design and opportunity. This brings extreme aesthetic brilliance to your endeavor. If you are buying a car, clothes, or a house today, they will turn out to be exceptionally beautiful and eye-catching.',
            'lore.nak.Anuradha': 'the star of friendship and devotion. It fosters extremely cooperative energy. If your event requires teamwork, partnerships, or bringing families together, Anuradha ensures everyone gets along perfectly without conflict.',
            'lore.nak.Uttara Ashadha': 'known as the "Universal Star of Undisputed Victory". It guarantees that no matter what obstacles come your way, you will win in the end. It provides a long-lasting, unshakeable success that cannot be easily broken.',
            'lore.nak.Revati': 'the very last star, ruled by the nourisher. It offers an incredibly sweet, gentle, and wealthy completion to your new beginnings. It ensures that your journey is safe, well-fed, and ends happily without any bumps.',
            'lore.nak.Ashwini': 'the star of the divine physicians. It brings miraculous, lightning-fast energy. If you need something done swiftly, or if you need rapid healing and movement, Ashwini provides the quick burst of horsepower you need.',
            'lore.nak.Pushya': 'widely considered the absolute best and most nourishing star in astrology. It acts like a caring mother. Anything started under Pushya is guaranteed to receive absolute divine care, flourishing growth, and extreme good luck.',

            'lore.favorable': 'is highly favorable',
            'lore.avoid': 'should be avoided',
            'lore.neutral': 'is neutral',
            'lore.excellent_day': 'is an excellent day',
            'lore.avoid_day': 'is traditionally avoided',
            'lore.acceptable': 'is acceptable'
        },
        hi: {
            // Navigation
            'nav.home': 'मुख्य पृष्ठ',
            'nav.calendar': 'पंचांग एवं पर्व',
            'nav.rituals': 'पूजा विधि',
            'nav.wedding': 'विवाह मार्गदर्शिका',
            'nav.tithi': 'जन्म तिथि',
            'nav.kundali': 'कुंडली निर्माण',
            'nav.matching': 'कुंडली मिलान',
            'nav.muhurat': 'मुहूर्त खोजें',
            'nav.varshphal': 'वार्षिक वर्षफल',
            'nav.heritage': 'पारिवारिक वंशावली',
            'nav.profiles': 'सहेजे गए प्रोफाइल',
            'nav.knowledge': 'ज्ञान संग्रह',
            'nav.audio': 'ऑडियो और वनवुन',
            'nav.sharada': 'शारदा लिपि सीखें',
            'nav.guide': 'ज्ञान मार्गदर्शिका',
            'nav.scholar': 'विद्वान द्वारा प्रमाणित',
            'nav.logo_title': 'कश्मीर',
            'nav.logo_subtitle': 'धर्म साथी',
            'nav.logo_mobile': 'कश्मीर धर्म',
            'nav.loading': 'पवित्र ज्ञान लोड हो रहा है...',
            
            // Home Page
            'home.mantra': 'ॐ नमः शिवाय',
            'home.mantra_highlight': 'हर हर महादेव',
            'home.mantra_meaning': 'भगवान शिव की दिव्य कृपा आपकी आध्यात्मिक यात्रा में शांति, ज्ञान और शक्ति लाए।',
            'home.presence_title': 'आज की उपस्थिति',
            'home.highlights_title': 'मुख्य आकर्षण',
            'home.cosmic_title': 'वर्तमान ब्रह्मांडीय ऊर्जा',
            'home.quick_tools': 'त्वरित उपकरण',
            'home.quick_tools_desc': 'अपनी आध्यात्मिक सुविधाओं तक पहुंचें',
            'home.explore_knowledge': 'ज्ञान का अन्वेषण करें',
            'home.explore_knowledge_desc': 'विरासत में गहराई से उतरें',
            'home.card_cal_desc': 'कश्मीरी पंडित त्योहारों का अन्वेषण करें',
            'home.card_kundali_desc': 'अपनी वैदिक जन्म कुंडली बनाएं',
            'home.card_muhurat_desc': 'शुभ तिथियों और समय की पहचान करें',
            'home.card_rituals_desc': 'अनुष्ठानों का व्यापक विश्वकोश',
            'home.card_wedding_desc': 'कश्मीरी पंडित विवाह के लिए आपकी मार्गदर्शिका',
            'home.card_sharada_desc': 'प्राचीन पवित्र लिपि सीखें',
            'home.festival': 'पर्व',
            
            // Festivals
            'fest.navreh.name': 'नवरेह (नव वर्ष)',
            'fest.navreh.date': 'चैत्र शुक्ल प्रतिपदा (मार्च/अप्रैल)',
            'fest.herath.name': 'हेराथ (महा शिवरात्रि)',
            'fest.herath.date': 'फाल्गुन कृष्ण त्रयोदशी (फरवरी/मार्च)',
            'fest.zyeth-atham.name': 'ज्येष्ठ अष्टमी',
            'fest.zyeth-atham.date': 'ज्येष्ठ शुक्ल अष्टमी (मई/जून)',
            'fest.khetsrimavas.name': 'खेत्रिअमावास',
            'fest.khetsrimavas.date': 'ज्येष्ठ अमावस्या (मई/जून)',
            'fest.pan-festival.name': 'पान (पन्न)',
            'fest.pan-festival.date': 'भाद्रपद (अगस्त/सितंबर)',
            'fest.janmashtami.name': 'जन्माष्टमी',
            'fest.janmashtami.date': 'भाद्रपद कृष्ण अष्टमी (अगस्त/सितंबर)',
            'fest.ram-navami.name': 'राम नवमी',
            'fest.ram-navami.date': 'चैत्र शुक्ल नवमी (मार्च/अप्रैल)',
            'fest.sharika-jayanti.name': 'शारिका जयंती',
            'fest.sharika-jayanti.date': 'आषाढ़ शुक्ल नवमी (जुलाई)',
            'home.sunrise': 'सूर्योदय',
            'home.sunset': 'सूर्यास्त',
            'home.local': 'स्थानीय',
            'home.srinagar': 'श्रीनगर',
            'home.tithi': 'तिथि',
            'home.nakshatra': 'नक्षत्र',
            'home.rashi': 'राशि',
            'home.festival': 'पर्व',
            'home.moon_in': 'चंद्रमा का गोचर है:',
            // Calendar Page
            'calendar.title': 'पंचांग एवं पर्व',
            'calendar.desc': 'कश्मीरी पंडितों के त्योहारों, व्रतों और समारोहों के संपूर्ण कैलेंडर का अन्वेषण करें',
            'calendar.previous': 'पिछला',
            'calendar.next': 'अगला',
            'calendar.all_festivals': 'सभी पर्व एवं व्रत',
            'calendar.all_festivals_desc': 'प्रत्येक त्योहार की विस्तृत मार्गदर्शिका',
            'calendar.search': 'पर्व खोजें...',
            'calendar.no_festivals': 'कोई पर्व नहीं मिला',
            'calendar.try_different': 'कोई अन्य शब्द खोजें',
            'month.0': 'जनवरी', 'month.1': 'फरवरी', 'month.2': 'मार्च', 'month.3': 'अप्रैल',
            'month.4': 'मई', 'month.5': 'जून', 'month.6': 'जुलाई', 'month.7': 'अगस्त',
            'month.8': 'सितंबर', 'month.9': 'अक्टूबर', 'month.10': 'नवंबर', 'month.11': 'दिसंबर',
            'month.4': 'मई', 'month.5': 'जून', 'month.6': 'जुलाई', 'month.7': 'अगस्त',
            'month.8': 'सितंबर', 'month.9': 'अक्टूबर', 'month.10': 'नवंबर', 'month.11': 'दिसंबर',
            'day.0': 'रवि', 'day.1': 'सोम', 'day.2': 'मंगल', 'day.3': 'बुध', 'day.4': 'गुरु', 'day.5': 'शुक्र', 'day.6': 'शनि',

            // Kundali Page
            'kundali.title': 'कुंडली निर्माण',
            'kundali.desc': 'स्थानीय स्तर पर और निजी तौर पर अपना वैदिक जन्म चार्ट बनाएं। कोई डेटा किसी सर्वर पर नहीं भेजा जाता है।',
            'kundali.enter_details': 'जन्म विवरण दर्ज करें',
            'kundali.name': 'नाम',
            'kundali.dob': 'जन्म तिथि',
            'kundali.tob': 'जन्म का समय',
            'kundali.city': 'जन्म का शहर (खोज योग्य)',
            'kundali.city_placeholder': 'वैश्विक शहरों को खोजने के लिए टाइप करें...',
            'kundali.generate': 'कुंडली बनाएं ✨',
            'kundali.print': '🖨️ प्रिंट / पीडीएफ के रूप में सहेजें',
            'kundali.lagna': 'लग्न:',
            'kundali.rashi': 'राशि:',
            'kundali.lagna': 'लग्न:',
            'kundali.rashi': 'राशि:',
            'kundali.nakshatra': 'नक्षत्र:',
            'kundali.d1': 'लग्न चक्र (D1)',
            'kundali.d9': 'नवांश चक्र (D9)',
            'kundali.d10': 'दशांश चक्र (D10)',
            'kundali.d7': 'सप्तांश चक्र (D7)',
            'kundali.chalit': 'भाव चलित चक्र',
            'kundali.panchang': 'जन्म पंचांग',
            'kundali.doshas': 'ज्योतिषीय दोष',
            'kundali.planets': 'ग्रह स्थिति',
            'kundali.sav': 'अष्टकवर्ग (SAV) अंक',
            'kundali.dasha': 'विंशोत्तरी दशा (महादशा और अंतर्दशा)',
            'kundali.simple_overview': 'सरल अवलोकन (शुरुआती लोगों के लिए)',

            // Matching Page
            'match.title': 'कुंडली मिलान',
            'match.header': 'अष्टकूट कुंडली मिलान',
            'match.desc': 'विस्तृत व्याख्याओं, दोष विश्लेषण और उपायों के साथ उन्नत 36-बिंदु गुण मिलान प्रणाली का उपयोग करके विवाह संगतता की खोज करें।',
            'match.boy_details': 'लड़के का विवरण',
            'match.name': 'नाम',
            'match.enter_name': 'नाम दर्ज करें',
            'match.dob': 'जन्म तिथि',
            'match.tob': 'जन्म का समय',
            'match.city': 'जन्म का शहर',
            'match.search_city': 'वैश्विक शहरों को खोजें...',
            'match.girl_details': 'लड़की का विवरण',
            'match.calc_btn': '✨ संगतता मिलान की गणना करें',

            // Muhurat Page
            'muhurat.title': 'मुहूर्त खोजक',
            'muhurat.desc': 'पारंपरिक पंचांग दिशानिर्देशों के आधार पर महत्वपूर्ण जीवन घटनाओं के लिए शुभ तिथियों और समय की पहचान करें',
            'muhurat.select_event': 'घटना का प्रकार चुनें',
            'muhurat.select_range': 'तिथि सीमा चुनें',
            'muhurat.from_date': 'प्रारंभ तिथि',
            'muhurat.to_date': 'अंतिम तिथि',
            'muhurat.find_btn': '🌟 शुभ तिथियां खोजें',

            // Varshphal Page
            'varshphal.title': 'वार्षिक वर्षफल',
            'varshphal.header': 'ताजिक वर्षफल',
            'varshphal.desc': 'सौर वापसी चार्ट, ताजिक योग विश्लेषण, घर-दर-घर भविष्यवाणियों और उपचारों के साथ अपनी व्यापक वार्षिक कुंडली बनाएं।',
            'varshphal.name': 'नाम',
            'varshphal.enter_name': 'नाम दर्ज करें',
            'varshphal.target_year': 'लक्ष्य वर्ष (उदा. 2024)',
            'varshphal.dob': 'जन्म तिथि',
            'varshphal.tob': 'जन्म का समय',
            'varshphal.city': 'जन्म का शहर',
            'varshphal.search_city': 'वैश्विक शहरों को खोजें...',
            'varshphal.gen_btn': '🌟 वार्षिक रिपोर्ट बनाएं',

            // Rituals Page
            'rituals.cat_all': 'सभी अनुष्ठान',
            'rituals.cat_life': 'जीवन की घटनाएँ',
            'rituals.cat_marriage': 'विवाह',
            'rituals.cat_seasonal': 'मौसमी',
            'rituals.cat_practice': 'नियमित अभ्यास',
            'rituals.title': 'अनुष्ठान पुस्तकालय',
            'rituals.header': 'अनुष्ठान ज्ञान पुस्तकालय',
            'rituals.desc': 'कश्मीरी पंडित अनुष्ठानों का एक व्यापक विश्वकोश - दैनिक प्रथाओं से लेकर जीवन समारोहों तक',
            'rituals.search': 'अनुष्ठान खोजें...',

            // Wedding Page
            'wedding.title': 'विवाह गाइड',
            'wedding.header': 'कश्मीरी पंडित विवाह गाइड',
            'wedding.desc': 'संपूर्ण कश्मीरी पंडित विवाह समारोहों को समझने के लिए आपका डिजिटल साथी',
            'wedding.overview': 'अवलोकन',
            'wedding.timeline': 'विवाह समारोह की समयरेखा',
            'wedding.songs': 'पारंपरिक विवाह गीत',
            'wedding.tips': 'कश्मीर के बाहर के परिवारों के लिए सुझाव',
            'wedding.view_details': 'विवरण देखें →',

            // Heritage Page
            'heritage.title': 'पारिवारिक विरासत',
            'heritage.header': 'पारिवारिक विरासत रिकॉर्ड',
            'heritage.desc': 'अपनी पारिवारिक विरासत को सुरक्षित रखें — गोत्र, कुलदेवता, मूल गांव, परंपराएं और महत्वपूर्ण अनुष्ठान। सभी डेटा आपके डिवाइस पर निजी तौर पर संग्रहीत किया जाता है।',
            'heritage.family_details': 'आपके परिवार का विवरण',
            'heritage.family_name': 'पारिवारिक नाम (क्रम)',
            'heritage.gotra': 'गोत्र',
            'heritage.kuldevta': 'कुलदेवता / कुलदेवी',
            'heritage.native_village': 'कश्मीर में मूल गांव / स्थान',
            'heritage.traditions': 'पारिवारिक परंपराएं और रीति-रिवाज',
            'heritage.observances': 'महत्वपूर्ण वार्षिक अनुष्ठान',
            'heritage.save_btn': 'विरासत सहेजें',
            'heritage.export_btn': 'निर्यात करें',
            'heritage.import_btn': 'आयात करें',
            'heritage.about': 'पारिवारिक विरासत के बारे में',

            // Birthday Page
            'birthday.title': 'जन्म तिथि खोजकर्ता',
            'birthday.header': 'हिंदू जन्मदिन (जन्म तिथि) खोजकर्ता',
            'birthday.desc': 'पारंपरिक चंद्र कैलेंडर के आधार पर अपना हिंदू जन्मदिन खोजें। अपनी तिथि, नक्षत्र और राशि जानने के लिए अपना जन्म विवरण दर्ज करें।',
            'birthday.enter_details': 'अपना जन्म विवरण दर्ज करें',
            'birthday.dob': 'जन्म तिथि',
            'birthday.tob': 'जन्म का समय (वैकल्पिक)',
            'birthday.place': 'जन्म स्थान (वैकल्पिक)',
            'birthday.year': 'इस वर्ष के लिए हिंदू जन्मदिन दिखाएं',
            'birthday.find_btn': '🔍 मेरी जन्म तिथि खोजें',
            'birthday.what_is': 'जन्म तिथि क्या है?',
            'birthday.what_tithi': 'तिथि क्या है?',
            'birthday.what_nakshatra': 'नक्षत्र क्या है?',
            'birthday.what_rashi': 'राशि क्या है?',

            // Sharada Page
            'sharada.title': 'शारदा लिपि सीखें',
            'sharada.header': 'शारदा लिपि सीखें',
            'sharada.desc': 'धार्मिक ग्रंथों और कुंडलियों के लिए उपयोग की जाने वाली कश्मीर की प्राचीन, पवित्र लिपि का अन्वेषण करें।',
            'sharada.about': 'शारदा के बारे में',

            // Guide Page
            'guide.title': 'ज्ञान गाइड',
            'guide.header': 'ज्ञान गाइड',
            'guide.desc': 'कश्मीरी पंडित परंपराओं के बारे में प्रश्न पूछें और हमारे विद्वान-मान्य ज्ञानकोष से उत्तर प्राप्त करें',
            'guide.greeting': '<strong>🔮 नमस्कार!</strong><br><br>मैं कश्मीरी पंडित परंपराओं के लिए आपका ज्ञान गाइड हूँ। मुझसे त्योहारों, अनुष्ठानों, समारोहों या सांस्कृतिक प्रथाओं के बारे में कुछ भी पूछें।<br><br><em style="color: var(--text-muted); font-size: var(--text-xs)">मैं आपके सवालों का जवाब देने के लिए हमारे विद्वान-मान्य ज्ञानकोष को खोजता हूँ।</em>',
            'guide.placeholder': 'कश्मीरी पंडित परंपराओं के बारे में पूछें...',
            'guide.send': 'भेजें',
            'guide.suggested': '💡 सुझाए गए प्रश्न',
            'guide.quick_topics': '🔍 त्वरित विषय',
            'guide.about': 'इस गाइड के बारे में',

            // Audio Page
            'audio.title': 'पवित्र ध्वनियाँ और वनवुन',
            'audio.header': 'पवित्र ध्वनियाँ और वनवुन',
            'audio.desc': 'पारंपरिक कश्मीरी पंडित मंत्र, भजन और शादी के गीत (वनवुन) सुनें।',
            'audio.mantras': 'मंत्र और स्तोत्र',
            'audio.wanwun': 'पारंपरिक वनवुन',
            'audio.note': '<strong>नोट:</strong> वर्तमान में प्लेसहोल्डर झंकार बज रही है। आप स्थानीय निर्देशिका में ऑडियो स्रोत फ़ाइलों को अपनी पसंद की वास्तविक MP3 रिकॉर्डिंग से बदल सकते हैं।',

            // Archive Page
            'archive.cat_all': 'सभी',
            'archive.cat_history': 'इतिहास',
            'archive.cat_teachings': 'शिक्षाएं',
            'archive.cat_culture': 'संस्कृति',
            'archive.cat_temples': 'मंदिर',
            'archive.title': 'ज्ञान संग्रह',
            'archive.header': 'ज्ञान संग्रह',
            'archive.desc': 'लेख, ऐतिहासिक दस्तावेज़, सांस्कृतिक निबंध, मंदिर की जानकारी और धार्मिक शिक्षाएँ',
            'archive.search': 'लेख खोजें...',
            'archive.read': 'पढ़ें →',

            // Astrological
            'astro.tithi.Pratipada': 'प्रतिपदा',
            'astro.tithi.Dwitiya': 'द्वितीया',
            'astro.tithi.Tritiya': 'तृतीया',
            'astro.tithi.Chaturthi': 'चतुर्थी',
            'astro.tithi.Panchami': 'पंचमी',
            'astro.tithi.Shashthi': 'षष्ठी',
            'astro.tithi.Saptami': 'सप्तमी',
            'astro.tithi.Ashtami': 'अष्टमी',
            'astro.tithi.Navami': 'नवमी',
            'astro.tithi.Dashami': 'दशमी',
            'astro.tithi.Ekadashi': 'एकादशी',
            'astro.tithi.Dwadashi': 'द्वादशी',
            'astro.tithi.Trayodashi': 'त्रयोदशी',
            'astro.tithi.Chaturdashi': 'चतुर्दशी',
            'astro.tithi.Amavasya': 'अमावस्या',
            'astro.tithi.Purnima': 'पूर्णिमा',
            'astro.paksha.Sukla': 'शुक्ल',
            'astro.paksha.Krishna': 'कृष्ण',

            'astro.rashi.Mesha': 'मेष',
            'astro.rashi.Vrishabha': 'वृषभ',
            'astro.rashi.Mithuna': 'मिथुन',
            'astro.rashi.Karka': 'कर्क',
            'astro.rashi.Simha': 'सिंह',
            'astro.rashi.Kanya': 'कन्या',
            'astro.rashi.Tula': 'तुला',
            'astro.rashi.Vrishchika': 'वृश्चिक',
            'astro.rashi.Dhanu': 'धनु',
            'astro.rashi.Makara': 'मकर',
            'astro.rashi.Kumbha': 'कुंभ',
            'astro.rashi.Meena': 'मीन',

            // Astrological (Months)
            'astro.month.Chaitra': 'चैत्र',
            'astro.month.Vaisakha': 'वैशाख',
            'astro.month.Jyeshtha': 'ज्येष्ठ',
            'astro.month.Ashadha': 'आषाढ़',
            'astro.month.Shravana': 'श्रावण',
            'astro.month.Bhadrapada': 'भाद्रपद',
            'astro.month.Ashvina': 'अश्विन',
            'astro.month.Kartika': 'कार्तिक',
            'astro.month.Margashirsha': 'मार्गशीर्ष',
            'astro.month.Pausha': 'पौष',
            'astro.month.Magha': 'माघ',
            'astro.month.Phalguna': 'फाल्गुन',
            'astro.paksha.word': 'पक्ष',
            
            'astro.nakshatra.Ashwini': 'अश्विनी',
            'astro.nakshatra.Bharani': 'भरणी',
            'astro.nakshatra.Krittika': 'कृत्तिका',
            'astro.nakshatra.Rohini': 'रोहिणी',
            'astro.nakshatra.Mrigashira': 'मृगशिरा',
            'astro.nakshatra.Ardra': 'आर्द्रा',
            'astro.nakshatra.Punarvasu': 'पुनर्वसु',
            'astro.nakshatra.Pushya': 'पुष्य',
            'astro.nakshatra.Ashlesha': 'आश्लेषा',
            'astro.nakshatra.Magha': 'मघा',
            'astro.nakshatra.Purva_Phalguni': 'पूर्वाफाल्गुनी',
            'astro.nakshatra.Uttara_Phalguni': 'उत्तराफाल्गुनी',
            'astro.nakshatra.Hasta': 'हस्त',
            'astro.nakshatra.Chitra': 'चित्रा',
            'astro.nakshatra.Swati': 'स्वाति',
            'astro.nakshatra.Vishakha': 'विशाखा',
            'astro.nakshatra.Anuradha': 'अनुराधा',
            'astro.nakshatra.Jyeshtha': 'ज्येष्ठा',
            'astro.nakshatra.Mula': 'मूल',
            'astro.nakshatra.Purva_Ashadha': 'पूर्वाषाढ़ा',
            'astro.nakshatra.Uttara_Ashadha': 'उत्तराषाढ़ा',
            'astro.nakshatra.Shravana': 'श्रवण',
            'astro.nakshatra.Dhanishta': 'धनिष्ठा',
            'astro.nakshatra.Shatabhisha': 'शतभिषा',
            'astro.nakshatra.Purva_Bhadrapada': 'पूर्वभाद्रपदा',
            'astro.nakshatra.Uttara_Bhadrapada': 'उत्तरभाद्रपदा',
            'astro.nakshatra.Revati': 'रेवती',
            
            // Cosmic Energy Descriptions
            'home.cosmic.Mesh': 'गतिशील ऊर्जा और शुरुआत का समय। साहस के साथ आगे बढ़ने और नेतृत्व करने पर ध्यान दें।',
            'home.cosmic.Vrish': 'स्थिरता का समय। वित्त, सुख-सुविधाओं और मजबूत नींव बनाने के लिए उत्कृष्ट।',
            'home.cosmic.Mithun': 'संचार और जिज्ञासा का समय। दूसरों से जुड़ें, विचारों का आदान-प्रदान करें और अपनी बौद्धिक खोजों को पूरा करें।',
            'home.cosmic.Karka': 'भावनात्मक गहराई और पोषण का चरण। घर, परिवार और आंतरिक आध्यात्मिक शांति पर ध्यान केंद्रित करने के लिए आदर्श।',
            'home.cosmic.Simh': 'रचनात्मकता और आत्म-अभिव्यक्ति की अवधि। अपनी स्वाभाविक नेतृत्व क्षमता को चमकने दें।',
            'home.cosmic.Kanya': 'संगठन और सेवा का समय। अपने दैनिक जीवन में विवरणों, स्वास्थ्य दिनचर्या और व्यावहारिक सुधारों पर ध्यान दें।',
            'home.cosmic.Tula': 'संतुलन और संबंधों का चरण। साझेदारी में सामंजस्य खोजें और इसके सभी रूपों में सुंदरता की सराहना करें।',
            'home.cosmic.Vrishchik': 'परिवर्तन और तीव्रता का समय। रहस्यों में गहराई से उतरें और गहरे भावनात्मक संबंधों को अपनाएं।',
            'home.cosmic.Dhanu': 'विस्तार और दर्शन की अवधि। आशावाद, यात्रा और उच्च ज्ञान की खोज को अपनाएं।',
            'home.cosmic.Makar': 'अनुशासन और महत्वाकांक्षा का चरण। अपने करियर, जिम्मेदारियों और दीर्घकालिक लक्ष्यों पर ध्यान दें।',
            'home.cosmic.Kumbh': 'नवाचार और समुदाय का समय। समूहों से जुड़ें, अपनी विशिष्टता को अपनाएं और मानवीय कार्यों का समर्थन करें।',
            'home.cosmic.Meen': 'अंतर्ज्ञान और आध्यात्मिकता की अवधि। कला और ध्यान के माध्यम से आराम करें, चिंतन करें और परमात्मा से जुड़ें।',

            // Settings
            'settings.title': 'सेटिंग्स',
            'settings.theme': 'थीम चुनें',
            'settings.theme_light': 'लाइट मोड',
            'settings.theme_dark': 'डार्क मोड',
            'settings.language': 'Language / भाषा',
            'settings.save': 'सेटिंग्स सहेजें'
        }
    };

    let currentLanguage = localStorage.getItem('appLanguage') || 'en';

    /**
     * Set the application language
     * @param {string} langCode - 'en', 'hi', etc.
     */
    function setLanguage(langCode) {
        if (translations[langCode]) {
            currentLanguage = langCode;
            localStorage.setItem('appLanguage', langCode);
            document.documentElement.lang = langCode;
            translatePage();
            
            // Trigger a router re-render so dynamically generated JS components update
            window.dispatchEvent(new Event('hashchange'));
        }
    }

    /**
     * Get the current language code
     * @returns {string}
     */
    function getLanguage() {
        return currentLanguage;
    }

    /**
     * Get a translated string for a given key
     * @param {string} key 
     * @param {string} [defaultStr] Default string if key not found
     * @returns {string} The translated string, or defaultStr/key if not found.
     */
    function t(key, defaultStr = null) {
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            return translations[currentLanguage][key];
        }
        // Fallback to English if key not found in current language
        if (currentLanguage !== 'en' && translations['en'] && translations['en'][key]) {
            return translations['en'][key];
        }
        return defaultStr !== null ? defaultStr : key; // If totally unfound, just return default or key
    }

    /**
     * Translates a composite astrological term like 'Sukla Pratipada'
     */
    function tAstro(str) {
        if (!str) return '';
        let result = str;
        // Basic translation for paksha and tithi parts
        const pakshas = ['Sukla', 'Krishna'];
        pakshas.forEach(p => {
            if (result.includes(p)) {
                result = result.replace(p, t(`astro.paksha.${p}`));
            }
        });
        
        // Translating tithis which are separate words
        const words = result.split(' ');
        const translatedWords = words.map(w => {
            const tk = `astro.tithi.${w}`;
            if (translations[currentLanguage] && translations[currentLanguage][tk]) {
                return translations[currentLanguage][tk];
            }
            return w;
        });
        return translatedWords.join(' ');
    }

    /**
     * Scans the DOM for [data-i18n] attributes and updates their innerText
     */
    function translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translatedText = t(key);
            // We use childNodes to only replace text and preserve inner icons/spans if needed,
            // or just innerText if it's purely text.
            
            // To be safe with icons inside elements (like in our sidebar),
            // we will replace the text node. If it's a simple element, innerText is fine.
            // Let's assume the element only contains text or an icon + text.
            // A safer approach: if there's an element with class 'nav-text', translate that instead.
            // Let's check if the element has children. If we need to preserve icons, we might
            // structure HTML so the data-i18n is on a span containing just the text.
            el.innerText = translatedText;
        });
    }

    return {
        setLanguage,
        getLanguage,
        t,
        tAstro,
        translatePage
    };
})();
