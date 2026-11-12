import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navbar from '../components/Navbar'
import {
  Stethoscope,
  BookOpenText,
  PencilSimpleLine,
  UsersThree,
  Sparkle,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Crown,
  TrendUp,
  Target,
  Lightning,
  Flame,
  ArrowsClockwise,
  Percent,
  Calculator,
  ChartPieSlice,
  CheckFat,
  Star,
  Fire,
} from '@phosphor-icons/react'

const numeracyBites = [
  {
    topic: 'Trik Diskon Cepat',
    formulaPrefix: 'Diskon 25% =',
    formulaAccent: 'Bagi 4',
    tip: 'Barang Rp 180.000 diskon 25%? Langsung bagi 4 = Rp 45.000! Bayar sisa Rp 135.000 tanpa ribet kalkulator.',
    tag: 'Keuangan Praktis',
  },
  {
    topic: 'Trik Rata-rata Cepat',
    formulaPrefix: 'Metode Selisih',
    formulaAccent: 'Patokan Tengah',
    tip: 'Nilai 78, 82, 85, 75? Ambil patokan 80. Selisih: -2, +2, +5, -5 (total selisih = 0). Maka rata-rata persis 80!',
    tag: 'Statistika Harian',
  },
  {
    topic: 'Trik 15% Tip / Pajak',
    formulaPrefix: '10% +',
    formulaAccent: 'Separuhnya (5%)',
    tip: 'Makan Rp 120.000 kena pajak 15%? 10% adalah 12.000, separuhnya 6.000. Total pajak = 12.000 + 6.000 = Rp 18.000.',
    tag: 'Finansial Harian',
  },
  {
    topic: 'Rasio Perbandingan Gampang',
    formulaPrefix: 'Skala Bagian',
    formulaAccent: 'Bagi Total',
    tip: 'Resep rasio gula : tepung = 2 : 5. Total 7 bagian. Jika butuh 350g adonan, tiap bagian = 50g. Gula = 100g, tepung = 250g.',
    tag: 'Logika Rasio',
  },
]

const menuCards = [
  {
    path: '/diagnostic',
    title: 'Tes Diagnostik',
    desc: 'Uji logika matematikamu dalam 3 menit untuk memetakan level dan rekomendasi sprint belajarmu.',
    icon: Stethoscope,
    badge: '3 Pertanyaan Kilat',
    highlight: 'Rekomendasi Pintar',
    motif: '%',
    actionText: 'Mulai Tes',
  },
  {
    path: '/microlearning',
    title: 'Materi Microlearning',
    desc: 'Bite-sized visual: pelajari persentase, rata-rata, dan rasio dengan analogi dunia nyata.',
    icon: BookOpenText,
    badge: 'Teks, Gambar & Video',
    highlight: 'Modul Bertahap',
    motif: '÷',
    actionText: 'Buka Materi',
  },
  {
    path: '/exercise',
    title: 'Latihan Soal Adaptif',
    desc: 'Tantang dirimu dengan soal konteks belanja, statistika mini, dan dapatkan umpan balik instan.',
    icon: PencilSimpleLine,
    badge: 'Umpan Balik Instan',
    highlight: 'Pilihan & Isian',
    motif: '×',
    actionText: 'Asah Soal',
  },
  {
    path: '/about',
    title: 'Tentang Tim & Bantuan',
    desc: 'Visi pengembang NumeracySprint dan kontak admin WhatsApp untuk aktivasi akun Pro.',
    icon: UsersThree,
    badge: 'WhatsApp Admin',
    highlight: 'Dukungan Belajar',
    motif: '+',
    actionText: 'Kontak Admin',
  },
]

