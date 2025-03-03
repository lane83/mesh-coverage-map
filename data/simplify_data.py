import json

def simplify_coverage_data(input_file, output_file, grid_size=0.001):
    """
    Simplifies coverage data by averaging signal strengths within a grid.

    Args:
        input_file (str): Path to the input JSON file.
        output_file (str): Path to the output JSON file.
        grid_size (float): Size of the grid cells in degrees.
    """
    with open(input_file, 'r') as f:
        data = json.load(f)

    points = data['points']
    grid = {}

    for point in points:
        lat = point['lat']
        lng = point['lng']
        signal = point['signal']

        # Calculate grid cell coordinates
        grid_lat = round(lat / grid_size) * grid_size
        grid_lng = round(lng / grid_size) * grid_size
        grid_key = (grid_lat, grid_lng)

        if grid_key not in grid:
            grid[grid_key] = {
                'lat': grid_lat,
                'lng': grid_lng,
                'signal_sum': 0,
                'count': 0
            }

        grid[grid_key]['signal_sum'] += signal
        grid[grid_key]['count'] += 1

    # Calculate average signal strength for each grid cell
    simplified_data = []
    for grid_key, grid_data in grid.items():
        avg_signal = grid_data['signal_sum'] / grid_data['count']
        simplified_data.append({
            'latitude': grid_data['lat'],
            'longitude': grid_data['lng'],
            'signal_strength': avg_signal
        })

    with open(output_file, 'w') as f:
        json.dump(simplified_data, f, indent=2)

if __name__ == "__main__":
    input_file = 'coverage_data.json'
    output_file = '../static/simplified_coverage_data.json'
    simplify_coverage_data(input_file, output_file)
