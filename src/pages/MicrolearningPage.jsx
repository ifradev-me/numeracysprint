import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import PaywallModal from '../components/PaywallModal'
import { defaultMaterials } from '../data/materials'
import { useUser } from '../context/UserContext'
import DynamicIcon from '../components/DynamicIcon'
import {
  BookOpenText,
  CaretDown,
  CheckCircle,
  LockKey,
  Crown,
  Sparkle,
  ImageSquare,
  PlayCircle,
  Clock,
  Lightbulb,
  CheckFat,
  BookmarkSimple,
  Lightning,
  Percent,
  ChartBar,
  Scales,
  Brain,
  Fire,
  Trophy,
  Target,
  ArrowRight,
  ChatsCircle,
  Check,
  GraduationCap,
} from '@phosphor-icons/react'

function MediaRenderer({ media }) {
  if (!media || media.length === 0) return null
  return (
    <div className="mt-5 space-y-4">
      {media.map((item, i) => {
        if (item.type === 'image') {
          return (
            <div key={i} className="rounded-2xl overflow-hidden shadow-soft border-2 border-white/20 bg-black/10">
              <img
                src={item.url}
                alt={item.caption || 'Ilustrasi Konsep'}
                className="w-full object-cover max-h-72 hover:scale-[1.01] transition-transform duration-300"
              />
              {item.caption && (
                <div className="p-3 bg-black/40 backdrop-blur-md text-xs text-white flex items-center gap-2">
                  <ImageSquare size={16} weight="bold" />
                  <span>{item.caption}</span>
                </div>
              )}
            </div>
          )
        }
        if (item.type === 'video') {
          const isYoutube = item.url.includes('youtube.com') || item.url.includes('youtu.be')
          if (isYoutube) {
            let videoId = ''
            if (item.url.includes('youtu.be/')) {
              videoId = item.url.split('youtu.be/')[1]?.split('?')[0]
            } else if (item.url.includes('watch?v=')) {
              videoId = item.url.split('watch?v=')[1]?.split('&')[0]
            }
            return (
              <div key={i} className="rounded-2xl overflow-hidden shadow-soft border-2 border-white/20 aspect-video bg-black/40">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={item.caption || 'Video Edukasi'}
                />
              </div>
            )
          }
          return (
            <video key={i} src={item.url} controls className="w-full rounded-2xl shadow-soft" />
          )
        }
        return null
      })}
    </div>
  )
}

function FormattedContent({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div className="space-y-2.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-2" />
        const parts = line.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={lIdx}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-black text-white bg-white/10 px-1.5 py-0.5 rounded tracking-wide">
                    {part.slice(2, -2)}
                  </strong>
                )
              }
              return <span key={pIdx}>{part}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Modul', icon: BookOpenText },
  { id: 'persen', label: 'Persentase & Diskon', icon: Percent },
  { id: 'statistika', label: 'Statistika Mean', icon: ChartBar },
  { id: 'rasio', label: 'Rasio & Proporsi', icon: Scales },
]

