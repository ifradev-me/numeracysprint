# 01 --- Visual Design Quality

## Panduan mengurangi desain UI yang terasa generik atau berantakan

Dokumen ini berisi prinsip untuk memperbaiki hierarki visual, tipografi,
warna, spacing, komponen, dan feedback antarmuka.

> Prinsip utama: setiap elemen visual harus membantu pengguna memahami
> konten, mengambil keputusan, atau menyelesaikan tindakan. Jika tidak,
> pertimbangkan untuk menghapusnya.

## 1. Dua puluh prinsip

1.  **Hapus badge pengisi.** Jangan menambahkan label seperti `BEST`,
    `AI POWERED`, atau `POPULAR` hanya untuk dekorasi. Pertahankan jika
    benar-benar memberi informasi.
2.  **Hilangkan label berulang.** Jangan mengulang informasi yang sudah
    jelas dari judul, konteks, atau nilai.
3.  **Jangan memiringkan kata secara acak.** Gunakan italic untuk
    kutipan, istilah, atau penekanan yang memang diperlukan.
4.  **Gunakan monospace seperlunya.** Cocok untuk kode, ID, token,
    timestamp, dan data teknis; bukan sebagai font utama seluruh situs.
5.  **Bangun design system.** Tetapkan token warna, tipografi, spacing,
    radius, elevation, dan aturan komponen.
6.  **Tampilkan produk sebenarnya.** Gunakan screenshot, preview, data,
    atau contoh hasil nyata jika lebih informatif daripada ilustrasi
    abstrak.
7.  **Tonjolkan fitur utama.** Elemen terpenting harus memiliki ukuran,
    posisi, atau kontras yang sesuai dengan prioritasnya.
8.  **Kelompokkan dengan spacing.** Elemen yang berhubungan didekatkan;
    kelompok berbeda diberi jarak lebih besar.
9.  **Buat headline spesifik.** Jelaskan manfaat atau fungsi, bukan
    slogan generik.
10. **Perjelas CTA.** Gunakan label tindakan yang konkret seperti
    `Mulai latihan`, bukan `Lanjutkan perjalanan`.
11. **Gunakan accent color secara selektif.** Arahkan perhatian ke CTA,
    status, atau informasi penting.
12. **Konsistenkan ikon.** Samakan keluarga ikon, ketebalan stroke,
    ukuran, dan gaya.
13. **Hapus ornamen tanpa fungsi.** Dekorasi tidak boleh mengalahkan
    konten atau mengganggu keterbacaan.
14. **Selaraskan radius bertingkat.** Radius elemen di dalam container
    harus terlihat harmonis dengan radius luar dan padding.
15. **Pastikan kontras teks.** Periksa keterbacaan teks terhadap
    background, termasuk state disabled dan hover.
16. **Atur pemenggalan headline.** Hindari satu kata tersisa di baris
    terakhir atau baris yang tampak tidak seimbang.
17. **Periksa alignment secara optis.** Keselarasan visual tidak selalu
    sama dengan posisi koordinat yang identik.
18. **Gunakan tabular numerals untuk data.** Angka dengan lebar seragam
    membantu tabel, harga, timer, dan statistik tetap stabil.
19. **Sediakan loading state.** Beri tahu pengguna ketika data sedang
    dimuat atau tindakan sedang diproses.
20. **Animasi feedback yang berguna.** Berikan konfirmasi visual setelah
    aksi berhasil, gagal, atau berubah status.

## 2. Design system minimum

Buat token terlebih dahulu, baru implementasikan komponen.

``` css
:root {
  /* Color */
  --color-bg: #ffffff;
  --color-surface: #f7f8fa;
  --color-text: #172033;
  --color-muted: #667085;
  --color-border: #e4e7ec;
  --color-primary: #245b91;
  --color-accent: #f4b942;
  --color-success: #16845b;
  --color-danger: #d64545;

  /* Spacing: gunakan skala yang konsisten */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Shape */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  /* Typography */
  --font-body: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;
}

.data-number {
  font-variant-numeric: tabular-nums;
}
```

