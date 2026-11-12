export const defaultMaterials = [
  {
    id: 1,
    title: 'Persentase & Diskon',
    iconName: 'Percent',
    isPremium: false, // Free preview
    summary: 'Pelajari konsep persentase dan penerapannya dalam belanja sehari-hari.',
    content: `Persentase adalah cara menyatakan pecahan dengan penyebut 100 (per seratus).

**Rumus Utama:**
• Nilai Persen = (Persen ÷ 100) × Nilai Pokok
• Harga Setelah Diskon = Harga Asal − ((Diskon% ÷ 100) × Harga Asal)

**Contoh Kasus Belanja:**
Sebuah kemeja berharga Rp250.000 memiliki label diskon 20%.
1. Hitung potongan harga: 20% × Rp250.000 = Rp50.000
2. Harga yang harus dibayar: Rp250.000 − Rp50.000 = **Rp200.000**

**Tips Cepat:**
Untuk diskon 10%, cukup geser satu desimal ke kiri. (10% dari Rp250.000 = Rp25.000. Jadi 20% = 2 × Rp25.000 = Rp50.000).`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Simulasi belanja dan menghitung potongan harga',
      },
    ],
  },
  {
    id: 2,
    title: 'Rata-rata Data (Mean)',
    iconName: 'ChartBar',
    isPremium: true, // Requires paid access
    summary: 'Pahami cara menghitung dan menginterpretasikan nilai rata-rata dari data nyata.',
    content: `Rata-rata (Mean) merupakan ukuran pemusatan data yang paling sering digunakan dalam kehidupan sehari-hari, seperti nilai rapor, pengeluaran harian, atau rata-rata penjualan.

**Rumus Utama:**
• Rata-rata = (Jumlah Seluruh Nilai Data) ÷ (Banyaknya Data)

**Contoh Kasus Pengeluaran Mingguan:**
Pengeluaran jajan Budi selama 5 hari: Rp15.000, Rp20.000, Rp12.000, Rp18.000, Rp25.000.
1. Total pengeluaran = 15.000 + 20.000 + 12.000 + 18.000 + 25.000 = Rp90.000
2. Banyak hari = 5 hari
3. Rata-rata = Rp90.000 ÷ 5 = **Rp18.000 per hari**`,
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=A1m3OZ9KDVE',
        caption: 'Video edukasi konsep dasar statistika dan rata-rata',
      },
    ],
  },
  {
    id: 3,
    title: 'Perbandingan & Rasio',
    iconName: 'Scales',
    isPremium: true, // Requires paid access
    summary: 'Pelajari hubungan proporsi dua besaran dalam resep masakan dan skala peta.',
    content: `Perbandingan atau rasio menyatakan perbandingan kuantitatif antara dua kelompok besaran atau lebih.

**Rumus Utama:**
• Rasio A : B artinya untuk setiap A bagian pertama, diperlukan B bagian kedua.
• Jika diketahui A, maka B = (Nilai A ÷ Bagian A) × Bagian B

**Contoh Kasus Resep Kue:**
Resep kue bolu membutuhkan perbandingan Tepung : Gula = 4 : 2 (atau 2 : 1).
Jika kita memakai tepung sebanyak 500 gram:
1. Gula yang diperlukan = 500 × (1/2) = **250 gram**

Penerapan ini sangat penting agar rasa dan tekstur masakan tetap sempurna saat porsi ditambah!`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Proporsi takaran bahan dalam memasak',
      },
    ],
  },
]
