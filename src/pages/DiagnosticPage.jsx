import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Navbar from '../components/Navbar'
import { diagnosticQuestions, calculateLevel } from '../data/diagnosticQuestions'
import { loadCustomDiagnostic } from '../services/api'
import {
  ClipboardText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkle,
  Trophy,
  BookOpenText,
  Timer,
  Target,
  Check,
  ShieldCheck,
  ArrowsClockwise,
} from '@phosphor-icons/react'

export default function DiagnosticPage() {
  const [questions, setQuestions] = useState(() => {
    const custom = localStorage.getItem('numeracy_custom_diagnostic')
    return custom ? [...diagnosticQuestions, ...JSON.parse(custom)] : [...diagnosticQuestions]
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const { user, saveDiagnosticResult } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    loadCustomDiagnostic().then((serverQuestions) => {
      if (serverQuestions && serverQuestions.length > 0) {
        setQuestions([...diagnosticQuestions, ...serverQuestions])
      }
    })
  }, [])

  const total = questions.length
  const question = questions[currentIndex] || questions[0]

  const handleSelect = (label) => {
    if (!question) return
    setAnswers((prev) => ({ ...prev, [question.id]: label }))
  }

  const handleSubmit = async () => {
    if (total === 0) return
    let correct = 0
    questions.forEach((q) => {
      const chosen = answers[q.id]
      const correctOption = q.options?.find((o) => o.correct)
      if (chosen === correctOption?.label) correct++
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

  const allAnswered = total > 0 && questions.every((q) => answers[q.id])

  // ==============================================================
  // RESULT SCREEN
  // ==============================================================
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
          {/* Result Card */}
          <div className="raised p-6 sm:p-10 space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl inset text-edupink">
              <Trophy size={44} weight="bold" />
            </div>

            <div className="space-y-2">
              <span className="badge-chip">
                <Sparkle size={12} weight="fill" className="text-edupink" /> Evaluasi Selesai
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-edutext">
                Hasil Evaluasi Kemampuan
              </h1>
              <p className="text-edutext-muted text-xs sm:text-sm max-w-md mx-auto">
                Skormu otomatis tersimpan di cloud database. Berikut rincian capaian dan rekomendasi belajarmu:
              </p>
            </div>

            {/* Score & Level Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="inset p-4 space-y-1">
                <p className="text-[11px] font-bold text-edutext-muted uppercase tracking-wider">Skor Akhir</p>
                <p className="text-3xl font-black font-display text-edupink tabular-nums">
                  {result.score}<span className="text-base text-edutext-muted">/100</span>
                </p>
              </div>

              <div className="inset p-4 space-y-1">
                <p className="text-[11px] font-bold text-edutext-muted uppercase tracking-wider">Jawaban Benar</p>
                <p className="text-3xl font-black font-display text-edupink tabular-nums">
                  {result.correct}<span className="text-base text-edutext-muted">/{result.total}</span>
                </p>
              </div>

              <div className="inset p-4 space-y-1">
                <p className="text-[11px] font-bold text-edutext-muted uppercase tracking-wider">Level Kamu</p>
                <div className="pt-1">
                  <span className={result.levelInfo?.badgeClass || 'badge-accent'}>
                    {result.levelInfo?.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="inset p-5 max-w-xl mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-edupink uppercase tracking-wider">
                <ShieldCheck size={18} weight="bold" />
                <span>Rekomendasi Belajar EduSpark:</span>
              </div>
              <p className="text-xs sm:text-sm text-edutext leading-relaxed font-medium">
                {result.levelInfo?.recommendation}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/materi')}
                className="btn-accent text-xs sm:text-sm py-3 px-6"
              >
                <BookOpenText size={18} weight="bold" />
                <span>Buka Materi Pembahasan</span>
              </button>

              <button
                onClick={() => navigate('/tryout')}
                className="btn-secondary text-xs sm:text-sm py-3 px-6"
              >
                <Timer size={18} weight="bold" className="text-edupink" />
                <span>Lanjut ke Try Out Ber-Timer</span>
              </button>

              <button
                onClick={handleRetake}
                className="btn-secondary text-xs sm:text-sm py-3 px-4 text-edutext-muted"
                title="Ulangi Evaluasi"
              >
                <ArrowsClockwise size={18} weight="bold" />
                <span>Ulangi Evaluasi</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="raised p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black font-display text-edutext">
              Pembahasan Soal Evaluasi
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userChoice = answers[q.id]
                const correctOpt = q.options.find((o) => o.correct)
                const isCorrect = userChoice === correctOpt?.label

                return (
                  <div key={q.id} className="inset p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-chip text-[11px]">
                        Soal #{idx + 1} &bull; {q.topic}
                      </span>
                      {isCorrect ? (
                        <span className="badge-accent text-[11px] flex items-center gap-1">
                          <CheckCircle size={14} weight="fill" /> Tepat
                        </span>
                      ) : (
                        <span className="badge-chip text-edudanger text-[11px] flex items-center gap-1">
                          <XCircle size={14} weight="fill" /> Belum Tepat
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-edutext">{q.question}</p>

                    <div className="text-xs space-y-1 text-edutext-muted">
                      <p>
                        Jawabanmu: <strong>{userChoice || 'Tidak dijawab'}</strong> &bull; Kunci Jawaban: <strong className="text-edupink">{correctOpt?.label}. {correctOpt?.text}</strong>
                      </p>
                      <p className="p-3 raised-sm rounded-xl mt-2 text-edutext font-medium">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ==============================================================
  // QUESTION TEST SCREEN
  // ==============================================================
  if (total === 0) {
    return (
      <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 pt-10 sm:pt-16 space-y-6">
          <div className="raised p-8 sm:p-12 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl inset text-edupink mx-auto">
              <ClipboardText size={44} weight="bold" />
            </div>

            <div className="space-y-2">
              <span className="badge-chip">
                <Sparkle size={12} weight="fill" className="text-edupink" /> Evaluasi Diagnostik
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext">
                Belum Ada Soal Tes Diagnostik
              </h1>
              <p className="text-edutext-muted text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Bank soal tes diagnostik belum diisi oleh admin atau pengajar. Silakan kembali ke Dashboard atau langsung mulai mempelajari modul materi microlearning.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/materi')}
                className="btn-accent text-xs sm:text-sm py-3 px-6 font-bold"
              >
                <BookOpenText size={18} weight="bold" />
                <span>Pelajari Materi Belajar</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary text-xs sm:text-sm py-3 px-6 font-bold"
              >
                <span>Ke Dashboard</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        {/* Header Bar */}
        <div className="raised p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-chip text-[11px] uppercase tracking-wider mb-2">
              <ClipboardText size={13} weight="bold" className="text-edupink" /> Evaluasi Kemampuan Awal
            </span>
            <h1 className="text-2xl font-black font-display text-edutext">
              Soal {currentIndex + 1} dari {total}
            </h1>
            <p className="text-xs text-edutext-muted font-medium mt-0.5">
              Topik: {question?.topic} ({question?.subtest})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                  currentIndex === idx
                    ? 'raised text-edupink border-2 border-edupink'
                    : answers[q.id]
                    ? 'inset text-edupink'
                    : 'raised-sm text-edutext-muted'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="raised p-6 sm:p-8 space-y-6">
          <p className="text-base sm:text-lg font-bold text-edutext leading-relaxed">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt) => {
              const isSelected = answers[question.id] === opt.label
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'inset border-2 border-edupink text-edupink font-bold'
                      : 'raised-sm hover:border-edupink text-edutext font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        isSelected ? 'bg-edupink text-white' : 'inset text-edutext'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </div>

                  {isSelected && <CheckCircle size={20} weight="fill" className="text-edupink" />}
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-white/60 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Sebelumnya</span>
            </button>

            {currentIndex < total - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
                className="btn-accent text-xs py-2.5 px-5"
              >
                <span>Berikutnya</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="btn-accent text-xs py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} weight="bold" />
                <span>Selesai & Lihat Skor</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
