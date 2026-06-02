const CityDatabase = [
    // Jammu & Kashmir - Kashmir Valley
    { name: "Srinagar, J&K, India", lat: 34.0837, lon: 74.7973, tz: 5.5 },
    { name: "Anantnag, J&K, India", lat: 33.7311, lon: 75.1487, tz: 5.5 },
    { name: "Baramulla, J&K, India", lat: 34.2023, lon: 74.3467, tz: 5.5 },
    { name: "Pulwama, J&K, India", lat: 33.8716, lon: 74.8946, tz: 5.5 },
    { name: "Kupwara, J&K, India", lat: 34.5262, lon: 74.2546, tz: 5.5 },
    { name: "Sopore, J&K, India", lat: 34.2954, lon: 74.4733, tz: 5.5 },
    { name: "Bandipora, J&K, India", lat: 34.4225, lon: 74.6542, tz: 5.5 },
    { name: "Shopian, J&K, India", lat: 33.7200, lon: 74.8300, tz: 5.5 },
    { name: "Kulgam, J&K, India", lat: 33.6450, lon: 75.0166, tz: 5.5 },
    { name: "Ganderbal, J&K, India", lat: 34.2163, lon: 74.7735, tz: 5.5 },
    { name: "Budgam, J&K, India", lat: 34.0151, lon: 74.7176, tz: 5.5 },
    { name: "Pahalgam, J&K, India", lat: 34.0142, lon: 75.3216, tz: 5.5 },
    { name: "Gulmarg, J&K, India", lat: 34.0484, lon: 74.3805, tz: 5.5 },
    { name: "Tral, J&K, India", lat: 33.9317, lon: 75.1097, tz: 5.5 },
    { name: "Pampore, J&K, India", lat: 34.0156, lon: 74.9333, tz: 5.5 },
    { name: "Bijbehara, J&K, India", lat: 33.7942, lon: 75.1017, tz: 5.5 },
    { name: "Awantipora, J&K, India", lat: 33.9234, lon: 75.0140, tz: 5.5 },
    { name: "Handwara, J&K, India", lat: 34.4011, lon: 74.2828, tz: 5.5 },
    { name: "Pattan, J&K, India", lat: 34.1611, lon: 74.5620, tz: 5.5 },
    { name: "Uri, J&K, India", lat: 34.0850, lon: 74.0401, tz: 5.5 },
    
    // Jammu & Kashmir - Jammu Region
    { name: "Jammu, J&K, India", lat: 32.7266, lon: 74.8570, tz: 5.5 },
    { name: "Udhampur, J&K, India", lat: 32.9262, lon: 75.1389, tz: 5.5 },
    { name: "Kathua, J&K, India", lat: 32.3716, lon: 75.5119, tz: 5.5 },
    { name: "Reasi, J&K, India", lat: 33.0805, lon: 74.8340, tz: 5.5 },
    { name: "Poonch, J&K, India", lat: 33.7681, lon: 74.0934, tz: 5.5 },
    { name: "Rajouri, J&K, India", lat: 33.3789, lon: 74.3013, tz: 5.5 },
    { name: "Samba, J&K, India", lat: 32.5539, lon: 75.1123, tz: 5.5 },
    { name: "Akhnoor, J&K, India", lat: 32.8712, lon: 74.7391, tz: 5.5 },
    { name: "Bhaderwah, J&K, India", lat: 32.9817, lon: 75.7139, tz: 5.5 },
    { name: "Doda, J&K, India", lat: 33.1465, lon: 75.5460, tz: 5.5 },
    { name: "Kishtwar, J&K, India", lat: 33.3129, lon: 75.7663, tz: 5.5 },
    { name: "Ramban, J&K, India", lat: 33.2427, lon: 75.2413, tz: 5.5 },
    { name: "Banihal, J&K, India", lat: 33.4371, lon: 75.1979, tz: 5.5 },
    
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
    { name: "Jaipur, Rajasthan, India", lat: 26.9124, lon: 75.7873, tz: 5.5 }
];

// Sort alphabetically for dropdown
CityDatabase.sort((a, b) => a.name.localeCompare(b.name));
