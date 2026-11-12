# 03 --- Motion Design Quality

## Panduan animasi UI yang halus, konsisten, dan bermakna

Motion design adalah penggunaan gerakan untuk menjelaskan perubahan
state, hubungan antar-elemen, feedback, dan alur interaksi.

> Prinsip utama: animasi harus membantu pengguna memahami apa yang
> berubah dan mengapa. Jangan membuat pengguna menunggu hanya demi efek
> visual.

## 1. Dua puluh prinsip

1.  **Ease-out untuk entrance.** Elemen bergerak cepat di awal lalu
    melambat saat tiba di posisi akhir.
2.  **Dropdown sekitar 150--250ms.** Jadikan ini titik awal, bukan
    aturan kaku. Respons harus terasa cepat.
3.  **Stagger list sekitar 30ms.** Item muncul sedikit berurutan;
    hindari jeda panjang yang membuat daftar terasa lambat.
4.  **Scale tombol ke 0.97 saat ditekan.** Beri feedback kecil ketika
    pointer atau jari menekan tombol.
5.  **Stretch moving knobs sekitar 12%.** Distorsi ringan dapat memberi
    kesan elastis pada knob atau objek bergerak; gunakan hanya jika
    cocok.
6.  **Stagger detail saat settling.** Elemen utama muncul lebih dulu,
    kemudian detail pendukung.
7.  **Gunakan lintasan melengkung bila sesuai.** Gerakan arc dapat
    terasa lebih natural daripada perpindahan lurus untuk objek
    tertentu.
8.  **Pulse untuk konfirmasi.** Pulse singkat dapat menandai
    keberhasilan, tetapi jangan membuat semua komponen terus berdenyut.
9.  **Ease-in-out untuk perpindahan.** Gerakan dimulai dan berakhir
    secara bertahap.
10. **Popover mulai dari skala 0.95.** Kombinasikan scale kecil dengan
    opacity dan transform origin yang tepat.
11. **Masuk dari trigger.** Menu atau popover muncul dari arah elemen
    yang membukanya.
12. **Keluar menuju trigger.** Saat ditutup, elemen kembali ke arah
    sumbernya bila hubungan spasialnya jelas.
13. **Hindari bounce pada UI sehari-hari.** Bounce cocok untuk momen
    tertentu, bukan setiap dropdown dan tombol.
14. **Jangan tween saat pengguna sedang menahan kontrol.** Jangan
    biarkan animasi otomatis melawan gerakan drag atau input langsung.
15. **Exit sekitar 20% lebih singkat.** Animasi keluar sering lebih baik
    jika sedikit lebih cepat daripada entrance.
16. **Overlap state lama dan baru.** Gunakan crossfade atau transisi
    terkoordinasi agar perubahan tidak terasa seperti kedipan.
17. **Gunakan mask untuk reveal.** Mask dapat mengungkap konten atau
    warna secara terarah.
18. **Crossfade ikon dan blur ringan.** Transisi ikon dapat dibuat
    halus; hindari blur berat yang mengurangi ketajaman.
19. **Rubber-band melewati batas dengan hati-hati.** Efek elastis cocok
    untuk interaksi tertentu, bukan navigasi utama.
20. **Gunakan shared layout identity.** Elemen yang sama dapat terasa
    berpindah atau berkembang ke layout baru, bukan menghilang lalu
    muncul sebagai objek berbeda.

## 2. Timing dan easing sebagai design tokens

Jadikan durasi dan easing konsisten.

``` css
:root {
  --motion-fast: 120ms;
  --motion-normal: 200ms;
  --motion-slow: 300ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

.button {
  transition:
    transform var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard);
}

.button:active {
  transform: scale(0.97);
}

.popover {
  transform-origin: top;
  transition:
    opacity var(--motion-normal) var(--ease-enter),
    transform var(--motion-normal) var(--ease-enter);
}

.popover[data-state="closed"] {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
```

Nilai timing harus disesuaikan dengan jarak gerak, ukuran elemen,
perangkat, dan urgensi interaksi.

