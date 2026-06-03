import urllib.request
import json
import time

cities = [
    "Shimla, Himachal Pradesh, India", "Manali, Himachal Pradesh, India", "Dharamshala, Himachal Pradesh, India",
    "Kullu, Himachal Pradesh, India", "Mandi, Himachal Pradesh, India", "Solan, Himachal Pradesh, India",
    "Amritsar, Punjab, India", "Jalandhar, Punjab, India", "Ludhiana, Punjab, India", "Patiala, Punjab, India",
    "Pathankot, Punjab, India", "Gurugram, Haryana, India", "Faridabad, Haryana, India", "Panipat, Haryana, India",
    "Ambala, Haryana, India", "Karnal, Haryana, India", "Rohtak, Haryana, India", "Dehradun, Uttarakhand, India",
    "Haridwar, Uttarakhand, India", "Rishikesh, Uttarakhand, India", "Roorkee, Uttarakhand, India", 
    "Haldwani, Uttarakhand, India", "Kanpur, UP, India", "Varanasi, UP, India", "Agra, UP, India",
    "Prayagraj, UP, India", "Meerut, UP, India", "Bareilly, UP, India", "Aligarh, UP, India",
    "Moradabad, UP, India", "Saharanpur, UP, India", "Gorakhpur, UP, India", "Noida, UP, India",
    "Ghaziabad, UP, India", "Mathura, UP, India", "Patna, Bihar, India", "Gaya, Bihar, India",
    "Jodhpur, Rajasthan, India", "Udaipur, Rajasthan, India", "Kota, Rajasthan, India", "Bikaner, Rajasthan, India",
    "Ajmer, Rajasthan, India", "Surat, Gujarat, India", "Vadodara, Gujarat, India", "Rajkot, Gujarat, India",
    "Bhavnagar, Gujarat, India", "Gandhinagar, Gujarat, India", "Indore, MP, India", "Bhopal, MP, India",
    "Jabalpur, MP, India", "Gwalior, MP, India", "Ujjain, MP, India", "Raipur, Chhattisgarh, India",
    "Nagpur, Maharashtra, India", "Nashik, Maharashtra, India", "Aurangabad, Maharashtra, India",
    "Solapur, Maharashtra, India", "Kolhapur, Maharashtra, India", "Panaji, Goa, India",
    "Mysuru, Karnataka, India", "Mangaluru, Karnataka, India", "Hubballi, Karnataka, India",
    "Coimbatore, Tamil Nadu, India", "Madurai, Tamil Nadu, India", "Tiruchirappalli, Tamil Nadu, India",
    "Salem, Tamil Nadu, India", "Kochi, Kerala, India", "Thiruvananthapuram, Kerala, India",
    "Kozhikode, Kerala, India", "Visakhapatnam, Andhra Pradesh, India", "Vijayawada, Andhra Pradesh, India",
    "Guntur, Andhra Pradesh, India", "Warangal, Telangana, India", "Bhubaneswar, Odisha, India",
    "Cuttack, Odisha, India", "Rourkela, Odisha, India", "Guwahati, Assam, India", "Shillong, Meghalaya, India",
    "Agartala, Tripura, India", "Imphal, Manipur, India", "Aizawl, Mizoram, India", "Gangtok, Sikkim, India",
    "Itanagar, Arunachal Pradesh, India", "Kohima, Nagaland, India", "Leh, Ladakh, India", "Kargil, Ladakh, India"
]

results = []

print("Fetching coordinates for 86 cities...")
for i, city in enumerate(cities):
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(city)}&format=json&limit=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'KashmirDharmaApp/1.0 (prashant@example.com)'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                lat = round(float(data[0]['lat']), 4)
                lon = round(float(data[0]['lon']), 4)
                results.append(f'    {{ name: "{city}", lat: {lat}, lon: {lon}, tz: 5.5 }},')
                print(f"[{i+1}/{len(cities)}] Success: {city}")
            else:
                print(f"[{i+1}/{len(cities)}] Not found: {city}")
    except Exception as e:
        print(f"[{i+1}/{len(cities)}] Error for {city}: {e}")
    
    # Respect Nominatim's 1 request per second usage policy
    time.sleep(1.1)

with open('new_cities.txt', 'w') as f:
    f.write('\n'.join(results))
print("Done! Saved to new_cities.txt")