Angka di atas hanya contoh. Sesuaikan dengan identitas produk dan jangan
menyalin palet secara membabi buta.

## 3. Library dan alat yang membantu

  ---------------------------------------------------------------------------------------------------------
  Kebutuhan               Pilihan                                                   Kegunaan
  ----------------------- --------------------------------------------------------- -----------------------
  Utility CSS             [Tailwind CSS](https://tailwindcss.com/)                  Styling konsisten dan
                                                                                    cepat melalui utility
                                                                                    classes.

  Komponen React          [shadcn/ui](https://ui.shadcn.com/)                       Komponen yang bisa
                                                                                    dimiliki dan
                                                                                    dikustomisasi di
                                                                                    codebase.

  Primitive aksesibel     [Radix UI](https://www.radix-ui.com/primitives)           Dialog, dropdown,
                                                                                    tooltip, dan primitive
                                                                                    interaktif.

  Ikon                    [Lucide](https://lucide.dev/)                             Satu keluarga ikon
                                                                                    outline yang konsisten.

  Token design system     [Style Dictionary](https://styledictionary.com/)          Mengelola token dan
                                                                                    menghasilkan format
                                                                                    untuk berbagai
                                                                                    platform.

  Font                    [Google Fonts](https://fonts.google.com/)                 Menjelajahi dan
                                                                                    menggunakan font web.

  Kontras warna           [WebAIM Contrast                                          Memeriksa rasio kontras
                          Checker](https://webaim.org/resources/contrastchecker/)   teks dan background.

  Referensi warna         [Coolors](https://coolors.co/)                            Eksplorasi palet warna;
                                                                                    tetap validasi kontras
                                                                                    secara terpisah.
  ---------------------------------------------------------------------------------------------------------

### Rekomendasi stack praktis

Untuk website React/Next.js: - Tailwind CSS untuk styling. - shadcn/ui
untuk komponen dasar. - Radix UI untuk primitive yang membutuhkan
perilaku aksesibel. - Lucide untuk ikon. - CSS variables untuk design
tokens.

Jangan memasang semua library sekaligus jika framework atau komponen
yang sudah dipakai telah menyediakan kemampuan serupa.

## 4. Checklist review visual

-   [ ] Apakah pengguna langsung memahami tujuan halaman?
-   [ ] Apakah satu elemen utama terlihat paling menonjol?
-   [ ] Apakah CTA memiliki label tindakan yang spesifik?
-   [ ] Apakah warna aksen digunakan secara selektif?
-   [ ] Apakah tipografi memiliki hierarki yang jelas?
-   [ ] Apakah spacing konsisten dan mengelompokkan konten dengan benar?
-   [ ] Apakah ikon berasal dari keluarga visual yang sama?
-   [ ] Apakah border, shadow, badge, dan ornamen benar-benar
    diperlukan?
-   [ ] Apakah angka dalam tabel atau statistik stabil saat berubah?
-   [ ] Apakah teks tetap terbaca di layar kecil?

## 5. Instruksi untuk AI coding agent

``` text
Audit UI ini berdasarkan dokumen Visual Design Quality.

Jangan langsung mengubah semua hal. Pertama:
1. Identifikasi 5 masalah visual paling berdampak.
2. Jelaskan lokasi dan alasan setiap masalah.
3. Prioritaskan keterbacaan, hierarki, konsistensi, dan usability.
4. Hindari menambahkan dekorasi hanya agar terlihat modern.
5. Pertahankan brand identity dan fungsi yang sudah benar.

Setelah audit, usulkan perubahan kecil yang konkret. Implementasikan hanya
setelah saya menyetujui rencana atau jika saya secara eksplisit meminta
langsung memperbaikinya.
```

## 6. Catatan

Prinsip ini bukan hukum mutlak. Badge, serif, gradient, border, dan
ilustrasi bisa tepat jika memiliki fungsi. Tujuannya bukan membuat semua
website minimalis, tetapi membuat setiap keputusan desain punya alasan.
