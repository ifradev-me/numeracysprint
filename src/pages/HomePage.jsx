import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getTeamInfo } from '../services/api'
import {
  Sparkle,
  ArrowRight,
  CheckCircle,
  Lock,
  LockOpen,
  WhatsappLogo,
  List,
  X,
  BookOpen,
  Brain,
  ChartLineUp,
  User,
  ShieldCheck,
  Check,
  DeviceMobile,
  ChatCircleText,
} from '@phosphor-icons/react'

export default function HomePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedMateriModal, setSelectedMateriModal] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [teamInfo, setTeamInfo] = useState(null)

  useEffect(() => {
    getTeamInfo().then((info) => setTeamInfo(info))
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const mapelList = [
    {
      code: 'PK',
      title: 'Pengetahuan Kuantitatif',
      description: 'Mengukur kemampuan berpikir deduktif matematika, logika simbolik, aljabar, dan analisis besaran numerik.',
      topics: ['Bilangan & Operasi', 'Aljabar Lanjut', 'Geometri & Pengukuran', 'Analisis Data & Statistik', 'Peluang'],
      sampleQuestion: 'Jika 2x + 6 = 16, berapakah nilai x?',
      sampleAnswer: 'x = 5 (2x = 10 → x = 5)',
      lockedNote: 'Materi lengkap Aljabar Matriks, Fungsi Invers, dan studi kasus analitik terapan.',
    },
    {
      code: 'PM',
      title: 'Penalaran Matematika',
      description: 'Menekankan pada penyelesaian masalah nyata sehari-hari, grafik dinamika data, pemodelan matematis, dan logika relasional.',
      topics: ['Soal Kontekstual Finansial', 'Grafik & Dinamika Data', 'Pola Barisan & Relasi', 'Konteks Sosial & Ilmiah'],
      sampleQuestion: 'Baju Rp80.000 diskon 25%. Berapakah harga akhir yang dibayar?',
      sampleAnswer: 'Rp60.000 (Diskon 25% = 1/4 × 80.000 = 20.000 → Bayar 60.000)',
      lockedNote: 'Analisis studi kasus grafik laba-rugi multi-variabel dan pemodelan matematis sains terapan.',
    },
    {
      code: 'PKu',
      title: 'Penalaran Kuantitatif',
      description: 'Bagian penalaran kuantitas untuk menentukan hubungan perbandingan antara nilai P dan Q secara efisien.',
      topics: ['Perbandingan P vs Q', 'Kuantitas & Estimasi Cepat', 'Hubungan Matematika Sederhana', 'Kecukupan Data'],
      sampleQuestion: 'Jika P = 3/4 dan Q = 0,7. Bagaimanakah hubungan P dan Q?',
      sampleAnswer: 'P > Q (karena 3/4 = 0,75 > 0,70)',
      lockedNote: 'Trik cepat 30 detik untuk tipe soal perbandingan kuantitas P vs Q dan kecukupan data.',
    },
  ]

  const paketList = [
    {
      name: 'Gratis',
      price: 'Rp0',
      period: 'Akses Dasar',
      badge: null,
      features: [
        { text: 'Uji coba materi matematika (sebagian)', included: true },
        { text: 'Soal evaluasi kemampuan awal', included: true },
        { text: 'Progress belajar tersimpan di cloud', included: true },
        { text: 'Materi matematika lengkap (PK, PM, PKu)', included: false },
        { text: 'Akses seluruh bank soal & modul lanjutan', included: false },
      ],
      ctaText: 'Mulai Gratis',
      isPrimary: false,
    },
    {
      name: '1 Bulan',
      price: 'Rp20.000',
      period: 'per bulan',
      badge: null,
      features: [
        { text: 'Materi matematika lengkap (PK, PM, PKu)', included: true },
        { text: 'Semua modul bank soal & pembahasannya', included: true },
        { text: 'Evaluasi mendalam & rekomendasi belajar', included: true },
        { text: 'Progress belajar & analisa kelemahan', included: true },
        { text: 'Dukungan tanya admin pendaftaran & soal', included: true },
      ],
      ctaText: 'Pilih Paket 1 Bulan',
      isPrimary: false,
    },
    {
      name: '3 Bulan',
      price: 'Rp50.000',
      period: '≈ Rp16.700 / bulan',
      badge: 'Hemat Rp10.000',
      features: [
        { text: 'Materi matematika lengkap (PK, PM, PKu)', included: true },
        { text: 'Semua modul bank soal & pembahasannya', included: true },
        { text: 'Simulasi intensif latihan berjangka', included: true },
        { text: 'Prioritas bantuan langsung tim admin', included: true },
        { text: 'Akses penuh tanpa batas seluruh fitur', included: true },
      ],
      ctaText: 'Pilih Paket 3 Bulan',
      isPrimary: true,
    },
    {
      name: '1 Tahun',
      price: 'Rp200.000',
      period: 'Akses 12 Bulan Penuh',
      badge: 'Paling Hemat',
      features: [
        { text: 'Akses penuh tanpa batas seluruh materi', included: true },
        { text: 'Semua bank soal + pembaruan berkala', included: true },
        { text: 'Analisa performa kumulatif belajar', included: true },
        { text: 'Prioritas konsultasi langsung admin', included: true },
        { text: 'Garansi pembaruan kurikulum materi baru', included: true },
      ],
      ctaText: 'Pilih Paket 1 Tahun',
      isPrimary: false,
    },
  ]

  const handleAdminContact = () => {
    const cleanPhone = (teamInfo?.phone || '6281234567890').replace(/[^0-9]/g, '')
    const message = teamInfo?.whatsappMessage || `Halo ${teamInfo?.name || 'Admin EduSpark'}, saya ingin bertanya seputar platform belajar EduSpark!`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleSelectPackage = (paket) => {
    if (user?.name) {
      showToast(`Kamu sudah masuk sebagai ${user.name}. Status paket: ${user.isPaid ? 'Pro (Berbayar)' : 'Gratis'}. Hubungi admin untuk upgrade.`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext selection:bg-edupink selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 toast-raised max-w-sm animate-pop-in flex items-center gap-2">
          <Sparkle size={18} weight="fill" className="text-eduaccent shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. NAVBAR (TANPA UTBK & TANPA TRYOUT)                          */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo EduSpark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl raised-sm flex items-center justify-center relative">
              <Brain size={24} weight="bold" className="text-eduaccent" />
              <span className="w-2.5 h-2.5 rounded-full bg-eduaccent absolute -top-1 -right-1 ring-2 ring-edubg" />
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-black font-display tracking-tight flex items-center">
                <span className="text-edutext">Edu</span>
                <span className="text-edupink">Spark</span>
              </div>
              <span className="hidden sm:block text-[10px] font-bold text-edutext-muted uppercase tracking-wider -mt-1">
                Platform Belajar Matematika
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items (No Tryout & No UTBK) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold">
            <a href="#mapel" className="hover:text-eduaccent transition-colors">
              Mata Pelajaran
            </a>
            <a href="#progress" className="hover:text-eduaccent transition-colors">
              Progress & Evaluasi
            </a>
            <a href="#paket" className="hover:text-eduaccent transition-colors">
              Paket Belajar
            </a>
            <a href="#admin" className="hover:text-eduaccent transition-colors">
              Kontak Admin
            </a>
          </nav>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-3">
            {user?.name ? (
              <Link to="/dashboard" className="btn-accent text-sm py-2 px-5">
                <User size={16} weight="bold" />
                <span>Dashboard ({user.name})</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-accent text-sm py-2 px-5">
                <span>Masuk</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl raised-sm flex items-center justify-center text-edutext hover:text-eduaccent"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 border-t border-white/60 bg-edubg animate-pop-in space-y-3">
            <a
              href="#mapel"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold hover:text-eduaccent"
            >
              Mata Pelajaran
            </a>
            <a
              href="#progress"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold hover:text-eduaccent"
            >
              Progress & Evaluasi
            </a>
            <a
              href="#paket"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold hover:text-eduaccent"
            >
              Paket Belajar
            </a>
            <a
              href="#admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold hover:text-eduaccent"
            >
              Kontak Admin
            </a>
            <div className="pt-2">
              <Link
                to={user?.name ? '/dashboard' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-accent w-full text-center py-2.5 text-sm"
              >
                {user?.name ? `Buka Dashboard (${user.name})` : 'Masuk ke EduSpark'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION (BEBAS UTBK)                                    */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full raised-sm text-xs font-black tracking-wider uppercase text-eduaccent">
              <Sparkle size={14} weight="fill" className="text-edupink" />
              <span>PLATFORM BELAJAR MATEMATIKA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-edutext tracking-tight">
              Taklukkan Matematika,{' '}
              <em className="italic text-eduaccent font-serif">langkah demi langkah.</em>
            </h1>

            <p className="text-base sm:text-lg text-edutext-muted max-w-xl font-medium leading-relaxed">
              Belajar Pengetahuan Kuantitatif, Penalaran Matematika, dan Logika Kuantitas dengan modul terstruktur, evaluasi kemampuan, dan progress yang terpantau.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/login" className="btn-accent text-base py-3.5 px-7">
                <span>Coba Gratis</span>
                <ArrowRight size={18} weight="bold" />
              </Link>
              <a href="#paket" className="btn-secondary text-base py-3.5 px-6">
                <span>Lihat Paket</span>
              </a>
            </div>

            {/* Quick stats pill */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-edutext-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} weight="bold" className="text-eduaccent" />
                <span>3 Bidang Matematika</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain size={16} weight="bold" className="text-eduaccent" />
                <span>Modul Microlearning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChartLineUp size={16} weight="bold" className="text-eduaccent" />
                <span>Evaluasi Real-time</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Preview Panel */}
          <div className="lg:col-span-5">
            <div className="raised p-6 sm:p-7 space-y-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <span className="text-xs font-bold uppercase tracking-wider text-edutext-muted flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-eduaccent" /> Pantauan Belajar Siswa
                </span>
                <span className="badge-chip text-[11px]">
                  Aktif
                </span>
              </div>

              {/* Progress items preview */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Pengetahuan Kuantitatif (PK)</span>
                    <span className="text-eduaccent">78%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Penalaran Matematika (PM)</span>
                    <span className="text-eduaccent">64%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '64%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Penalaran Kuantitatif (PKu)</span>
                    <span className="text-eduaccent">71%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '71%' }} />
                  </div>
                </div>
              </div>

              {/* Evaluation excerpt */}
              <div className="inset p-4 text-xs space-y-1">
                <p className="font-bold text-edutext">Evaluasi Otomatis:</p>
                <p className="text-edutext-muted leading-relaxed">
                  Terkuat: <strong className="text-eduaccent">PK (78%)</strong>. Perlu ditingkatkan: <strong className="text-edudanger">PM (64%)</strong>. Ulangi latihan topik terendah untuk memperkuat logika matematikamu.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Link to="/login" className="text-xs font-black text-eduaccent hover:underline flex items-center gap-1">
                  Mulai belajar sekarang <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MATA PELAJARAN SECTION (#mapel)                              */}
      {/* ============================================================== */}
      <section id="mapel" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/60">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
            3 Bidang Matematika
          </h2>
          <p className="text-edutext-muted text-sm sm:text-base leading-relaxed">
            Tiga pilar matematika esensial untuk mengasah penalaran deduktif dan numerik. Tiap mapel bisa dicoba gratis, materi lengkap ada di paket berbayar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {mapelList.map((mapel, idx) => (
            <div key={mapel.code} className="raised p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl inset flex items-center justify-center font-black font-display text-xl text-eduaccent">
                    {idx + 1}
                  </div>
                  <span className="badge-chip uppercase tracking-wider">{mapel.code}</span>
                </div>

                <h3 className="text-xl font-black font-display text-edutext">{mapel.title}</h3>
                <p className="text-xs text-edutext-muted leading-relaxed">{mapel.description}</p>

                {/* Topics list as chips */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-edutext-muted uppercase tracking-wider mb-2">Cakupan Topik:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mapel.topics.map((t) => (
                      <span key={t} className="text-[11px] font-semibold px-2.5 py-1 rounded-full inset">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMateriModal(mapel)}
                className="btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <BookOpen size={16} weight="bold" className="text-eduaccent" />
                <span>Coba Materi Gratis</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. PROGRESS & EVALUASI (#progress)                            */}
      {/* ============================================================== */}
      <section id="progress" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/60">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
            Progress & Evaluasi Belajar
          </h2>
          <p className="text-edutext-muted text-sm sm:text-base leading-relaxed">
            Hasil evaluasi dan latihan otomatis tercatat di sini. Gratis untuk semua pengguna dan langsung tersimpan di cloud database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          <div className="raised p-6 space-y-5">
            <h4 className="text-base font-black font-display text-edutext flex items-center gap-2">
              <ChartLineUp size={20} weight="bold" className="text-eduaccent" />
              <span>Pantauan Real-time Lintas Perangkat</span>
            </h4>
            <p className="text-xs text-edutext-muted leading-relaxed">
              Tiap kali kamu menyelesaikan modul atau tes evaluasi kemampuan, datamu disinkronkan secara aman. Belajar di laptop, lanjutkan di HP tanpa kehilangan catatan kemajuan.
            </p>

            <div className="space-y-3 pt-2">
              <div className="inset p-3.5 flex items-center justify-between">
                <span className="text-xs font-bold">Evaluasi Kemampuan Awal</span>
                <span className="text-xs font-black text-eduaccent">Level Menengah (80/100)</span>
              </div>
              <div className="inset p-3.5 flex items-center justify-between">
                <span className="text-xs font-bold">Pengetahuan Kuantitatif</span>
                <span className="text-xs font-black text-eduaccent">Skor 3/3 (100%)</span>
              </div>
              <div className="inset p-3.5 flex items-center justify-between">
                <span className="text-xs font-bold">Penalaran Matematika</span>
                <span className="text-xs font-black text-eduaccent">Skor 2/3 (67%)</span>
              </div>
            </div>
          </div>

          <div className="raised p-6 space-y-5">
            <h4 className="text-base font-black font-display text-edutext flex items-center gap-2">
              <Brain size={20} weight="bold" className="text-eduaccent" />
              <span>Rekomendasi Cerdas Sesuai Hasil</span>
            </h4>
            <p className="text-xs text-edutext-muted leading-relaxed">
              Sistem menganalisis bidang kelemahanmu dan menyarankan topik spesifik yang perlu dipelajari terlebih dahulu.
            </p>
            <div className="inset p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-eduaccent font-bold">
                <ShieldCheck size={18} weight="bold" />
                <span>Analisa Otomatis EduSpark</span>
              </div>
              <p className="text-edutext leading-relaxed">
                "Terkuat: <strong>Pengetahuan Kuantitatif (100%)</strong>. Perlu ditingkatkan: <strong>Penalaran Matematika (67%)</strong>. Ulangi materi dasar, lalu buka modul lengkap di paket berbayar."
              </p>
            </div>
            <Link to="/login" className="btn-secondary w-full text-xs py-3">
              Cek Level Kemampuanmu Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PAKET SECTION (#paket)                                      */}
      {/* ============================================================== */}
      <section id="paket" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/60">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
            Pilih Paketmu
          </h2>
          <p className="text-edutext-muted text-sm sm:text-base leading-relaxed">
            Mulai gratis, upgrade kapan saja untuk akses materi lengkap dan seluruh bank soal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paketList.map((paket) => (
            <div
              key={paket.name}
              className={`raised p-6 flex flex-col justify-between relative transition-all duration-200 ${
                paket.isPrimary ? 'ring-2 ring-eduaccent' : ''
              }`}
            >
              {paket.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-accent text-[11px] font-bold">
                  {paket.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-black font-display text-edutext">{paket.name}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black font-display text-edutext">{paket.price}</span>
                  </div>
                  <p className="text-xs text-edutext-muted font-semibold mt-1">{paket.period}</p>
                </div>

                <div className="border-t border-white/60 pt-4 space-y-2.5">
                  {paket.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2 text-xs">
                      {feat.included ? (
                        <Check size={15} weight="bold" className="text-eduaccent shrink-0 mt-0.5" />
                      ) : (
                        <Lock size={15} weight="bold" className="text-edutext-muted shrink-0 mt-0.5" />
                      )}
                      <span className={feat.included ? 'text-edutext font-medium' : 'text-edutext-muted line-through opacity-70'}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectPackage(paket)}
                  className={`w-full text-xs py-3 ${
                    paket.isPrimary ? 'btn-accent' : 'btn-secondary'
                  }`}
                >
                  {paket.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-edutext-muted mt-8">
          Aktivasi paket dilakukan langsung melalui konfirmasi admin via WhatsApp.
        </p>
      </section>

      {/* ============================================================== */}
      {/* 6. ADMIN / KONTAK SECTION (#admin) — SESUAI DATA ADMIN PAGE     */}
      {/* ============================================================== */}
      <section id="admin" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/60">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
            Hubungi Admin
          </h2>
          <p className="text-edutext-muted text-sm sm:text-base leading-relaxed">
            Ada kendala pendaftaran, aktivasi akun, atau pertanyaan seputar materi? Admin EduSpark siap membantu.
          </p>
        </div>

        {/* Real Dynamic Admin Card based on Admin Page Settings */}
        <div className="max-w-xl mx-auto raised p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full inset flex items-center justify-center text-3xl font-black font-display text-eduaccent mx-auto">
            {teamInfo?.name ? teamInfo.name.charAt(0).toUpperCase() : 'A'}
          </div>

          <div className="space-y-1">
            <span className="badge-chip text-[11px]">
              <Sparkle size={12} weight="fill" className="text-edupink" /> Kontak Pengelola Resmi
            </span>
            <h3 className="text-2xl font-black font-display text-edutext mt-1">
              {teamInfo?.name || 'Admin EduSpark'}
            </h3>
            <p className="text-xs font-bold text-eduaccent">
              {teamInfo?.role || 'Layanan Siswa & Bantuan Belajar'}
            </p>
            <p className="text-xs text-edutext-muted font-mono pt-1">
              WhatsApp: +{(teamInfo?.phone || '6281234567890').replace(/\D/g, '')}
            </p>
          </div>

          <div className="inset p-4 rounded-2xl text-xs space-y-1 text-left">
            <p className="font-bold text-edutext flex items-center gap-1.5">
              <ChatCircleText size={16} weight="bold" className="text-eduaccent" />
              <span>Pesan Siap Terhubung:</span>
            </p>
            <p className="text-edutext-muted italic">
              "{teamInfo?.whatsappMessage || 'Halo Admin EduSpark, saya ingin konfirmasi aktivasi akun dan bantuan belajar!'}"
            </p>
          </div>

          <button
            onClick={handleAdminContact}
            className="btn-accent w-full text-sm py-3.5 flex items-center justify-center gap-2 font-bold shadow-accent-btn"
          >
            <WhatsappLogo size={20} weight="fill" />
            <span>Hubungi Admin Sekarang via WhatsApp</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="border-t border-white/60 py-10 px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain size={20} weight="bold" className="text-eduaccent" />
          <span className="font-display font-black text-base">
            Edu<span className="text-edupink">Spark</span>
          </span>
        </div>
        <p className="text-xs text-edutext-muted">
          &copy; 2026 EduSpark &bull; Platform Belajar Matematika Adaptif
        </p>
      </footer>

      {/* ============================================================== */}
      {/* MODAL: UJI COBA MATERI GRATIS                                  */}
      {/* ============================================================== */}
      {selectedMateriModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edutext/40 backdrop-blur-sm animate-pop-in">
          <div className="raised p-6 sm:p-8 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <span className="badge-chip">
                <Sparkle size={12} weight="fill" /> Uji Coba Gratis
              </span>
              <button
                onClick={() => setSelectedMateriModal(null)}
                className="w-8 h-8 rounded-full raised-sm flex items-center justify-center text-edutext hover:text-edudanger"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-eduaccent uppercase tracking-wider">
                Mata Pelajaran {selectedMateriModal.code}
              </span>
              <h3 className="text-2xl font-black font-display text-edutext mt-1">
                {selectedMateriModal.title}
              </h3>
              <p className="text-xs text-edutext-muted mt-1 leading-relaxed">
                {selectedMateriModal.description}
              </p>
            </div>

            {/* Free Sample */}
            <div className="inset p-4 space-y-2">
              <p className="text-xs font-bold text-eduaccent uppercase tracking-wider">
                Contoh Materi Gratis:
              </p>
              <p className="text-sm font-bold text-edutext">
                {selectedMateriModal.sampleQuestion}
              </p>
              <p className="text-xs text-edutext-muted">
                <strong>Pembahasan:</strong> {selectedMateriModal.sampleAnswer}
              </p>
            </div>

            {/* Locked Part */}
            <div className="raised-sm p-4 space-y-2 border border-edupink/40">
              <div className="flex items-center gap-1.5 text-xs font-black text-edutext-muted">
                <Lock size={16} weight="bold" className="text-edupink" />
                <span>Konten Lengkap Terkunci</span>
              </div>
              <p className="text-xs text-edutext-muted leading-relaxed">
                {selectedMateriModal.lockedNote}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#paket"
                onClick={() => setSelectedMateriModal(null)}
                className="btn-accent flex-1 text-xs py-3 text-center"
              >
                Lihat Paket Langganan
              </a>
              <button
                onClick={() => setSelectedMateriModal(null)}
                className="btn-secondary text-xs py-3 px-5"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
