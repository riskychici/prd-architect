# PRD Architect Pro

> **Satu Alat untuk Semua Kebutuhan Spesifikasi Produk**  
> Platform perancang *Product Requirement Document* (PRD) interaktif berbasis React untuk membantu Product Manager, System Analyst, dan Software Architect menyusun dokumen spesifikasi teknis dan bisnis secara terstruktur dan efisien.

[![Version](https://img.shields.io/badge/version-3.1-blue.svg?style=flat-square)](https://github.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](./LICENSE)

---

## Preview Aplikasi

| Single Editor View | Live PRD Preview |
| :---: | :---: |
| *[ Sisipkan Screenshot Panel Editor di Sini ]* | *[ Sisipkan Screenshot Preview Dokumen di Sini ]* |

---

## Ringkasan Fitur

PRD Architect Pro dirancang untuk memangkas waktu pengerjaan dokumentasi produk tanpa mengorbankan kualitas spesifikasi teknis. Aplikasi ini menjembatani ideasi bisnis dengan kebutuhan implementasi teknis lewat dua alur kerja terpisah:

* **Mode Simple MVP:** Berfokus pada komponen esensial (*Problem Statement*, *Core Features*, *High-level Flow*) untuk percepatan fase *prototyping* atau proyek skala kecil.
* **Mode Enterprise:** Menyediakan modul dokumentasi mendalam termasuk *Persona Matrix*, *Design System Standard*, *Role & Permission Matrix*, *Schema Data*, *Acceptance Criteria*, hingga *Non-Functional Requirements (NFR)* dan *Risk Analysis*.

---

## Fitur Unggulan

### Fleksibilitas & Kustomisasi
* **Dynamic Section Toggling:** Aktifkan modul Enterprise secara parsial di Mode Simple tanpa perlu mengubah struktur dokumen secara keseluruhan.
* **Live Side-by-Side Preview:** Render dokumen secara *real-time* saat pengisian data.

### Editor & Manajemen Data
* **Data Schema & Architecture Mapping:** Tentukan entitas data, relasi, tipe data, dan dependensi sistem secara eksplisit.
* **State Persistence & History:** Dilengkapi fitur *Auto-save* ke `localStorage` serta *Undo/Redo stack* hingga 50 riwayat perubahan.
* **Integrated Sample Data:** Lakukan eksplorasi fitur secara cepat menggunakan preset data bawaan (*Prime Property Case Study*).

### Interoperabilitas Multi-Format
* **Export & Import JSON:** Simpan berkas mentah untuk kebutuhan *backup* atau kolaborasi antar anggota tim.
* **Markdown Generator:** Salin format Markdown siap pakai untuk diintegrasikan ke Notion, GitHub, atau Jira.
* **A4 Print Engine:** Layout teroptimasi khusus untuk cetak langsung atau *Export to PDF* dengan tampilan korporat yang rapi.

---

## Stack Teknologi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | Library utama antarmuka komponen |
| **Build Tooling** | Vite 8 | Transpiler dan *dev server* berkecepatan tinggi |
| **Styling Engine** | Tailwind CSS 4 | *Utility-first CSS framework* untuk desain responsif |
| **State Management** | Zustand 5 | Manajemen state global yang ringan dan terprediksi |
| **Icons & Media** | Font Awesome 7 | Set ikon grafis untuk navigasi UI |
| **Utilities** | Lodash, File-Saver | Manipulasi data, manajemen *history*, dan penanganan ekspor berkas |

---

## Panduan Memulai (*Quick Start*)

### Prasyarat Sistem
* **Node.js**: v18.0.0 atau versi terbaru
* **Package Manager**: `npm` v9+ atau `yarn` / `pnpm`

### Langkah Instalasi

1. **Clone repositori:**
   ```bash
   git clone https://github.com/username/prd-architect-pro.git
   cd prd-architect-pro
   ```

2. **Pasang dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Akses aplikasi pada peramban melalui alamat `http://localhost:5173`.

4. **Kompilasi untuk Production:**
   ```bash
   npm run build
   ```
   Aset hasil kompilasi akan tersimpan pada direktori `/dist`.

---

## Struktur Direktori Proyek

```bash
prd-architect-pro/
├── src/
│   ├── components/
│   │   ├── editor/          # Panel kontrol dan pengisian formulir
│   │   │   └── sections/    # Komponen formulir spesifik per modul
│   │   ├── header/          # Header utama, status indicator, & mode switcher
│   │   ├── mobile/          # Modul responsif dan gesture navigation
│   │   ├── preview/         # Visualizer dokumen live-preview
│   │   │   └── sections/    # Komponen renderer dokumen spesifik
│   │   └── shared/          # UI Kit reusable (Input, Modal, Button)
│   ├── hooks/               # Custom hooks (Auto-save, History management)
│   ├── services/            # Modul parser Markdown, PDF, dan File I/O
│   ├── store/               # Zustand Central Store & State Mutator
│   ├── styles/              # Design tokens dan Tailwind directives
│   ├── utils/               # Form validator, formatter, dan mock constants
│   ├── App.jsx              # Application Layout Shell
│   └── main.jsx             # Entry point React DOM
├── public/                  # Aset statis & manifes
└── package.json             # Dependensi dan skrip proyek
```

---

## Pintasan Board (Keyboard Shortcuts)

| Kombinasi Tombol | Aksi |
| :--- | :--- |
| `Ctrl` + `Z` | Batalkan perubahan terakhir (*Undo*) |
| `Ctrl` + `Y` | Ulangi perubahan (*Redo*) |
| `Ctrl` + `Shift` + `Z` | Alternatif *Redo* |

---

## Kontribusi

Aplikasi ini bersifat terbuka untuk pengembang dan praktisi manajemen produk. Jika Anda ingin berkontribusi:

1. Lakukan **Fork** pada repositori ini.
2. Buat *feature branch* baru (`git checkout -b feature/FiturBaru`).
3. Simpan perubahan Anda (`git commit -m 'feat: menambahkan modul export baru'`).
4. Unggah ke branch Anda (`git push origin feature/FiturBaru`).
5. Buat **Pull Request** baru untuk ditinjau.

---

## Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT**. Silakan merujuk ke berkas [LICENSE](./LICENSE) untuk informasi selengkapnya.

---

<p align="center">
  Didesain untuk efisiensi tim produk modern. Dipelihara oleh komunitas open-source.
</p>
