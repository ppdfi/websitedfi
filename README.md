# Website Resmi Pondok Pesantren Darul Fawaid Ilmiyah (PP DFI)

Website profil resmi Pondok Pesantren Darul Fawaid Ilmiyah yang modern, elegan, minimalis, dan ramah pengguna ponsel (mobile-friendly).

---

## 📁 Struktur File Sederhana

Proyek ini telah dibuat sangat ringkas dan mudah dipahami oleh pengembang pemula:

- **`src/pesantrenData.ts`** : **Pusat Data**. Tempat mengubah nomor WhatsApp, link pendaftaran formulir Google Form PSB, teks deskripsi, daftar lembaga, program unggulan, foto galeri, dan prestasi santri.
- **`src/App.tsx`** : **Pusat Tampilan & Komponen**. Berisi seluruh struktur halaman mulai dari Navbar, Hero, Profil, Sejarah, Lembaga, Galeri, Prestasi, Berita, Buku Tamu / Testimoni, Peta Lokasi, hingga Footer.
- **`src/main.tsx`** : Berkas inisialisasi aplikasi React.
- **`src/index.css`** : Berkas konfigurasi styling Tailwind CSS.

---

## 🚀 Panduan Menjalankan & Deploy ke GitHub (Untuk Pemula)

### 1. Menjalankan di Komputer Lokal (Localhost)
```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server lokal
npm run dev
```
Buka browser di `http://localhost:3000` (atau port yang ditampilkan di terminal).

---

### 2. Cara Mengunggah (Push) ke GitHub Branch `main`

Jika Anda baru membuat repositori baru di GitHub:

```bash
git init
git add .
git commit -m "Update website PP DFI modern & responsif"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
git push -u origin main
```

Untuk update selanjutnya kapan pun Anda mengubah teks atau foto:
```bash
git add .
git commit -m "Update informasi pesantren"
git push origin main
```

---

### 3. Cara Deploy Gratis & Otomatis (Tinggal Connect GitHub `main`)

#### Opsi A: Deploy Menggunakan **Vercel** (Paling Mudah, 1 Klik Langsung Aktif)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New..."** -> **"Project"**.
3. Pilih repository website PP DFI Anda.
4. Klik tombol **"Deploy"** (Semua pengaturan otomatis terdeteksi Vite/React).
5. Selesai! Website Anda langsung online dengan domain gratis seperti `ppdfi.vercel.app` (dan otomatis update setiap Anda `git push origin main`).

#### Opsi B: Deploy Menggunakan **GitHub Pages**
1. Buka `package.json`, tambahkan `"homepage": "https://USERNAME.github.io/REPO_NAME"`
2. Jalankan `npm run build` untuk menghasilkan folder `dist`.
3. Pada tab **Settings** -> **Pages** di repositori GitHub Anda, pilih sumber deploy **GitHub Actions** (pilih template *Static HTML / Vite*).
