const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'kashmiri-calendar');

const START = new Date(2026, 3, 1);
const END = new Date(2027, 3, 30);

const SCRIPT_EXPORTS = [
  ['js/lib/astronomy.js', 'Astronomy'],
  ['js/utils/panchang-core.js', 'PanchangCore'],
  ['js/utils/astrology-calc.js', 'AstroCalc'],
  ['js/utils/calendar-calc.js', 'CalendarCalc'],
];

const TITHI_TO_KOSHUR = {
  Pratipada: 'Okdoh',
  Dwitiya: 'Dwitya',
  Tritiya: 'Tritya',
  Chaturthi: 'Choram',
  Panchami: 'Paancham',
  Shashthi: 'Shishthi',
  Saptami: 'Satam',
  Ashtami: 'Ashtami',
  Navami: 'Navum',
  Dashami: 'Dhashmi',
  Ekadashi: 'Ekadashi',
  Dwadashi: 'Dwadashi',
  Trayodashi: 'Triyodashi',
  Chaturdashi: 'Chaturdashi',
  Purnima: 'Poornima',
  Amavasya: 'Amavasya',
};

const MONTH_TO_KOSHUR = {
  Chaitra: 'Chaitra',
  Vaishakha: 'Vaishakh',
  Jyeshtha: 'Zyeth',
  Ashadha: 'Aashaad',
  Shravana: 'Shravan',
  Bhadrapada: 'Bhadra',
  Ashvina: 'Ashwin',
  Kartika: 'Kartik',
  Margashirsha: 'Maarg',
  Pausha: 'Poh',
  Magha: 'Maagh',
  Phalguna: 'Phalgun',
};

const FIXED_SOLAR_EVENTS = {
  '14-04': 'Baisakhi / Sankranti',
  '15-01': 'Makar Sankranti',
};

const FESTIVAL_RULES = [
  { label: 'Navreh, Navratra Starts', month: 'Chaitra', paksha: 0, tithi: 'Pratipada', imp: '2' },
  { label: 'Durga Ashtami', month: 'Chaitra', paksha: 0, tithi: 'Ashtami', imp: '1' },
  { label: 'Ram Navmi', month: 'Chaitra', paksha: 0, tithi: 'Navami', imp: '1' },
  { label: 'Mata Kheer Bhawani Yatra, Zyeth Ashtami', month: 'Jyeshtha', paksha: 0, tithi: 'Ashtami', imp: '2' },
  { label: 'Janmashtami', month: 'Bhadrapada', paksha: 1, tithi: 'Ashtami', imp: '1' },
  { label: 'Herath', month: 'Phalguna', paksha: 1, tithi: 'Trayodashi', imp: '2' },
];

function loadCalendarCalc() {
  const context = { console, Date, Math, Intl };
  vm.createContext(context);

  for (const [file, exportedName] of SCRIPT_EXPORTS) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(
      `${source}\nif (typeof ${exportedName} !== 'undefined') globalThis.${exportedName} = ${exportedName};`,
      context,
      { filename: file }
    );
  }

  return context.CalendarCalc;
}

function eachDate(start, end, callback) {
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    callback(new Date(date));
  }
}

function formatDate(date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('-');
}

function formatIso(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function dateKey(date) {
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function addEvent(map, date, label, imp) {
  const key = formatIso(date);
  const current = map.get(key) || { labels: [], imp: undefined };
  label.split(',').map((item) => item.trim()).filter(Boolean).forEach((item) => {
    if (!current.labels.includes(item)) current.labels.push(item);
  });
  if (imp && (!current.imp || Number(imp) > Number(current.imp))) current.imp = imp;
  map.set(key, current);
}

function buildFestivalMap(CalendarCalc) {
  const map = new Map();
  const navrehDates = [];

  eachDate(START, END, (date) => {
    const hDate = CalendarCalc.getHinduDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12,
      0
    );
    if (
      hDate.hinduMonth.name === 'Chaitra'
      && hDate.tithi.pakshaIndex === 0
      && hDate.tithi.name === 'Pratipada'
      && date.getMonth() >= 2
    ) {
      navrehDates.push(new Date(date));
    }
  });

  for (const rule of FESTIVAL_RULES) {
    if (rule.month === 'Chaitra') {
      for (const navrehDate of navrehDates) {
        const scanEnd = new Date(navrehDate);
        scanEnd.setDate(scanEnd.getDate() + 14);

        eachDate(navrehDate, scanEnd, (date) => {
          const hDate = CalendarCalc.getHinduDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            12,
            0
          );
          if (hDate.tithi.pakshaIndex === rule.paksha && hDate.tithi.name === rule.tithi) {
            addEvent(map, date, rule.label, rule.imp);
          }
        });
      }
      continue;
    }

    const seenYears = new Set();
    eachDate(START, END, (date) => {
      const hDate = CalendarCalc.getHinduDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        12,
        0
      );
      const matches = hDate.hinduMonth.name === rule.month
        && hDate.tithi.pakshaIndex === rule.paksha
        && hDate.tithi.name === rule.tithi;

      if (matches) {
        const seenKey = `${rule.label}:${date.getFullYear()}`;
        if (seenYears.has(seenKey)) return;
        seenYears.add(seenKey);
        addEvent(map, date, rule.label, rule.imp);
      }
    });
  }
  return map;
}

