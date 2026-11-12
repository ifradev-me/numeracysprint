# LAPORAN PENGEMBANGAN PLATFORM NUMERACySPRINT
## Platform Microlearning Adaptif Berbasis Diagnosis

### 1. Pendahuluan

Perkembangan teknologi digital membuka peluang untuk menghadirkan metode pembelajaran yang lebih interaktif, fleksibel, dan mudah diakses. Salah satu kemampuan penting yang perlu dikembangkan melalui pendidikan adalah numerasi, yaitu kemampuan memahami, menggunakan, dan menginterpretasikan angka serta informasi matematis dalam berbagai situasi kehidupan sehari-hari.

NumeracySprint merupakan sebuah platform pembelajaran numerasi berbasis website yang dirancang untuk membantu siswa meningkatkan kemampuan numerasi melalui pendekatan pembelajaran bertahap. Platform ini mengintegrasikan tes diagnostik, materi microlearning, dan latihan soal kontekstual dalam satu antarmuka.

### 2. Tujuan Pengembangan

Pengembangan NumeracySprint bertujuan untuk:

1. Membantu siswa mengidentifikasi kemampuan awal numerasi melalui tes diagnostik.
2. Menyediakan materi pembelajaran singkat yang mudah dipahami.
3. Meningkatkan kemampuan penerapan konsep matematika dalam kehidupan sehari-hari.
4. Memberikan rekomendasi pembelajaran berdasarkan hasil tes diagnostik.
5. Menghadirkan media pembelajaran digital yang sederhana dan responsif.

### 3. Deskripsi Sistem

NumeracySprint merupakan aplikasi web berbasis frontend yang dikembangkan menggunakan HTML, CSS, dan JavaScript.

Sistem memiliki dua tampilan utama, yaitu halaman login dan dashboard pembelajaran.

Pada halaman login, siswa diminta memasukkan nama lengkap sebelum mengakses dashboard. Setelah berhasil masuk, siswa dapat mengakses berbagai fitur pembelajaran melalui navigasi yang tersedia.

Dashboard menyediakan tiga page utama pembelajaran, dan satu About page yaitu:

- Tes diagnostik numerasi.
- Materi microlearning.
- Latihan numerasi kontekstual.
- tentang Tim kami.

### 4. Fitur Utama

#### 4.1 Login Siswa

Fitur login digunakan untuk mengidentifikasi nama siswa yang sedang menggunakan platform. Nama yang dimasukkan akan ditampilkan pada dashboard sebagai sapaan personal.

Pada versi ini, proses login masih menggunakan JavaScript di sisi pengguna dan belum terhubung dengan sistem autentikasi maupun database.

#### 4.2 Tes Diagnostik Numerasi

Tes diagnostik berfungsi untuk mengidentifikasi kemampuan awal siswa dalam memahami beberapa konsep numerasi.

Tes terdiri atas tiga pertanyaan pilihan ganda yang mencakup:

- Persentase dan diskon.
- Rata-rata data.
- Perbandingan dua besaran.

Sistem menghitung jumlah jawaban benar dan mengubahnya menjadi skor dalam rentang 0–100.

Berdasarkan hasil tersebut, siswa dikelompokkan menjadi tiga kategori:

- Level Dasar: skor di bawah 40.
- Level Menengah: skor 40 hingga di bawah 100.
- Level Lanjut: skor 100.

Setiap kategori dilengkapi rekomendasi pembelajaran yang sesuai dengan hasil diagnosis.

#### 4.3 Materi Microlearning

Fitur microlearning menyediakan materi numerasi dalam bentuk pembelajaran singkat dan kontekstual.

Terdapat tiga materi utama:

1. Persentase dan Diskon: membahas konsep persentase serta penerapannya dalam aktivitas belanja.
2. Rata-rata Data: menjelaskan cara menghitung nilai rata-rata dari sekumpulan data.
3. Perbandingan: membahas hubungan antara dua besaran melalui contoh penggunaan bahan dalam resep makanan.

Materi dilengkapi fitur interaktif untuk membuka dan membaca penjelasan serta contoh perhitungan.

#### 4.4 Latihan Numerasi

Fitur latihan digunakan untuk menguji pemahaman siswa melalui permasalahan yang berkaitan dengan kehidupan sehari-hari.

Salah satu latihan yang tersedia adalah perhitungan penggunaan uang saku bulanan. Siswa diminta menghitung 15% dari uang saku sebesar Rp1.200.000.

Jawaban yang benar adalah Rp180.000.

Sistem kemudian memberikan umpan balik berdasarkan jawaban yang dimasukkan siswa.

### 5. Teknologi yang Digunakan

Pengembangan platform menggunakan beberapa teknologi berikut:

**react js**

**CSS + tailwind (Cascading Style Sheets)**

Digunakan untuk mengatur tampilan antarmuka, meliputi warna, tipografi, tata letak, animasi sederhana, responsivitas, dan desain komponen.

**JavaScript**

Digunakan untuk mengimplementasikan interaktivitas dan logika sistem, seperti proses login, perhitungan skor diagnostik, pengelompokan level kemampuan, serta pemeriksaan jawaban latihan.

**Netlify & Netlify function**


### 6. Sistem Pembelajaran 

Sistem pembelajaran NumeracySprint memiliki berbagai fitur sebagai berikut:

1. Siswa membuka website dan memasukkan nama pada halaman login.
2. Sistem menampilkan dashboard pembelajaran.
3. Siswa mengerjakan tes diagnostik numerasi.
4. Sistem menghitung skor dan menentukan kategori kemampuan.
5. Siswa memperoleh rekomendasi pembelajaran berdasarkan hasil diagnosis.
6. Siswa mempelajari materi microlearning yang tersedia.
7. Siswa mengerjakan latihan numerasi untuk menguji pemahaman.

### 7. Desain Antarmuka

Antarmuka NumeracySprint dirancang dengan pendekatan sederhana dan responsif agar mudah digunakan oleh siswa.

Desain menggunakan kombinasi warna navy, biru, dan teal sebagai warna utama untuk memberikan kesan profesional, edukatif, dan nyaman dilihat.

Komponen antarmuka disusun menggunakan kartu informasi, panel soal, navigasi, serta bagian materi interaktif. Selain itu, penggunaan CSS Media Query memungkinkan tata letak menyesuaikan ukuran layar perangkat, termasuk komputer dan perangkat seluler.

### 8. Kesimpulan

NumeracySprint merupakan prototipe platform pembelajaran numerasi berbasis web yang mengintegrasikan tes diagnostik, microlearning, dan latihan kontekstual.

Platform ini dirancang untuk memberikan pengalaman belajar yang lebih terarah melalui identifikasi kemampuan awal siswa dan rekomendasi pembelajaran berdasarkan hasil tes.

Dengan memanfaatkan HTML, CSS, dan JavaScript, sistem dapat menjalankan fungsi pembelajaran dasar secara interaktif tanpa memerlukan backend pada tahap pengembangan awal.

Pengembangan selanjutnya dapat mencakup penambahan database untuk menyimpan hasil belajar, autentikasi pengguna, penambahan variasi soal, serta sistem adaptasi materi yang lebih dinamis berdasarkan kemampuan masing-masing siswa.
