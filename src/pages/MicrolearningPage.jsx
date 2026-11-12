import React, { useState, useEffect } from 'react'
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

export default function MicrolearningPage() {
  const { user } = useUser()
  const [openId, setOpenId] = useState(1)
  const [paywallTarget, setPaywallTarget] = useState(null)
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10">
        {/* Header Hero banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge-pink">
                <Sparkle size={13} weight="fill" /> Modul Microlearning
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
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-roboto text-gray-900 tracking-tight">
              Materi Numerasi Interaktif
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Pelajari konsep praktis matematika dalam waktu singkat (3-5 menit per modul).
            </p>
          </div>

          {/* Progress pill widget */}
          <div className="bg-gradient-to-r from-turquoise-surface to-pink-light/40 p-4 rounded-3xl border-2 border-turquoise shrink-0 shadow-card">
            <div className="flex items-center justify-between text-xs font-black text-turquoise-deep mb-2 gap-4">
              <span>Progres Selesai:</span>
              <span className="tabular-nums text-pink-hover font-black">{completed.length} / {materials.length} Modul</span>
            </div>
            <div className="h-3 w-48 bg-white rounded-full overflow-hidden p-0.5 border border-turquoise/20">
              <div
                className="h-full bg-gradient-to-r from-turquoise via-[#209ba5] to-pink-soft rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(completed.length / materials.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Materials Accordion List - BLUE CARDS */}
        <div className="space-y-4">
          {materials.map((mat, idx) => {
            const isOpen = openId === mat.id
            const isDone = completed.includes(mat.id)
            const isLocked = mat.isPremium && !user?.isPaid

            return (
              <div
                key={mat.id}
                className="card-blue relative transition-all duration-200 border-2 border-white/25 shadow-lg"
              >
                {/* Header Button */}
                <button
                  onClick={() => handleTopicClick(mat)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shrink-0 shadow-soft">
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
                          <span className="badge-pink text-[10px] uppercase font-black tracking-wider py-0.5 px-2 flex items-center gap-1">
                            <LockKey size={12} weight="fill" /> Pro
                          </span>
                        )}
                        {isDone && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white text-turquoise-deep shadow-sm">
                            <CheckCircle size={13} weight="fill" className="text-turquoise" /> Selesai
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/85 mt-1 line-clamp-1 font-medium">{mat.summary}</p>
                    </div>
                  </div>

                  {/* Toggle Indicator */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
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
                  <div className="mt-6 pt-6 border-t border-white/20 animate-pop-in">
                    {/* Read time pill */}
                    <div className="flex items-center gap-2 text-[11px] font-bold text-white/80 mb-3">
                      <Clock size={14} weight="bold" />
                      <span>Estimasi baca: ~3 menit</span>
                    </div>

                    {/* Reading Content with bold formatting */}
                    <div className="card-inner-glass text-xs sm:text-sm text-white/95 font-normal">
                      <FormattedContent text={mat.content} />
                    </div>

                    {/* Rich Media (Image / Video) */}
                    <MediaRenderer media={mat.media} />

                    {/* Completion button */}
                    <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-end">
                      <button
                        onClick={() => markComplete(mat.id)}
                        className={`text-xs py-2.5 px-5 rounded-2xl font-extrabold transition-all duration-150 active:scale-[0.97] flex items-center gap-2 ${
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
