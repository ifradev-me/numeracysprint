# EduSpark v2: Isi, Copywriting, dan UI/UX

Spesifikasi ini menggantikan dokumen v1. Isinya tiga bagian terpisah: **Isi** (konteks, konten, fitur), **Copywriting**, dan **UI/UX**.

> **Status:** Prototipe aktif — React + Tailwind, Netlify Functions + Netlify DB, branch `v2-rework`.

## Ringkasan perubahan dari v1

| # | Perubahan |
|---|---|
| 1 | Paket jadi 4: **Gratis** + 3 berbayar (1 bulan Rp20.000, 3 bulan Rp50.000, 1 tahun Rp200.000) |
| 2 | **FAQ dihapus** |
| 3 | **Tutor diganti Admin** |
| 4 | Tiga kartu bukan lagi "materi" (Aljabar/Geometri/Statistika), tetapi **3 mata pelajaran** (subtes) |
| 5 | **Try Out khusus bagian matematika UTBK** (PK, PM, dan penalaran kuantitatif), **dengan timer 2 menit per soal** |
| 6 | **Uji coba materi**: gratis = sebagian, berbayar = penuh |
| 7 | "Latihan soal interaktif" **dihapus dari daftar paket**, karena latihan sudah termasuk di Try Out UTBK |
| 8 | Paket gratis berisi: uji coba materi matematika, soal evaluasi kemampuan, progress belajar |
| 9 | **UI:** dari pink + skeuomorphism menjadi **neumorphism**, pink **terang**, aksen **teal gelap** |
| 10 | **Semua emoji/icon** diganti Phosphor Icons SVG (`@phosphor-icons/react`) |
| 11 | **Penyimpanan:** localStorage → **Netlify Functions + Netlify DB** (data persisten lintas device) |
| 12 | **Status paket siswa** dikelola manual oleh admin (toggle di Admin Dashboard) |
| 13 | **Tambah halaman HomePage** (landing sebelum login), struktur tetap **React Router multi-page** |

---

# BAGIAN 1: ISI

## 1.1 Konteks

| Aspek | Keterangan |
|---|---|
| **Produk** | EduSpark, platform belajar matematika untuk UTBK-SNBT |
| **Target** | Siswa yang mempersiapkan UTBK-SNBT |
| **Model bisnis** | Freemium: paket gratis + 3 paket langganan |
| **Proposisi nilai** | Latihan terarah per subtes matematika, try out ber-timer, dan progress yang terpantau |
| **Bahasa** | Indonesia |
| **Status** | Prototipe aktif: React + Tailwind, Netlify Functions + Netlify DB, branch `v2-rework` |

**Acuan struktur UTBK-SNBT 2026** (dari sumber publik; cek portal resmi SNPMB sebelum dipakai sebagai klaim):
- Tujuh subtes dalam dua komponen: Tes Potensi Skolastik dan Tes Literasi. Total durasi 195 menit.
- Subtes yang berhubungan dengan matematika:
  - **Pengetahuan Kuantitatif (PK):** 20 soal (beberapa sumber menulis 15–20).
  - **Penalaran Matematika (PM):** 20 soal.
  - **Penalaran Kuantitatif:** bagian dari Penalaran Umum, 10 soal.
- **Durasi per subtes berbeda antar sumber** (PK 20–25 menit, PM 25–42,5 menit). Jangan menulis angka resmi di halaman sebelum dicek ke SNPMB.

## 1.2 Konten

### Struktur app (multi-page, React Router)

| Route | Halaman | Akses | Isi |
|---|---|---|---|
| `/` | **HomePage** | Publik | Landing: hero, mata pelajaran, paket, kontak admin |
| `/login` | **LoginPage** | Publik | Form nama siswa, redirect ke dashboard |
| `/dashboard` | **DashboardPage** | Login | Sapaan, kartu navigasi ke semua halaman |
| `/diagnostic` | **DiagnosticPage** | Login | "Evaluasi Kemampuan" — 3 soal, skor, level |
| `/materi` | **MicrolearningPage** | Login | Accordion materi PK/PM/PKu, paywall |
| `/tryout` | **TryOutPage** | Login | Try Out ber-timer 2 menit/soal, navigasi, skor |
| `/tentang` | **AboutPage** | Login | Info tim & platform |
| `/admin` | **AdminPage** | Admin | Dashboard admin |
| `/admin/users` | **AdminUsers** | Admin | Daftar siswa + toggle status paket (Gratis/Berbayar) |
| `/admin/materials` | **AdminMaterials** | Admin | CRUD materi microlearning |
| `/admin/exercises` | **AdminExercises** | Admin | CRUD soal try out + import CSV |

