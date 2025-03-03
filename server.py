#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import json

class CoverageDataHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), 'static'), **kwargs)

    def do_GET(self):
        if self.path == '/simplified_coverage_data.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            filepath = os.path.join(os.path.dirname(__file__), 'static', 'simplified_coverage_data.json')
            with open(filepath, 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().do_GET()

def main():
    port = 8301
    server = HTTPServer(('', port), CoverageDataHandler)
    print(f"Server running on http://localhost:{port}")
    server.serve_forever()

if __name__ == "__main__":
    main()
