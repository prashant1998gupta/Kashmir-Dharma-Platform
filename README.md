# Kashmir Dharma Platform — Kashmiri Pandit Digital Companion

A comprehensive single-page web application (SPA) designed to preserve, organize, and make accessible the rich cultural heritage, traditions, and rituals of the Kashmiri Pandit community. 

This platform serves as a digital bridge between the community and its heritage — ensuring knowledge is available to every family, especially those in the diaspora, without replacing the vital role of traditional scholars and priests.

## 🌟 Key Features

### 1. 📅 Festival Calendar
- Interactive monthly calendar with festival markers.
- Detailed information on major festivals (Navreh, Herath, Zyeth Atham, Khetsrimavas, etc.).
- Includes significance, ritual procedures, preparation checklists, traditional foods, and common FAQs.

### 2. 📖 Ritual Knowledge Library
- Comprehensive encyclopedia of rituals spanning Life Events, Marriage, Seasonal, and Regular Practices.
- Detailed step-by-step timelines, required materials checklists, historical significance, and regional variations.

### 3. 💒 Wedding Planning Guide
- Complete guide to Kashmiri Pandit wedding ceremonies (Kasamdry to Satrandir).
- Interactive chronological timeline.
- Detailed responsibilities for both the bride's and groom's families.
- Information on traditional wedding songs (Vanvun, Rouf) and tips for diaspora families.

### 4. 🎂 Hindu Birthday (Janma Tithi) Finder
- Astronomical algorithm-based calculator to find your exact lunar birthday.
- Calculates Tithi, Nakshatra, Moon Rashi, and the corresponding Hindu month.
- Predicts upcoming Janma Tithi dates for any target Gregorian year.

### 5. 🌟 Muhurat Finder
- Identifies auspicious dates and timings for 9 important life events (Vehicle/Property Purchase, Job, Marriage, Housewarming, etc.).
- Custom scoring algorithm based on traditional Panchang guidelines.
- Provides specific favorable and unfavorable days/tithis.

### 6. 👪 Family Heritage Records
- Private, on-device storage for your family's specific heritage data.
- Record Family Name (Kram), Gotra, Kuldevta/Kuldevi, Native Village, and unique family traditions.
- Tracks important annual observances.
- Export and import data securely via JSON (data never leaves your device).

### 7. 📚 Knowledge Archive
- Curated articles covering Kashmiri Pandit History, Kashmir Shaivism, Saints (Lal Ded), Traditional Cuisine, Sacred Temples, and Language preservation.
- Bookmark favorite articles for quick access.

### 8. 🔮 AI Knowledge Guide (Smart Search)
- Chat-style interface to ask questions about traditions.
- Full-text fuzzy search engine across all festivals, rituals, wedding ceremonies, and archive articles.
- Contextual answers with source linking and related topic suggestions.

## 🛠️ Technology Stack

The application is built using a modern, lightweight, dependency-free architecture:

- **Frontend Core:** Pure HTML5, Vanilla JavaScript, Vanilla CSS.
- **Routing:** Custom hash-based SPA Router (`js/router.js`).
- **Data Layer:** Static JSON files fetched asynchronously (`data/*.json`).
- **Storage:** Browser `localStorage` for user preferences and heritage data (`js/utils/storage.js`).
- **Search Engine:** Custom client-side fuzzy-matching full-text search (`js/utils/search.js`).
- **Astrology Engine:** Bundled Astronomy Engine for geocentric Sun, Moon, and planetary positions, plus a shared Panchang core for tithi, nakshatra, rashi, yoga, and karana rules (`js/lib/astronomy.js`, `js/utils/panchang-core.js`, `js/utils/calendar-calc.js`, `js/utils/astrology-calc.js`).

See [`calculation_accuracy_audit.md`](calculation_accuracy_audit.md) for the current accuracy status and the production roadmap toward Swiss Ephemeris validation.

### Design System
- **Theme:** Dark mode by default, reflecting a premium, spiritual aesthetic.
- **Color Palette:** Saffron (Deep Crimson), Antique Gold, and Valley Green.
- **Styling:** Glassmorphism UI components, dynamic micro-animations, and responsive layouts (CSS Grid/Flexbox).

## 🚀 Getting Started

Since this is a static client-side application, running it is incredibly simple.

### Prerequisites
- Any modern web browser.
- A basic local HTTP server (optional, but recommended for fetching JSON data properly without CORS issues).

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/prashant1998gupta/Kashmir-Dharma-Platform.git
   cd Kashmir-Dharma-Platform
   ```

2. Start a local server. For example, using Python 3:
   ```bash
   python -m http.server 8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```text
├── index.html                  # Main SPA HTML shell
├── css/
│   ├── styles.css              # Core design tokens and styles
│   └── animations.css          # CSS transitions and keyframes
├── js/
│   ├── app.js                  # Application entry point & init
│   ├── router.js               # Hash-based routing logic
│   ├── components.js           # Reusable UI components (Cards, Modals, etc.)
│   ├── utils/                  # Core utilities (Search, Storage, Calc)
│   └── pages/                  # Page-specific rendering logic
└── data/                       # Static JSON knowledge base
    ├── festivals.json
    ├── rituals.json
    ├── wedding.json
    ├── archive.json
    └── muhurat-data.json
```

## ⚠️ Disclaimer

While great care has been taken to ensure the authenticity of the information provided, this platform is meant to be a companion and reference tool. For exact Muhurat timings, complex astrological calculations, and highly specific religious procedures, **consultation with a qualified Kashmiri Pandit scholar or priest is strongly recommended.**

## 🤝 Contributing

Contributions to improve the accuracy of the data, add new rituals, or enhance the application are welcome! Please feel free to submit a Pull Request.

---
*Preserving the sacred heritage of the Kashmir Valley for future generations.*