### Struktur HomePage (landing, sebelum login)

| # | Section | Isi |
|---|---|---|
| 1 | Navbar | Logo EduSpark, tombol Masuk → `/login` |
| 2 | Hero | Badge UTBK-SNBT, headline, deskripsi, 2 CTA, panel progress demo |
| 3 | Mata Pelajaran | 3 kartu PK/PM/PKu + tombol uji coba materi (sebagian gratis) |
| 4 | Try Out Preview | Teaser fitur timer (ilustrasi) |
| 5 | Paket | 4 kartu paket Freemium |
| 6 | Admin/Kontak | Kartu tim admin + tombol Hubungi (kontak dari Admin Dashboard) |
| 7 | Footer | © 2026 EduSpark |

**Dihapus:** FAQ dan bagian Tutor.

### Tiga mata pelajaran

| Kode | Mapel | Cakupan topik |
|---|---|---|
| PK | Pengetahuan Kuantitatif | Bilangan, Aljabar, Geometri & pengukuran, Analisis data, Peluang |
| PM | Penalaran Matematika | Soal kontekstual, data & grafik, pola & relasi, konteks sosial & ilmiah |
| PKu | Penalaran Kuantitatif | Kuantitas, hubungan matematika sederhana |

Topik PK dan PKu mengacu pada kisi-kisi publik. Topik PM adalah rangkuman contoh, bukan kisi-kisi resmi.

### Soal contoh (3 per subtes)

| Subtes | Soal | Jawaban |
|---|---|---|
| PK | Jika 2x + 6 = 16, nilai x adalah… | **5** |
| PK | 20% dari 250 adalah… | **50** |
| PK | Rata-rata dari 4, 6, 8, dan 10 adalah… | **7** |
| PM | Tarif taksi Rp5.000 + Rp2.000/km. Dengan Rp25.000, jarak maksimum… km | **10** |
| PM | Baju Rp80.000 diskon 25%. Harga yang dibayar… | **Rp60.000** |
| PM | Mesin membuat 12 botol/menit. Dalam 2,5 jam menghasilkan… botol | **1.800** |
| PKu | P = 3/4 dan Q = 0,7. Hubungan P dan Q… | **P > Q** |
| PKu | x > 0. P = 2x dan Q = x + x. Hubungan P dan Q… | **P = Q** |
| PKu | P = 15% dari 80 dan Q = 1/5 dari 70. Hubungan P dan Q… | **P < Q** |

**Sistem Timer & Tryout (Khas UTBK):**
- Menggunakan mekanisme **global countdown timer**. Durasi total = jumlah soal × 2 menit (misal 3 soal = 6 menit, try out penuh = N × 2 menit).
- Timer dimulai ketika peserta menekan tombol mulai dan terus berjalan tanpa henti selama sesi tryout berlangsung. Perpindahan antarsoal tidak memengaruhi maupun mereset timer.
- Peserta hanya mengerjakan dan berpindah antarsoal (didukung fitur Ragu-ragu) **tanpa menerima pembahasan atau umpan balik benar/salah** selama tryout berlangsung.
- Ketika timer mencapai nol, sistem otomatis mengakhiri tryout dan menyimpan hasil pengerjaan.
- **Pembahasan lengkap dan hasil evaluasi disajikan di akhir setelah tryout selesai.**
- **Paywall:** Pratinjau gratis 3 soal untuk semua peserta, sedangkan Tryout Penuh (seluruh bank soal UTBK) memerlukan paket Pro (berbayar) dengan aktivasi via WhatsApp admin.

### Paket

| | **Gratis** | **1 Bulan** | **3 Bulan** | **1 Tahun** |
|---|---|---|---|---|
| Harga | Rp0 | Rp20.000 | Rp50.000 | Rp200.000 |
| Penghematan | n/a | n/a | Hemat Rp10.000 | Hemat Rp40.000 |
| Ekuivalen per bulan | n/a | Rp20.000 | ≈ Rp16.700 | ≈ Rp16.700 |

