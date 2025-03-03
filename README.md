# Mesh Coverage Map

A visualization tool for Meshtastic mesh network coverage data. This tool provides two different visualization options for understanding and analyzing your mesh network's coverage area.

## Requirements

### Hardware
- Meshtastic-compatible radio device connected via USB
- Computer running Linux, macOS, or Windows

### Software Dependencies
- Python 3.x
- Web browser with JavaScript enabled
- Python packages:
  - `http.server` (standard library)
  - `json` (standard library)

### Frontend Dependencies (automatically loaded from CDN)
- Leaflet.js (v1.9.4)
- Leaflet.heat plugin
- OpenStreetMap tiles

## Meshtastic Configuration

Before using this tool, ensure your Meshtastic radios are properly configured:

1. **Channel Encryption**
   - Enable encryption on the public channel (Channel 0)
   - Use at least 128-bit encryption
   - All nodes must use the same encryption settings

2. **Location Settings**
   - Enable precise location under Channel 0 settings
   - Configure this setting on all nodes you want included in the coverage map

## Visualization Options

### 1. Binary Coverage Map (coverage_map.html)
- Shows coverage as a binary "covered/not covered" visualization
- Areas within 0.25 miles of any data point are shown as covered
- Uses a green heatmap to indicate coverage areas
- Best for understanding overall coverage boundaries

### 2. Signal Strength Map (index.html)
- Displays coverage points with color-coded circles
- Signal strength indicators:
  - Green: Strong signal (-65 dBm or better)
  - Blue: Good signal (-85 to -65 dBm)
  - Yellow: Fair signal (-100 to -85 dBm)
  - Red: Poor signal (below -100 dBm)
- Updates dynamically every 5 seconds
- Best for detailed signal strength analysis

## Running the Server

1. Clone this repository
2. Connect your Meshtastic radio via USB
3. Run the server:
   ```bash
   python3 server.py
   ```
4. Open one of the visualization options in your web browser:
   - Binary Coverage Map: http://localhost:8301/coverage_map.html
   - Signal Strength Map: http://localhost:8301/index.html

## Python Scripts

### server.py
- Simple HTTP server that serves the static files
- Provides access to the simplified coverage data
- Runs on port 8301 by default
- Serves files from the static directory

### simplify_data.py
- Processes raw coverage data into a simplified format
- Averages signal strengths within a grid
- Reduces data points while maintaining coverage accuracy
- Creates simplified_coverage_data.json for visualization

## Privacy Considerations

The coverage data files contain real GPS coordinates. If you plan to share this project or push it to a public repository:

1. Consider whether you want to share your actual location data
2. You may want to:
   - Remove the data files from version control
   - Add data files to .gitignore
   - Create sample data files with anonymized coordinates

## Data Collection

The system collects the following data points:
- Latitude and longitude
- Signal strength (in dBm)
- Signal-to-noise ratio (SNR)
- Altitude
- Timestamp
- Node ID

This data is processed and visualized to help you understand your mesh network's coverage area and identify potential gaps or weak spots in coverage.
