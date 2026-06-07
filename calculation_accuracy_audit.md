# Calculation Accuracy Audit

This product should earn trust before it asks for money. The goal is not to claim "perfect" astrology; the goal is to make every calculation traceable, repeatable, and honest about its method.

## Research Baseline

- Astronomy Engine is already bundled in `js/lib/astronomy.js`. Its project documentation describes browser-friendly Sun, Moon, and planet calculations tested against sources such as NOVAS and JPL Horizons, with a stated design target of about 1 arcminute accuracy.
- Swiss Ephemeris remains the professional-grade target for paid reports. Its programming manual supports official sidereal modes, including `SE_SIDM_LAHIRI = 1`, described as the official Lahiri ayanamsha used in the Indian Astronomical Ephemeris since 1985.
- Panchang elements should be derived from true sidereal Sun/Moon longitudes:
  - Tithi: Moon minus Sun, divided into 30 segments of 12 degrees.
  - Nakshatra: Moon longitude divided into 27 segments of 13 degrees 20 minutes.
  - Yoga: Sun plus Moon longitude divided into 27 equal segments.
  - Karana: half-tithi, 60 segments of 6 degrees with the traditional movable/fixed sequence.
  - Vaar: weekday at the user's local date.

## Fixed In This Pass

- Added a shared `PanchangCore` so kundali, calendar, birthday, and muhurat flows can use the same canonical tithi, nakshatra, rashi, yoga, karana, and weekday naming rules.
- Replaced numbered kundali placeholders like `Yoga #12` and `Karana #24` with named Panchang values.
- Updated the daily calendar calculation path to use Astronomy Engine geocentric Sun/Moon longitudes when available, falling back to the old approximate series only if the engine is missing.
- Improved Lahiri ayanamsha from a birth-year-only value to a date-aware mean Lahiri approximation.
- Added tithi numbers, nakshatra padas, yoga, karana, and calculation mode metadata to `CalendarCalc.getHinduDate()`.
- Bumped the service worker cache so corrected calculation scripts are delivered instead of stale cached files.

## Still Not Monetization-Grade

These items should be completed before selling reports as expert-grade:

- Replace browser-side mean Lahiri approximation with Swiss Ephemeris on a backend or a validated WASM/service layer.
- Build a golden test corpus: 50-100 known charts covering boundary cases near sign, tithi, nakshatra, navamsa, sunrise, DST, and international timezones.
- Add city/timezone handling from an IANA timezone database instead of fixed numeric offsets.
- Add true sunrise-based Panchang day selection and transition end-times for tithi, nakshatra, yoga, and karana.
- Replace the current simplified Sarvashtakavarga model with true Ashtakavarga lookup-table calculation.
- Validate Ashtakoot tables, Manglik exceptions, Nadi exceptions, and Tajika rules with at least one qualified Jyotish scholar.
- Decide and document house system defaults: whole-sign, equal-house bhava chalit, and any optional Placidus/Sripati support.
- Store calculation provenance inside every paid PDF: engine, ayanamsha, timezone source, generated timestamp, and disclaimer.

## Validation Targets

- Planetary sidereal longitudes: within 1 arcminute against the selected production ephemeris.
- Ascendant: within 1 arcminute for normal latitudes after timezone/DST verification.
- Tithi/nakshatra/yoga/karana labels: match the reference ephemeris for the same timestamp and location.
- Festival dates: match a selected authoritative Panchang rule set, including sunrise and skipped/extended tithi cases.
- Report generation: same input must produce the same PDF content every time.

## Sources

- Astronomy Engine: https://github.com/cosinekitty/astronomy
- Astronomy Engine JavaScript docs: https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md
- Swiss Ephemeris programming manual: https://www.astro.com/swisseph/swephprg.pdf