| Fitur | Gratis | Berbayar |
|---|---|---|
| Uji coba materi matematika | ✅ Sebagian | ✅ **Penuh** |
| Materi matematika lengkap (PK, PM, PKu) | ❌ | ✅ |
| Soal evaluasi kemampuan | ✅ | ✅ |
| Try Out UTBK ber-timer (penuh) | ❌ (pratinjau 3 soal per subtes) | ✅ |
| Progress belajar | ✅ | ✅ |
| Hubungi admin | ✅ | ✅ |

> "Latihan soal interaktif" **tidak** dicantumkan di daftar paket, sesuai permintaan.

### Tim Admin

Kontak dan info tim admin dikonfigurasi langsung dari **Admin Dashboard** (bukan hardcode). Tampil di HomePage section Kontak Admin.

| Nama default | Peran default |
|---|---|
| Andi Pratama | Admin Pendaftaran & Pembayaran |
| Salsa Putri | Admin Materi & Soal |
| Rizky Maulana | Admin Bantuan Teknis |

## 1.3 Fitur

| Fitur | Paket | Status |
|---|---|---|
| Halaman landing (HomePage) sebelum login | Publik | 🔲 Baru dibuat di v2 |
| Navigasi multi-page React Router + BottomNav mobile | Semua | ✅ Ada, rework UI |
| Login nama siswa → dashboard | Semua | ✅ Ada, rework UI |
| Evaluasi Kemampuan (3 soal diagnostik, skor, level) | Semua | ✅ Ada, rework UI |
| Materi microlearning accordion + paywall | Gratis sebagian, penuh berbayar | ✅ Ada, rework UI |
| **Try Out ber-timer** (2 menit/soal, auto submit, skor) | Pratinjau gratis, penuh berbayar | ✅ Ada, tambah timer |
| Progress & evaluasi otomatis dari skor try out | Semua | ✅ Ada → Netlify DB |
| Admin CRUD materi, soal, import CSV | Admin | ✅ Ada, rework UI |
| Toggle status paket siswa (Gratis/Berbayar) | Admin | 🔲 Tambah di AdminUsers |
| Kontak admin dari Admin Dashboard (konfigurasi tim) | Admin | 🔲 Tambah di AdminTeam |
| **Penyimpanan data ke Netlify DB** (lintas device) | Semua | 🔲 Migrasi dari localStorage |
| Semua ikon Phosphor Icons SVG (tanpa emoji) | Semua | 🔲 Ganti semua |
| Kartu paket + tombol pilih | n/a | 🟡 Simulasi |
| Pembayaran | Berbayar | ⚪ Belum ada |
| Materi lengkap (isi bab) | Berbayar | ⚪ Belum ada |

---

# BAGIAN 2: COPYWRITING

## 2.1 Identitas verbal

| Elemen | Teks |
|---|---|
| **Nama** | EduSpark (logo: "Edu" gelap, "Spark" pink terang, dengan orb teal kecil) |
| **Badge** | MATEMATIKA UTBK-SNBT |
| **Headline** | Taklukkan Matematika UTBK, *langkah demi langkah.* |
| **Deskripsi** | Belajar PK, PM, dan Penalaran Kuantitatif dengan materi terstruktur, try out ber-timer ala UTBK, dan progress yang terpantau. |
| **Footer** | © 2026 EduSpark · Platform belajar matematika UTBK-SNBT |

**Gaya bahasa:** ramah, langsung, memakai "kamu", kalimat pendek. Tidak ada emoji — semua ikon pakai Phosphor Icons SVG.

## 2.2 Inventaris copy per bagian

**Navbar (HomePage):** EduSpark · **Masuk**

**Navbar (App):** Dashboard · Evaluasi · Materi · Try Out · Tentang · [avatar] · Keluar

**Hero**
- CTA: **Coba Gratis** / **Lihat Paket**
- Panel: "Contoh tampilan" · Try Out PK · 02:00 · PK 78% · PM 64% · Penalaran Kuantitatif 71%

**Mata Pelajaran**
- Judul: 3 Mata Pelajaran Matematika
- Subjudul: Tiga subtes matematika yang paling sering dihadapi di UTBK. Tiap mapel bisa dicoba gratis, materi lengkap ada di paket berbayar.
- Tombol: **Coba Materi Gratis**

