# Panduan Admin Tria Uma

Panduan ini menjelaskan cara masuk ke `/admin`, mengelola konten situs, mengatur elemen itinerary, dan menggunakan tombol-tombol yang tersedia.

## 1. Masuk ke halaman admin

1. Buka alamat situs diikuti `/admin` (contoh lokal: `http://localhost:4321/admin`).
2. Masukkan email dan password akun admin Supabase.
3. Klik **LOG IN TO DASHBOARD**.
4. Klik ikon mata di kolom password untuk menampilkan atau menyembunyikan password saat mengetik.

Akun admin harus sudah dibuat dan diberi akses admin oleh pengelola Supabase. Jika login gagal, periksa email/password dan konfigurasi Supabase.

## 2. Mengenali bagian dashboard

### Tombol pada header

- **VIEW WEBSITE** — membuka situs utama di tab baru untuk melihat perubahan.
- **PREVIEW PLANNER** — membuka halaman perencana perjalanan di tab baru.
- **LOG OUT** — keluar dari dashboard. Konfirmasi akan muncul sebelum logout.

### Menu utama

- **WEBSITE CONTENT CMS** — mengelola konten dan pengaturan halaman situs.
- **CUSTOM ITINERARY BUILDER** — mengelola pilihan hotel, aktivitas, kendaraan, layanan, dan saran itinerary.
- **SETTINGS & DATA TOOLS** — mengganti password admin, mengekspor atau mengimpor backup, dan mengembalikan konten ke default.

### Tab Website Content CMS

- **Homepage & Hero** — identitas merek, hero homepage, dan pernyataan filosofi homepage.
- **Calendar Events** — acara, tanggal, lokasi, status, dan tautannya.
- **Featured Hotels** — daftar hotel unggulan dan detailnya.
- **Journal Stories** — artikel dan cerita.
- **Signature Plans** — paket atau rencana perjalanan yang ditampilkan situs.
- **Special Offers** — penawaran khusus.
- **Experiences** — pengalaman yang ditampilkan situs serta media hero halaman Experiences.
- **FAQs** — pertanyaan dan jawaban.
- **About & Philosophy** — konten halaman About.
- **Contact Channels** — email reservasi, WhatsApp, telepon, jam operasional, dan alamat.

Tombol **+ ADD ...** muncul untuk koleksi yang mendukung banyak item. Tombol ini tidak muncul pada Homepage & Hero, About & Philosophy, atau Contact Channels karena ketiganya berupa formulir pengaturan tunggal. Pada Featured Hotels dan Experiences, pengaturan media hero halaman berada di atas daftar item; simpan bagian hero dan item secara terpisah.

### Tab Custom Itinerary Builder

- **Itinerary Hotels** — hotel yang dapat dipilih dalam itinerary.
- **Activities** — aktivitas yang dapat dipilih.
- **Chauffeur Vehicles** — kendaraan dan kapasitasnya.
- **Services** — layanan tambahan.
- **Day Suggestions** — saran template aktivitas per hari.
- **+ ADD ELEMENT** — menambahkan item pada tab itinerary yang sedang dipilih.

## 3. Menambah konten

### Menambah item Website Content

1. Buka **WEBSITE CONTENT CMS**, lalu pilih tab koleksi yang ingin diisi.
2. Klik **+ ADD [JENIS ITEM]**.
3. Isi formulir. Kolom bertanda `*` wajib diisi; kolom lainnya bersifat opsional.
4. Klik **Save Changes**. Item baru muncul di urutan paling atas setelah berhasil disimpan.

Kolom yang tersedia bergantung pada jenis konten:

- **FAQ:** Question dan Answer wajib diisi.
- **Calendar Event:** Event Title, Category, Date Display, Location, dan Description wajib diisi. Pilih status Upcoming, Current, atau Past. Image URL, tautan, dan badge bersifat opsional.
- **Featured Hotel:** Hotel Name, Address / Location for Map, dan Description wajib diisi. Slug, kategori, waktu berkendara dari bandara, highlight sekitar, gambar utama, serta foto dan deskripsi fasilitas opsional. Form menyediakan maksimal lima pasangan foto/deskripsi fasilitas.
- **Journal Story:** Title, Description / Excerpt, dan Full Article Body wajib diisi. Pisahkan paragraf artikel dengan satu baris kosong. Slug, kategori, dan gambar opsional.
- **Signature Plans, Special Offers, dan Experiences:** Title dan Description wajib diisi. Slug, Category, dan Image URL opsional.

