// Initialize the map
var map = L.map('map').setView([42.2564, -84.4169], 16); // Center on coverage area

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to calculate distance between two points in miles
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Fetch the coverage data
fetch('/simplified_coverage_data.json')
    .then(response => response.json())
    .then(data => {
        // Filter out the southern dataset that had location obfuscation
        data = data.filter(point => point.latitude > 42.25);
        
        // Create a denser grid of points for smoother coverage visualization
        const coveragePoints = [];
        const gridSpacing = 0.0005; // Approximately 0.05 mile grid for better accuracy
        
        // Find bounds of data
        const bounds = data.reduce((acc, point) => ({
            minLat: Math.min(acc.minLat, point.latitude),
            maxLat: Math.max(acc.maxLat, point.latitude),
            minLon: Math.min(acc.minLon, point.longitude),
            maxLon: Math.max(acc.maxLon, point.longitude)
        }), {
            minLat: Infinity,
            maxLat: -Infinity,
            minLon: Infinity,
            maxLon: -Infinity
        });
        
        // Extend bounds by quarter mile
        const latOffset = 0.0035; // Approximately quarter mile in latitude
        const lonOffset = 0.0035; // Approximately quarter mile in longitude
        bounds.minLat -= latOffset;
        bounds.maxLat += latOffset;
        bounds.minLon -= lonOffset;
        bounds.maxLon += lonOffset;

        // Create grid points and check if they're within half mile of any data point
        for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSpacing) {
            for (let lon = bounds.minLon; lon <= bounds.maxLon; lon += gridSpacing) {
                // Check if this grid point is within half mile of any data point
                const isInCoverage = data.some(point => 
                    calculateDistance(lat, lon, point.latitude, point.longitude) <= 0.25
                );
                
                if (isInCoverage) {
                    coveragePoints.push([lat, lon, 1]); // Full intensity for covered areas
                }
            }
        }

        // Create the heatmap layer with simplified settings for coverage area
        var heat = L.heatLayer(coveragePoints, {
            radius: 25,    // Smaller radius for more precise coverage
            blur: 15,      // Less blur for clearer boundaries
            maxZoom: 17,
            gradient: {
                0.4: '#4CAF50',  // Solid green for coverage area
                1.0: '#4CAF50'   // Same color to show binary coverage
            },
            minOpacity: 0.4
        }).addTo(map);

        // Fit map to coverage bounds
        map.fitBounds([
            [bounds.minLat, bounds.minLon],
            [bounds.maxLat, bounds.maxLon]
        ]);
    })
    .catch(error => console.error('Error loading coverage data:', error));