**Try Out**
- Judul: Try Out Ber-Timer
- Subjudul: Pilih subtes, tekan mulai, dan kerjakan sebelum waktu habis. Pratinjau 3 soal per subtes; try out penuh ada di paket berbayar.
- Tombol: Mulai Try Out · Sebelumnya · Berikutnya · Selesai · Ulangi · Lihat Progress
- Info subtes: "[Nama subtes] · 3 soal · 2 menit/soal"
- Timer: "02:00" → merah saat < 10 detik
- Hasil: "Skor PK: 2 dari 3 benar (67%)" / "Waktu habis!" bila timer nol

**Evaluasi Kemampuan** *(nama tampil DiagnosticPage)*
- Judul: Evaluasi Kemampuan
- Subjudul: Uji pemahamanmu dengan soal pilihan ganda. Hasilmu menentukan rekomendasi materi.

**Progress & Evaluasi**
- Subjudul: Skor try out otomatis tercatat di sini. Gratis untuk semua pengguna.
- Awal: "Belum dikerjakan" dan "Kerjakan try out untuk melihat kekuatan dan bagian yang perlu ditingkatkan."
- Setelah try out: "Terkuat: [mapel] ([x]%). Perlu ditingkatkan: [mapel] ([y]%). Ulangi subtes terendah, lalu buka materi lengkap di paket berbayar."

**Paket**
- Judul: Pilih Paketmu
- Subjudul: Mulai gratis, upgrade kapan saja untuk materi lengkap dan try out penuh.
- Label: Hemat Rp10.000 · Paling hemat · Hemat Rp40.000
- Daftar Gratis: Uji coba materi matematika (sebagian) · Soal evaluasi kemampuan · Progress belajar · [ikon kunci] Materi lengkap dan Try Out hanya di paket berbayar
- Daftar Berbayar: Materi matematika lengkap (PK, PM, Penalaran Kuantitatif) · Try Out UTBK ber-timer · Progress belajar · Evaluasi kemampuan
- Tombol: **Mulai Gratis** / **Pilih Paket**
- Catatan: Prototipe: pembayaran belum terhubung.

**Admin/Kontak**
- Judul: Hubungi Admin
- Subjudul: Ada kendala pendaftaran, pembayaran, atau soal? Admin siap bantu.
- Tombol: **Hubungi Admin** (kontak sesuai pengaturan di Admin Dashboard)

**Modal uji coba materi:** UJI COBA GRATIS · "[ikon kunci] Bab lengkap dan latihan mendalam terbuka di paket berbayar." · Lihat Paket / Tutup

**Modal Masuk/Daftar:** Masuk / Daftar · "Paket dipilih: [nama]" · Email · Password · Lanjut / Batal

**Pesan sistem (toast):**
- "Prototipe: akun belum tersimpan di server."
- "Prototipe: chat dengan [nama] belum terhubung."

## 2.3 Evaluasi copywriting

**Sudah membaik dari v1**
- Tidak ada lagi klaim "semua kebutuhan belajar SNBT".
- Pesan prototipe jujur, tidak ada "pendaftaran berhasil" palsu.
- Istilah konsisten dengan UTBK (PK, PM, subtes).

**Masih perlu diperhatikan**

| # | Temuan | Saran |
|---|---|---|
| 1 | "Soal evaluasi kemampuan" (gratis) dan "Evaluasi kemampuan" (berbayar) terbaca sama | Bedakan, mis. gratis: "Evaluasi singkat per mapel", berbayar: "Evaluasi mendalam + rekomendasi belajar" |
| 2 | Paket 3 bulan dan 1 tahun sama-sama ≈ Rp16.700 per bulan, tetapi tahunan berlabel "Paling hemat" | Ubah jadi "Hemat Rp40.000 setahun" atau turunkan harga tahunan / beri bonus |
| 3 | FAQ dihapus, padahal keberatan umum (cara bayar, batal langganan, refund) belum terjawab | Taruh jawaban singkat di kartu paket atau di bagian Admin |
| 4 | Frasa "ala UTBK" bisa dibaca sebagai "sama persis" | Pertahankan "ala", jangan klaim identik dengan soal asli |
| 5 | Catatan "Prototipe: ..." harus dihapus saat rilis | Siapkan teks pengganti sebelum peluncuran |

---

# BAGIAN 3: UI/UX

## 3.1 Arah desain: Neumorphism, pink terang