export default function MicrolearningPage() {
  const { user } = useUser()
  const [openId, setOpenId] = useState(1)
  const [paywallTarget, setPaywallTarget] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('numeracy_completed_materials')
    return saved ? JSON.parse(saved) : []
  })
  const [materials, setMaterials] = useState(() => {
    const custom = localStorage.getItem('numeracy_custom_materials')
    return custom ? [...defaultMaterials, ...JSON.parse(custom)] : defaultMaterials
  })

  useEffect(() => {
    const custom = localStorage.getItem('numeracy_custom_materials')
    if (custom) {
      setMaterials([...defaultMaterials, ...JSON.parse(custom)])
    }
  }, [])

  const handleTopicClick = (mat) => {
    const isLocked = mat.isPremium && !user?.isPaid
    if (isLocked) {
      setPaywallTarget(mat)
    } else {
      setOpenId(openId === mat.id ? null : mat.id)
    }
  }

  const markComplete = (id) => {
    const updated = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id]
    setCompleted(updated)
    localStorage.setItem('numeracy_completed_materials', JSON.stringify(updated))
  }

  // Filter materials based on selected category tab
  const filteredMaterials = useMemo(() => {
    if (activeCategory === 'all') return materials
    if (activeCategory === 'persen') {
      return materials.filter(m => m.title.toLowerCase().includes('persen') || m.title.toLowerCase().includes('diskon'))
    }
    if (activeCategory === 'statistika') {
      return materials.filter(m => m.title.toLowerCase().includes('rata') || m.title.toLowerCase().includes('mean') || m.title.toLowerCase().includes('data'))
    }
    if (activeCategory === 'rasio') {
      return materials.filter(m => m.title.toLowerCase().includes('rasio') || m.title.toLowerCase().includes('banding') || m.title.toLowerCase().includes('proporsi'))
    }
    return materials
  }, [materials, activeCategory])

  const progressPercent = Math.round((completed.length / (materials.length || 1)) * 100)

  return (
    <div className="min-h-screen bg-white pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10">

        {/* ============================================================ */}
        {/* DESKTOP-ONLY: Fun Floating Ornaments & Mini Cheat Widgets    */}
        {/* ============================================================ */}
        <div className="hidden lg:flex items-center justify-between mb-6 gap-4">
          {/* Quick formula floater 1 */}
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-3xl border-2 border-turquoise/30 shadow-soft animate-float-slow"
            style={{ background: 'linear-gradient(135deg, #e8fafb 0%, #ffffff 100%)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
              <Percent size={20} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Rumus Cepat Saku</p>
              <p className="text-xs font-black text-turquoise-deep font-mono">
                Diskon 25% = <span className="text-pink-soft font-bold">Harga ÷ 4</span>
              </p>
            </div>
          </div>

          {/* Quick duration floater 2 */}
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-3xl border-2 border-pink-soft/30 shadow-pink animate-float-reverse"
            style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffffff 100%)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink">
              <Clock size={20} weight="fill" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Metode Belajar</p>
              <p className="text-xs font-black text-pink-hover">Bite-sized (3-5 Menit/Modul)</p>
            </div>
          </div>

          {/* XP & Streak floater 3 */}
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-3xl border-2 border-turquoise/30 shadow-soft animate-float-slow"
            style={{ background: 'linear-gradient(135deg, #f0fbff 0%, #e8fafb 100%)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
              <Sparkle size={20} weight="fill" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">XP Booster</p>
              <p className="text-xs font-black text-turquoise-deep tabular-nums">+30 XP per modul tuntas</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* HEADER HERO BANNER                                           */}
        {/* ============================================================ */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-turquoise-surface via-white to-pink-light/30 p-6 sm:p-8 border-2 border-turquoise/40 shadow-card relative overflow-hidden">
          {/* Subtle math motifs background watermark */}
          <div className="hidden sm:block absolute right-6 -bottom-8 text-turquoise/10 text-9xl font-mono font-black select-none pointer-events-none">
            %
          </div>
          <div className="hidden sm:block absolute right-40 -top-4 text-pink-soft/10 text-8xl font-mono font-black select-none pointer-events-none">
            ÷
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge-pink">
                  <Sparkle size={13} weight="fill" /> Modul Microlearning Praktis
                </span>
                {user?.isPaid ? (
                  <span className="badge-turquoise text-xs font-bold flex items-center gap-1">
                    <Crown size={14} weight="fill" /> Akses Lengkap Aktif
                  </span>
                ) : (
                  <span className="badge-white text-xs text-gray-500 font-bold">
                    Sprint Siswa
                  </span>
                )}
                <span className="hidden md:inline-flex badge-glass !bg-turquoise/10 !border-turquoise/30 !text-turquoise-deep text-xs font-black">
                  <Lightning size={13} weight="fill" className="text-amber-500" /> Logika Praktis
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-roboto text-gray-900 tracking-tight">
                Materi Numerasi Interaktif 💡
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed font-medium">
                Pahami cara kerja angka di dunia nyata lewat analogi belanja, resep masakan, dan data harian. Ringkas, santai, langsung paham!
              </p>
            </div>

            {/* Progress Card Widget */}
            <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-turquoise/30 shrink-0 shadow-soft">
              <div className="flex items-center justify-between text-xs font-black text-turquoise-deep mb-2 gap-6">
                <span className="flex items-center gap-1.5">
                  <Trophy size={16} weight="fill" className="text-amber-400" />
                  Progres Belajar:
                </span>
                <span className="tabular-nums text-pink-hover font-black text-sm">
                  {completed.length} / {materials.length} Modul ({progressPercent}%)
                </span>
              </div>
              <div className="h-3 w-52 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-turquoise/20">
                <div
                  className="h-full bg-gradient-to-r from-turquoise via-[#209ba5] to-pink-soft rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-1.5 text-right">
                {completed.length === materials.length ? '🎉 Semua modul tuntas!' : `${materials.length - completed.length} modul lagi menuju tuntas`}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE CATEGORY FILTER PILLS                            */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-turquoise to-turquoise-dark text-white shadow-soft shadow-turquoise/30 scale-105'
                    : 'bg-white border-2 border-turquoise/20 text-gray-600 hover:text-turquoise-deep hover:bg-turquoise-light/50 shadow-sm'
                }`}
              >
                <Icon size={16} weight={isActive ? 'bold' : 'regular'} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* ============================================================ */}
        {/* MAIN LAYOUT: 2-Column on Desktop (lg:grid), 1-Column on Mobile*/}
        {/* ============================================================ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">

          {/* LEFT COLUMN: Materials List (8 cols on desktop, full on mobile) */}
          <div className="lg:col-span-8 space-y-4">
            {filteredMaterials.map((mat, idx) => {
              const isOpen = openId === mat.id
              const isDone = completed.includes(mat.id)
              const isLocked = mat.isPremium && !user?.isPaid

              return (
                <div
                  key={mat.id}
                  className="card-blue relative transition-all duration-200 border-2 border-white/25 shadow-lg overflow-hidden group"
                >
                  {/* Desktop-only subtle watermark icon */}
                  <div className="hidden md:block absolute -right-3 -bottom-5 text-white/[0.08] text-8xl font-mono font-black select-none pointer-events-none">
                    {idx === 0 ? '%' : idx === 1 ? 'x̄' : idx === 2 ? ':' : '#'}
                  </div>

                  {/* Header Accordion Button */}
                  <button
                    onClick={() => handleTopicClick(mat)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer active:scale-[0.99] transition-transform relative z-10"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shrink-0 shadow-soft group-hover:scale-105 transition-transform duration-200">
                        <DynamicIcon name={mat.iconName || 'BookBookmark'} size={26} weight="bold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-white/70">
                            Modul #{idx + 1}
                          </span>
                          <h3 className="font-black text-white text-base sm:text-lg font-roboto tracking-tight">
                            {mat.title}
                          </h3>
                          {isLocked && (
                            <span className="badge-pink text-[10px] uppercase font-black tracking-wider py-0.5 px-2 flex items-center gap-1 shadow-pink">
                              <LockKey size={12} weight="fill" /> Pro
                            </span>
                          )}
                          {isDone && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white text-turquoise-deep shadow-sm">
                              <CheckCircle size={14} weight="fill" className="text-turquoise" /> Selesai
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/85 mt-1 line-clamp-1 font-medium">{mat.summary}</p>
                      </div>
                    </div>

                    {/* Toggle Indicator */}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition-colors">
                      {isLocked ? (
                        <LockKey size={16} weight="bold" className="text-white" />
                      ) : (
                        <CaretDown
                          size={18}
                          weight="bold"
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Content Expanded */}
                  {isOpen && !isLocked && (
                    <div className="mt-6 pt-6 border-t border-white/20 animate-pop-in relative z-10">
                      {/* Meta badges strip */}
                      <div className="flex items-center gap-3 text-[11px] font-bold text-white/90 mb-4 flex-wrap">
                        <span className="badge-glass flex items-center gap-1.5">
                          <Clock size={14} weight="bold" />
                          <span>Estimasi baca: ~3 menit</span>
                        </span>
                        <span className="badge-glass flex items-center gap-1.5">
                          <Brain size={14} weight="bold" />
                          <span>Metode Kontekstual</span>
                        </span>
                        <span className="badge-glass flex items-center gap-1.5">
                          <Sparkle size={14} weight="fill" className="text-pink-light" />
                          <span>Numeracy Sprint</span>
                        </span>
                      </div>

                      {/* Reading Content with bold formatting */}
                      <div className="card-inner-glass text-xs sm:text-sm text-white/95 font-normal leading-relaxed">
                        <FormattedContent text={mat.content} />
                      </div>

                      {/* Rich Media (Image / Video) */}
                      <MediaRenderer media={mat.media} />

                      {/* Completion button */}
                      <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between flex-wrap gap-3">
                        <span className="text-xs text-white/75 font-medium hidden sm:inline">
                          Sudah paham materi ini? Tandai agar progresmu tercatat.
                        </span>
                        <button
                          onClick={() => markComplete(mat.id)}
                          className={`text-xs py-2.5 px-5 rounded-2xl font-extrabold transition-all duration-150 active:scale-[0.97] flex items-center gap-2 cursor-pointer ${
                            isDone
                              ? 'bg-white hover:bg-gray-100 text-turquoise-deep shadow-soft border border-white/60'
                              : 'btn-accent shadow-pink'
                          }`}
                        >
                          <CheckCircle size={18} weight="fill" className={isDone ? 'text-turquoise' : 'text-white'} />
                          <span>{isDone ? 'Telah Dipahami (Klik Batal)' : 'Tandai Selesai Dipahami'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-gray-200">
                <BookOpenText size={36} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-500">Tidak ada materi pada kategori ini.</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-3 text-xs text-turquoise font-black underline"
                >
                  Lihat Semua Modul
                </button>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: Desktop-Only Rich Sidebar & Cheat Sheet      */}
          {/* ========================================================== */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-24 self-start">

            {/* Sidebar Card 1: Cheat Sheet Saku */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-turquoise-surface via-white to-pink-light/30 border-2 border-turquoise/30 shadow-card">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
                  <Lightbulb size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 font-roboto">Cheat Sheet Saku</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Trik Hitung Cepat 1 Detik</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-2xl bg-white border border-turquoise/20 shadow-sm flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-pink-soft text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                    %
                  </span>
                  <div>
                    <span className="font-black text-gray-900">Diskon 25%</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Langsung bagi 4 dari harga asli.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-turquoise/20 shadow-sm flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-turquoise text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                    x̄
                  </span>
                  <div>
                    <span className="font-black text-gray-900">Rata-rata Cepat</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Ambil patokan tengah, lalu hitung selisihnya.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-turquoise/20 shadow-sm flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-pink-soft text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                    :
                  </span>
                  <div>
                    <span className="font-black text-gray-900">Rasio 2 : 3</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Total 5 bagian. Nilai 1 bagian = Total ÷ 5.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Card 2: Gamified Quest Milestones */}
            <div className="p-5 rounded-3xl bg-white border-2 border-turquoise/30 shadow-card">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink">
                  <Target size={20} weight="bold" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 font-roboto">Misi Sprint Hari Ini</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Kumpulkan Poin Numerasi</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-turquoise-surface/70 text-turquoise-deep font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-turquoise" />
                    <span>Login & Masuk Belajar</span>
                  </div>
                  <span className="badge-pink !py-0.5 !px-2 text-[10px] font-black">+10 XP</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-turquoise-surface/70 text-turquoise-deep font-bold">
                  <div className="flex items-center gap-2">
                    {completed.length > 0 ? (
                      <CheckCircle size={16} weight="fill" className="text-turquoise" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span>Pahami 1 Modul</span>
                  </div>
                  <span className="badge-pink !py-0.5 !px-2 text-[10px] font-black">+20 XP</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-turquoise-surface/70 text-turquoise-deep font-bold">
                  <div className="flex items-center gap-2">
                    {completed.length === materials.length ? (
                      <CheckCircle size={16} weight="fill" className="text-turquoise" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span>Tuntaskan Semua Modul</span>
                  </div>
                  <span className="badge-pink !py-0.5 !px-2 text-[10px] font-black">+50 XP</span>
                </div>
              </div>
            </div>

            {/* Sidebar Card 3: Pro Membership Callout */}
            {!user?.isPaid && (
              <div
                className="p-5 rounded-3xl border-2 border-pink-soft/30 shadow-card text-center"
                style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffffff 100%)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center mx-auto mb-2.5 shadow-pink">
                  <Crown size={24} weight="fill" />
                </div>
                <h4 className="text-sm font-black text-gray-900 font-roboto">Buka Semua Modul Pro</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Akses modul Rata-rata Data dan Perbandingan Rasio tanpa batas.
                </p>
                <button
                  onClick={() => setPaywallTarget(materials.find(m => m.isPremium) || materials[1])}
                  className="btn-accent text-xs py-2.5 px-4 w-full mt-3 font-black shadow-pink"
                >
                  <Sparkle size={15} weight="fill" />
                  Upgrade Akun Pro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP-ONLY: Bottom Decorative Educational Strip            */}
        {/* ============================================================ */}
        <div
          className="hidden md:flex items-center justify-between mt-12 mb-6 px-8 py-5 rounded-3xl border-2 border-turquoise/20 shadow-soft"
          style={{ background: 'linear-gradient(135deg, #e8fafb 0%, #fff0f6 60%, #f0fbff 100%)' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
              <GraduationCap size={22} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">NumeracySprint Mastery</p>
              <p className="text-sm font-black text-turquoise-deep">Konsep Dipahami? Uji Kemampuanmu di Menu Latihan!</p>
            </div>
          </div>

          <a
            href="/exercise"
            className="btn-primary text-xs py-2.5 px-5 font-black"
          >
            <span>Mulai Latihan Soal</span>
            <ArrowRight size={15} weight="bold" />
          </a>
        </div>

      </main>

      {/* Paywall Modal Component */}
      <PaywallModal
        isOpen={!!paywallTarget}
        onClose={() => setPaywallTarget(null)}
        materialTitle={paywallTarget?.title}
      />
    </div>
  )
}
