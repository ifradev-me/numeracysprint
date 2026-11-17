import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import PaywallModal from '../components/PaywallModal'
import { defaultMaterials } from '../data/materials'
import { useUser } from '../context/UserContext'
import DynamicIcon from '../components/DynamicIcon'
import { loadCustomMaterials } from '../services/api'
import {
  BookOpenText,
  CaretDown,
  CheckCircle,
  Lock,
  LockOpen,
  Crown,
  Sparkle,
  ImageSquare,
  PlayCircle,
  Clock,
  Lightbulb,
  Check,
  Percent,
  ChartBar,
  Scales,
  Brain,
  Target,
  ArrowRight,
} from '@phosphor-icons/react'

function MediaRenderer({ media }) {
  if (!media || media.length === 0) return null
  return (
    <div className="mt-5 space-y-4">
      {media.map((item, i) => {
        if (item.type === 'image') {
          return (
            <div key={i} className="rounded-2xl overflow-hidden inset p-1 bg-black/5">
              <img
                src={item.url}
                alt={item.caption || 'Ilustrasi Konsep'}
                className="w-full object-cover max-h-72 rounded-xl"
              />
              {item.caption && (
                <div className="p-3 text-xs text-edutext-muted flex items-center gap-2">
                  <ImageSquare size={16} weight="bold" className="text-edupink" />
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
              <div key={i} className="rounded-2xl overflow-hidden inset p-1 aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title={item.caption || 'Video Edukasi'}
                />
              </div>
            )
          }
          return (
            <video key={i} src={item.url} controls className="w-full rounded-2xl inset p-1" />
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
    <div className="space-y-2.5 leading-relaxed text-sm text-edutext">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-2" />
        const parts = line.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={lIdx}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-black text-edupink font-display">
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
  { id: 'pk', label: 'Pengetahuan Kuantitatif', icon: Percent },
  { id: 'pm', label: 'Penalaran Matematika', icon: ChartBar },
  { id: 'pku', label: 'Penalaran Kuantitatif', icon: Scales },
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

    loadCustomMaterials().then((serverMaterials) => {
      if (serverMaterials && serverMaterials.length > 0) {
        setMaterials([...defaultMaterials, ...serverMaterials])
      }
    })
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

  // Filter materials based on category
  const filteredMaterials = useMemo(() => {
    if (activeCategory === 'all') return materials
    if (activeCategory === 'pk') {
      return materials.filter(m => m.title.toLowerCase().includes('persen') || m.title.toLowerCase().includes('aljabar') || m.title.toLowerCase().includes('kuantitatif'))
    }
    if (activeCategory === 'pm') {
      return materials.filter(m => m.title.toLowerCase().includes('rata') || m.title.toLowerCase().includes('mean') || m.title.toLowerCase().includes('diskon'))
    }
    if (activeCategory === 'pku') {
      return materials.filter(m => m.title.toLowerCase().includes('rasio') || m.title.toLowerCase().includes('banding') || m.title.toLowerCase().includes('proporsi'))
    }
    return materials
  }, [materials, activeCategory])

  const progressPercent = Math.round((completed.length / (materials.length || 1)) * 100)

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        {/* ============================================================ */}
        {/* HEADER HERO BANNER                                           */}
        {/* ============================================================ */}
        <div className="raised p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge-chip text-[11px]">
                  <Sparkle size={13} weight="fill" className="text-edupink" /> Modul Microlearning
                </span>
                {user?.isPaid ? (
                  <span className="badge-accent text-[11px] flex items-center gap-1">
                    <Crown size={13} weight="fill" /> Akses Penuh Pro
                  </span>
                ) : (
                  <span className="badge-chip text-[11px] text-edutext-muted">
                    Pratinjau Gratis
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext">
                Materi Pembelajaran Matematika
              </h1>
              <p className="text-xs sm:text-sm text-edutext-muted font-medium leading-relaxed">
                Pelajari konsep inti Pengetahuan Kuantitatif, Penalaran Matematika, dan Penalaran Kuantitatif dengan analogi praktis dan trik cepat.
              </p>
            </div>

            {/* Progress Card */}
            <div className="inset p-4 rounded-2xl min-w-[200px] text-center space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-edutext-muted">Progres Modul</span>
                <span className="text-edupink tabular-nums font-black">{progressPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-[11px] text-edutext-muted">
                {completed.length} dari {materials.length} topik dipahami
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CATEGORY FILTER TABS                                         */}
        {/* ============================================================ */}
        <div className="flex p-1.5 inset rounded-2xl gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'raised-sm text-edupink bg-edubg'
                    : 'text-edutext-muted hover:text-edutext'
                }`}
              >
                <Icon size={16} weight={isActive ? 'bold' : 'regular'} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION MODULES LIST                                       */}
        {/* ============================================================ */}
        <div className="space-y-4">
          {filteredMaterials.map((mat) => {
            const isOpen = openId === mat.id
            const isCompleted = completed.includes(mat.id)
            const isLocked = mat.isPremium && !user?.isPaid

            return (
              <div
                key={mat.id}
                className="raised overflow-hidden transition-all duration-200"
              >
                {/* Header item */}
                <div
                  onClick={() => handleTopicClick(mat)}
                  className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none hover:border-edupink"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl inset flex items-center justify-center text-edupink shrink-0">
                      <DynamicIcon name={mat.iconName || 'BookOpenText'} size={24} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black font-display text-edutext">
                          {mat.title}
                        </h3>
                        {mat.isPremium ? (
                          isLocked ? (
                            <span className="badge-chip text-[10px] text-edupink flex items-center gap-1">
                              <Lock size={12} weight="bold" /> Pro
                            </span>
                          ) : (
                            <span className="badge-accent text-[10px] flex items-center gap-1">
                              <Crown size={12} weight="fill" /> Pro Unlocked
                            </span>
                          )
                        ) : (
                          <span className="badge-chip text-[10px] text-edupink">
                            Gratis
                          </span>
                        )}
                        {isCompleted && (
                          <span className="badge-accent text-[10px] flex items-center gap-1">
                            <CheckCircle size={12} weight="fill" /> Selesai
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-edutext-muted line-clamp-1 font-medium">
                        {mat.summary}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl raised-sm flex items-center justify-center text-edutext-muted shrink-0">
                    {isLocked ? (
                      <Lock size={16} weight="bold" className="text-edupink" />
                    ) : (
                      <CaretDown
                        size={16}
                        weight="bold"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-edupink' : ''}`}
                      />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && !isLocked && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/60 space-y-5 animate-pop-in">
                    <div className="inset p-5 rounded-2xl space-y-4">
                      <FormattedContent text={mat.content} />
                      <MediaRenderer media={mat.media} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => markComplete(mat.id)}
                        className={`btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 ${
                          isCompleted ? 'text-edupink font-black' : ''
                        }`}
                      >
                        <CheckCircle size={16} weight={isCompleted ? 'fill' : 'bold'} />
                        <span>{isCompleted ? 'Sudah Dipahami (Batalkan)' : 'Tandai Sudah Dipahami'}</span>
                      </button>

                      <span className="text-[11px] text-edutext-muted font-semibold">
                        Modul #{mat.id} &bull; EduSpark Learning
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={!!paywallTarget}
        onClose={() => setPaywallTarget(null)}
        materialTitle={paywallTarget?.title}
      />
    </div>
  )
}