export default function DashboardPage() {
  const { user, diagnosticResult } = useUser()
  const navigate = useNavigate()
  const [biteIndex, setBiteIndex] = useState(0)

  // Quick stats from localStorage
  const completedMaterials = JSON.parse(
    localStorage.getItem('numeracy_completed_materials') || '[]'
  )

  const currentBite = numeracyBites[biteIndex]

  const nextBite = () => {
    setBiteIndex((prev) => (prev + 1) % numeracyBites.length)
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        {/* ============================================================== */}
        {/* 1. HERO CARD: VIBRANT RICH BLUE with PINK ACCENTS & MOTIFS    */}
        {/* ============================================================== */}
        <div className="card-blue-vibrant mb-8 relative border-2 border-white/30">
          {/* Desktop-only subtle floating math watermarks */}
          <div className="hidden md:block absolute -right-6 -bottom-8 text-white/[0.08] text-9xl font-mono font-black select-none pointer-events-none">
            %
          </div>
          <div className="hidden md:block absolute right-52 -top-6 text-white/[0.08] text-8xl font-mono font-black select-none pointer-events-none">
            +
          </div>
          <div className="hidden md:block absolute right-24 top-20 text-white/[0.07] text-7xl font-mono font-black select-none pointer-events-none">
            ÷
          </div>

          {/* Desktop-only fun active learning widget */}
          <div className="hidden lg:flex absolute top-7 right-8 bg-white/15 backdrop-blur-md rounded-3xl p-4 border border-white/30 text-white items-center gap-3.5 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center font-bold shadow-pink animate-pulse-subtle">
              <Flame size={26} weight="fill" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-pink-light">Sprint Aktif</p>
              <p className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Siap Eksplorasi</span>
                <span className="w-2.5 h-2.5 rounded-full bg-pink-soft animate-ping" />
              </p>
            </div>
          </div>

          <div className="max-w-xl relative z-10">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="badge-pink">
                <Sparkle size={13} weight="fill" /> Berani Bernumerasi
              </span>
              {user?.isPaid ? (
                <span className="badge-pink flex items-center gap-1 shadow-pink">
                  <Crown size={14} weight="fill" className="text-yellow-300" /> Akun Pro Lunas
                </span>
              ) : (
                <span className="badge-glass text-white">
                  Sprint Siswa
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-black font-roboto text-white leading-tight">
              Halo, {user?.name || 'Sobat Numerasi'}! 👋
            </h1>
            <p className="text-white/95 text-xs sm:text-sm mt-2.5 leading-relaxed font-medium">
              Matematika bukan cuma rumus abstrak, tapi cara berpikir kritis buat keputusan nyata. Siap asah logikamu hari ini?
            </p>

            {/* Quick Diagnostic / Progress Strip inside Hero */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {diagnosticResult ? (
                <div className="card-inner-glass !py-2.5 !px-4 inline-flex items-center gap-3.5 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 font-bold">Level:</span>
                    <span className="badge-pink text-xs font-black shadow-pink">
                      {diagnosticResult.levelInfo?.level}
                    </span>
                  </div>
                  <span className="text-white/40">•</span>
                  <div className="flex items-center gap-1.5 font-black tabular-nums text-white">
                    <Target size={16} weight="bold" className="text-white" />
                    <span>Skor: <strong className="text-yellow-300">{diagnosticResult.score}</strong>/100</span>
                  </div>
                  <span className="text-white/40 hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-white font-bold">
                    <CheckFat size={14} weight="fill" className="text-emerald-300" />
                    <span>{diagnosticResult.correct}/{diagnosticResult.total} Tepat</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/diagnostic')}
                  className="btn-accent text-xs sm:text-sm py-3 px-6 font-black shadow-pink flex items-center gap-2"
                >
                  <Stethoscope size={18} weight="bold" />
                  <span>Ambil Tes Diagnostik Kilat (3 Menit)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. NUMERACY QUICK BITE (Vibrant Blue + Punchy Pink Accent)    */}
        {/* ============================================================== */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-turquoise-surface via-white to-pink-light/40 p-5 sm:p-6 border-2 border-turquoise shadow-card relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="hidden sm:block absolute right-4 -bottom-6 text-turquoise/15 text-8xl font-black select-none pointer-events-none">
            ⚡
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shrink-0 shadow-soft">
                <Lightbulb size={26} weight="fill" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-pink text-[10px] uppercase font-black tracking-wider shadow-sm">
                    {currentBite.tag}
                  </span>
                  <span className="text-xs font-black text-gray-500">
                    {currentBite.topic}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-gray-900 mt-1 font-roboto flex items-center gap-1.5">
                  <span className="text-turquoise-deep">{currentBite.formulaPrefix}</span>
                  <span className="bg-pink-soft text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-sm">
                    {currentBite.formulaAccent}
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 mt-1.5 leading-relaxed max-w-2xl font-medium">
                  {currentBite.tip}
                </p>
              </div>
            </div>

            <button
              onClick={nextBite}
              title="Ganti trik berikutnya"
              className="btn-accent text-xs py-2.5 px-4 shrink-0 self-end sm:self-center font-black shadow-pink flex items-center gap-1.5"
            >
              <ArrowsClockwise size={16} weight="bold" />
              <span>Ganti Trik</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SECTION TITLE WITH QUICK STAT PILLS                         */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-roboto text-gray-900 tracking-tight flex items-center gap-2">
              <span>Sprint Belajarmu</span>
              <span className="w-3 h-3 rounded-full bg-pink-soft shadow-pink" />
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-medium">
              Eksplorasi modul berurutan atau langsung asah kemampuan kontekstual
            </p>
          </div>

          {/* Quick learning progress counters */}
          <div className="flex items-center gap-2">
            <div className="badge-pink text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-pink">
              <BookOpenText size={15} weight="bold" />
              <span className="tabular-nums font-black">
                {completedMaterials.length} Modul Tuntas
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. FOUR BLUE CARDS: Richly blue with pink action badges        */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {menuCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="card-blue group cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border-2 border-white/25 flex flex-col justify-between"
              >
                {/* Desktop-only subtle corner motif */}
                <span className="hidden md:block absolute -right-2 -bottom-4 text-white/[0.09] font-mono text-7xl font-black pointer-events-none select-none">
                  {card.motif}
                </span>

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                      <Icon size={30} weight="bold" />
                    </div>
                    <span className="badge-pink text-[11px] font-black shadow-pink">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black font-roboto text-white flex items-center gap-2 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/95 text-xs sm:text-sm mt-1.5 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom Action Footer with Pink Pop */}
                <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[11px] text-white/90 font-black uppercase tracking-wider">
                    {card.highlight}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-black text-white group-hover:text-pink-light transition-colors">
                    <span>{card.actionText}</span>
                    <div className="w-8 h-8 rounded-full bg-pink-soft group-hover:bg-white text-white group-hover:text-pink-hover flex items-center justify-center transition-all shadow-pink">
                      <ArrowRight size={15} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