URL gambar harus berupa URL yang dapat diakses publik. Untuk slug, gunakan teks singkat yang cocok untuk alamat halaman, misalnya `slow-travel-bali`. Jika slug dikosongkan, sistem membuat slug sederhana dari judul; periksa kembali hasilnya agar tidak bentrok dengan item lain.

### Menambah elemen itinerary

1. Buka **CUSTOM ITINERARY BUILDER** dan pilih jenis elemen.
2. Klik **+ ADD ELEMENT**.
3. Isi formulir, kemudian klik **Save Changes**.

Formulir berbeda menurut jenis:

- **Vehicle:** Vehicle Name, Max Pax, Max Luggage, dan Description wajib diisi; Image URL opsional.
- **Activity:** Activity Name dan Description wajib diisi; Category, Duration, Location, dan Image URL opsional.
- **Hotel, Service, dan Day Suggestion:** Name / Title dan Description wajib diisi; Category / Type dan Image URL opsional.

## 4. Mengedit konten

1. Buka tab yang berisi item.
2. Pada kartu item, klik **Edit**.
3. Ubah kolom yang diperlukan. Form akan terisi dengan data saat ini.
4. Klik **Save Changes** untuk menyimpan. Klik **Cancel** atau tombol **×** jika tidak ingin menerapkan perubahan.

Untuk Homepage & Hero, About & Philosophy, dan Contact Channels, edit kolom langsung di formulir lalu klik tombol simpan pada bagian tersebut:

- **SAVE HOMEPAGE CONTENT** — menyimpan branding, teks dan media hero homepage, serta pernyataan filosofi homepage.
- **SAVE ABOUT US CONTENT** — menyimpan judul, subtitle, gambar hero, dan filosofi halaman About.
- **SAVE CONTACT CHANNELS** — menyimpan kanal reservasi dan alamat.
- **Save Hotels Page Hero** / **Save Experience Page Hero** — menyimpan tipe media dan URL gambar/video hero untuk halaman terkait.

Perubahan pada formulir tunggal disimpan saat tombol simpan yang sesuai diklik, tidak melalui **Save Changes** pada jendela item.

## 5. Menghapus konten

1. Temukan kartu item yang ingin dihapus.
2. Klik **Delete**.
3. Pastikan item yang dipilih benar, lalu konfirmasi penghapusan.

Jika memilih batal pada konfirmasi, item tidak dihapus. Penghapusan item tidak memiliki tombol undo; gunakan backup JSON sebelum melakukan perubahan besar.

## 6. Arti tombol pada jendela item

- **×** — menutup jendela editor tanpa menyimpan perubahan yang belum disimpan.
- **Cancel** — menutup jendela editor tanpa menyimpan perubahan yang belum disimpan.
- **Save Changes** — menyimpan item baru atau perubahan pada item yang sedang diedit. Kolom wajib harus valid agar dapat disimpan.
- **Edit** — membuka jendela untuk mengubah item.
- **Delete** — meminta konfirmasi lalu menghapus item.

Pesan notifikasi di pojok halaman menunjukkan apakah penyimpanan berhasil atau gagal. Jika gagal, baca pesan yang muncul, periksa koneksi dan akses admin, lalu coba lagi.

## 7. Settings & Data Tools

- **UPDATE PASSWORD** — mengganti password akun admin yang sedang login. Password baru minimal 8 karakter.
- **EXPORT ALL CONTENT JSON** — mengunduh salinan data CMS, elemen itinerary, dan pengaturan kontak dalam file JSON. Simpan file backup di tempat aman.
- **IMPORT FROM JSON** — memulihkan data dari file JSON backup. Pilih file backup yang valid; bagian yang tersedia di file akan dipulihkan. Pastikan membuat backup kondisi terbaru sebelum mengimpor karena data dapat tertimpa.
- **RESET ALL TO DEFAULTS** — mengembalikan konten situs dan elemen itinerary ke nilai bawaan Tria Uma setelah konfirmasi. Tindakan ini tidak dapat dibatalkan; ekspor backup terlebih dahulu jika ingin menyimpan data saat ini.

## 8. Praktik aman sebelum dan sesudah mengedit

1. Ekspor backup sebelum perubahan besar, impor data, atau reset.
2. Isi kolom dengan informasi yang siap dipublikasikan. Konten yang disimpan dapat tampil pada situs publik.
3. Periksa kembali judul, URL gambar/video, slug, tautan, tanggal, dan ejaan.
4. Setelah menyimpan, gunakan **VIEW WEBSITE** atau **PREVIEW PLANNER** untuk memastikan hasilnya benar.
5. Logout setelah selesai, terutama saat menggunakan perangkat bersama.
