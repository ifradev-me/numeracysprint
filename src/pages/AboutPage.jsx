import React from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../context/UserContext'
import {
  UsersThree,
  WhatsappLogo,
  Sparkle,
  ShieldCheck,
  Code,
  MathOperations,
  DeviceMobile,
  CheckCircle,
  Lightbulb,
  Heart,
} from '@phosphor-icons/react'

export default function AboutPage() {
  const { teamInfo } = useUser()
  const cleanPhone = (teamInfo?.phone || '6281234567890').replace(/\D/g, '')
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Halo Tim NumeracySprint, saya ingin bertanya seputar platform dan pembelajaran numerasi!'
  )}`

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        {/* Hero Banner - Blue Card */}
        <div className="card-blue-vibrant text-center relative border-2 border-white/30 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-white text-turquoise-deep flex items-center justify-center mx-auto mb-4 shadow-soft">
            <MathOperations size={36} weight="bold" />
          </div>

          <span className="badge-pink mb-2">
            <Sparkle size={13} weight="fill" /> Inovasi Pembelajaran
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-roboto text-white tracking-tight">
            NumeracySprint Platform
          </h1>
          <p className="text-white/90 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed font-normal">
            Platform Microlearning Adaptif Berbasis Diagnosis untuk membantu siswa dan pemuda menguasai numerasi praktis kehidupan sehari-hari.
          </p>
        </div>

        {/* Dynamic Developer Team & Contact - BLUE CARD */}
        <div className="card-blue border-2 border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shadow-soft">
              <UsersThree size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-black font-roboto text-white tracking-tight">Tim Pengembang</h2>
              <p className="text-xs text-white/80">Layanan Dukungan Belajar & Aktivasi Akun</p>
            </div>
          </div>

          {/* Member Card */}
          <div className="card-inner-white text-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center font-black text-lg shadow-soft shrink-0">
                {teamInfo?.name ? teamInfo.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">{teamInfo?.name || 'Tim NumeracySprint'}</h3>
                <p className="text-xs text-turquoise-deep font-bold">{teamInfo?.role || 'Pengembang Platform'}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 font-mono">
                  <DeviceMobile size={14} weight="bold" /> +{cleanPhone}
                </p>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent text-xs py-2.5 px-4 font-bold shrink-0 shadow-pink"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Platform Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-inner-white border-2 border-turquoise/20 hover:border-turquoise transition-colors shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-turquoise-light text-turquoise-deep flex items-center justify-center mb-3 font-bold">
              <ShieldCheck size={22} weight="bold" />
            </div>
            <h4 className="font-black text-gray-900 text-sm mb-1">Berbasis Diagnosis</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Mengidentifikasi level penalaran awal secara objektif sebelum memilih modul belajar.
            </p>
          </div>

          <div className="card-inner-white border-2 border-turquoise/20 hover:border-turquoise transition-colors shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-pink-light text-pink-soft flex items-center justify-center mb-3 font-bold">
              <Sparkle size={22} weight="fill" />
            </div>
            <h4 className="font-black text-gray-900 text-sm mb-1">Microlearning</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Materi ringkas 3-5 menit dilengkapi analogi visual, gambar, dan video interaktif.
            </p>
          </div>

          <div className="card-inner-white border-2 border-turquoise/20 hover:border-turquoise transition-colors shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-turquoise-light text-turquoise-deep flex items-center justify-center mb-3 font-bold">
              <Code size={22} weight="bold" />
            </div>
            <h4 className="font-black text-gray-900 text-sm mb-1">Netlify Ready</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Arsitektur stateless serverless modern bertenaga Netlify Functions & Netlify Blobs.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
