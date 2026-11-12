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
} from '@phosphor-icons/react'

export default function DiagnosticPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const { saveDiagnosticResult } = useUser()
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

  const allAnswered = diagnosticQuestions.every((q) => answers[q.id])

  // ==============================================================
  // RESULT SCREEN
  // ==============================================================
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10">
          <div className="card-blue-vibrant text-center relative overflow-hidden border-2 border-white/30 shadow-2xl">
            {/* Desktop-only fun decorative math watermarks */}
            <div className="hidden md:block absolute -right-6 -bottom-6 text-white/[0.08] text-9xl font-mono font-black select-none pointer-events-none">
              ★
            </div>
            <div className="hidden md:flex absolute top-6 right-6 w-12 h-12 rounded-2xl bg-pink-soft items-center justify-center text-white shadow-pink rotate-12">
              <Sparkle size={24} weight="fill" />
            </div>

            <div className="w-20 h-20 rounded-3xl bg-white text-turquoise-dark flex items-center justify-center mx-auto mb-4 shadow-card">
              <Trophy size={44} weight="fill" className="text-yellow-400" />
            </div>

            <span className="badge-pink mb-2">
              <Sparkle size={13} weight="fill" /> Hasil Diagnostik Selesai
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-roboto text-white tracking-tight">
              Level {result.levelInfo.level}
            </h2>

            {/* Score Box */}
            <div className="my-6 inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl px-8 py-5 shadow-soft">
              <p className="text-[11px] uppercase font-extrabold tracking-wider text-white/80">
                Skor Diagnosis
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
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {result.levelInfo.recommendation}
              </p>
            </div>

            {/* Questions breakdown */}
            <div className="space-y-3 text-left mb-6">
              {diagnosticQuestions.map((q) => {
                const chosen = answers[q.id]
                const correct = q.options.find((o) => o.correct)
                const isCorrect = chosen === correct.label
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white/15 border border-white/25 text-white shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
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
                    <p className="text-xs text-white/90 leading-relaxed font-normal">
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
                className="btn-accent text-sm py-3 px-6 font-extrabold"
              >
                <BookOpenText size={20} weight="bold" />
                <span>Buka Materi Belajar</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-outline-white text-sm py-3 px-6"
              >
                <House size={20} weight="bold" />
                <span>Kembali ke Dashboard</span>
              </button>
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
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10">
        {/* Progress Tracker */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-turquoise text-white flex items-center justify-center font-bold shadow-soft">
              <Stethoscope size={20} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 tabular-nums">
                Soal {currentIndex + 1} dari {total}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Sprint Diagnostik Awal</p>
            </div>
          </div>

          <span className="badge-turquoise text-xs font-extrabold">{question.topic}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden p-0.5 border border-gray-200/50">
          <div
            className="h-full bg-gradient-to-r from-turquoise to-pink-soft transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* Blue Question Card */}
        <div className="card-blue relative border-2 border-white/25 shadow-2xl">
          {/* Subtle math motif in background */}
          <div className="hidden sm:block absolute right-4 bottom-4 text-white/[0.08] text-7xl font-mono font-black pointer-events-none select-none">
            ?
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="badge-glass text-[11px] font-bold">
              Pertanyaan #{currentIndex + 1}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-roboto text-white mb-6 leading-relaxed">
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
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
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
                    <span className="w-6 h-6 rounded-full bg-pink-soft text-white flex items-center justify-center shrink-0">
                      <Check size={14} weight="bold" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
              className="btn-outline-white text-xs py-2.5 px-4 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex < total - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                disabled={!answers[question.id]}
                className="btn-white text-xs py-2.5 px-5 disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Selanjutnya</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn-accent text-xs py-3 px-6 font-extrabold disabled:opacity-40 disabled:pointer-events-none shadow-pink"
              >
                <span>Lihat Hasil Diagnostik</span>
                <Sparkle size={18} weight="fill" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
