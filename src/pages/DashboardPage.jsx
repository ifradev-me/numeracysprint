import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navbar from '../components/Navbar'
import {
  Brain,
  ClipboardText,
  BookOpenText,
  Timer,
  UsersThree,
  Sparkle,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Crown,
  TrendUp,
  Target,
  Lightning,
  ArrowsClockwise,
  Percent,
  Calculator,
  ChartBar,
  ShieldCheck,
  Check,
  Scales,
} from '@phosphor-icons/react'

const numeracyBites = [
  {
    topic: 'Trik Hubungan P vs Q (Penalaran Kuantitatif)',
    formulaPrefix: 'Bentuk Pecahan vs Desimal',
    formulaAccent: 'Samakan ke Desimal',
    tip: 'Jika P = 3/4 dan Q = 0,7. Ubah 3/4 menjadi 0,75. Karena 0,75 > 0,70, maka langsung simpulkan P > Q dalam 5 detik!',
    tag: 'Trik PKu',
  },
  {
    topic: 'Trik Diskon Cepat (Penalaran Matematika)',
    formulaPrefix: 'Diskon 25% =',
    formulaAccent: 'Bagi 4',
    tip: 'Barang Rp80.000 diskon 25%? Langsung bagi 4 = Rp20.000! Bayar sisa Rp60.000 tanpa ribet kalkulator.',
    tag: 'Trik PM',
  },
  {
    topic: 'Trik Persamaan Cepat (Pengetahuan Kuantitatif)',
    formulaPrefix: 'Eliminasi Cepat',
    formulaAccent: 'Pindah Ruas',
    tip: '2x + 6 = 16 → kurangi 6 di kedua sisi: 2x = 10 → x = 5. Latih kecepatanmu agar punya sisa waktu untuk soal geometri.',
    tag: 'Trik PK',
  },
  {
    topic: 'Trik Rata-rata Cepat (Statistika UTBK)',
    formulaPrefix: 'Metode Patokan',
    formulaAccent: 'Jumlah Selisih',
    tip: 'Nilai 78, 82, 85, 75? Ambil patokan 80. Selisih: -2, +2, +5, -5 (total selisih = 0). Maka rata-rata persis 80!',
    tag: 'Statistika',
  },
]

const menuCards = [
  {
    path: '/diagnostic',
    title: 'Evaluasi Kemampuan',
    desc: 'Uji logika matematikamu dalam 3 soal kilat untuk memetakan level dan rekomendasi subtes belajarmu.',
    icon: ClipboardText,
    badge: '3 Soal Evaluasi',
    highlight: 'Rekomendasi Belajar',
    actionText: 'Mulai Evaluasi',
  },
  {
    path: '/materi',
    title: 'Materi Matematika',
    desc: 'Modul terstruktur PK, PM, dan PKu dengan pembahasan kontekstual, gambar ilustrasi, dan video.',
    icon: BookOpenText,
    badge: 'Modul PK, PM, PKu',
    highlight: 'Akses Uji Coba & Pro',
    actionText: 'Buka Materi',
  },
  {
    path: '/tryout',
    title: 'Try Out Ber-Timer',
    desc: 'Simulasi ujian matematika UTBK dengan countdown 2 menit per soal dan umpan balik pembahasan instan.',
    icon: Timer,
    badge: 'Timer 2 Menit/Soal',
    highlight: 'Skor & Pembahasan',
    actionText: 'Mulai Try Out',
  },
  {
    path: '/about',
    title: 'Tentang & Tim Admin',
    desc: 'Profil tim EduSpark dan kontak admin via WhatsApp untuk bantuan pendaftaran dan aktivasi paket Pro.',
    icon: UsersThree,
    badge: 'WhatsApp Admin',
    highlight: 'Bantuan Belajar',
    actionText: 'Hubungi Admin',
  },
]

