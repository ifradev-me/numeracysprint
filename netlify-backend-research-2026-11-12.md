# Netlify sebagai Backend Utama

**Tanggal riset:** 12 November 2026  
**Fokus:** Menggunakan layanan native Netlify untuk membangun aplikasi full-stack tanpa Supabase, Firebase, atau backend hosting pihak ketiga.

> Dokumen ini merangkum dokumentasi resmi Netlify yang tersedia pada tanggal riset. Batas paket dan harga dapat berubah. Perhatikan juga bahwa akun yang dibuat sebelum 4 September 2025 mungkin masih menggunakan skema harga legacy.

## Ringkasan

Netlify saat ini menyediakan komponen yang cukup untuk menjadikan Netlify sebagai platform utama aplikasi web:

- **Netlify Database:** PostgreSQL terkelola untuk data relasional.
- **Netlify Blobs:** object/key-value storage untuk file dan data tidak terstruktur.
- **Netlify Functions:** API dan backend serverless.
- **Scheduled Functions:** fungsi terjadwal seperti cron.
- **Background Functions:** pekerjaan asinkron yang lebih panjang.
- **Edge Functions:** middleware dan pemrosesan request di edge.
- **Netlify Identity:** autentikasi pengguna, termasuk email/password dan OAuth.
- **Netlify Server (Early Access):** server Node.js berumur panjang yang mendukung WebSocket dan SSE.
- **Netlify Forms, CDN, Image CDN, environment variables, dan observability:** fitur pendukung.

**Kesimpulan awal:** aplikasi CRUD, dashboard, katalog, sistem booking, admin panel, dan SaaS kecil hingga menengah dapat dibangun dengan Netlify sebagai backend utama. Namun, Netlify belum otomatis menggantikan seluruh pengalaman Supabase. Aplikasi tetap perlu membuat API dan aturan otorisasi sendiri. Untuk realtime, Netlify Server menjanjikan kemampuan yang lebih lengkap, tetapi statusnya masih Early Access dan adapter framework full-stack seperti Next.js belum berjalan di atas Netlify Server.

---

## 1. Arsitektur yang disarankan

```text
Browser / Mobile App
        |
        v
Frontend
Next.js / React / Vite
        |
        v
Netlify Functions / Next.js Route Handlers
        |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
Netlify Database        Netlify Blobs          Netlify Identity
PostgreSQL              Files / Objects       User authentication
        |
        v
Database migrations, backups, and branches
```

Komponen-komponen itu berada dalam satu ekosistem Netlify. Untuk Next.js, adapter Netlify menggunakan OpenNext untuk menyediakan Functions bagi SSR, ISR, PPR, Route Handlers/API Routes, dan Server Actions. Middleware Next.js dijalankan melalui Edge Functions.

Referensi:
- [Netlify data and storage overview](https://docs.netlify.com/build/data-and-storage/overview/)
- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)

## 2. Netlify Database: PostgreSQL

### 2.1 Apa yang tersedia

Netlify Database adalah PostgreSQL terkelola yang terintegrasi dengan workflow Netlify. Fitur yang terdokumentasi mencakup:

- Provisioning database otomatis.
- SQL untuk relasi, JOIN, transaksi, dan query kompleks.
- Migration system yang menyimpan migration dalam repository dan menerapkannya saat deploy.
- Database branching untuk deploy preview dan eksperimen.
- Automated backups dan pemulihan.
- Dashboard untuk melihat, mengedit, menghapus data, serta memantau compute, bandwidth, dan storage.
- Integrasi dengan Functions, Edge Functions, Builds, dan Agent Runners.
- Pemilihan cara query melalui `@netlify/database` atau Drizzle ORM.

Netlify Database berstatus **Generally Available (GA)** sejak 28 April 2026. Ini bukan lagi sekadar beta Netlify DB yang lama.

