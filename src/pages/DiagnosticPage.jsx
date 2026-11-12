import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navbar from '../components/Navbar'
import { diagnosticQuestions, calculateLevel } from '../data/diagnosticQuestions'
import {
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkle,
  Trophy,
  BookOpenText,
  House,
  Target,
  CheckFat,
  Lightning,
  Check,
  Clock,
  Lightbulb,
  Fire,
  ArrowsClockwise,
  GraduationCap,
  Star,
  ListNumbers,
  Compass,
} from '@phosphor-icons/react'

export default function DiagnosticPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const { user, saveDiagnosticResult } = useUser()
  const navigate = useNavigate()

  const question = diagnosticQuestions[currentIndex]
  const total = diagnosticQuestions.length

  const handleSelect = (label) => {
    setAnswers((prev) => ({ ...prev, [question.id]: label }))
  }

  const handleSubmit = async () => {
    let correct = 0
    diagnosticQuestions.forEach((q) => {
      const chosen = answers[q.id]
      const correctOption = q.options.find((o) => o.correct)
      if (chosen === correctOption.label) correct++
    })
    const score = Math.round((correct / total) * 100)
    const levelInfo = calculateLevel(score)
    const data = { score, correct, total, levelInfo }
    setResult(data)
    await saveDiagnosticResult(data)
    setSubmitted(true)
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentIndex(0)
    setSubmitted(false)
    setResult(null)
  }

  const allAnswered = diagnosticQuestions.every((q) => answers[q.id])

  // ==============================================================
  // RESULT SCREEN
  // ==============================================================
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-white pb-28">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10">

          {/* Desktop-only Grounded Status Ribbon (No Float) */}
          <div className="hidden lg:grid grid-cols-3 gap-3.5 mb-6 p-2 rounded-3xl bg-white border-2 border-turquoise/25 shadow-soft">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-turquoise-surface/80 to-white border border-turquoise/15 hover:border-turquoise/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft shrink-0">
                <Trophy size={20} weight="fill" className="text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-turquoise" />
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Status Evaluasi</p>
                </div>
                <p className="text-xs font-black text-turquoise-deep font-roboto">Hasil Diagnostik Sah</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-light/60 to-white border border-pink-soft/20 animate-pink-breathe transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink shrink-0">
                <Star size={20} weight="fill" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-soft opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-hover"></span>
                  </span>
                  <p className="text-[10px] text-pink-hover font-black uppercase tracking-wider">Reward Prestasi</p>
                </div>
                <p className="text-xs font-black text-gray-900">+100 XP Diagnostik 🔥</p>
              </div>
            </div>

            <div className="shimmer-card flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-turquoise-surface/60 via-white to-turquoise-surface/40 border border-turquoise/15 hover:border-turquoise/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft shrink-0">
                <Compass size={20} weight="bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Rute Sprint</p>
                </div>
                <p className="text-xs font-black text-turquoise-deep">Modul Rekomendasi Terbuka</p>
              </div>
            </div>
          </div>

          {/* Result Layout: 2 Columns on Desktop, 1 Column on Mobile */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">

            {/* Main Result Area (8 cols on desktop) */}
            <div className="lg:col-span-8">
              <div className="card-blue-vibrant text-center relative overflow-hidden border-2 border-white/30 shadow-2xl">
                {/* Desktop-only subtle floating math motifs */}
                <div className="hidden md:block absolute -right-6 -bottom-6 text-white/[0.08] text-9xl font-mono font-black select-none pointer-events-none">
                  ★
                </div>
                <div className="hidden md:flex absolute top-6 right-6 w-12 h-12 rounded-2xl bg-pink-soft items-center justify-center text-white shadow-pink rotate-12">
                  <Sparkle size={24} weight="fill" />
                </div>

                <div className="w-20 h-20 rounded-3xl bg-white text-turquoise-dark flex items-center justify-center mx-auto mb-4 shadow-card">
                  <Trophy size={44} weight="fill" className="text-yellow-400" />
                </div>

                <span className="badge-pink mb-2 shadow-pink">
                  <Sparkle size={13} weight="fill" /> Hasil Diagnostik Selesai
                </span>

                <h2 className="text-2xl sm:text-3xl font-black font-roboto text-white tracking-tight">
                  Level {result.levelInfo.level}
                </h2>

                {/* Score Box */}
                <div className="my-6 inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl px-8 py-5 shadow-soft">
                  <p className="text-[11px] uppercase font-extrabold tracking-wider text-white/80">
                    Skor Pemahaman Numerasi
                  </p>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-1 tabular-nums">
                    {result.score}
                    <span className="text-xl text-white/60 font-medium"> / 100</span>
                  </div>
                  <p className="text-xs text-white/95 mt-1.5 font-bold flex items-center justify-center gap-1.5">
                    <CheckFat size={14} weight="fill" className="text-emerald-300" />
                    <span>{result.correct} dari {result.total} soal terjawab tepat</span>
                  </p>
                </div>

                {/* Recommendation card */}
                <div className="card-inner-white text-left text-gray-800 mb-6">
                  <div className="flex items-center gap-2 text-turquoise-deep font-extrabold text-sm mb-1.5">
                    <Target size={18} weight="bold" /> Rekomendasi Belajarmu:
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {result.levelInfo.recommendation}
                  </p>
                </div>

                {/* Questions breakdown */}
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center justify-between text-xs font-black text-white/80 px-1">
                    <span>Pembahasan Soal & Jawaban:</span>
                    <span className="tabular-nums">{result.correct}/{result.total} Benar</span>
                  </div>
                  {diagnosticQuestions.map((q) => {
                    const chosen = answers[q.id]
                    const correct = q.options.find((o) => o.correct)
                    const isCorrect = chosen === correct.label
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-white/15 border border-white/25 text-white shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                                <CheckCircle size={15} weight="fill" />
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-pink-soft shrink-0 shadow-sm">
                                <XCircle size={15} weight="fill" />
                              </span>
                            )}
                            <span className="font-extrabold text-xs uppercase tracking-wider text-white">
                              {q.topic}
                            </span>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-400/20 text-emerald-200' : 'bg-pink-soft/30 text-pink-200'}`}>
                            {isCorrect ? 'Tepat' : `Jawabanmu: ${chosen || '-'}`}
                          </span>
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed font-normal mt-1">
                          {q.explanation}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => navigate('/microlearning')}
                    className="btn-accent text-sm py-3 px-6 font-extrabold cursor-pointer"
                  >
                    <BookOpenText size={20} weight="bold" />
                    <span>Buka Materi Belajar</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-outline-white text-sm py-3 px-6 cursor-pointer"
                  >
                    <House size={20} weight="bold" />
                    <span>Kembali ke Dashboard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop-Only Result Sidebar (4 cols) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-24 self-start">

              {/* Achievement Passport Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-turquoise-surface via-white to-pink-light/30 border-2 border-turquoise/30 shadow-card">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
                    <GraduationCap size={20} weight="bold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 font-roboto">Paspor Prestasi</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Kartu Hasil Belajar</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-turquoise/20 shadow-sm space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-400 font-bold">Nama Siswa:</span>
                    <span className="font-black text-gray-800">{user?.name || 'Sobat Numerasi'}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-400 font-bold">Level Capaian:</span>
                    <span className="badge-pink !py-0.5 !px-2 text-[10px] font-black">Level {result.levelInfo.level}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-400 font-bold">Total Nilai:</span>
                    <span className="font-mono font-black text-turquoise-deep text-sm tabular-nums">{result.score} / 100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-bold">Reward XP:</span>
                    <span className="font-black text-pink-hover">+100 XP 🔥</span>
                  </div>
                </div>

                <button
                  onClick={handleRetake}
                  className="btn-outline-turquoise w-full text-xs py-2.5 mt-3.5 font-black flex items-center justify-center gap-1.5"
                >
                  <ArrowsClockwise size={16} weight="bold" />
                  <span>Ulangi Tes Diagnostik</span>
                </button>
              </div>

              {/* Next Step Roadmap */}
              <div className="p-5 rounded-3xl bg-white border-2 border-turquoise/30 shadow-card">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink">
                    <Compass size={20} weight="fill" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 font-roboto">Langkah Berikutnya</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Rute Belajar Rekomendasi</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <CheckCircle size={16} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">1. Tes Diagnostik Kilat</span>
                      <p className="text-[10px] text-emerald-600">Selesai dievaluasi!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-turquoise-surface text-turquoise-deep font-bold">
                    <div className="w-4 h-4 rounded-full bg-turquoise text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <span>Baca Modul Rekomendasi</span>
                      <p className="text-[10px] text-turquoise font-medium">Buka materi 3 menit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50 text-gray-400">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <span>Latihan Soal Adaptif</span>
                      <p className="text-[10px] text-gray-400">Uji ketepatan waktu</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    )
  }

  // ==============================================================
  // ACTIVE QUESTION SCREEN
  // ==============================================================
  return (
    <div className="min-h-screen bg-white pb-28">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10">

        {/* ============================================================ */}
        {/* DESKTOP-ONLY: Grounded Diagnostik Status Bar (No Float)       */}
        {/* ============================================================ */}
        <div className="hidden lg:grid grid-cols-3 gap-3.5 mb-6 p-2 rounded-3xl bg-white border-2 border-turquoise/25 shadow-soft">
          {/* Tile 1: Tantangan Kilat */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-turquoise-surface/80 to-white border border-turquoise/15 hover:border-turquoise/40 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft shrink-0">
              <Stethoscope size={20} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-turquoise" />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Format Diagnostik</p>
              </div>
              <p className="text-xs font-black text-turquoise-deep">3 Soal Kilat Logika</p>
            </div>
          </div>

          {/* Tile 2: Estimasi Waktu with Live Beacon */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-light/60 to-white border border-pink-soft/20 animate-pink-breathe transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink shrink-0">
              <Clock size={20} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-soft opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-hover"></span>
                </span>
                <p className="text-[10px] text-pink-hover font-black uppercase tracking-wider">Estimasi Waktu</p>
              </div>
              <p className="text-xs font-black text-gray-900">&lt; 1 Menit / Soal</p>
            </div>
          </div>

          {/* Tile 3: Format Soal with Shimmer */}
          <div className="shimmer-card flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-turquoise-surface/60 via-white to-turquoise-surface/40 border border-turquoise/15 hover:border-turquoise/40 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft shrink-0">
              <Lightning size={20} weight="fill" className="text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Metode Uji</p>
              </div>
              <p className="text-xs font-black text-turquoise-deep">Konteks Nyata Belanja</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE QUESTION STEP BAR (DESKTOP + MOBILE)            */}
        {/* ============================================================ */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {diagnosticQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex
              const isAnswered = !!answers[q.id]
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-turquoise-deep text-white shadow-soft scale-105'
                      : isAnswered
                      ? 'bg-turquoise-light text-turquoise-deep border border-turquoise/30'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span>Soal {idx + 1}</span>
                  {isAnswered && <Check size={12} weight="bold" className="text-turquoise-deep" />}
                </button>
              )
            })}
          </div>

          <span className="badge-pink text-xs font-black shadow-pink">
            {question.topic}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden p-0.5 border border-gray-200/50">
          <div
            className="h-full bg-gradient-to-r from-turquoise via-[#209ba5] to-pink-soft transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* ============================================================ */}
        {/* QUIZ MAIN LAYOUT: 2 Columns on Desktop, 1 Column on Mobile   */}
        {/* ============================================================ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">

          {/* Question Card (8 cols on desktop, full on mobile) */}
          <div className="lg:col-span-8">
            <div className="card-blue relative border-2 border-white/25 shadow-2xl overflow-hidden">
              {/* Subtle math motif in background */}
              <div className="hidden sm:block absolute right-4 bottom-4 text-white/[0.08] text-8xl font-mono font-black pointer-events-none select-none">
                ?
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="badge-glass text-[11px] font-bold">
                  Pertanyaan #{currentIndex + 1} dari {total}
                </span>
                <span className="badge-glass text-[11px] font-bold">
                  {question.topic}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-roboto text-white mb-6 leading-relaxed relative z-10">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 relative z-10">
                {question.options.map((opt) => {
                  const isSelected = answers[question.id] === opt.label
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      className={`w-full text-left flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                        isSelected
                          ? 'border-pink-soft bg-white text-gray-900 shadow-pink font-bold'
                          : 'border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors shadow-sm ${
                            isSelected
                              ? 'bg-pink-soft text-white'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-sm leading-snug">{opt.text}</span>
                      </div>

                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-pink-soft text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check size={14} weight="bold" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20 relative z-10">
                <button
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  disabled={currentIndex === 0}
                  className="btn-outline-white text-xs py-2.5 px-4 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ArrowLeft size={16} weight="bold" />
                  <span>Sebelumnya</span>
                </button>

                {currentIndex < total - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    disabled={!answers[question.id]}
                    className="btn-white text-xs py-2.5 px-5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="btn-accent text-xs py-3 px-6 font-extrabold disabled:opacity-40 disabled:pointer-events-none shadow-pink cursor-pointer flex items-center gap-2"
                  >
                    <span>Lihat Hasil Diagnostik</span>
                    <Sparkle size={18} weight="fill" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop-Only Sidebar: Peta Soal & Trik (4 cols) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-24 self-start">

            {/* Peta Diagnostik */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-turquoise-surface via-white to-pink-light/30 border-2 border-turquoise/30 shadow-card">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center shadow-soft">
                  <ListNumbers size={20} weight="bold" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 font-roboto">Peta Soal Diagnostik</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Status Jawabanmu</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {diagnosticQuestions.map((q, idx) => {
                  const isCurrent = idx === currentIndex
                  const isAnswered = !!answers[q.id]
                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-turquoise bg-turquoise-surface text-turquoise-deep font-black shadow-sm'
                          : isAnswered
                          ? 'border-gray-200 bg-white text-gray-800 font-bold hover:border-turquoise/50'
                          : 'border-gray-100 bg-gray-50/70 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          isCurrent ? 'bg-turquoise text-white' : isAnswered ? 'bg-turquoise-light text-turquoise-deep' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs leading-none">{q.topic}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-normal">
                            {isAnswered ? `Pilihan: ${answers[q.id]}` : 'Belum dijawab'}
                          </p>
                        </div>
                      </div>

                      {isAnswered ? (
                        <CheckCircle size={18} weight="fill" className="text-turquoise" />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">Kosong</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Trik Cepat Menjawab */}
            <div className="p-5 rounded-3xl bg-white border-2 border-turquoise/30 shadow-card">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-soft to-pink-hover text-white flex items-center justify-center shadow-pink">
                  <Lightbulb size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 font-roboto">Trik Cepat Logika</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Anti Pusing Menghitung</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="p-2.5 rounded-xl bg-turquoise-surface border border-turquoise/20">
                  <p className="font-bold text-turquoise-deep">1. Eliminasi Angka Aneh</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Diskon 25% dari 200rb pasti di bawah 200rb tapi tidak mungkin tinggal 50rb. Coret yang tidak wajar!
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-light/40 border border-pink-soft/20">
                  <p className="font-bold text-pink-hover">2. Rata-rata Patokan</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Cari angka tengah terdekat. Selisih plus dan minus akan saling meniadakan.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