**Neumorphism (soft UI):** elemen tampak "timbul" atau "tertekan" dari permukaan yang **warnanya sama dengan latar**, dibentuk oleh dua bayangan: satu terang dari kiri-atas, satu gelap dari kanan-bawah. Tidak ada gradasi glossy, tidak ada bevel keras.

### Logika warna

- **Dasar:** pink **terang** (bukan pink gelap atau plum). Semua permukaan memakai pink yang sama dengan latar.
- **Aksen:** pink berada di hue ±336°, lawannya di color wheel ±156° (hijau-teal). Versi **cerah** dari lawan ini bertabrakan dengan pink terang karena sama-sama terang. Solusinya: pakai lawan yang **gelap dan tidak terlalu jenuh** (**teal gelap**), sehingga kontras muncul dari terang-gelap, bukan dari dua warna terang yang bersaing.

### Token warna & Ambience

- **Latar belakang & pencahayaan:** Latar diberi warna dasar lembut `#FAF5F7` dengan perpaduan ambient light radial putih (`rgba(255,255,255, 0.95)`), sehingga halaman tidak tampak datar pink pekat melainkan memiliki dimensi kedalaman cahaya yang segar dan elegan.
- **Permukaan kartu:** Permukaan kartu ditinggikan dengan gradasi permukaan putih bersih (`linear-gradient(150deg, #FFFFFF 0%, #FCF5F8 60%, #F9EDF3 100%)`), memberikan kontras yang jelas dan nyaman dipandang antara kartu utama dan latar belakang.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--bg` | `#FAF5F7` | Latar halaman dengan ambient light putih |
| `--bg-deep` | `#F3E0EA` | Dasar cekungan (input, track progress, timer) |
| `--sh-light` | `#FFFFFF` | Bayangan terang (kiri-atas) |
| `--sh-dark` | `#DDB8C8` | Bayangan gelap lembut (kanan-bawah) |
| `--pink` | `#E89BB8` | Ikon, badge, isian dekoratif |
| `--pink-soft` | `#F6D0DE` | Chip, hover halus |
| `--accent` | `#1B6B58` | Tombol utama, teks aksen, progress fill, fokus |
| `--accent-dark` | `#124D3F` | Hover/active tombol, teks timer |
| `--text` | `#3D222E` | Teks utama |
| `--text-muted` | `#735060` | Teks pendukung |
| `--danger` | `#B04A5E` | Status jawaban salah + timer kritis |

**Perkiraan kontras (hitungan kasar, verifikasi dengan alat kontras):** teks utama di atas `--bg` ≈ 10:1; teks muted ≈ 5:1; aksen di atas `--bg` ≈ 5:1; teks putih di atas `--accent` ≈ 6:1.

**Mode gelap:** tidak dipakai di v2 agar tampilan tetap terang.

## 3.2 Tipografi

| Peran | Font | Ukuran |
|---|---|---|
| Judul | Fraunces 700–800 | H1 `clamp(2.6rem, 7vw, 4.7rem)`, H2 `clamp(2rem, 4.5vw, 3rem)`, H3 `1.4rem` |
| Isi | Figtree 400–700 | 17px dasar, subjudul 1.15rem, catatan 0.85–0.9rem |
| Timer | Share Tech Mono | 2.3rem |

Fallback: Georgia (judul), system-ui (isi), ui-monospace (timer). Line-height isi 1.65, judul 1.12.

## 3.3 Sistem elevasi neumorphism

| Level | Dipakai untuk | Bayangan |
|---|---|---|
| **Raised besar** | Kartu, panel, modal | `8px 8px 18px var(--sh-dark), -8px -8px 18px var(--sh-light)` |
| **Raised kecil** | Tombol sekunder, chip, opsi jawaban, avatar | `4px 4px 10px var(--sh-dark), -4px -4px 10px var(--sh-light)` |
| **Inset** | Input, track progress, timer, opsi terpilih, tab aktif | `inset 5px 5px 10px var(--sh-dark), inset -5px -5px 10px var(--sh-light)` |
| **Tombol utama** | CTA | Isi `--accent`, teks putih, `5px 5px 12px rgba(18,77,63,.35), -4px -4px 10px var(--sh-light)` |
| **Pressed** | `:active` | Ganti ke inset (`inset 3px 3px 7px rgba(0,0,0,.3)` untuk tombol utama) |

**Radius:** kartu 24px, tombol 16px, input 14px, chip pill, avatar lingkaran.
**Spasi:** padding section `4.5rem 5%` (HP `3.2rem 5%`), lebar maks 1160px, jarak antar kartu 1.6rem.

