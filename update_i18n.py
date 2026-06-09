import json
import re

file_path = 'js/utils/i18n.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

en_additions = """
            // Expanded Home Page Data
            'home.panchang.brahma': 'Brahma Muhurat',
            'home.panchang.abhijit': 'Abhijit Muhurat',
            'home.panchang.rahu': 'Rahu Kaal',
            'home.panchang.yoga': 'Yoga',
            'home.panchang.karana': 'Karana',
            'home.wisdom.title': 'Daily Wisdom',
            'home.wisdom.shloka': 'Gita Verse of the Day',
            'home.wisdom.subhashita': 'Ancient Proverb',
            
            // Daily Gita Shlokas
            'home.gita.day0': 'BG 2.47: You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.',
            'home.gita.day0_sk': 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
            'home.gita.day1': 'BG 6.5: Let a man lift himself by his own Self alone; let him not lower himself, for this self alone is the friend of oneself and this self alone is the enemy of oneself.',
            'home.gita.day1_sk': 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।',
            'home.gita.day2': 'BG 2.14: O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons.',
            'home.gita.day2_sk': 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।',
            'home.gita.day3': 'BG 3.19: Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.',
            'home.gita.day3_sk': 'तस्मादसक्तः सततं कार्यं कर्म समाचर।',
            'home.gita.day4': 'BG 4.38: In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.',
            'home.gita.day4_sk': 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।',
            'home.gita.day5': 'BG 12.15: He by whom no one is put into difficulty and who is not put into difficulty by anyone, who is equipoised in happiness and distress, fear and anxiety, is very dear to Me.',
            'home.gita.day5_sk': 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।',
            'home.gita.day6': 'BG 6.19: As a lamp in a windless place does not waver, so the transcendentalist, whose mind is controlled, remains always steady in his meditation on the transcendent self.',
            'home.gita.day6_sk': 'यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता।',

            // Daily Subhashitas
            'home.sub.day0': 'Knowledge is the true wealth that cannot be stolen.',
            'home.sub.day0_sk': 'विद्या धनं सर्वधन प्रधानम्।',
            'home.sub.day1': 'Truth alone triumphs, not falsehood.',
            'home.sub.day1_sk': 'सत्यमेव जयते नानृतं।',
            'home.sub.day2': 'The whole world is one family.',
            'home.sub.day2_sk': 'वसुधैव कुटुम्बकम्।',
            'home.sub.day3': 'Where women are honored, divinity blossoms there.',
            'home.sub.day3_sk': 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः।',
            'home.sub.day4': 'Health is the greatest wealth.',
            'home.sub.day4_sk': 'आरोग्यं परमं भाग्यं स्वास्थ्यं सर्वार्थसाधनम्।',
            'home.sub.day5': 'Ahinsa (non-violence) is the highest Dharma.',
            'home.sub.day5_sk': 'अहिंसा परमो धर्मः।',
            'home.sub.day6': 'Action is thy duty, reward not thy concern.',
            'home.sub.day6_sk': 'कर्मण्येवाधिकारस्ते।',

            // Expanded Lore & Sadhana
            'home.lore.surya': 'Sunday is ruled by the Sun, the source of all life and consciousness. It is a day to cultivate inner strength, health, and a luminous aura.',
            'home.sadhana.surya': 'Sadhana: Offer water (Arghya) to the Sun at sunrise, and chant the Gayatri Mantra 11 times.',
            'home.lore.shiva': 'Monday is ruled by the Moon and dedicated to Lord Shiva, the master of asceticism and inner peace. It brings emotional calmness.',
            'home.sadhana.shiva': 'Sadhana: Offer milk or water to the Shivling, or silently chant "Om Namah Shivaya" for 5 minutes.',
            'home.lore.hanuman': 'Tuesday is ruled by Mars, governed by Lord Hanuman. It is a day of immense physical and mental energy, perfect for overcoming fears.',
            'home.sadhana.hanuman': 'Sadhana: Recite the Hanuman Chalisa. Face challenges head-on today without avoidance.',
            'home.lore.ganesha': 'Wednesday is ruled by Mercury. Worshipping Lord Ganesha today sharpens the intellect, removes obstacles in learning, and brings good fortune.',
            'home.sadhana.ganesha': 'Sadhana: Offer Durva grass if possible, and mentally pray for the removal of unseen mental blocks.',
            'home.lore.vishnu': 'Thursday is ruled by Jupiter (Guru), the planet of wisdom. Lord Vishnu sustains the universe through dharma and cosmic harmony.',
            'home.sadhana.vishnu': 'Sadhana: Express deep gratitude for your life’s blessings. Chant "Om Namo Bhagavate Vasudevaya".',
            'home.lore.durga': 'Friday is ruled by Venus. The Divine Mother embodies supreme compassion and fierce protection. It is a day of beauty, art, and motherly love.',
            'home.sadhana.durga': 'Sadhana: Perform an act of kindness for a woman or mother-figure in your life.',
            'home.lore.shani': 'Saturday is ruled by Saturn, the planet of karma and discipline. Lord Shani teaches patience, hard work, and justice.',
            'home.sadhana.shani': 'Sadhana: Practice fasting, silence, or donate food/clothes to the needy. Avoid anger today.',
"""

