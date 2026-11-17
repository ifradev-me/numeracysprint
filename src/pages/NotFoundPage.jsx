import React from 'react'
import { Link } from 'react-router-dom'
import { SmileySad, House, ArrowLeft, Sparkle, Question, Brain } from '@phosphor-icons/react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-edubg text-edutext flex items-center justify-center p-4 selection:bg-edupink selection:text-white">
      <div className="w-full max-w-md">
        <div className="raised text-center p-8 space-y-6">
          <div className="w-20 h-20 rounded-3xl inset flex items-center justify-center mx-auto text-edupink">
            <SmileySad size={48} weight="bold" />
          </div>

          <div className="space-y-1">
            <span className="badge-chip text-xs">Error 404</span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Tautan yang kamu tuju sepertinya tidak ada dalam rute platform EduSpark.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/dashboard" className="btn-accent text-xs py-3 px-5 flex items-center justify-center gap-2">
              <House size={16} weight="bold" />
              <span>Ke Dashboard</span>
            </Link>
            <Link to="/" className="btn-secondary text-xs py-3 px-5 flex items-center justify-center gap-2">
              <ArrowLeft size={16} weight="bold" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
