const CityDatabase = [
    // Jammu & Kashmir
    { name: "Srinagar, J&K, India", lat: 34.0837, lon: 74.7973, tz: 5.5 },
    { name: "Jammu, J&K, India", lat: 32.7266, lon: 74.8570, tz: 5.5 },
    { name: "Anantnag, J&K, India", lat: 33.7311, lon: 75.1487, tz: 5.5 },
    { name: "Baramulla, J&K, India", lat: 34.2023, lon: 74.3467, tz: 5.5 },
    
    // Major Indian Cities
    { name: "Delhi / New Delhi, India", lat: 28.6139, lon: 77.2090, tz: 5.5 },
    { name: "Mumbai, Maharashtra, India", lat: 19.0760, lon: 72.8777, tz: 5.5 },
    { name: "Pune, Maharashtra, India", lat: 18.5204, lon: 73.8567, tz: 5.5 },
    { name: "Bengaluru, Karnataka, India", lat: 12.9716, lon: 77.5946, tz: 5.5 },
    { name: "Chennai, Tamil Nadu, India", lat: 13.0827, lon: 80.2707, tz: 5.5 },
    { name: "Kolkata, West Bengal, India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
    { name: "Hyderabad, Telangana, India", lat: 17.3850, lon: 78.4867, tz: 5.5 },
    { name: "Ahmedabad, Gujarat, India", lat: 23.0225, lon: 72.5714, tz: 5.5 },
    { name: "Chandigarh, India", lat: 30.7333, lon: 76.7794, tz: 5.5 },
    { name: "Lucknow, UP, India", lat: 26.8467, lon: 80.9462, tz: 5.5 },
    { name: "Jaipur, Rajasthan, India", lat: 26.9124, lon: 75.7873, tz: 5.5 },

    // Global Cities (Diaspora)
    { name: "New York, USA", lat: 40.7128, lon: -74.0060, tz: -5.0 },
    { name: "Los Angeles, USA", lat: 34.0522, lon: -118.2437, tz: -8.0 },
    { name: "Chicago, USA", lat: 41.8781, lon: -87.6298, tz: -6.0 },
    { name: "Houston, USA", lat: 29.7604, lon: -95.3698, tz: -6.0 },
    { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194, tz: -8.0 },
    { name: "Toronto, Canada", lat: 43.6510, lon: -79.3470, tz: -5.0 },
    { name: "Vancouver, Canada", lat: 49.2827, lon: -123.1207, tz: -8.0 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278, tz: 0.0 },
    { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, tz: 10.0 },
    { name: "Melbourne, Australia", lat: -37.8136, lon: 144.9631, tz: 10.0 },
    { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tz: 4.0 },
    { name: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8.0 }
];

// Sort alphabetically for dropdown
CityDatabase.sort((a, b) => a.name.localeCompare(b.name));
