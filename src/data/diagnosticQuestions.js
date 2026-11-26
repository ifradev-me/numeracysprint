export const diagnosticQuestions = []

export function calculateLevel(score) {
  if (score < 50) {
    return {
      level: 'Dasar',
      badgeClass: 'badge-chip text-edudanger',
      recommendation: 'Mulai dari pemahaman konsep dasar aljabar, persentase, serta penguatan fondasi penalaran matematika.',
    }
  }
  if (score < 80) {
    return {
      level: 'Menengah',
      badgeClass: 'badge-accent',
      recommendation: 'Kemampuan dasarmu sudah cukup baik! Perkuat pemahaman modul lanjutan dan latih kecepatanmu dengan try out ber-timer.',
    }
  }
  return {
    level: 'Lanjut',
    badgeClass: 'badge-accent',
    recommendation: 'Luar biasa! Kemampuan numerasimu sangat solid. Langsung asah konsistensi dan kecepatan pengerjaanmu di simulasi try out.',
  }
}
