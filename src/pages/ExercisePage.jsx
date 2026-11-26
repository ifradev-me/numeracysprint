import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { defaultExercises } from '../data/exercises'
import { loadCustomExercises } from '../services/api'
import {
  PencilSimpleLine,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sparkle,
  ListNumbers,
  Check,
  TrendUp,
  Flame,
  CheckFat,
  ClockCounterClockwise,
} from '@phosphor-icons/react'

export default function ExercisePage() {
  const [exercises, setExercises] = useState(() => {
    const custom = localStorage.getItem('numeracy_custom_exercises')
    return custom ? [...defaultExercises, ...JSON.parse(custom)] : [...defaultExercises]
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [answeredHistory, setAnsweredHistory] = useState({}) // { [id]: { isCorrect: boolean } }
  const [streak, setStreak] = useState(0)

  // Sync fresh custom exercises from backend
  useEffect(() => {
    const custom = localStorage.getItem('numeracy_custom_exercises')
    if (custom) {
      setExercises([...defaultExercises, ...JSON.parse(custom)])
    }

    loadCustomExercises().then((serverExercises) => {
      if (serverExercises && serverExercises.length > 0) {
        setExercises([...defaultExercises, ...serverExercises])
      }
    })
  }, [])

  const question = exercises[currentIndex] || exercises[0]
  const total = exercises.length

  const checkAnswer = () => {
    if (!question) return
    let isCorrect = false
    if (question.type === 'input') {
      const cleanInput = userAnswer.replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
      const cleanAnswer = (question.answer || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
      const cleanDisplay = (question.answerDisplay || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
      isCorrect = cleanInput === cleanAnswer || cleanInput === cleanDisplay
    } else {
      isCorrect = selectedOption === question.options?.find((o) => o.correct)?.label
    }

    if (isCorrect) {
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    setFeedback({ isCorrect, explanation: question.explanation })
    setAnsweredHistory((prev) => ({
      ...prev,
      [question.id]: { isCorrect },
    }))
  }

  const handleSelectQuestion = (idx) => {
    setFeedback(null)
    setUserAnswer('')
    setSelectedOption(null)
    setCurrentIndex(idx)
  }

  const next = () => {
    if (currentIndex < total - 1) {
      handleSelectQuestion(currentIndex + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      handleSelectQuestion(currentIndex - 1)
    }
  }

  const correctCount = Object.values(answeredHistory).filter((a) => a.isCorrect).length
  const attemptedCount = Object.keys(answeredHistory).length

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10">
        {/* Header Title with Streak & Score */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge-pink">
                <Sparkle size={13} weight="fill" /> Latihan Numerasi Kontekstual
              </span>
              {streak > 1 && (
                <span className="badge-turquoise text-xs font-black flex items-center gap-1 animate-pulse-subtle">
                  <Flame size={14} weight="fill" className="text-pink-soft" /> {streak}x Tepat Berurutan!
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-roboto text-gray-900 tracking-tight">
              Latihan Soal Adaptif
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Pecahkan masalah kontekstual matematika dengan bantuan umpan balik instan.
            </p>
          </div>

          {/* Score Counter Widget */}
          <div className="bg-gradient-to-r from-turquoise-surface to-pink-light/40 p-3.5 sm:p-4 rounded-3xl border-2 border-turquoise flex items-center gap-3 shrink-0 shadow-card">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark text-white flex items-center justify-center font-bold shadow-soft">
              <TrendUp size={22} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-turquoise-dark tracking-wider">Akurasi Latihan</p>
              <p className="text-sm sm:text-base font-black text-turquoise-deep tabular-nums">
                {correctCount} / {total} Soal Tuntas
              </p>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="card-inner-white text-center py-16 px-6 rounded-3xl border-2 border-dashed border-turquoise/40 shadow-card">
            <div className="w-16 h-16 rounded-3xl bg-turquoise-light/60 text-turquoise-deep flex items-center justify-center mx-auto mb-4">
              <PencilSimpleLine size={32} weight="bold" />
            </div>
            <h2 className="text-xl font-black font-roboto text-gray-900 mb-2">
              Belum Ada Soal Latihan
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              Saat ini belum ada soal latihan numerasi yang tersedia. Silakan cek kembali nanti atau hubungi pengajar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/microlearning" className="btn-secondary text-xs py-2.5 px-5 font-bold">
                Buka Materi
              </Link>
              <Link to="/dashboard" className="btn-primary text-xs py-2.5 px-5 font-bold">
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Question Outline Bar ("tampil apa aja soalnya dan berapa banyak") */}
            <div className="card-inner-white mb-6 border-2 border-turquoise/30 shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2 font-black text-gray-800">
              <ListNumbers size={18} weight="bold" className="text-turquoise" />
              <span>Navigasi Soal ({total} Soal Tersedia):</span>
            </div>
            <span className="text-[11px] text-pink-hover font-black tabular-nums bg-pink-light px-2.5 py-0.5 rounded-full border border-pink-soft/30">
              {attemptedCount} dari {total} telah dicoba
            </span>
          </div>

          {/* Quick jump question badges */}
          <div className="flex flex-wrap gap-2">
            {exercises.map((item, idx) => {
              const hist = answeredHistory[item.id]
              const isCurrent = currentIndex === idx
              let statusClasses = 'bg-gray-100 text-gray-700 hover:bg-turquoise-light/60 border border-gray-200'
              if (hist?.isCorrect) statusClasses = 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-sm border border-emerald-300'
              else if (hist?.isCorrect === false) statusClasses = 'bg-gradient-to-r from-pink-soft to-pink-hover text-white font-black shadow-pink border border-pink-soft'

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-xs font-black transition-all duration-150 active:scale-95 flex items-center justify-center cursor-pointer ${statusClasses} ${
                    isCurrent ? 'ring-3 ring-pink-soft ring-offset-2 scale-105' : ''
                  }`}
                  title={`Soal ${idx + 1} - ${item.topic}`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Blue Card for active question */}
        <div className="card-blue relative border-2 border-white/25 shadow-2xl">
          {/* Subtle math watermark on desktop */}
          <span className="hidden sm:block absolute right-4 -bottom-6 text-white/[0.08] text-8xl font-mono font-black pointer-events-none select-none">
            #
          </span>

          <div className="flex items-center justify-between mb-4">
            <span className="badge-glass text-[11px] font-bold">
              Soal #{currentIndex + 1} &bull; {question.topic}
            </span>
            <span className="text-xs text-white/80 font-mono font-bold bg-white/10 px-2.5 py-1 rounded-xl">
              {question.type === 'input' ? 'Isian Mandiri' : 'Pilihan Ganda'}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold font-roboto text-white mb-6 leading-relaxed">
            {question.question}
          </h2>

          {/* Hint if available */}
          {question.hint && (
            <div className="mb-5 p-3.5 rounded-2xl bg-white/15 border border-white/25 text-xs text-white flex items-start gap-2.5 shadow-sm">
              <Lightbulb size={20} weight="fill" className="text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-white">Petunjuk Pengerjaan: </span>
                <span className="text-white/90">{question.hint}</span>
              </div>
            </div>
          )}

          {/* Interactive Answer Form */}
          {question.type === 'input' ? (
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-white uppercase tracking-wider">
                Tulis Jawabanmu (Ketik Angka atau Teks):
              </label>
              <input
                type="text"
                className="input-field-light text-sm font-bold text-gray-900"
                placeholder="Contoh: 180000 atau Rp180.000"
                value={userAnswer}
                disabled={!!feedback}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !feedback && userAnswer.trim() && checkAnswer()}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {question.options?.map((opt) => {
                const isSelected = selectedOption === opt.label
                return (
                  <button
                    key={opt.label}
                    onClick={() => !feedback && setSelectedOption(opt.label)}
                    disabled={!!feedback}
                    className={`w-full text-left flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'border-pink-soft bg-white text-gray-900 shadow-pink font-bold'
                        : 'border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isSelected ? 'bg-pink-soft text-white' : 'bg-white/20 text-white'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-sm">{opt.text}</span>
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
          )}

          {/* Feedback Area with cheerful confirmation */}
          {feedback && (
            <div
              className={`mt-6 p-4 sm:p-5 rounded-2xl bg-white shadow-soft border-2 text-gray-800 animate-pop-in ${
                feedback.isCorrect ? 'border-emerald-500' : 'border-pink-soft'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
                    <span className="text-emerald-800">Mantap! Jawabanmu Tepat Sekali! 🎯</span>
                  </>
                ) : (
                  <>
                    <XCircle size={22} weight="fill" className="text-pink-soft shrink-0" />
                    <span className="text-pink-hover">Hampir Tepat! Yuk Pelajari Caranya. 💡</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{feedback.explanation}</p>
              {!feedback.isCorrect && question.answerDisplay && (
                <div className="mt-3 inline-block bg-turquoise-light/80 text-turquoise-deep px-3 py-1.5 rounded-xl text-xs font-extrabold">
                  Kunci Jawaban: {question.answerDisplay}
                </div>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="btn-outline-white text-xs py-2.5 px-4 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Sebelumnya</span>
            </button>

            {!feedback ? (
              <button
                onClick={checkAnswer}
                disabled={question.type === 'input' ? !userAnswer.trim() : !selectedOption}
                className="btn-accent text-xs py-3 px-6 font-extrabold disabled:opacity-40 disabled:pointer-events-none shadow-pink"
              >
                <span>Periksa Jawaban</span>
                <Check size={16} weight="bold" />
              </button>
            ) : (
              <button
                onClick={next}
                disabled={currentIndex === total - 1}
                className="btn-white text-xs py-2.5 px-5 font-extrabold disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  )
}
