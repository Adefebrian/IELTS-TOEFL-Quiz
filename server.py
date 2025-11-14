#!/usr/bin/env python3
"""
Simple HTTP Server untuk menjalankan IELTS/TOEFL Quiz
Jalankan script ini, lalu buka browser ke http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Tambahkan CORS headers untuk memungkinkan fetch dari localhost
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Pastikan kita di direktori yang benar
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print("🚀 Server HTTP sedang berjalan!")
        print("=" * 60)
        print(f"\n📖 Buka browser ke: {url}")
        print(f"\n⏹️  Tekan Ctrl+C untuk menghentikan server\n")
        print("=" * 60)
        
        # Buka browser otomatis
        try:
            webbrowser.open(url)
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server dihentikan. Sampai jumpa!")

if __name__ == "__main__":
    main()