### Snippet token

```css
:root{
  --bg:#F9E4EC; --bg-deep:#F3D5E1;
  --sh-light:#FFF7FA; --sh-dark:#DDB5C6;
  --pink:#EFA7C1; --pink-soft:#F6CADA;
  --accent:#1B6B58; --accent-dark:#124D3F;
  --text:#4A2A38; --text-muted:#7A5566; --danger:#B04A5E;
}
body{background:var(--bg);color:var(--text)}
.raised{background:var(--bg);border-radius:24px;
  box-shadow:8px 8px 18px var(--sh-dark),-8px -8px 18px var(--sh-light)}
.inset{background:var(--bg);border-radius:14px;
  box-shadow:inset 5px 5px 10px var(--sh-dark),inset -5px -5px 10px var(--sh-light)}
.btn{background:var(--accent);color:#fff;border:0;border-radius:16px;padding:.8rem 1.4rem;
  box-shadow:5px 5px 12px rgba(18,77,63,.35),-4px -4px 10px var(--sh-light)}
.btn:active{box-shadow:inset 3px 3px 7px rgba(0,0,0,.3)}
.btn:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
```

## 3.4 Komponen

| Komponen | Spesifikasi |
|---|---|
| **Navbar** | Sticky, permukaan `--bg`, garis bawah tipis (bayangan raised kecil), menu jadi ☰ di ≤760px |
| **BottomNav** | Mobile only: 5 ikon Phosphor Icons SVG, aktif = teal `--accent` |
| **Hero** | 2 kolom (kiri teks, kanan panel contoh progress). Tombol utama teal, tombol kedua raised pink-soft |
| **Kartu mapel** | Raised besar; nomor dalam lingkaran raised dengan angka `--accent`; topik berupa chip raised kecil |
| **Tab subtes** | Segmented control; tab aktif **inset** + teks `--accent`, tab lain raised kecil |
| **Timer** | Sumur inset `--bg-deep`, teks mono `--accent-dark`. Saat sisa < 10 detik, teks `--danger` |
| **Opsi jawaban** | Raised kecil. Terpilih: inset + teks `--accent`. Hasil benar: border `--accent`; salah: border `--danger` |
| **Progress** | Track inset `--bg-deep`, isi `--accent` rata dengan highlight tipis, transisi lebar 0,9 dtk |
| **Kartu paket** | Raised besar. Paket unggulan: label kecil berisi `--accent` di atas kartu |
| **Daftar fitur paket** | Phosphor `CheckCircle` warna `--accent`; item terkunci Phosphor `Lock` warna `--text-muted` |
| **Admin** | Avatar lingkaran raised dengan inisial `--accent`; tombol utama di bawah |
| **Modal** | Kartu raised di atas scrim `rgba(74,42,56,.35)`; tutup dengan Esc, klik luar, atau tombol |
| **Input** | Inset, label di atas, cincin fokus `--accent` |
| **Toast** | Raised kecil, teks `--accent-dark`, hilang otomatis ±2,8 detik |
| **Footer** | Rata `--bg`, garis inset tipis di atas |

> **Catatan ikon:** Semua ikon pakai `@phosphor-icons/react`. Tidak ada emoji di UI. Contoh: Lock, CheckCircle, Timer, ChartBar, BookOpen, Trophy, ArrowRight, User, SignOut, List.

## 3.5 Responsif

| Lebar | Perilaku |
|---|---|
| **> 760px** | Hero 2 kolom, grid kartu `repeat(auto-fit, minmax(235px, 1fr))`, Navbar top |
| **≤ 760px** | Hero 1 kolom, Navbar hanya logo + hamburger, BottomNav aktif |

Grid `auto-fit` menghilangkan masalah kartu "yatim" di baris kedua (masalah v1 di lebar 651–900px).

## 3.6 Interaksi dan alur

```
HomePage (/)
 ├─ Masuk ──────────────► LoginPage ──► DashboardPage
 ├─ Coba Gratis ────────► LoginPage
 └─ Lihat Paket ────────► scroll ke #paket

DashboardPage
 ├─ Evaluasi Kemampuan ─► DiagnosticPage ──► hasil + rekomendasi
 ├─ Materi ─────────────► MicrolearningPage ──► accordion + paywall
 ├─ Try Out ────────────► TryOutPage ──► pilih subtes ──► Mulai
 │                                         └─► soal (timer 2 mnt/soal)
 │                                               └─► Selesai/waktu habis ──► skor
 ├─ Tentang ────────────► AboutPage
 └─ Keluar ─────────────► LoginPage
```

