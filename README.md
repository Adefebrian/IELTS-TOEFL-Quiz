# 🎓 IELTS/TOEFL Quiz Practice Application

Aplikasi latihan soal IELTS/TOEFL dengan dua mode: **Web Application** dan **Terminal Application**. Aplikasi ini membantu kamu berlatih grammar, reading, dan vocabulary dengan sistem tracking progress yang terintegrasi.

**Created by brian**

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Struktur File](#-struktur-file)
- [Cara Menggunakan - Web Application](#-cara-menggunakan---web-application)
- [Cara Menggunakan - Terminal Application](#-cara-menggunakan---terminal-application)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur

- ✅ **4000+ Soal Latihan** dari berbagai kategori (Grammar, Reading, Vocabulary)
- ✅ **Progress Tracking** - Simpan progress yang sudah dikerjakan
- ✅ **Dua Mode Latihan**:
  - **Mulai Latihan**: Soal yang belum pernah dikerjakan
  - **Latihan Ulang**: Soal yang sudah pernah dikerjakan
- ✅ **Penjelasan Lengkap** - Setiap jawaban dilengkapi dengan penjelasan
- ✅ **Modern UI** - Interface yang user-friendly dan responsive
- ✅ **Dua Versi**: Web Application dan Terminal Application

---

## 📁 Struktur File

```
PY IELTS/
├── index.html          # File HTML utama (Web Application)
├── css/                # Folder berisi file CSS
│   └── styles.css      # File CSS untuk styling
├── js/                 # Folder berisi file JavaScript
│   ├── config.js       # Konfigurasi global dan state
│   ├── utils.js        # Utility functions
│   ├── storage.js      # LocalStorage functions
│   ├── loader.js       # Load questions dari CSV
│   ├── progress.js      # Progress tracking functions
│   ├── stats.js        # Statistics dan chart functions
│   ├── quiz.js         # Quiz logic (display, submit, etc)
│   ├── measurement.js  # Measurement modal functions
│   └── main.js         # Initialization
├── data/               # Folder berisi data CSV
│   ├── quiz_batch1_2000.csv # File CSV berisi 2000 soal pertama
│   └── quiz_batch2_2000.csv # File CSV berisi 2000 soal kedua
├── server.py           # Server HTTP untuk menjalankan web app
├── quiz_app.py         # Aplikasi terminal/command-line
├── quiz_state.json     # File untuk menyimpan progress (terminal version)
└── README.md           # File dokumentasi ini
```

---

## 🌐 Cara Menggunakan - Web Application

### Prasyarat

- Python 3.x terinstall di komputer kamu
- Web browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet (untuk load library eksternal)

### Langkah-langkah

#### 1. Buka Terminal/Command Prompt

Buka terminal atau command prompt di folder project ini.

#### 2. Jalankan Server HTTP

Jalankan salah satu perintah berikut:

**Opsi 1: Menggunakan server.py (Recommended)**
```bash
python3 server.py
```

**Opsi 2: Menggunakan Python Built-in Server**
```bash
python3 -m http.server 8000
```

**Opsi 3: Menggunakan Node.js (jika terinstall)**
```bash
npm install -g http-server
http-server -p 8000
```

#### 3. Buka Browser

Setelah server berjalan, buka browser dan akses:

```
http://localhost:8000/index.html
```

Server akan otomatis membuka browser jika menggunakan `server.py`.

#### 4. Mulai Latihan

1. **Mulai Latihan** - Klik card "Mulai Latihan" untuk mengerjakan soal yang belum pernah dikerjakan
2. **Latihan Ulang** - Klik card "Latihan Ulang" untuk mengulang soal yang sudah pernah dikerjakan
3. **Reset Progress** - Klik tombol "Reset" jika ingin menghapus semua progress dan mulai dari awal

#### 5. Menggunakan Quiz

- Pilih jawaban dengan mengklik salah satu pilihan (A, B, C, atau D)
- Klik "Submit Jawaban" untuk melihat hasil
- Setelah submit, kamu akan melihat:
  - ✅ Jawaban benar/salah
  - 📝 Jawaban yang kamu pilih
  - ✅ Jawaban yang benar
  - 💡 Penjelasan lengkap
- Klik "Soal Berikutnya" untuk lanjut ke soal berikutnya

### ⚠️ Catatan Penting

- **Server harus tetap berjalan** saat kamu menggunakan aplikasi
- **Progress disimpan permanen** di browser (localStorage), jadi akan tetap tersimpan meskipun:
  - Browser ditutup
  - Server direstart
  - Komputer direstart
- Progress hanya akan hilang jika:
  - Cache browser dibersihkan secara manual
  - Browser dalam mode incognito/private (beberapa browser)
  - User melakukan reset progress melalui aplikasi
- Untuk menghentikan server, tekan `Ctrl+C` di terminal

---

## 💻 Cara Menggunakan - Terminal Application

### Prasyarat

- Python 3.x terinstall di komputer kamu
- Terminal/Command Prompt

### Langkah-langkah

#### 1. Buka Terminal/Command Prompt

Buka terminal atau command prompt di folder project ini.

#### 2. Jalankan Aplikasi

```bash
python3 quiz_app.py
```

atau

```bash
python quiz_app.py
```

#### 3. Menu Utama

Setelah aplikasi berjalan, kamu akan melihat menu:

```
==================================================
     LATIHAN IELTS/TOEFL QUIZ
==================================================
Progress: X/4000 soal telah dikerjakan

1. Mulai latihan (soal yang belum dikerjakan)
2. Latihan yang sudah dikerjakan
3. Reset status semua soal
0. Keluar
==================================================
```

#### 4. Pilih Menu

- **Pilihan 1**: Mulai latihan soal yang belum pernah dikerjakan
- **Pilihan 2**: Latihan ulang soal yang sudah pernah dikerjakan
- **Pilihan 3**: Reset semua progress dan mulai dari awal
- **Pilihan 0**: Keluar dari aplikasi

#### 5. Mengerjakan Soal

Setelah memilih menu 1 atau 2, aplikasi akan menampilkan soal:

```
======================================================================
ID: 1234 | Kategori: grammar
======================================================================

[Pertanyaan akan ditampilkan di sini]

----------------------------------------------------------------------
A. [Pilihan A]
B. [Pilihan B]
C. [Pilihan C]
D. [Pilihan D]
----------------------------------------------------------------------

Jawaban kamu (A/B/C/D):
```

Ketik huruf jawaban (A, B, C, atau D) lalu tekan Enter.

#### 6. Melihat Hasil

Setelah menjawab, aplikasi akan menampilkan:

```
======================================================================
✅ BENAR!  (atau ❌ SALAH!)

Jawaban kamu: A
Jawaban yang benar: B — [Jawaban yang benar]

💡 Penjelasan:
[Penjelasan lengkap akan ditampilkan di sini]
======================================================================

Lanjut ke soal berikutnya? (y/n):
```

- Ketik `y` untuk lanjut ke soal berikutnya
- Ketik `n` untuk kembali ke menu utama

### 💾 Penyimpanan Progress

Progress disimpan di file `quiz_state.json` di folder yang sama dengan aplikasi. File ini akan otomatis dibuat saat pertama kali menjawab soal.

---

## 🔧 Troubleshooting

### Web Application

#### Problem: File CSV tidak terbaca

**Solusi:**
1. Pastikan server HTTP sedang berjalan
2. Pastikan kamu membuka melalui `http://localhost:8000/index.html` (bukan `file://`)
3. Pastikan file CSV ada di folder `data/`:
   - `data/quiz_batch1_2000.csv`
   - `data/quiz_batch2_2000.csv`
4. Cek Console browser (F12) untuk melihat error detail

#### Problem: Server tidak bisa dijalankan

**Solusi:**
1. Pastikan Python 3 terinstall: `python3 --version`
2. Pastikan port 8000 tidak digunakan aplikasi lain
3. Coba gunakan port lain: `python3 -m http.server 8080`
4. Buka browser ke port yang sesuai: `http://localhost:8080/index.html`

#### Problem: Progress hilang setelah refresh

**Solusi:**
- Progress sekarang disimpan di localStorage, jadi seharusnya **tidak hilang** setelah refresh
- Jika progress masih hilang, kemungkinan:
  - Browser dalam mode incognito/private (beberapa browser membatasi localStorage)
  - Cache browser dibersihkan
  - Browser setting yang membatasi localStorage
- Cek di Console browser (F12) untuk melihat apakah localStorage berfungsi

### Terminal Application

#### Problem: File CSV tidak ditemukan

**Solusi:**
1. Pastikan file CSV ada di folder `data/`:
   - `data/quiz_batch1_2000.csv`
   - `data/quiz_batch2_2000.csv`
2. Pastikan nama file tepat
3. Pastikan kamu menjalankan aplikasi dari folder root (bukan dari dalam folder data/)

#### Problem: Error saat menjalankan aplikasi

**Solusi:**
1. Pastikan Python 3 terinstall: `python3 --version`
2. Pastikan semua file CSV ada dan tidak corrupt
3. Cek error message untuk detail lebih lanjut

#### Problem: Progress tidak tersimpan

**Solusi:**
1. Pastikan folder memiliki permission untuk write file
2. Pastikan tidak ada aplikasi lain yang menggunakan `quiz_state.json`
3. Cek apakah file `quiz_state.json` dibuat di folder yang sama

---

## 📝 Format File CSV

File CSV harus memiliki format berikut:

```csv
id,category,question,option_a,option_b,option_c,option_d,correct_letter,correct_answer,explanation_id
1,grammar,"Question text here?","Option A","Option B","Option C","Option D","A","Correct answer text","Explanation text here"
```

**Kolom yang diperlukan:**
- `id`: Nomor ID soal (integer)
- `category`: Kategori soal (grammar, reading, vocabulary)
- `question`: Teks pertanyaan
- `option_a`, `option_b`, `option_c`, `option_d`: Pilihan jawaban
- `correct_letter`: Huruf jawaban yang benar (A, B, C, atau D)
- `correct_answer`: Teks jawaban yang benar
- `explanation_id`: Penjelasan lengkap untuk jawaban

---

## 🎯 Tips Penggunaan

1. **Rutin Latihan**: Coba latihan setiap hari untuk hasil terbaik
2. **Review Soal Salah**: Gunakan fitur "Latihan Ulang" untuk review soal yang salah
3. **Baca Penjelasan**: Selalu baca penjelasan setelah menjawab, bahkan jika jawabanmu benar
4. **Track Progress**: Monitor progress kamu di header aplikasi web atau menu utama terminal

---

## 📞 Support

Jika ada masalah atau pertanyaan, pastikan:
1. Semua file ada di folder yang sama
2. Python 3 terinstall dengan benar
3. File CSV tidak corrupt
4. Port 8000 tidak digunakan aplikasi lain (untuk web app)

---

**Selamat berlatih dan semoga sukses dengan IELTS/TOEFL kamu! 🎉**

*Created by brian*

