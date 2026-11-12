import React from 'react'
import { Link } from 'react-router-dom'
import { SmileySad, House, ArrowLeft, Sparkle, Question } from '@phosphor-icons/react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Blue Card */}
        <div className="card-blue-vibrant text-center relative border-2 border-white/30 shadow-2xl">
          {/* Decorative element - visible only on desktop */}
          <div className="hidden md:flex absolute -top-4 -right-4 w-14 h-14 bg-pink-soft rounded-2xl items-center justify-center text-white shadow-pink rotate-12">
            <Sparkle size={26} weight="fill" />
          </div>
          <div className="hidden md:flex absolute -bottom-3 -left-3 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl items-center justify-center text-white -rotate-12">
            <Question size={24} weight="bold" />
          </div>

          <div className="w-20 h-20 rounded-3xl bg-white/15 border-2 border-white/30 flex items-center justify-center mx-auto mb-5 text-white">
            <SmileySad size={48} weight="duotone" />
          </div>

          <span className="badge-pink mb-3">Error 404</span>
          <h1 className="text-3xl sm:text-4xl font-black font-roboto text-white mb-2 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-white/85 text-xs sm:text-sm max-w-sm mx-auto mb-8 font-medium">
            Waduh, tautan yang kamu buka sepertinya salah perhitungan atau belum ada dalam rute NumeracySprint!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard" className="btn-accent text-sm py-3 px-6 font-black">
              <House size={20} weight="bold" />
              <span>Kembali ke Dashboard</span>
            </Link>
            <Link to="/" className="btn-outline-white text-sm py-3 px-6 font-bold">
              <ArrowLeft size={20} weight="bold" />
              <span>Halaman Awal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