Referensi:
- [Netlify Database overview](https://docs.netlify.com/build/data-and-storage/netlify-database/)
- [Pengumuman GA, 28 April 2026](https://www.netlify.com/changelog/2026-04-28-netlify-database/)
- [Getting started](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/)

### 2.2 Batas database menurut paket

Angka berikut berasal dari halaman Billing, limits, and compliance Netlify Database yang diperbarui 14 Agustus 2026.

| Batas | Free | Personal | Pro | Enterprise |
|---|---:|---:|---:|---:|
| Database per akun | 3 | 5 | 50 | 500 (default) |
| Branch per database | 20 | 100 | 300 | 450 |
| Backup terjadwal | 3 hari* | 7 hari | 30 hari | 30 hari |
| Backup saat publish | Deploy terakhir | 3 deploy terakhir | 10 deploy terakhir | 10 deploy terakhir |
| Compute minimum | 1 unit | 1 unit | 1 unit | 4 unit |
| Compute maksimum | 1 unit | 4 unit | 16 unit | 32 unit |
| Total compute per database/periode | 48 unit | Tidak dibatasi | Tidak dibatasi | Tidak dibatasi |
| Total data tertulis per database/periode | 5 GB | 100 GB | 100 GB | Tidak dibatasi |
| Database bandwidth keluar/periode | 5 GB | 100 GB | 100 GB | Tidak dibatasi |
| Ukuran database maksimum pada satu waktu | **5 GB** | **100 GB** | **100 GB** | Tidak dibatasi dalam tabel limit |

Catatan:

- *Ada perbedaan antardokumentasi untuk retensi backup Free: halaman Billing, limits, and compliance database menyebut 3 hari, sedangkan tabel perbandingan paket lain menyebut 7 hari. Untuk angka yang aman, anggap 3 hari sampai dashboard akun mengonfirmasi sebaliknya.*
- Ukuran maksimum database adalah ukuran data yang tersimpan pada satu waktu.
- Batas data tertulis dan bandwidth berlaku per periode tagihan.
- "Tidak dibatasi" berarti tidak ada batas kuota pada tabel publik tersebut, bukan jaminan performa tanpa batas.
- Free dan Personal tidur setelah 5 menit tidak aktif. Free memiliki rentang compute 1 unit; Personal dapat mencapai 4 unit. Pro dan Enterprise dapat mengatur rentang compute sesuai batas paket.
- Satu compute unit menyediakan sekitar 25% vCPU dan 1 GB RAM. Empat unit setara dengan 1 vCPU dan 4 GB RAM.

Sumber: [Billing, limits, and compliance](https://docs.netlify.com/build/data-and-storage/netlify-database/billing-and-usage/) dan [Configure auto-scale](https://docs.netlify.com/build/data-and-storage/netlify-database/configure-auto-scale/).

### 2.3 Cara penagihan database

Database memiliki dua meter penggunaan utama:

| Meter | Tarif kredit | Keterangan |
|---|---:|---|
| Database compute | 10 kredit per GB-hour/compute unit-hour | Bergantung pada durasi database aktif dan tingkat compute yang digunakan. |
| Database bandwidth keluar | 20 kredit/GB | Data yang keluar dari database menuju Functions atau komponen lain. |

Contoh dari dokumentasi Netlify: database Personal yang aktif selama 37 jam pada 1 compute unit akan mengonsumsi 37 unit. Pada tarif 10 kredit per unit, penggunaan tersebut setara 370 kredit. Jika compute meningkat pada sebagian waktu, konsumsi dihitung berdasarkan unit yang digunakan selama jam tersebut.

**Penting tentang biaya storage:** dokumentasi billing yang masih tersedia menyatakan storage gratis sampai 1 Juli 2026 dan tarif storage akan diumumkan sebelumnya. Tanggal tersebut sudah lewat, tetapi halaman publik yang saya periksa masih memuat keterangan lama dan tidak menampilkan tarif GB yang berlaku setelah tanggal tersebut. Karena itu, biaya storage database per November 2026 **belum dapat dipastikan dari halaman publik yang berhasil diverifikasi**. Periksa dashboard Netlify sebelum memindahkan data produksi.

Sumber: [Database billing and usage](https://docs.netlify.com/build/data-and-storage/netlify-database/billing-and-usage/).

### 2.4 ORM dan pengembangan lokal

Netlify menyediakan paket `@netlify/database`. CLI dapat membantu menyiapkan database dan migration:

```bash
netlify database init
```

Saat setup, workflow dapat memilih Drizzle ORM atau SQL langsung. Migration diletakkan di:

```text
netlify/database/migrations/
```

Untuk pengembangan lokal:

```bash
netlify dev
```

Dokumentasi menyebut `netlify dev` dapat menjalankan PostgreSQL lokal sehingga pengembangan tidak perlu menyentuh database production. Saat deploy, Netlify melakukan provisioning dan menjalankan migration sesuai lifecycle deploy.

Contoh instalasi manual:

```bash
npm install @netlify/database
# Opsional, jika memilih Drizzle:
npm install drizzle-orm
```

Sumber: [Netlify Database getting started](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/).

---

## 3. Netlify Blobs: file dan object storage

### 3.1 Fungsi utama

Netlify Blobs adalah storage untuk data tidak terstruktur dan key-value. Penggunaannya cocok untuk:

- Foto profil dan gambar produk.
- Dokumen yang diunggah pengguna.
- File hasil proses backend.
- JSON sederhana, konfigurasi, cache data, dan output background jobs.
- Data pendukung yang tidak membutuhkan query relasional.

API menyediakan operasi seperti `get`, `set`, `delete`, `list`, dan metadata. Satu site dapat memiliki beberapa store/namespace, misalnya `user-uploads`, `avatars`, dan `generated-files`.

**Netlify Blobs bukan pengganti PostgreSQL.** Dokumentasi Netlify secara eksplisit menyarankan database untuk kebutuhan relasi, query kompleks, dan kontrol konkurensi. Perbandingan paket Netlify yang diperiksa masih memberi label Blobs sebagai “Beta”, jadi periksa status dan limit aktual di dashboard sebelum menjadikannya satu-satunya tempat penyimpanan file produksi.

Sumber: [Netlify Blobs overview](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) dan [Perbandingan Database vs Blobs](https://docs.netlify.com/build/data-and-storage/overview/).

### 3.2 Kapasitas dan batas teknis

| Batas | Nilai yang didokumentasikan |
|---|---:|
| Ukuran maksimum satu object/blob | **5 GB** |
| Ukuran maksimum metadata satu object | 2 KB |
| Panjang nama store | 64 byte |
| Panjang object key | 600 byte |

Poin penting:

- Batas 5 GB adalah batas **per object**, bukan total storage akun.
- Dokumentasi yang diperiksa tidak menyebutkan kuota total storage per akun atau harga storage per GB yang dapat dipastikan. Jangan menganggap kapasitas total unlimited atau gratis tanpa mengecek dashboard/billing.
- Limit object 5 GB tidak berarti semua file sebesar itu dapat dikirim melalui satu request Function. Request/response Function biasa memiliki batas payload tersendiri, dibahas pada bagian Functions.
- File-based upload ke deploy-specific store dilakukan selama proses build/deploy. Ini bukan mekanisme upload file pengguna dari browser saat aplikasi berjalan.

### 3.3 Konsistensi data

Default Netlify Blobs menggunakan **eventual consistency**:

- Blob baru langsung tersedia secara global.
- Update dan delete dijamin tersebar ke seluruh edge location dalam waktu maksimal 60 detik.
- Strong consistency dapat dipilih untuk store atau operasi pembacaan tertentu, dengan konsekuensi pembacaan bisa lebih lambat.

Jika dua write bersamaan mengubah key yang sama, aturan default-nya adalah **last write wins**. Blobs tidak menyediakan mekanisme concurrency control bawaan. Untuk data yang harus konsisten secara transaksional, gunakan PostgreSQL.

### 3.4 Region untuk pengguna Indonesia

Region yang tersedia untuk Blobs:

| Region code | Lokasi |
|---|---|
| `ap-southeast-1` | Singapore |
| `ap-southeast-2` | Sydney |
| `eu-central-1` | Frankfurt |
| `us-east-1` | N. Virginia |
| `us-east-2` | Ohio |

**Perhatian:** site-wide store yang dibuat dengan `getStore()` secara default disimpan di `us-east-2` (Ohio), bukan otomatis mengikuti region Functions. Untuk data pengguna Asia Tenggara, tentukan `region: "ap-southeast-1"` secara konsisten pada setiap akses ke store tersebut.

Mengubah region tidak memindahkan data lama. Store pada region baru akan terlihat kosong sampai datanya disalin.

### 3.5 Penggunaan dan keamanan

Contoh dependency:

```bash
npm install @netlify/blobs
```

Pola yang disarankan:

1. Browser mengirim file ke endpoint backend.
2. Function memverifikasi session dan hak akses pengguna.
3. Backend memvalidasi tipe, ukuran, dan nama file.
4. Backend menyimpan file ke store Blobs.
5. PostgreSQL menyimpan metadata file, pemilik, path/key, ukuran, MIME type, dan waktu upload.
6. Saat file diminta, backend memeriksa authorization sebelum mengirim file atau metadata aksesnya.

Jangan mengekspos endpoint yang menerima arbitrary key untuk data sensitif. Netlify menyatakan Blobs dienkripsi saat transit dan saat tersimpan, tetapi aplikasi tetap bertanggung jawab untuk memastikan kode aksesnya tidak membocorkan data.

Sumber: [Netlify Blobs docs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/).

---

## 4. Netlify Functions: backend/API

Netlify Functions menjalankan kode server-side tanpa perlu mengelola server sendiri. Functions dapat digunakan sebagai REST API, webhook, handler autentikasi, validasi, dan business logic.

### 4.1 Jenis fungsi

| Jenis | Kegunaan | Batas eksekusi |
|---|---|---:|
| Synchronous/serverless Function | API request-response, REST endpoint, webhook | 60 detik |
| Scheduled Function | Cron job dan tugas berkala | 30 detik |
| Background Function | Proses asinkron, scraping, batch, pekerjaan lambat | 15 menit |
| Edge Function | Middleware, redirect/rewrite, request/response di edge | CPU 50 ms per request |
| Netlify Server | Server Node.js long-lived, WebSocket, SSE | Hingga 30 menit per request; 2 jam pada Pro/Business/Enterprise, status Early Access |

### 4.2 Batas default Functions

| Parameter | Batas default |
|---|---:|
| Memory | 1.024 MB (1 GB) |
| Synchronous execution | 60 detik |
| Scheduled execution | 30 detik |
| Background execution | 15 menit |
| Buffered request/response payload | 6 MB |
| Streamed response payload | 20 MB |
| Background request/response payload | 256 KB |

Untuk payload binary seperti gambar, encoding Base64 menambah sekitar 30% ukuran. Karena itu, batas request binary efektif sekitar **4,5 MB** pada jalur buffered Function biasa.

Pada Pro dan Enterprise, memory Function dapat ditingkatkan hingga 4 GB. Pilihan memory/vCPU yang lebih besar tidak tersedia di Free dan Personal.

### 4.3 Scheduled Functions

Scheduled Functions bekerja seperti cron job. Fitur ini tersedia pada semua paket.

Contoh cron:

```ts
export const config = {
  schedule: "@hourly",
};
```

Hal yang perlu diperhatikan:

- Jadwal menggunakan zona waktu UTC.
- Hanya deploy production yang menjalankan jadwal otomatis.
- Tidak bisa dipanggil langsung menggunakan URL seperti API biasa.
- Tidak menerima payload POST dari pemanggil.
- Batas eksekusi 30 detik.

Untuk timezone Asia/Jakarta, konversikan jadwal ke UTC. Contoh: pukul 07.00 WIB berarti pukul 00.00 UTC.

### 4.4 Background Functions

Background Functions cocok untuk pekerjaan yang tidak harus selesai sebelum pengguna menerima respons.

Alur dasarnya:

1. Client memanggil Function.
2. Netlify mengembalikan `202` setelah tugas berhasil dijadwalkan.
3. Background Function melanjutkan proses sampai selesai atau mencapai batas 15 menit.
4. Hasilnya disimpan ke database/Blobs atau dikirim ke sistem lain.

Netlify mendokumentasikan mekanisme retry jika invocation gagal: retry pertama setelah satu menit, lalu retry berikutnya setelah dua menit jika masih gagal.

### 4.5 Biaya Functions

Pada credit-based plans, Functions dihitung berdasarkan **GB-hour**, bukan hanya jumlah invocation.

| Meter | Tarif |
|---|---:|
| Functions compute | 10 kredit per GB-hour |
| Web requests | 2 kredit per 10.000 request |
| Web bandwidth | 20 kredit/GB |

Contoh: Function memakai memory 1 GB dan total waktu eksekusi 2 jam dalam satu periode. Pemakaian compute-nya sekitar 2 GB-hour atau 20 kredit. Request API dan response bandwidth tetap dapat menambah meter lain.

Sumber:
- [Functions configuration and limits](https://docs.netlify.com/build/functions/configuration/)
- [Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Background Functions](https://docs.netlify.com/build/functions/background-functions/)
- [Functions usage and billing](https://docs.netlify.com/build/functions/usage-and-billing/)
- [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)

---

## 5. Edge Functions

Edge Functions berjalan dekat dengan pengguna untuk memodifikasi request/response sebelum diteruskan. Contoh:

- Middleware dan routing.
- Redirect/rewrite berdasarkan negara, cookie, atau header.
- Geolocation-based content.
- Pemeriksaan token atau identitas di lapisan awal.
- Personalization dan eksperimen.

Batas penting:

| Parameter | Batas |
|---|---:|
| Bundle code | 20 MB setelah kompresi |
| Memory | 512 MB per set Edge Functions yang dideploy |
| CPU execution time | 50 ms per request |
| Response header timeout | 40 detik |

Edge Functions tidak memakai meter Functions compute. Penggunaannya dihitung sebagai web requests.

Edge runtime cocok untuk pekerjaan ringan yang harus dekat dengan pengguna. Jangan memindahkan proses berat, query kompleks, atau pemrosesan file besar ke Edge Functions.

Sumber:
- [Edge Functions limits](https://docs.netlify.com/build/edge-functions/limits/)
- [Edge Functions usage and billing](https://docs.netlify.com/build/edge-functions/usage-and-billing/)

---

## 6. Netlify Server: backend Node.js yang persisten

**Status per 12 November 2026: Early Access.** Ini salah satu fitur baru yang paling relevan untuk kebutuhan backend tanpa host Node.js terpisah.

### 6.1 Kemampuan

Netlify Server menjalankan satu proses server aplikasi yang berumur panjang dan dikelola Netlify. Server dapat:

- Menangani beberapa request secara bersamaan.
- Menjaga state runtime seperti database connection pool, cache, atau SDK client.
- Mempertahankan WebSocket dan Server-Sent Events (SSE).
- Menjalankan server/framework seperti Express, Fastify, Hono, dan Koa.
- Mengakses Netlify Database, Netlify Blobs, AI Gateway, dan Cache API.
- Scale up berdasarkan traffic dan scale to zero saat idle.

Satu project memiliki maksimal satu server entry point, misalnya `netlify/server/index.ts`.

### 6.2 Limit Early Access

| Parameter | Batas |
|---|---:|
| Instance bersamaan di Free/Personal | 1 |
| Instance bersamaan di Pro/Enterprise | Maksimal 3 |
| Request concurrency per instance (small) | 32 |
| Request concurrency per instance (medium) | 64 |
| Request concurrency per instance (large) | 128 |
| WebSocket | Beberapa ratus koneksi per instance, mengikuti batas gabungan instance |
| Durasi request | 30 menit; 2 jam pada Pro, Business, Enterprise |
| Waktu mengirim response header | 20 detik |
| Idle sebelum instance berhenti | 5 menit |
| Lifetime instance | 8 jam sebelum diganti |
| Waktu koneksi outbound idle | 60 detik tanpa data masuk/keluar |

SSE/streaming response dihitung sebagai request yang masih berlangsung. Jika kapasitas instance penuh, request baru dapat menunggu atau menerima HTTP 429.

### 6.3 Status dan kompatibilitas

- Masih Early Access, sehingga API dan perilakunya dapat berubah.
- Gratis selama Early Access menurut dokumentasi saat ini.
- Setelah GA, penagihan direncanakan berdasarkan reserved memory (GB-hours) dan active CPU time (vCPU-hours). Tarif kreditnya belum diumumkan.
- Traffic request tetap dihitung dalam web request meter, dan komponen lain pada project tetap mengikuti billing normal.
- Netlify menyarankan penggunaan Early Access untuk evaluasi, eksperimen, dan production volume rendah.
- **Next.js, Astro, Nuxt, SvelteKit, React Router, dan TanStack Start belum berjalan di atas Netlify Server.** Framework tersebut tetap menggunakan adapter masing-masing, yang menjalankan server-side code melalui Functions.

### 6.4 Apakah cocok untuk aplikasi realtime?

Ya, secara teknis Server menyediakan WebSocket dan SSE, sehingga lebih cocok daripada Function biasa untuk chat, live dashboard, atau aplikasi yang perlu mempertahankan koneksi. Namun, batas instance dan status Early Access perlu diperhitungkan. Server saat ini juga belum menyediakan managed database change feed setara layanan realtime database. Implementasi broadcast, room, presence, dan sinkronisasi tetap menjadi tanggung jawab aplikasi.

Sumber:
- [Netlify Server overview](https://docs.netlify.com/build/server/)
- [Netlify Server limits](https://docs.netlify.com/build/server/limits/)
- [Netlify Server real-time](https://docs.netlify.com/build/server/real-time/)
- [Netlify Server configuration](https://docs.netlify.com/build/server/configuration/)

---

## 7. Authentication: Netlify Identity

Netlify Identity masih didukung. Netlify pernah mengumumkan rencana penghentian, tetapi pada 19 Februari 2026 mengubah keputusan tersebut dan menyatakan Identity tetap menjadi opsi autentikasi yang didukung.

### Fitur yang tersedia

- Signup dan login menggunakan email/password.
- OAuth provider: Google, GitHub, GitLab, dan Bitbucket.
- Verifikasi user di server-side Functions dan Edge Functions.
- Identity event functions untuk signup, login, dan validasi.
- Account recovery dan email change.
- Unlimited active users dan invite-only users menurut dokumentasi plan.
- Role-based access melalui role/metadata dan aturan akses.

Identity tersedia tanpa biaya tambahan pada credit-based plans. Fitur Pro atau lebih tinggi mencakup custom outgoing email, custom email templates, dan identity audit log.

### Hal yang perlu diperhatikan

- Paket frontend baru yang direkomendasikan adalah `@netlify/identity`; dokumentasi/tutorial terbaru menyebut widget lama dan `gotrue-js` sebagai pendekatan yang sudah digantikan.
- OAuth callback harus diproses melalui `handleAuthCallback()`.
- Tutorial Netlify menyebut endpoint Identity tidak dapat diuji penuh dengan `netlify dev`; uji auth pada Deploy Preview.
- Selalu lakukan otorisasi di sisi server. Login sukses tidak otomatis berarti user berhak membaca atau mengubah setiap record.

Sumber:
- [Netlify Identity overview](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/)
- [Identity plans and pricing](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/usage-and-billing/)
- [Add Identity to your project](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/)
- [Netlify Identity support update](https://www.netlify.com/blog/auth0-extension-identity-changes/)

---

## 8. Layanan pendukung lain

| Fitur | Kegunaan | Catatan |
|---|---|---|
| Netlify Forms | Form submission sederhana | Pada credit-based plans, submissions gratis dan unlimited. Tidak sama dengan API database umum. |
| Global CDN | Mengirim static assets ke pengguna | Traffic dan bandwidth masuk perhitungan credit. |
| Image CDN | Optimasi dan transformasi gambar | Terintegrasi dengan `next/image` melalui adapter Next.js. |
| Environment variables | Menyimpan secret dan konfigurasi backend | Jangan pernah mengirim credential database ke browser. |
| Firewall Traffic Rules | Proteksi traffic dan basic rate limiting | Perlu dicek kesesuaian aturan dengan kebutuhan aplikasi. |
| Observability | Log, metrik, dan debugging | Retensi observability berbeda menurut paket. |

Referensi:
- [Netlify Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/)
- [Netlify pricing](https://www.netlify.com/pricing/)
- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)

---

## 9. Harga dan sistem credit

Untuk credit-based plans yang ditampilkan Netlify pada tanggal riset:

| Paket | Harga bulanan | Credit bulanan | Keterangan |
|---|---:|---:|---|
| Free | $0 | 300 | Hard monthly limit; project dapat pause ketika limit tercapai. |
| Personal | $9 | 1.000 | Auto-recharge opsional. |
| Pro | Mulai $20 | Mulai 3.000 | Tier dapat dipilih sampai 20.000 credit/bulan. |

Harga Pro pada tier yang dipublikasikan:

| Credit/bulan | Harga/bulan |
|---:|---:|
| 3.000 | $20 |
| 5.000 | $33 |
| 10.000 | $63 |
| 15.000 | $95 |
| 20.000 | $126 |

Credit utama yang relevan untuk backend:

| Meter | Penggunaan | Credit |
|---|---|---:|
| Production deploy | 1 deploy | 15 |
| Functions/Database compute | 1 GB-hour | 10 |
| Web bandwidth | 1 GB keluar ke pengunjung | 20 |
| Database bandwidth | 1 GB keluar dari database | 20 |
| Web requests | 10.000 request | 2 |
| Netlify Forms | Submission pada credit-based plans | Gratis |

### Cara membaca billing

Misalnya satu endpoint API dipanggil 100.000 kali:

- Meter web requests: 20 credit.
- Function compute dihitung terpisah berdasarkan memory dan total runtime.
- Jika response mengirim data besar, web bandwidth juga akan terpakai.
- Jika function membaca banyak data dari database, database bandwidth juga terpakai.

Jadi, request yang sama dapat memengaruhi lebih dari satu meter. Total credit tidak hanya ditentukan jumlah API calls.

Free plan memiliki batas keras 300 credit per bulan. Netlify menyatakan project akan masuk kondisi pause ketika batas pemakaian tercapai sampai siklus berikutnya atau plan ditingkatkan. Auto-recharge tidak tersedia untuk Free. Personal dan Pro memiliki opsi auto-recharge, tetapi bisa dibiarkan mati untuk menghindari penambahan tagihan otomatis.

**Catatan akun lama:** semua akun baru sejak 4 September 2025 menggunakan credit-based pricing. Akun yang dibuat sebelumnya dapat masih berada pada legacy pricing sampai pemilik akun mengganti plan. Periksa dashboard bagian Usage & billing sebelum memakai angka di atas sebagai estimasi akun pribadi.

Sumber:
- [Pricing and Plans](https://www.netlify.com/pricing/)
- [Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)

---

## 10. Region dan latensi untuk Indonesia

Region perlu diperhatikan karena lokasi server backend dapat memengaruhi latency ketika Function mengakses database.

### Functions

Default region Functions adalah `cmh` (Ohio). Pemilihan region custom terdokumentasi tersedia untuk Pro dan Enterprise. Daftar self-service mencakup:

- `sin`: Singapore
- `nrt`: Tokyo
- `syd`: Sydney
- `cmh`: Ohio
- `iad`: N. Virginia
- `fra`: Frankfurt
- `dub`: Ireland
- `lhr`: London
- `pdx`: Oregon
- `sfo`: N. California
- `gru`: São Paulo
- `yul`: Canada Central

Untuk pengguna Indonesia, Singapore biasanya menjadi pilihan region terdekat yang tersedia pada Functions, bila plan mengizinkannya.

### Blobs

Untuk Blobs, gunakan `ap-southeast-1` (Singapore) secara eksplisit pada site-wide store. Perhatikan bahwa ini adalah kode region AWS, bukan kode airport Functions.

### Database

Database region default mengikuti region Functions pada saat provisioning, menurut API reference. Jika region penting, pilih region Functions sebelum membuat database dan verifikasi lokasi database di dashboard.

### Netlify Server

Dokumentasi konfigurasi Server yang diperiksa hanya mencantumkan `cmh` (Ohio) dan `fra` (Frankfurt). Belum ada region Asia Tenggara yang tercantum untuk Server Early Access.

Sumber:
- [Functions region configuration](https://docs.netlify.com/build/functions/configuration/)
- [Database API reference](https://docs.netlify.com/build/data-and-storage/netlify-database/api/)
- [Blobs regions](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Server configuration](https://docs.netlify.com/build/server/configuration/)

---

## 11. Hal yang belum sepenuhnya menggantikan Supabase

| Kapabilitas | Status Netlify | Implikasi |
|---|---|---|
| Relational database | Ada, PostgreSQL | Cocok untuk data aplikasi. |
| Object/file storage | Ada, Blobs | Cocok untuk file, tetapi bukan relasional. Kuota total dan tarif storage Blobs tidak terlihat jelas dalam dokumentasi publik yang diperiksa. |
| Authentication | Ada, Netlify Identity | Login dan OAuth tersedia. Otorisasi per record tetap perlu dirancang. |
| Auto-generated REST API untuk seluruh tabel | Tidak terlihat sebagai fitur inti Database | Buat API sendiri menggunakan Functions/Route Handlers. |
| Database row-level security UI seperti Supabase | Tidak terlihat sebagai fitur managed siap pakai | Terapkan authorization di backend dan/atau kebijakan PostgreSQL sendiri. |
| Managed database realtime subscriptions | Tidak terlihat sebagai fitur Database | WebSocket/SSE bisa dibuat melalui Server, tetapi broadcast dan sinkronisasi aplikasi harus dibuat sendiri. |
| Background jobs | Ada, Background Functions | Maksimal 15 menit per eksekusi; gunakan pola idempotent dan simpan status job. |
| Cron | Ada, Scheduled Functions | Maksimal 30 detik dan jadwal UTC. |
| Long-lived Node.js / WebSocket | Ada, Netlify Server | Masih Early Access dan limit instance; belum untuk adapter Next.js. |
| Email transaksi bebas | Tidak setara layanan email transaksional khusus | Email autentikasi tersedia lewat Identity; email aplikasi seperti invoice/newsletter bisa membutuhkan provider email/API. |
| SMS/WhatsApp/payment gateway | Bukan layanan native Netlify | Tetap membutuhkan provider resmi masing-masing. |

Khusus authorization: jangan hanya menyembunyikan tombol di frontend. Setiap Function/Route Handler harus memvalidasi identitas pengguna, kepemilikan resource, dan role sebelum query atau mutasi database. Netlify Identity menyediakan identitas; kebijakan akses data tetap tanggung jawab aplikasi.

---

## 12. Rekomendasi arsitektur berdasarkan tipe aplikasi

### A. CRUD SaaS, admin dashboard, booking, inventory, katalog

Gunakan:

- Next.js atau React frontend.
- Netlify Functions/Next.js Route Handlers sebagai API server-side.
- Netlify Database (PostgreSQL) untuk semua data relasional.
- Drizzle ORM atau SQL langsung.
- Netlify Identity untuk login.
- Netlify Blobs untuk file.

Ini adalah kombinasi paling siap untuk menghindari backend pihak ketiga.

### B. Aplikasi dengan upload gambar dan dokumen

Gunakan:

- PostgreSQL untuk record dan metadata file.
- Blobs untuk konten file.
- Function sebagai pintu validasi dan authorization.
- Region Singapore untuk site-wide Blob store.

Perhatikan batas payload Function. Jangan menganggap batas 5 GB per Blob berarti request upload 5 GB melalui endpoint Function biasa akan berjalan. Uji alur upload besar secara khusus sebelum production.

### C. Chat, live dashboard, dan aplikasi realtime

Pilihan paling mendekati server biasa adalah Netlify Server dengan WebSocket atau SSE. Namun, karena Early Access dan instance limit, lakukan load test. Untuk Next.js, kode server-side masih menggunakan Functions melalui adapter, bukan Netlify Server. Jika kebutuhan realtime kritikal dan skala tinggi, Netlify saja belum memberikan managed realtime database seperti Supabase Realtime.

### D. WhatsApp bot, webhook, dan automation

Netlify Functions dapat menerima webhook, memvalidasi request, memanggil API eksternal, dan menyimpan state ke PostgreSQL/Blobs. Scheduled Functions dapat menjalankan tugas terjadwal, sedangkan Background Functions dapat menjalankan proses lebih panjang.

Namun, koneksi WhatsApp resmi, pengiriman pesan, dan integrasi payment/email tetap bergantung pada provider API masing-masing. Netlify menggantikan hosting backend, bukan penyedia jaringan atau platform eksternal tersebut.

---

## 13. Langkah implementasi awal

Untuk proyek baru berbasis Next.js:

1. Buat project dan hubungkan repository Git ke Netlify.
2. Pilih region Functions sebelum provisioning database jika menggunakan plan yang mendukung pengaturan region.
3. Jalankan `netlify database init` dari root project.
4. Pilih Drizzle ORM atau SQL langsung.
5. Buat schema dan migration di repository.
6. Buat API melalui Next.js Route Handlers atau Netlify Functions.
7. Aktifkan Netlify Identity dan lakukan authorization di server.
8. Tambahkan `@netlify/blobs` jika aplikasi membutuhkan file storage.
9. Buat Deploy Preview dan pastikan perubahan schema tidak mengubah database production.
10. Pantau database compute, database bandwidth, function compute, web requests, dan web bandwidth melalui dashboard.

Paket yang mungkin diperlukan:

```bash
npm install @netlify/database @netlify/blobs @netlify/functions
```

Untuk ORM:

```bash
npm install drizzle-orm
```

CLI database init dapat memasang dependency dan scaffold yang dibutuhkan, jadi tidak harus mengikuti daftar instalasi manual secara kaku.

---

## 14. Kesimpulan

Netlify sudah dapat menjadi backend utama untuk banyak aplikasi web tanpa Supabase. Kombinasi paling masuk akal saat ini adalah **Netlify Database + Netlify Functions + Netlify Identity + Netlify Blobs**.

Netlify Server menambah kemampuan server Node.js long-lived, WebSocket, dan SSE, tetapi masih Early Access. Untuk project Next.js, gunakan adapter Netlify yang saat ini menjalankan server-side framework melalui Functions.

Hal yang paling perlu diverifikasi sebelum production adalah:

1. **Harga storage database setelah 1 Juli 2026**, karena halaman billing publik yang ditemukan belum mencantumkan angka tarif terbaru.
2. **Total kapasitas dan tarif storage Blobs**, karena docs yang diperiksa memberi batas per-object 5 GB, tetapi tidak menyajikan kuota total atau harga storage per GB yang jelas.
3. **Region database dan Functions**, khususnya untuk pengguna Indonesia. Free plan default ke Ohio; Singapore region Functions memerlukan plan Pro/Enterprise menurut dokumentasi region.
4. **Batas Functions dan credit usage**, terutama karena API request, compute, dan bandwidth bisa dihitung terpisah.
5. **Kebutuhan realtime**, sebab Netlify Server masih Early Access dan belum menjadi managed database realtime.

Untuk proyek CRUD dan SaaS standar, Netlify sudah layak diuji sebagai satu platform. Untuk aplikasi yang bergantung pada upload file besar, realtime kritikal, atau kapasitas database yang terus tumbuh, lakukan pengujian dan validasi billing sebelum migrasi penuh.

---

## Referensi resmi utama

1. [Netlify pricing](https://www.netlify.com/pricing/)
2. [Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
3. [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)
4. [Netlify Database overview](https://docs.netlify.com/build/data-and-storage/netlify-database/)
5. [Netlify Database billing, limits, and compliance](https://docs.netlify.com/build/data-and-storage/netlify-database/billing-and-usage/)
6. [Netlify Database getting started](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/)
7. [Netlify Database API reference](https://docs.netlify.com/build/data-and-storage/netlify-database/api/)
8. [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
9. [Data and storage overview](https://docs.netlify.com/build/data-and-storage/overview/)
10. [Functions configuration](https://docs.netlify.com/build/functions/configuration/)
11. [Functions usage and billing](https://docs.netlify.com/build/functions/usage-and-billing/)
12. [Background Functions](https://docs.netlify.com/build/functions/background-functions/)
13. [Scheduled Functions](https://docs.netlify.com/build/functions/scheduled-functions/)
14. [Edge Functions limits](https://docs.netlify.com/build/edge-functions/limits/)
15. [Netlify Server overview](https://docs.netlify.com/build/server/)
16. [Netlify Server limits](https://docs.netlify.com/build/server/limits/)
17. [Netlify Server real-time](https://docs.netlify.com/build/server/real-time/)
18. [Netlify Server configuration](https://docs.netlify.com/build/server/configuration/)
19. [Netlify Identity overview](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/)
20. [Netlify Identity getting started](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/)
21. [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
22. [Netlify Database GA announcement, 28 April 2026](https://www.netlify.com/changelog/2026-04-28-netlify-database/)
23. [Netlify Identity support update, 19 February 2026](https://www.netlify.com/blog/auth0-extension-identity-changes/)