## 3. Library animasi

  ------------------------------------------------------------------------------------------------------------------------------------------
  Library                                                                                    Cocok untuk             Catatan
  ------------------------------------------------------------------------------------------ ----------------------- -----------------------
  [Motion](https://motion.dev/)                                                              React UI, layout        Pilihan utama untuk
                                                                                             transition, gesture,    aplikasi React yang
                                                                                             enter/exit, shared      banyak interaksi.
                                                                                             layout                  

  [GSAP](https://gsap.com/)                                                                  Timeline kompleks,      Kuat dan fleksibel;
                                                                                             scroll animation, SVG,  bisa berlebihan untuk
                                                                                             storytelling            micro-interaction
                                                                                                                     sederhana.

  [AutoAnimate](https://auto-animate.formkit.com/)                                           Animasi otomatis saat   Cara cepat memberi
                                                                                             elemen ditambah,        transisi pada daftar
                                                                                             dihapus, atau dipindah  dan layout sederhana.

  [Lottie](https://airbnb.io/lottie/)                                                        Animasi vektor hasil    Cocok untuk ilustrasi
                                                                                             ekspor After Effects    animasi yang sudah
                                                                                                                     dirancang.

  [Rive](https://rive.app/)                                                                  Animasi interaktif      Cocok untuk karakter,
                                                                                             berbasis state machine  ilustrasi, dan
                                                                                                                     interaksi kompleks.

  [CSS                                                                                       Hover, focus, button    Tanpa dependency
  transitions/animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)   press, fade, dan        tambahan.
                                                                                             transform sederhana     
  ------------------------------------------------------------------------------------------------------------------------------------------

### Rekomendasi pemilihan

-   Landing page sederhana: CSS transitions.
-   React dashboard atau aplikasi: Motion.
-   Animasi scroll/timeline yang kompleks: GSAP.
-   Animasi ilustrasi siap pakai: Lottie.
-   Ilustrasi interaktif yang memiliki state: Rive.
-   List dan layout sederhana: AutoAnimate.

Jangan menggunakan beberapa animation engine untuk pekerjaan yang sama
tanpa kebutuhan jelas.

## 4. Contoh Motion untuk React

Instalasi:

``` bash
npm install motion
```

Contoh tombol dan entrance:

``` jsx
import { motion } from "motion/react";

export function ActionButton() {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
    >
      Mulai belajar
    </motion.button>
  );
}

export function EntranceCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      Konten utama
    </motion.section>
  );
}
```

Contoh stagger:

``` jsx
import { motion } from "motion/react";

const items = ["Materi", "Latihan", "Progres"];

export function MenuList() {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.03 }
        }
      }}
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

Catatan: contoh ini menggunakan API Motion untuk React. Untuk proyek
non-React, gunakan CSS atau API yang sesuai dengan framework.

## 5. Accessibility dan performa

Hormati preferensi pengguna yang mengurangi gerakan.

``` css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Praktik tambahan: - Utamakan `transform` dan `opacity` untuk animasi
yang ringan. - Hindari animasi layout mahal secara terus-menerus. -
Jangan menghalangi klik atau input ketika animasi berjalan. - Pastikan
loading dan error state tetap jelas. - Uji di perangkat kelas bawah dan
layar sentuh. - Jangan mengandalkan warna atau gerakan saja untuk
menyampaikan status.

## 6. Checklist motion review

-   [ ] Apakah animasi menjelaskan perubahan state atau memberi
    feedback?
-   [ ] Apakah durasinya terasa cepat dan tidak menghambat?
-   [ ] Apakah easing konsisten?
-   [ ] Apakah entrance dan exit terasa saling terhubung?
-   [ ] Apakah elemen muncul dari sumber interaksinya jika relevan?
-   [ ] Apakah animasi tidak melawan input drag atau keyboard?
-   [ ] Apakah pengguna dapat memahami state tanpa animasi?
-   [ ] Apakah `prefers-reduced-motion` dihormati?
-   [ ] Apakah performa tetap baik di perangkat mobile?
-   [ ] Apakah animasi dekoratif sudah dikurangi?

## 7. Instruksi untuk AI coding agent

``` text
Audit motion design UI ini berdasarkan dokumen Motion Design Quality.

Untuk setiap animasi, identifikasi:
- Trigger dan state yang berubah.
- Tujuan animasi: feedback, navigation, orientation, atau decoration.
- Durasi dan easing.
- Apakah gerakan membantu atau justru memperlambat.
- Dampak terhadap aksesibilitas dan performa.

Prioritaskan CSS untuk interaksi sederhana. Jika proyek menggunakan React
dan membutuhkan layout transition atau gesture, pertimbangkan Motion.
Jangan menambahkan library baru sebelum memeriksa dependency yang sudah ada.

Hormati prefers-reduced-motion dan jangan mengorbankan responsivitas demi
animasi yang terlihat menarik.
```

## 8. Catatan

Motion yang bagus sering kali hampir tidak disadari pengguna. Ukuran
keberhasilannya bukan seberapa spektakuler animasi, melainkan seberapa
jelas dan nyaman interaksi terasa.