export default function DashboardPage() {
  const { user, diagnosticResult } = useUser()
  const navigate = useNavigate()
  const [biteIndex, setBiteIndex] = useState(0)

  // Completed materials from localStorage
  const completedMaterials = JSON.parse(
    localStorage.getItem('numeracy_completed_materials') || '[]'
  )

  const currentBite = numeracyBites[biteIndex]

  const nextBite = () => {
    setBiteIndex((prev) => (prev + 1) % numeracyBites.length)
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        {/* ============================================================== */}
        {/* 1. HERO CARD NEUMORPHIC                                       */}
        {/* ============================================================== */}
        <div className="raised p-6 sm:p-8 relative">
          <div className="max-w-2xl space-y-4">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-chip">
                <Sparkle size={13} weight="fill" className="text-edupink" /> SNBT 2026 Ready
              </span>
              {user?.isPaid ? (
                <span className="badge-accent flex items-center gap-1">
                  <Crown size={14} weight="fill" /> Akun Pro Aktif
                </span>
              ) : (
                <span className="badge-chip text-edutext-muted">
                  Paket Gratis
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-black font-display text-edutext leading-tight">
              Halo, {user?.name || 'Sobat EduSpark'}!
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm leading-relaxed font-medium">
              Siap menaklukkan Pengetahuan Kuantitatif, Penalaran Matematika, dan Penalaran Kuantitatif hari ini? Asah kemampuanmu dengan konsisten!
            </p>

            {/* Quick Diagnostic / Progress Strip inside Hero */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {diagnosticResult ? (
                <div className="inset p-3 sm:p-4 rounded-2xl flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-edutext-muted">Level:</span>
                    <span className="badge-accent !py-0.5 !px-2 text-[11px]">
                      {diagnosticResult.levelInfo?.level}
                    </span>
                  </div>
                  <span className="text-edutext-muted/40">•</span>
                  <div className="flex items-center gap-1.5 font-black text-edutext">
                    <Target size={16} weight="bold" className="text-eduaccent" />
                    <span>Skor: <strong className="text-eduaccent">{diagnosticResult.score}</strong>/100</span>
                  </div>
                  <span className="text-edutext-muted/40 hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 font-bold text-edutext">
                    <CheckCircle size={15} weight="fill" className="text-eduaccent" />
                    <span>{diagnosticResult.correct}/{diagnosticResult.total} Tepat</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/diagnostic')}
                  className="btn-accent text-xs sm:text-sm py-3 px-5 flex items-center gap-2"
                >
                  <ClipboardText size={18} weight="bold" />
                  <span>Ambil Evaluasi Kemampuan Awal (3 Soal)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. NUMERACY QUICK BITE                                         */}
        {/* ============================================================== */}
        <div className="raised p-5 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl inset flex items-center justify-center shrink-0 text-eduaccent">
                <Lightbulb size={24} weight="fill" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge-chip text-[10px] uppercase tracking-wider">
                    {currentBite.tag}
                  </span>
                  <span className="text-xs font-bold text-edutext-muted">
                    {currentBite.topic}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black font-display text-edutext flex items-center gap-1.5">
                  <span>{currentBite.formulaPrefix}</span>
                  <span className="badge-accent !py-0.5 !px-2 text-xs font-bold">
                    {currentBite.formulaAccent}
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-edutext-muted leading-relaxed max-w-2xl font-medium">
                  {currentBite.tip}
                </p>
              </div>
            </div>

            <button
              onClick={nextBite}
              title="Ganti trik berikutnya"
              className="btn-secondary text-xs py-2 px-3.5 shrink-0 self-end sm:self-center flex items-center gap-1.5"
            >
              <ArrowsClockwise size={15} weight="bold" />
              <span>Trik Lain</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SECTION TITLE WITH QUICK STAT PILLS                         */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-edutext tracking-tight flex items-center gap-2">
              <span>Menu Belajar EduSpark</span>
              <span className="w-2.5 h-2.5 rounded-full bg-edupink" />
            </h2>
            <p className="text-edutext-muted text-xs sm:text-sm font-medium">
              Eksplorasi modul materi, uji kemampuan awal, atau simulasikan try out ber-timer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="badge-chip text-xs px-3 py-1 flex items-center gap-1.5">
              <BookOpenText size={15} weight="bold" className="text-eduaccent" />
              <span className="tabular-nums font-bold">
                {completedMaterials.length} Modul Terbaca
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. FOUR MENU CARDS NEUMORPHIC                                  */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="raised p-6 flex flex-col justify-between cursor-pointer hover:border-eduaccent transition-all duration-200 group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-13 h-13 rounded-2xl inset flex items-center justify-center text-eduaccent group-hover:scale-105 transition-transform">
                      <Icon size={26} weight="bold" />
                    </div>
                    <span className="badge-chip text-[11px] font-bold">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black font-display text-edutext tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-edutext-muted text-xs sm:text-sm mt-1.5 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/60 flex items-center justify-between">
                  <span className="text-[11px] text-edutext-muted font-bold uppercase tracking-wider">
                    {card.highlight}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-black text-eduaccent group-hover:translate-x-1 transition-transform">
                    <span>{card.actionText}</span>
                    <div className="w-7 h-7 rounded-full inset flex items-center justify-center">
                      <ArrowRight size={14} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ============================================================== */}
        {/* 5. BOTTOM MOTIVATION BANNER                                    */}
        {/* ============================================================== */}
        <div className="raised p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl inset flex items-center justify-center text-eduaccent shrink-0">
              <Brain size={24} weight="bold" />
            </div>
            <div>
              <p className="text-xs text-edutext-muted font-bold uppercase tracking-wider">EduSpark UTBK-SNBT</p>
              <p className="text-sm font-black font-display text-edutext">Konsistensi latihan adalah kunci taklukkan tes matematika.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tryout')}
            className="btn-accent text-xs py-2.5 px-5 shrink-0"
          >
            <Timer size={16} weight="bold" />
            <span>Mulai Try Out</span>
          </button>
        </div>
      </main>
    </div>
  )
}