| State | Tampilan |
|---|---|
| Hover | Bayangan raised sedikit mengecil, teks sedikit lebih gelap |
| Active | Ganti ke inset |
| Focus | Outline 3px `--accent`, offset 3px (jangan hanya andalkan bayangan) |
| Terpilih | Inset + teks `--accent` |
| Disabled | Opasitas 0,45, tanpa bayangan raised |

Transisi 0,1–0,3 detik; lebar progress 0,9 detik; scroll halus antar section.

## 3.7 Risiko neumorphism dan mitigasi

Neumorphism punya kelemahan umum: kontras tepi rendah, sehingga elemen interaktif sulit dibedakan.

| Risiko | Mitigasi |
|---|---|
| Tombol dan kartu menyatu dengan latar | Tombol utama selalu berisi warna `--accent`; kartu diberi jarak cukup |
| Status hanya terlihat dari bayangan | Selalu tambah perubahan warna teks atau border, bukan bayangan saja |
| Teks pink terang sulit dibaca | Teks hanya `--text`, `--text-muted`, atau `--accent`; pink hanya untuk dekorasi |
| Fokus keyboard tidak terlihat | `:focus-visible` dengan outline `--accent` |
| Bayangan tidak terlihat di layar redup | `--sh-dark` cukup pekat (`#DDB5C6`); uji di kecerahan rendah |
| Emoji sebagai ikon | Semua diganti Phosphor Icons SVG dengan `aria-label` / `aria-hidden` |

## 3.8 Revert dari skeuomorphism ke neumorphism

| Elemen | Versi skeuomorphism (sebelumnya) | Versi neumorphism (v2) |
|---|---|---|
| Permukaan | Gradasi pink, panel dengan bevel | Satu warna pink terang rata dengan latar |
| Bayangan | Bayangan tegas + highlight putih keras | Dua bayangan lembut (terang dan gelap) |
| Tombol | Gradasi glossy + "tebal 3D" (bayangan padat 6px) | Raised lembut, isi teal gelap, pressed = inset |
| Aksen | Teal cerah (`#19A67D`) / Turquoise (`#2DB4BE`) | Teal gelap (`#1B6B58`) |
| Timer | — | Sumur inset `--bg-deep`, teks mono teal gelap |
| Progress | — | Track inset + isi teal rata |
| Paket | Kartu flat turquoise | Kartu raised pink neumorphism |
| Teks judul | Efek emboss (text-shadow) | Polos, Fraunces |
| Ikon | Phosphor Icons (turquoise/pink) | Phosphor Icons (teal/pink sesuai token) |
| Mode gelap | Ada | Dihapus |

## 3.9 Masalah yang sudah dijawab

| Keputusan | Nilai |
|---|---|
| Timer try out | **Global countdown timer (jumlah soal × 2 menit)**, berjalan kontinu tanpa reset antarsoal, tanpa feedback selama pengerjaan, auto submit saat habis, pembahasan lengkap di akhir |
| Paywall try out | **Pratinjau gratis 3 soal**, Try Out Penuh memerlukan status Pro (berbayar) dengan WhatsApp paywall |
| Status paket siswa | **Toggle manual admin** di AdminUsers |
| Penyimpanan data | **Netlify Functions + Netlify DB** (bukan localStorage) |
| Kontak admin di HomePage | **Dikonfigurasi dari Admin Dashboard** (AdminTeam) |
| Ikon & emoji | **Semua diganti Phosphor Icons SVG** |
| Struktur app | **React Router multi-page** (bukan SPA anchor) |

## 3.10 Masalah yang masih terbuka

| Prioritas | Masalah |
|---|---|
| 🔴 | Materi lengkap (isi bab PK/PM/PKu) belum ditulis |
| 🔴 | Pembayaran belum ada (prototipe: simulasi saja) |
| 🟡 | Perbedaan evaluasi gratis vs berbayar belum didefinisikan secara konten |
| 🟡 | Catatan "Prototipe: ..." perlu dihapus saat rilis |
| 🟢 | Tambah bukti sosial (testimoni/jumlah pengguna) setelah ada data nyata |