function buildDailyEvents(CalendarCalc) {
  const festivalMap = buildFestivalMap(CalendarCalc);
  const rows = [];
  let previousRashi = null;

  eachDate(START, END, (date) => {
    const hDate = CalendarCalc.getHinduDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12,
      0
    );
    const labels = [];
    let imp;

    const solarLabel = FIXED_SOLAR_EVENTS[dateKey(date)];
    if (solarLabel) labels.push(solarLabel);

    const rashi = Math.floor(hDate.sunLongitude / 30);
    if (previousRashi !== null && rashi !== previousRashi && !labels.some((label) => label.includes('Sankranti'))) {
      labels.push('Sankranti');
    }
    previousRashi = rashi;

    const festival = festivalMap.get(formatIso(date));
    if (festival) {
      labels.push(...festival.labels);
      imp = festival.imp;
    }

    const tithiName = TITHI_TO_KOSHUR[hDate.tithi.name] || hDate.tithi.name;
    labels.push(tithiName);

    const row = {
      date: formatDate(date),
      events: labels.filter(Boolean).join(', '),
    };

    if (imp) row.imp = imp;
    rows.push(row);
  });

  return rows;
}

function makeRange(start, end, name, imp) {
  const row = {
    startDate: formatDate(start),
    endDate: formatDate(end),
    monthName: name,
  };
  if (imp) row.imp = imp;
  return row;
}

function buildMonthEvents(CalendarCalc) {
  const rows = [];
  const panchakRanges = [];
  let current = null;
  let panchakStart = null;
  let previousDate = null;

  eachDate(START, END, (date) => {
    const hDate = CalendarCalc.getHinduDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12,
      0
    );
    const month = MONTH_TO_KOSHUR[hDate.hinduMonth.name] || hDate.hinduMonth.name;
    const paksha = hDate.tithi.pakshaIndex === 0 ? 'Shukla Paksha' : 'Krishna Paksha';
    const monthName = `${month} ${paksha}`;

    if (!current) {
      current = { start: new Date(date), end: new Date(date), monthName };
    } else if (current.monthName === monthName) {
      current.end = new Date(date);
    } else {
      rows.push(makeRange(current.start, current.end, current.monthName));
      current = { start: new Date(date), end: new Date(date), monthName };
    }

    const isPanchak = hDate.nakshatra.index >= 22;
    if (isPanchak && !panchakStart) {
      panchakStart = new Date(date);
    } else if (!isPanchak && panchakStart) {
      panchakRanges.push(makeRange(panchakStart, previousDate, 'Panchak', '2'));
      panchakStart = null;
    }

    previousDate = new Date(date);
  });

  if (current) rows.push(makeRange(current.start, current.end, current.monthName));
  if (panchakStart) panchakRanges.push(makeRange(panchakStart, END, 'Panchak', '2'));

  return [...rows, ...panchakRanges].sort((a, b) => {
    const [ad, am, ay] = a.startDate.split('-').map(Number);
    const [bd, bm, by] = b.startDate.split('-').map(Number);
    return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd);
  });
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const CalendarCalc = loadCalendarCalc();
  const dailyEvents = buildDailyEvents(CalendarCalc);
  const monthEvents = buildMonthEvents(CalendarCalc);

  fs.writeFileSync(path.join(OUT_DIR, '26_27.json'), `${JSON.stringify(dailyEvents, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, 'months_26_27.json'), `${JSON.stringify(monthEvents, null, 2)}\n`);

  console.log(`Wrote ${dailyEvents.length} daily rows`);
  console.log(`Wrote ${monthEvents.length} month/panchak rows`);
}

main();
