import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  Brain,
  ArrowRight,
  Sparkle,
  LockKey,
  CheckCircle,
  Timer,
  Student,
  Percent,
  ChartBar,
  Scales,
  ArrowLeft,
} from '@phosphor-icons/react'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login } = useUser()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Silakan ketik namamu dulu sebelum mulai!')
      return
    }
    if (name.trim().length < 2) {
      setError('Nama minimal harus 2 karakter ya.')
      return
    }
    login(name.trim())
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext flex flex-col justify-between p-4 sm:p-8 relative selection:bg-edupink selection:text-white">
      {/* Top Bar with back link to landing page */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-edutext-muted hover:text-eduaccent raised-sm px-3 py-1.5 transition-all"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="badge-chip text-[11px]">
          <Sparkle size={12} weight="fill" className="text-edupink" /> SNBT 2026
        </span>
      </div>

      {/* Main Login Form Container */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl raised mb-3 text-eduaccent">
            <Brain size={44} weight="bold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
            Edu<span className="text-edupink">Spark</span>
          </h1>
          <p className="text-edutext-muted text-xs sm:text-sm mt-1.5 font-medium">
            Taklukkan Matematika UTBK-SNBT, langkah demi langkah
          </p>
        </div>

        {/* Card Raised Neumorphic */}
        <div className="raised p-6 sm:p-8 relative space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/60">
            <span className="badge-chip text-[11px]">
              <Sparkle size={13} weight="fill" className="text-edupink" /> Masuk Siswa
            </span>
            <div className="text-edutext-muted text-xs font-bold flex items-center gap-1.5">
              <Student size={16} weight="bold" /> Area Latihan
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black font-display text-edutext">
              Selamat Datang!
            </h2>
            <p className="text-edutext-muted text-xs mt-1 leading-relaxed">
              Masukkan nama lengkapmu untuk mengakses try out ber-timer, tes evaluasi kemampuan, dan modul materi adaptif.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-edutext uppercase tracking-wider mb-2">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                className="input-inset text-sm font-semibold"
                placeholder="Contoh: Budi Pratama"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                autoFocus
              />
              {error && (
                <div className="mt-2 text-xs font-bold text-white bg-edudanger p-3 rounded-xl shadow-sm animate-pop-in">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-accent w-full text-sm py-3.5 font-extrabold"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          </form>

          {/* Quick Subtests Pill Strip */}
          <div className="pt-4 border-t border-white/60 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="inset p-2.5 flex flex-col items-center justify-center font-bold">
              <Percent size={18} weight="bold" className="text-eduaccent mb-1" />
              <span>Kuantitatif</span>
            </div>
            <div className="inset p-2.5 flex flex-col items-center justify-center font-bold">
              <ChartBar size={18} weight="bold" className="text-eduaccent mb-1" />
              <span>Penalaran</span>
            </div>
            <div className="inset p-2.5 flex flex-col items-center justify-center font-bold">
              <Timer size={18} weight="bold" className="text-eduaccent mb-1" />
              <span>Try Out Timer</span>
            </div>
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="text-center mt-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-edutext-muted hover:text-eduaccent font-bold raised-sm px-4 py-2 transition-all active:scale-95"
          >
            <LockKey size={14} weight="bold" />
            <span>Panel Admin EduSpark</span>
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-[11px] text-edutext-muted py-2">
        EduSpark &copy; 2026 &bull; Platform Belajar Matematika UTBK-SNBT
      </div>
    </div>
  )
}
