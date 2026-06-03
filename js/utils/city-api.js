/* ============================================
   City Search API (Using Open-Meteo Free Geocoding)
   ============================================ */

const CityAPI = (() => {

    /**
     * Calculate precise UTC timezone offset (including DST)
     */
    function getTzOffset(timezoneStr, dateStr) {
        try {
            const d = dateStr ? new Date(dateStr) : new Date();
            const utcDate = new Date(d.toLocaleString('en-US', { timeZone: "UTC" }));
            const tzDate = new Date(d.toLocaleString('en-US', { timeZone: timezoneStr }));
            return (tzDate.getTime() - utcDate.getTime()) / 3600000;
        } catch (e) {
            console.warn("Invalid timezone string:", timezoneStr);
            return 0;
        }
    }

    /**
     * Search cities via Open-Meteo API
     */
    async function searchCities(query) {
        if (!query || query.length < 2) return [];
        
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.results) return [];

            return data.results.map(city => {
                const displayName = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
                return {
                    id: city.id,
                    name: displayName,
                    lat: city.latitude,
                    lon: city.longitude,
                    tzStr: city.timezone || 'UTC'
                };
            });
        } catch (error) {
            console.error("City Search API Error:", error);
            return [];
        }
    }

    /**
     * Initialize autocomplete logic for a given input
     */
    function initCityAutocomplete(inputId, resultsId) {
        const input = document.getElementById(inputId);
        const resultsBox = document.getElementById(resultsId);
        if (!input || !resultsBox) return;

        let debounceTimer;

        // Base styles for the dropdown
        resultsBox.style.display = 'none';
        resultsBox.style.position = 'absolute';
        resultsBox.style.zIndex = '1000';
        resultsBox.style.width = '100%';
        resultsBox.style.background = 'var(--bg-card)';
        resultsBox.style.backdropFilter = 'blur(15px)';
        resultsBox.style.border = '1px solid var(--surface-border)';
        resultsBox.style.borderRadius = 'var(--radius-md)';
        resultsBox.style.maxHeight = '250px';
        resultsBox.style.overflowY = 'auto';
        resultsBox.style.listStyle = 'none';
        resultsBox.style.padding = '0';
        resultsBox.style.margin = '4px 0 0 0';
        resultsBox.style.boxShadow = 'var(--surface-shadow-lg)';
        
        // Wrapper for relative positioning
        if (input.parentElement.style.position !== 'relative') {
            input.parentElement.style.position = 'relative';
        }

        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            clearTimeout(debounceTimer);
            
            // Clear dataset on new input
            input.dataset.lat = '';
            input.dataset.lon = '';
            input.dataset.tzStr = '';

            if (val.length < 2) {
                resultsBox.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(async () => {
                // Show a loading state
                resultsBox.innerHTML = `<li style="padding: 10px 15px; color: var(--text-muted);">Searching...</li>`;
                resultsBox.style.display = 'block';

                const results = await searchCities(val);
                
                if (results.length === 0) {
                    resultsBox.innerHTML = `<li style="padding: 10px 15px; color: var(--text-muted);">No cities found</li>`;
                    return;
                }

                resultsBox.innerHTML = '';
                results.forEach(city => {
                    const li = document.createElement('li');
                    li.style.padding = '10px 15px';
                    li.style.cursor = 'pointer';
                    li.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    li.style.color = 'var(--text-primary)';
                    li.style.transition = 'background 0.2s';
                    
                    li.onmouseover = () => li.style.background = 'var(--bg-card-hover)';
                    li.onmouseout = () => li.style.background = 'transparent';

                    li.innerHTML = `<span style="margin-right: 8px;">🌍</span><strong>${city.name.split(',')[0]}</strong><span style="font-size: 0.85em; color: var(--text-muted); margin-left: 8px;">${city.name.substring(city.name.indexOf(','))}</span>`;
                    
                    li.addEventListener('click', () => {
                        input.value = city.name;
                        input.dataset.lat = city.lat;
                        input.dataset.lon = city.lon;
                        input.dataset.tzStr = city.tzStr;
                        resultsBox.style.display = 'none';
                    });

                    resultsBox.appendChild(li);
                });

                // Add API Footer
                const footer = document.createElement('li');
                footer.style.padding = '8px 15px';
                footer.style.fontSize = '0.75em';
                footer.style.textAlign = 'right';
                footer.style.color = 'var(--color-secondary)';
                footer.style.borderTop = '1px solid var(--surface-border)';
                footer.style.background = 'rgba(0,0,0,0.2)';
                footer.innerHTML = `<em>⚡ Powered by Global Open-Meteo API</em>`;
                resultsBox.appendChild(footer);

            }, 400); // 400ms debounce
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== resultsBox) {
                resultsBox.style.display = 'none';
            }
        });
    }

    return {
        getTzOffset,
        searchCities,
        initCityAutocomplete
    };
})();
