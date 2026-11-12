import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  MathOperations,
  ArrowRight,
  Sparkle,
  LockKey,
  CheckCircle,
  Lightning,
  Student,
  Percent,
  ChartBar,
  Scales,
  Fire,
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
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Desktop-only fun decorative background math shapes */}
      <div className="hidden md:block absolute -top-16 -left-16 w-72 h-72 bg-turquoise-light rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="hidden md:block absolute -bottom-16 -right-16 w-80 h-80 bg-pink-light rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Desktop-only subtle floating math symbols watermark */}
      <div className="hidden lg:block absolute top-12 right-24 text-gray-200/60 font-mono text-9xl font-black select-none pointer-events-none">
        %
      </div>
      <div className="hidden lg:block absolute bottom-12 left-20 text-gray-200/60 font-mono text-9xl font-black select-none pointer-events-none">
        ÷
      </div>

      {/* Desktop-only fun floating badges with purposeful micro-copy */}
      <div className="hidden lg:flex absolute top-20 left-12 bg-white shadow-card border border-turquoise/20 rounded-2xl p-3.5 items-center gap-3 animate-float-slow">
        <div className="w-10 h-10 rounded-xl bg-turquoise text-white flex items-center justify-center font-bold shadow-soft">
          <Lightning size={22} weight="fill" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-900">Sprint Diagnostik</p>
          <p className="text-[10px] text-gray-400">Diagnosis 3 Menit</p>
        </div>
      </div>

      <div className="hidden lg:flex absolute bottom-24 right-14 bg-white shadow-card border border-pink-soft/20 rounded-2xl p-3.5 items-center gap-3 animate-float-reverse">
        <div className="w-10 h-10 rounded-xl bg-pink-soft text-white flex items-center justify-center font-bold shadow-pink">
          <Sparkle size={22} weight="fill" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-900">Microlearning Adaptif</p>
          <p className="text-[10px] text-gray-400">Bite-sized Praktis</p>
        </div>
      </div>

      {/* Main Form container */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white shadow-card-blue mb-3 group hover:rotate-6 transition-transform">
            <MathOperations size={44} weight="bold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-roboto tracking-tight">
            Numeracy<span className="text-turquoise">Sprint</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1.5 font-medium">
            Tingkatkan Nalar Matematika & Keputusan Nyata
          </p>
        </div>

        {/* Card: BLUE with rich texture, math pattern and pink CTA button */}
        <div className="card-blue-vibrant relative shadow-2xl border-2 border-white/30">
          <div className="flex items-center justify-between mb-3">
            <span className="badge-pink">
              <Sparkle size={13} weight="fill" /> Mulai Petualangan
            </span>
            <div className="text-white/80 text-xs font-bold flex items-center gap-1.5">
              <Student size={16} weight="bold" /> Area Siswa
            </div>
          </div>

          <h2 className="text-2xl font-black font-roboto text-white mb-1 tracking-tight">
            Selamat Datang!
          </h2>
          <p className="text-white/85 text-xs mb-6 leading-relaxed">
            Masukkan nama lengkapmu untuk mulai latihan tes diagnosis dan membuka modul numerasi adaptif.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-white uppercase tracking-wider mb-2">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                className="input-field-dark text-sm placeholder:text-white/50 font-medium"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                autoFocus
              />
              {error && (
                <div className="mt-2 text-xs font-bold text-white bg-pink-soft/90 p-2.5 rounded-xl border border-white/40 shadow-sm animate-pop-in">
                  {error}
                </div>
              )}
            </div>

            {/* Accent Button: Soft Pink for refreshing pop with tactile active scale */}
            <button
              type="submit"
              className="btn-accent w-full text-sm py-3.5 shadow-pink font-extrabold"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          </form>

          {/* Quick value props pill strip */}
          <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-center text-[11px] text-white">
            <div className="card-inner-glass !p-2 flex flex-col items-center justify-center font-bold">
              <Percent size={18} weight="bold" className="text-white mb-1" />
              <span>Persentase</span>
            </div>
            <div className="card-inner-glass !p-2 flex flex-col items-center justify-center font-bold">
              <ChartBar size={18} weight="bold" className="text-white mb-1" />
              <span>Rata-Rata</span>
            </div>
            <div className="card-inner-glass !p-2 flex flex-col items-center justify-center font-bold">
              <Scales size={18} weight="bold" className="text-white mb-1" />
              <span>Rasio & Skala</span>
            </div>
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="text-center mt-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-turquoise font-bold transition-all bg-gray-50 hover:bg-turquoise-light/50 px-4 py-2 rounded-full border border-gray-100 shadow-sm active:scale-95"
          >
            <LockKey size={14} weight="bold" />
            <span>Panel Admin NumeracySprint</span>
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-[11px] text-gray-400 py-2">
        NumeracySprint &copy; 2026 &bull; Pembelajaran Numerasi Berbasis Diagnosis
      </div>
    </div>
  )
}
