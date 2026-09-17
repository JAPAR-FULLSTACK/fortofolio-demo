# Fortofolio

Portofolio tim (Raffa, Jesika, Susan, Arya, Rasya) yang dibangun dengan
**Next.js 16 (App Router) + Tailwind CSS 4**. Desainnya bergaya editorial
"kertas & tinta" dengan palet senja, aurora blobs, animasi scroll-reveal,
dan marquee — bukan template AI generik.

## ✨ Fitur

- **Beranda publik** — hero dengan statistik, chip anggota tim, daftar
  project bergaya kartu, arsip sertifikat, dan footer kontak.
- **Halaman detail project** (`/projects/[slug]`) — screenshot, deskripsi,
  tag, tombol **Buka demo live ↗**, link repo, dan **preview iframe** demo.
- **Panel admin** (`/admin`) — upload project & sertifikat (dengan file),
  kartu statistik, daftar item dengan thumbnail, hapus item, dan tombol keluar.
- **Sistem login** (`/login`) — session cookie httpOnly bertanda tangan
  HMAC-SHA256, berlaku 7 hari, tanpa database.
- **Penyimpanan file** — gambar/PDF tersimpan di `data/uploads/` dan disajikan
  lewat `/api/files/[name]` (validasi tipe & ukuran, maksimal 8 MB).
- **Desain & animasi** — aurora blobs, gradien beranimasi, scroll reveal,
  marquee, progress bar scroll, plus dukungan `prefers-reduced-motion`.

## 🚀 Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Halaman penting:

| Rute | Fungsi |
| --- | --- |
| `/` | Beranda portofolio |
| `/projects/[slug]` | Detail project + demo live |
| `/admin` | Panel kelola (wajib login) |
| `/login` | Masuk ke panel |

## 🔐 Kredensial Admin

Default: username **`admin`**, password **`admin`**.

Sangat disarankan menggantinya lewat file `.env.local` (tidak di-commit):

```env
AUTH_USERNAME=admin
AUTH_PASSWORD=password-anda
AUTH_SECRET=kunci-rahasia-panjang-bebas
```

> `AUTH_SECRET` wajib diset di produksi. Kalau kosong, dipakai kunci
> cadangan yang hanya stabil selama satu proses server hidup — semua
> session hangus setiap server restart.

## 📤 Mengunggah Project / Sertifikat

1. Buka `/login`, masuk dengan kredensial admin.
2. Di `/admin`, pilih tab **＋ Project** atau **＋ Sertifikat**.
3. Isi form (judul & deskripsi wajib untuk project; judul & penerbit untuk
   sertifikat), lampirkan screenshot/PDF bila ada.
4. Simpan — item langsung tampil di beranda.
5. Untuk project, isi **URL demo live** agar tombol *"Buka demo live"* dan
   preview iframe muncul di halaman detailnya.

Format file: JPG, PNG, WebP, AVIF, GIF, PDF — maksimal **8 MB** per file.
Data tersimpan di `data/portfolio.json`, file di `data/uploads/`
(keduanya dibuat otomatis dan tidak perlu di-commit).

## 🛠 Teknologi

- [Next.js 16](https://nextjs.org/docs) (App Router, Server Actions)
- [Tailwind CSS 4](https://tailwindcss.com)
- Font: Bricolage Grotesque, Atkinson Hyperlegible, IBM Plex Mono
- Penyimpanan JSON lokal (`data/`) — siap diganti database bila perlu

## 📜 Skrip

```bash
npm run dev     # server pengembangan
npm run build   # build produksi
npm run start   # jalankan hasil build
npm run lint    # eslint
```
