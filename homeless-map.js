// Initialize the map
var map = L.map('map').setView([20, 0], 2); // Centered on the world

// Load base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example homelessness data by country (ISO country codes)
var homelessnessData = {
    "USA": 550000,
    "CAN": 235000,
    "IND": 1800000,
    "BRA": 1000000,
    "AUS": 116000,
    "GBR": 320000,
    "FRA": 300000
};

// Function to get color based on homeless population
function getColor(d) {
    return d > 1000000 ? '#800000' :
           d > 500000  ? '#B22222' :
           d > 100000  ? '#DC143C' :
           d > 50000   ? '#FF4500' :
                         '#FFA07A';
}

// Load GeoJSON country borders
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
        L.geoJson(data, {
            style: function(feature) {
                var countryCode = feature.properties.iso_a3; // Get ISO country code
                var homelessCount = homelessnessData[countryCode] || 0;
                return {
                    fillColor: getColor(homelessCount),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                var countryCode = feature.properties.iso_a3;
                var homelessCount = homelessnessData[countryCode] || "Data not available";
                layer.bindPopup(`<strong>${feature.properties.name}</strong><br>Homeless: ${homelessCount.toLocaleString()}`);
            }
        }).addTo(map);
    });
