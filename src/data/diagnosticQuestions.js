export const diagnosticQuestions = [
  {
    id: 1,
    topic: 'Persentase & Diskon',
    subtest: 'Pengetahuan Kuantitatif & PM',
    question: 'Sebuah baju seharga Rp200.000 mendapat diskon 25%. Berapa harga setelah diskon?',
    options: [
      { label: 'A', text: 'Rp150.000', correct: true },
      { label: 'B', text: 'Rp175.000', correct: false },
      { label: 'C', text: 'Rp160.000', correct: false },
      { label: 'D', text: 'Rp125.000', correct: false },
    ],
    explanation: '25% dari Rp200.000 = Rp50.000. Jadi harga setelah diskon = Rp200.000 - Rp50.000 = Rp150.000.',
  },
  {
    id: 2,
    topic: 'Rata-rata Data (Mean)',
    subtest: 'Pengetahuan Kuantitatif',
    question: 'Nilai ulangan 5 siswa adalah 70, 80, 90, 60, dan 100. Berapa nilai rata-ratanya?',
    options: [
      { label: 'A', text: '78', correct: false },
      { label: 'B', text: '80', correct: true },
      { label: 'C', text: '75', correct: false },
      { label: 'D', text: '82', correct: false },
    ],
    explanation: 'Rata-rata = (70 + 80 + 90 + 60 + 100) ÷ 5 = 400 ÷ 5 = 80.',
  },
  {
    id: 3,
    topic: 'Perbandingan & Rasio',
    subtest: 'Penalaran Kuantitatif',
    question: 'Resep kue membutuhkan tepung dan gula dengan perbandingan 3:1. Jika tepung yang digunakan 300 gram, berapa gram gula yang dibutuhkan?',
    options: [
      { label: 'A', text: '150 gram', correct: false },
      { label: 'B', text: '50 gram', correct: false },
      { label: 'C', text: '100 gram', correct: true },
      { label: 'D', text: '75 gram', correct: false },
    ],
    explanation: 'Perbandingan 3:1 artinya jika tepung = 300 gram, gula = 300 ÷ 3 = 100 gram.',
  },
]

export function calculateLevel(score) {
  if (score < 40) {
    return {
      level: 'Dasar',
      badgeClass: 'badge-chip text-edudanger',
      recommendation: 'Mulai dari materi Persentase & Diskon serta penguatan fondasi aljabar dasar UTBK.',
    }
  }
  if (score < 100) {
    return {
      level: 'Menengah',
      badgeClass: 'badge-accent',
      recommendation: 'Perkuat pemahaman dengan modul Rata-rata dan Perbandingan, lalu coba Try Out ber-timer.',
    }
  }
  return {
    level: 'Lanjut',
    badgeClass: 'badge-accent',
    recommendation: 'Hebat! Kemampuan dasarmu sangat solid. Langsung asah kecepatanmu di Try Out SNBT ber-timer.',
  }
}
