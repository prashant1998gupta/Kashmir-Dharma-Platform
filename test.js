const I18n = {t: (k,v)=>v};
console.log(`${typeof I18n !== 'undefined' ? I18n.t('match.boy_moon_sign', 'Boy\\'s Moon Sign (Rashi)') : 'Boy\\'s Moon Sign (Rashi)'}`)
