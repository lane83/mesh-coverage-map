// Specify the node ID to show coverage from
const fromId = '!6c72fbfc';

// Initialize the map centered on a default location
const map = L.map('map').setView([42.2808, -83.7430], 13); // Ann Arbor coordinates

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Initialize coverage layer group
let coverageLayer = L.layerGroup().addTo(map);

// Function to get color and opacity based on signal strength
function getSignalStyle(signal) {
    // Signal strength is typically negative, lower absolute value is better
    // Typical range: -40 (excellent) to -120 (very poor)
    let color, opacity;
    
    if (signal >= -65) {
        color = '#4CAF50';      // Strong: Green
        opacity = 0.4;
    } else if (signal >= -85) {
        color = '#2196F3';      // Good: Blue
        opacity = 0.35;
    } else if (signal >= -100) {
        color = '#FFC107';      // Fair: Yellow
        opacity = 0.3;
    } else {
        color = '#F44336';      // Poor: Red
        opacity = 0.25;
    }

    return { color, opacity };
}

// Function to update the coverage visualization
function updateCoverage(points) {
    // Clear existing coverage
    coverageLayer.clearLayers();

    // Add coverage circles for each point
    points.forEach(point => {
        // Calculate radius based on signal strength
        // Better signal = larger coverage area
        const baseRadius = 300; // Base radius in meters
        const signalFactor = Math.max(0, Math.min(1, (point.signal + 120) / 80)); // Normalize -120 to -40 to 0-1
        const radius = baseRadius * (0.5 + signalFactor); // Radius varies from 50% to 100% of base

        const style = getSignalStyle(point.signal);
        
        // Create main coverage circle
        L.circle([point.lat, point.lng], {
            radius: radius,
            color: style.color,
            fillColor: style.color,
            fillOpacity: style.opacity,
            weight: 0.5,
            opacity: 0.8
        }).addTo(coverageLayer);
        
        // Add inner circle for visual effect
        L.circle([point.lat, point.lng], {
            radius: radius * 0.3,
            color: style.color,
            fillColor: style.color,
            fillOpacity: style.opacity * 1.5,
            weight: 0.5,
            opacity: 0.8
        }).addTo(coverageLayer);
    });

    // Update last updated timestamp
    if (points.length > 0) {
        const lastUpdate = new Date().toLocaleString();
        document.getElementById('lastUpdate').textContent = lastUpdate;
    }
}

// Function to fetch and update coverage data
async function fetchCoverageData() {
    try {
        const response = await fetch(`/data?fromId=${fromId}`);
        const data = await response.json();
        
        if (data.points && data.points.length > 0) {
            updateCoverage(data.points);
            
            // Fit map bounds to data points
            const bounds = L.latLngBounds(data.points.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds);
        }
    } catch (error) {
        console.error('Error fetching coverage data:', error);
    }
}

// Initial data fetch with fromId
fetchCoverageData();

// Fetch new data every 5 seconds
setInterval(fetchCoverageData, 5000);