hi_additions = """
            // Expanded Home Page Data (Hindi)
            'home.panchang.brahma': 'ब्रह्म मुहूर्त',
            'home.panchang.abhijit': 'अभिजित मुहूर्त',
            'home.panchang.rahu': 'राहु काल',
            'home.panchang.yoga': 'योग',
            'home.panchang.karana': 'करण',
            'home.wisdom.title': 'दैनिक ज्ञान',
            'home.wisdom.shloka': 'आज का गीता श्लोक',
            'home.wisdom.subhashita': 'सुभाषितम् (प्राचीन नीति)',
            
            // Daily Gita Shlokas (Hindi)
            'home.gita.day0': 'बीजी 2.47: तुम्हें अपना निर्धारित कर्म करने का अधिकार है, लेकिन तुम कर्म के फलों के अधिकारी नहीं हो।',
            'home.gita.day0_sk': 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
            'home.gita.day1': 'बीजी 6.5: मनुष्य को चाहिए कि वह अपने मन की सहायता से अपना उद्धार करे और अपने को नीचे न गिरने दे। यह मन ही बद्ध जीव का मित्र है और यही मन उसका शत्रु है।',
            'home.gita.day1_sk': 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।',
            'home.gita.day2': 'बीजी 2.14: हे कुंतीपुत्र, सुख और दुख का क्षणिक उदय और कालक्रम में उनका अंत होना सर्दी और गर्मी की ऋतुओं के आने और जाने के समान है।',
            'home.gita.day2_sk': 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।',
            'home.gita.day3': 'बीजी 3.19: इसलिए कर्मफलों में आसक्त हुए बिना, मनुष्य को कर्तव्य समझकर कर्म करना चाहिए, क्योंकि अनासक्त होकर कर्म करने से परब्रह्म की प्राप्ति होती है।',
            'home.gita.day3_sk': 'तस्मादसक्तः सततं कार्यं कर्म समाचर।',
            'home.gita.day4': 'बीजी 4.38: इस संसार में दिव्य ज्ञान के समान शुद्ध और उदात्त कुछ भी नहीं है। ऐसा ज्ञान समस्त योग का परिपक्व फल है।',
            'home.gita.day4_sk': 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।',
            'home.gita.day5': 'बीजी 12.15: जिससे किसी को कष्ट नहीं होता और जो किसी अन्य के द्वारा विचलित नहीं होता, जो सुख-दुख, भय और चिंता में समभाव रहता है, वह मुझे बहुत प्रिय है।',
            'home.gita.day5_sk': 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।',
            'home.gita.day6': 'बीजी 6.19: जिस प्रकार वायुहीन स्थान में दीपक नहीं हिलता, उसी प्रकार जिस योगी का मन वश में है, वह आत्म-तत्व के ध्यान में सदैव स्थिर रहता है।',
            'home.gita.day6_sk': 'यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता।',

            // Daily Subhashitas (Hindi)
            'home.sub.day0': 'विद्या ही वह सच्चा धन है जिसे कोई चुरा नहीं सकता।',
            'home.sub.day0_sk': 'विद्या धनं सर्वधन प्रधानम्।',
            'home.sub.day1': 'सत्य की ही जीत होती है, झूठ की नहीं।',
            'home.sub.day1_sk': 'सत्यमेव जयते नानृतं।',
            'home.sub.day2': 'यह पूरी पृथ्वी ही एक परिवार है।',
            'home.sub.day2_sk': 'वसुधैव कुटुम्बकम्।',
            'home.sub.day3': 'जहाँ स्त्रियों का सम्मान होता है, वहां देवता निवास करते हैं।',
            'home.sub.day3_sk': 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः।',
            'home.sub.day4': 'स्वास्थ्य ही सबसे बड़ा धन है।',
            'home.sub.day4_sk': 'आरोग्यं परमं भाग्यं स्वास्थ्यं सर्वार्थसाधनम्।',
            'home.sub.day5': 'अहिंसा ही सबसे बड़ा धर्म है।',
            'home.sub.day5_sk': 'अहिंसा परमो धर्मः।',
            'home.sub.day6': 'कर्म ही तुम्हारा अधिकार है, फल नहीं।',
            'home.sub.day6_sk': 'कर्मण्येवाधिकारस्ते।',

            // Expanded Lore & Sadhana (Hindi)
            'home.lore.surya': 'रविवार सूर्य देव द्वारा शासित है, जो सभी जीवन और चेतना के स्रोत हैं। यह आंतरिक शक्ति, स्वास्थ्य और एक चमकदार आभा विकसित करने का दिन है।',
            'home.sadhana.surya': 'साधना: सूर्योदय के समय सूर्य को जल (अर्घ्य) अर्पित करें, और गायत्री मंत्र का 11 बार जाप करें।',
            'home.lore.shiva': 'सोमवार चंद्रमा द्वारा शासित है और भगवान शिव को समर्पित है, जो तपस्या और आंतरिक शांति के स्वामी हैं। यह भावनात्मक शांति लाता है।',
            'home.sadhana.shiva': 'साधना: शिवलिंग पर दूध या जल चढ़ाएं, या 5 मिनट के लिए चुपचाप "ॐ नमः शिवाय" का जाप करें।',
            'home.lore.hanuman': 'मंगलवार मंगल ग्रह द्वारा शासित है, जो भगवान हनुमान के अधीन है। यह अपार शारीरिक और मानसिक ऊर्जा का दिन है, जो डर पर काबू पाने के लिए उत्तम है।',
            'home.sadhana.hanuman': 'साधना: हनुमान चालीसा का पाठ करें। आज बचने के बजाय चुनौतियों का डटकर सामना करें।',
            'home.lore.ganesha': 'बुधवार बुध ग्रह द्वारा शासित है। आज भगवान गणेश की पूजा करने से बुद्धि तेज होती है, सीखने में आने वाली बाधाएं दूर होती हैं और सौभाग्य प्राप्त होता है।',
            'home.sadhana.ganesha': 'साधना: यदि संभव हो तो दूर्वा घास अर्पित करें, और अनदेखे मानसिक अवरोधों को दूर करने के लिए मानसिक रूप से प्रार्थना करें।',
            'home.lore.vishnu': 'गुरुवार बृहस्पति (गुरु) द्वारा शासित है, जो ज्ञान के ग्रह हैं। भगवान विष्णु धर्म और लौकिक सद्भाव के माध्यम से ब्रह्मांड को बनाए रखते हैं।',
            'home.sadhana.vishnu': 'साधना: अपने जीवन के आशीर्वाद के लिए गहरी कृतज्ञता व्यक्त करें। "ॐ नमो भगवते वासुदेवाय" का जाप करें।',
            'home.lore.durga': 'शुक्रवार शुक्र ग्रह द्वारा शासित है। दिव्य माता सर्वोच्च करुणा और भयंकर सुरक्षा का प्रतीक हैं। यह सुंदरता, कला और मातृ प्रेम का दिन है।',
            'home.sadhana.durga': 'साधना: अपने जीवन में किसी महिला या माता-समान व्यक्ति के लिए दया का कार्य करें।',
            'home.lore.shani': 'शनिवार शनि ग्रह द्वारा शासित है, जो कर्म और अनुशासन के ग्रह हैं। भगवान शनि धैर्य, कड़ी मेहनत और न्याय सिखाते हैं।',
            'home.sadhana.shani': 'साधना: उपवास या मौन का अभ्यास करें, या जरूरतमंदों को भोजन/कपड़े दान करें। आज क्रोध से बचें।',
"""

# We need to insert en_additions into the 'en' object and hi_additions into the 'hi' object.
# The 'en' object ends where 'hi: {' begins. 
# We can search for 'hi: {' or similar boundaries.

import re
match = re.search(r'\n\s*hi:\s*\{', content)
if match:
    hi_start_str = match.group(0)
    en_part = content[:match.start()].rstrip()
    
    if en_part.endswith(','):
        en_part = en_part[:-1] + "," + en_additions + "\n        "
    else:
        en_part = en_part + "," + en_additions + "\n        "
    
    hi_part = content[match.end():]
    last_brace_idx = hi_part.rfind('}')
    
    hi_modified = hi_part[:last_brace_idx].rstrip()
    if hi_modified.endswith(','):
        hi_modified = hi_modified[:-1] + "," + hi_additions + "\n        "
    else:
        hi_modified = hi_modified + "," + hi_additions + "\n        "
    
    hi_modified += hi_part[last_brace_idx:]
    
    final_content = en_part + hi_start_str + hi_modified
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Successfully updated i18n.js")
else:
    print("Could not find hi: {")
