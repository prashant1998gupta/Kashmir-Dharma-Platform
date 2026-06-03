# Premium Features Implementation Plan
**Features:** Automated Kundali Matching (Guna Milan) & Annual Horoscope (Varshphal)

This plan outlines the architecture and execution strategy for building the two core premium products: the Ashtakoot Kundali Matching Engine and the Tajika Varshphal Engine. Both will be high-fidelity, mathematically precise features designed for PDF monetization.

## User Review Required

> [!WARNING]
> This is a massive update that introduces two completely new astrological engines and hundreds of lines of complex math. Please review the proposed algorithms and UX below to ensure they meet your exact vision before I begin coding.

## Open Questions

> [!IMPORTANT]
> 1. **Data Inputs:** For Kundali Matching, do you want a single form where users enter BOTH the Boy's and Girl's birth details at the same time?
> 2. **Varshphal Limit:** Should the Varshphal allow users to generate a report for *any* year (e.g. 2024, 2030, etc.), or just the "Current Year"?

---

## Proposed Changes

### Phase 1: Mathematical Engines (Backend Logic)

#### [NEW] [match-calc.js](file:///d:/Prashant_WorkSpace/Python/Kashmir%20Dharma%20Platform/js/utils/match-calc.js)
This utility will handle the 36-point Ashtakoot Guna Milan logic. It requires the Moon Nakshatra and Pada of both individuals.
- **Varna (1 pt):** Based on Rashi element compatibility.
- **Vashya (2 pts):** Based on animal nature of the Moon signs.
- **Tara (3 pts):** Birth star distance compatibility.
- **Yoni (4 pts):** Intimacy compatibility mapped to 14 animal yonis.
- **Graha Maitri (5 pts):** Moon sign lord friendship.
- **Gana (6 pts):** Deva, Manushya, and Rakshasa temperaments.
- **Bhakoot (7 pts):** 6-8, 9-5, 2-12 relational positioning of Moon signs.
- **Nadi (8 pts):** Adi, Madhya, and Antya dosha checks.

#### [NEW] [varshphal-calc.js](file:///d:/Prashant_WorkSpace/Python/Kashmir%20Dharma%20Platform/js/utils/varshphal-calc.js)
This utility will compute the Tajika system for a specific year.
- **Solar Return:** Finds the exact Date and Time when the Sun returns to its exact natal sidereal longitude.
- **Varsha Lagna:** Computes the Ascendant at the time of the solar return.
- **Muntha:** Calculates the progressed Ascendant `(Natal Lagna + Age) % 12`.
- **Varsheshvara (Year Lord):** Evaluates the Panchadhikari (5 office bearers) to determine the ruler of the year.
- **Mudda Dasha:** Calculates the 1-year compressed dasha timeline.

---

### Phase 2: UI & Page Development

#### [MODIFY] [index.html](file:///d:/Prashant_WorkSpace/Python/Kashmir%20Dharma%20Platform/index.html)
- Add navigation sidebar tabs for **Kundali Matching** and **Annual Varshphal**.
- Add `<script>` tags for the new utilities and pages.

#### [NEW] [matching.js](file:///d:/Prashant_WorkSpace/Python/Kashmir%20Dharma%20Platform/js/pages/matching.js)
- Build a split-screen glassmorphic form for "Boy's Details" and "Girl's Details".
- Generate a gorgeous 36-point breakdown UI with circular progress bars.
- Build the exact print/PDF layout (similar to Kundali) that hides the form and prints the detailed compatibility report cleanly.

#### [NEW] [varshphal.js](file:///d:/Prashant_WorkSpace/Python/Kashmir%20Dharma%20Platform/js/pages/varshphal.js)
- Build a form requesting Birth Details + Target Year.
- Generate a UI displaying the Solar Return chart, Muntha position, Year Lord, and the 1-year Mudda Dasha timeline.
- Implement precise Print/PDF logic to generate the multi-page Varshphal.

---

## Verification Plan

### Automated Tests
- Validate Ashtakoot Engine against known celebrity charts or standard ephemeris outputs to ensure it outputs exactly out of 36 points.
- Verify Solar Return time calculation matches standard Drik Panchang solar return offsets.

### Manual Verification
- Test Print/PDF layout on Chrome and Edge for both Matching and Varshphal to ensure zero pagination glitches, following the fixes applied to the Kundali PDF logic.
