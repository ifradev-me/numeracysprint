import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PaywallModal from '../components/PaywallModal'
import { defaultExercises } from '../data/exercises'
import { loadCustomExercises, syncUserWithBackend } from '../services/api'
import { useUser } from '../context/UserContext'
import {
  Timer,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkle,
  Check,
  Lock,
  LockOpen,
  Crown,
  Play,
  ClockCounterClockwise,
  WarningCircle,
  ListNumbers,
  Target,
  Trophy,
  ShieldCheck,
  Question,
  BookOpenText,
  House,
} from '@phosphor-icons/react'

const SECONDS_PER_QUESTION = 120 // 2 menit per soal (aturan UTBK)

export default function ExercisePage() {
  const { user } = useUser()
  const navigate = useNavigate()

  const [allBankExercises, setAllBankExercises] = useState(() => {
    const custom = localStorage.getItem('numeracy_custom_exercises')
    return custom ? [...defaultExercises, ...JSON.parse(custom)] : [...defaultExercises]
  })

  // Selected mode: 'preview' (3 soal, gratis) vs 'full' (seluruh bank soal, butuh Pro)
  const [examMode, setExamMode] = useState('preview')
  const [paywallOpen, setPaywallOpen] = useState(false)

  // Exam state
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [id]: userChoice }
  const [doubtful, setDoubtful] = useState({}) // { [id]: boolean } (Ragu-ragu ala UTBK)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [timeExpiredModal, setTimeExpiredModal] = useState(false)
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false)
  const [examResult, setExamResult] = useState(null)

  const timerRef = useRef(null)

  // Sync fresh custom exercises from backend
  useEffect(() => {
    loadCustomExercises().then((serverExercises) => {
      if (serverExercises && serverExercises.length > 0) {
        setAllBankExercises([...defaultExercises, ...serverExercises])
      }
    })
  }, [])

  // Active questions pool based on mode:
  // If preview: take first 3 questions.
  // If full: take all questions.
  const activeQuestions = examMode === 'preview'
    ? allBankExercises.slice(0, 3)
    : allBankExercises

  const totalQuestions = activeQuestions.length

  // Global Countdown Timer (runs without reset across all questions)
  useEffect(() => {
    if (isStarted && !isSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleAutoFinishTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isStarted, isSubmitted, timeLeft])

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Handle start tryout
  const handleStartExam = (mode) => {
    if (mode === 'full' && !user?.isPaid) {
      setPaywallOpen(true)
      return
    }

    const pool = mode === 'preview' ? allBankExercises.slice(0, 3) : allBankExercises
    const duration = pool.length * SECONDS_PER_QUESTION

    setExamMode(mode)
    setTotalDuration(duration)
    setTimeLeft(duration)
    setAnswers({})
    setDoubtful({})
    setCurrentIndex(0)
    setIsSubmitted(false)
    setExamResult(null)
    setIsStarted(true)
  }

  // Auto finish when timer reaches zero
  const handleAutoFinishTimeUp = () => {
    setTimeExpiredModal(true)
    finishExam(true)
  }

  // Calculate final results and submit
  const finishExam = async (wasAutoTimeUp = false) => {
    if (timerRef.current) clearInterval(timerRef.current)

    let correctCount = 0
    let incorrectCount = 0
    let emptyCount = 0

    activeQuestions.forEach((q) => {
      const userChoice = (answers[q.id] || '').trim().toLowerCase()
      if (!userChoice) {
        emptyCount++
        return
      }

      if (q.type === 'input') {
        const cleanAnswer = (q.answer || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
        const cleanDisplay = (q.answerDisplay || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
        const cleanInput = userChoice.replace(/\./g, '').replace(/,/g, '.')
        if (cleanInput === cleanAnswer || cleanInput === cleanDisplay) {
          correctCount++
        } else {
          incorrectCount++
        }
      } else {
        const correctLabel = q.options?.find((o) => o.correct)?.label?.toLowerCase()
        if (userChoice === correctLabel) {
          correctCount++
        } else {
          incorrectCount++
        }
      }
    })

    const score = Math.round((correctCount / totalQuestions) * 100)
    const timeUsed = totalDuration - timeLeft

    const resultData = {
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      emptyCount,
      timeUsed,
      wasAutoTimeUp,
      completedAt: new Date().toISOString(),
      mode: examMode,
      answers,
    }

    setExamResult(resultData)
    setIsSubmitted(true)
    setConfirmSubmitModal(false)

    // Save to user history & cloud
    try {
      const savedHist = JSON.parse(localStorage.getItem('eduspark_tryout_history') || '[]')
      savedHist.unshift(resultData)
      localStorage.setItem('eduspark_tryout_history', JSON.stringify(savedHist))

      if (user?.name) {
        await syncUserWithBackend({
          name: user.name,
          latestTryout: { score, completedAt: resultData.completedAt },
        })
      }
    } catch (e) {
      console.warn('Failed to persist tryout score to backend:', e)
    }
  }

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0]
  const currentAnswer = answers[currentQuestion?.id] || ''
  const isCurrentDoubtful = !!doubtful[currentQuestion?.id]

  const handleSelectOption = (label) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: label,
    }))
  }

  const handleInputAnswer = (val) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }))
  }

  const toggleDoubtful = () => {
    setDoubtful((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }))
  }

  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k].trim()).length

  // ==============================================================
  // VIEW 1: RESULTS & DETAILED REVIEW (SETELAH UJIAN SELESAI)
  // ==============================================================
  if (isSubmitted && examResult) {
    return (
      <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
          {/* Result Banner Card */}
          <div className="raised p-6 sm:p-10 space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl inset text-edupink mx-auto">
              <Trophy size={44} weight="bold" />
            </div>

            <div className="space-y-2">
              <span className="badge-chip">
                <Sparkle size={12} weight="fill" className="text-edupink" /> Try Out Selesai
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-edutext">
                Hasil & Pembahasan Try Out
              </h1>
              <p className="text-edutext-muted text-xs sm:text-sm max-w-md mx-auto">
                {examResult.wasAutoTimeUp
                  ? 'Waktu ujian telah habis. Seluruh jawabanmu otomatis tersimpan dan dievaluasi.'
                  : 'Sesi ujian telah selesai dikerjakan. Berikut rincian nilai dan pembahasan lengkapnya:'}
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="inset p-4 space-y-1">
                <p className="text-[10px] font-bold text-edutext-muted uppercase tracking-wider">Skor Akhir</p>
                <p className="text-3xl font-black font-display text-edupink tabular-nums">
                  {examResult.score}<span className="text-sm text-edutext-muted">/100</span>
                </p>
              </div>

              <div className="inset p-4 space-y-1">
                <p className="text-[10px] font-bold text-edutext-muted uppercase tracking-wider">Benar</p>
                <p className="text-3xl font-black font-display text-emerald-700 tabular-nums">
                  {examResult.correctCount}<span className="text-sm text-edutext-muted">/{examResult.totalQuestions}</span>
                </p>
              </div>

              <div className="inset p-4 space-y-1">
                <p className="text-[10px] font-bold text-edutext-muted uppercase tracking-wider">Salah / Kosong</p>
                <p className="text-3xl font-black font-display text-edudanger tabular-nums">
                  {examResult.incorrectCount + examResult.emptyCount}
                </p>
              </div>

              <div className="inset p-4 space-y-1">
                <p className="text-[10px] font-bold text-edutext-muted uppercase tracking-wider">Waktu Dipakai</p>
                <p className="text-2xl font-black font-display text-edutext tabular-nums font-mono mt-1">
                  {formatTimer(examResult.timeUsed)}
                </p>
              </div>
            </div>

            {/* Feedback Summary */}
            <div className="inset p-5 max-w-2xl mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-edupink uppercase tracking-wider">
                <ShieldCheck size={18} weight="bold" />
                <span>Analisa Evaluasi EduSpark:</span>
              </div>
              <p className="text-xs sm:text-sm text-edutext leading-relaxed font-medium">
                {examResult.score >= 80
                  ? 'Luar biasa! Pemahaman konsep matematika dan kecepatan pengerjaanmu sudah sangat kompetitif dan matang.'
                  : examResult.score >= 50
                  ? 'Cukup baik! Kamu sudah menguasai beberapa soal dasar, namun perlu melatih manajemen waktu pada tipe soal kontekstual.'
                  : 'Tetap semangat! Telusuri pembahasan soal di bawah ini dan pelajari kembali modul microlearning untuk memperkuat fondasi.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setIsStarted(false)
                  setIsSubmitted(false)
                }}
                className="btn-accent text-xs sm:text-sm py-3 px-6 font-bold"
              >
                <ClockCounterClockwise size={18} weight="bold" />
                <span>Ulangi Try Out</span>
              </button>

              <button
                onClick={() => navigate('/materi')}
                className="btn-secondary text-xs sm:text-sm py-3 px-6 font-bold"
              >
                <BookOpenText size={18} weight="bold" className="text-edupink" />
                <span>Pelajari Modul Terkait</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary text-xs sm:text-sm py-3 px-5 font-bold"
              >
                <House size={18} weight="bold" />
                <span>Ke Dashboard</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="raised p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h3 className="text-xl font-black font-display text-edutext">
                Pembahasan Lengkap Semua Soal
              </h3>
              <span className="badge-chip text-[11px] font-bold">
                {activeQuestions.length} Soal Dianalisis
              </span>
            </div>

            <div className="space-y-6">
              {activeQuestions.map((q, idx) => {
                const userChoice = (answers[q.id] || '').trim()
                const correctOpt = q.options?.find((o) => o.correct)
                let isCorrect = false

                if (q.type === 'input') {
                  const cleanAnswer = (q.answer || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
                  const cleanDisplay = (q.answerDisplay || '').replace(/\./g, '').replace(/,/g, '.').trim().toLowerCase()
                  const cleanInput = userChoice.replace(/\./g, '').replace(/,/g, '.').toLowerCase()
                  isCorrect = cleanInput === cleanAnswer || cleanInput === cleanDisplay
                } else {
                  isCorrect = userChoice.toLowerCase() === correctOpt?.label?.toLowerCase()
                }

                return (
                  <div key={q.id} className="inset p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="badge-chip text-[11px]">
                        Soal #{idx + 1} &bull; {q.topic}
                      </span>
                      {userChoice ? (
                        isCorrect ? (
                          <span className="badge-accent text-[11px] flex items-center gap-1">
                            <CheckCircle size={14} weight="fill" /> Jawaban Tepat
                          </span>
                        ) : (
                          <span className="badge-chip text-edudanger text-[11px] flex items-center gap-1">
                            <XCircle size={14} weight="fill" /> Jawaban Salah
                          </span>
                        )
                      ) : (
                        <span className="badge-chip text-edutext-muted text-[11px]">
                          Tidak Dijawab
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-edutext leading-relaxed">
                      {q.question}
                    </p>

                    {/* Answer comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="raised-sm p-3 space-y-0.5">
                        <span className="text-[10px] font-bold text-edutext-muted uppercase">Jawabanmu:</span>
                        <p className={`font-bold ${isCorrect ? 'text-edupink' : userChoice ? 'text-edudanger' : 'text-edutext-muted italic'}`}>
                          {userChoice || 'Kosong (Tidak Dijawab)'}
                        </p>
                      </div>

                      <div className="raised-sm p-3 space-y-0.5">
                        <span className="text-[10px] font-bold text-edutext-muted uppercase">Kunci Jawaban Resmi:</span>
                        <p className="font-bold text-edupink">
                          {q.type === 'input'
                            ? (q.answerDisplay || q.answer)
                            : `${correctOpt?.label}. ${correctOpt?.text}`}
                        </p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="raised-sm p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-edupink font-bold">
                        <CheckCircle size={15} weight="bold" />
                        <span>Langkah Pembahasan:</span>
                      </div>
                      <p className="text-edutext leading-relaxed font-medium">
                        {q.explanation}
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
  // VIEW 2: START GATE (PILIH MODE & PAYWALL)
  // ==============================================================
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
          <div className="space-y-1">
            <span className="badge-chip text-[11px]">
              <Sparkle size={13} weight="fill" className="text-edupink" /> Simulasi Ujian Matematika 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-edutext tracking-tight">
              Try Out Matematika Ber-Timer
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm font-medium">
              Sistem ujian ber-timer dengan mekanisme global countdown: timer berjalan tanpa henti (2 menit × jumlah soal). Selama sesi berlangsung tidak ada pembahasan atau jawaban benar/salah. Pembahasan lengkap disajikan setelah sesi selesai.
            </p>
          </div>

          {allBankExercises.length === 0 && (
            <div className="raised p-6 text-center space-y-2 border border-edupink/40">
              <Question size={32} className="text-edupink mx-auto" weight="bold" />
              <h3 className="text-sm font-black text-edutext">Belum Ada Soal Latihan Try Out</h3>
              <p className="text-xs text-edutext-muted max-w-md mx-auto">
                Bank soal try out saat ini masih kosong. Silakan import CSV soal atau tambahkan soal baru di panel admin.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Pratinjau Gratis */}
            <div className="raised p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl inset text-edupink flex items-center justify-center font-bold">
                    <Timer size={24} weight="bold" />
                  </div>
                  <span className="badge-chip text-[11px] text-edupink">Gratis</span>
                </div>

                <div>
                  <h3 className="text-xl font-black font-display text-edutext">
                    Pratinjau Try Out (3 Soal)
                  </h3>
                  <p className="text-xs text-edutext-muted mt-1 leading-relaxed">
                    Sesi uji coba singkat untuk membiasakan ritme manajemen waktu 2 menit per soal.
                  </p>
                </div>

                <div className="inset p-4 rounded-2xl space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Jumlah Soal:</span>
                    <span className="font-bold">3 Soal Ujian</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Durasi Total:</span>
                    <span className="font-bold text-edupink font-mono">06:00 (6 Menit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Mekanisme:</span>
                    <span className="font-bold">Timer Global Countdown</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam('preview')}
                disabled={allBankExercises.length === 0}
                className="btn-accent w-full text-xs py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play size={16} weight="fill" />
                <span>Mulai Pratinjau Gratis</span>
              </button>
            </div>

            {/* Card 2: Try Out Penuh (Paywall / Pro) */}
            <div className="raised p-6 flex flex-col justify-between space-y-6 relative border-2 border-edupink/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl inset text-edupink flex items-center justify-center font-bold">
                    <Trophy size={24} weight="bold" />
                  </div>
                  {user?.isPaid ? (
                    <span className="badge-accent text-[11px] flex items-center gap-1">
                      <Crown size={12} weight="fill" /> Pro Unlocked
                    </span>
                  ) : (
                    <span className="badge-chip text-[11px] text-edupink flex items-center gap-1">
                      <Lock size={12} weight="bold" /> Butuh Paket Pro
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-black font-display text-edutext">
                    Try Out Penuh (Seluruh Bank Soal)
                  </h3>
                  <p className="text-xs text-edutext-muted mt-1 leading-relaxed">
                    Simulasi intensif mencakup seluruh kumpulan soal Pengetahuan Kuantitatif, Penalaran Matematika, dan Penalaran Kuantitatif.
                  </p>
                </div>

                <div className="inset p-4 rounded-2xl space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Jumlah Soal:</span>
                    <span className="font-bold">{allBankExercises.length} Soal Lengkap</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Durasi Total:</span>
                    <span className="font-bold text-edupink font-mono">
                      {formatTimer(allBankExercises.length * SECONDS_PER_QUESTION)} ({allBankExercises.length * 2} Menit)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-edutext-muted">Pembahasan:</span>
                    <span className="font-bold">Lengkap di Akhir Sesi</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam('full')}
                disabled={allBankExercises.length === 0}
                className={`w-full text-xs py-3.5 font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                  user?.isPaid ? 'btn-accent' : 'btn-secondary text-edupink'
                }`}
              >
                {user?.isPaid ? (
                  <>
                    <Play size={16} weight="fill" />
                    <span>Mulai Try Out Penuh</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} weight="bold" />
                    <span>Buka Akses Penuh (Upgrade Pro)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          materialTitle="Try Out Penuh Ber-Timer"
        />
      </div>
    )
  }

  // ==============================================================
  // VIEW 3: ACTIVE EXAM SCREEN
  // ==============================================================
  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      {/* Top Test Header (Sticky with Global Timer) */}
      <header className="sticky top-0 z-40 bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm">
        <div className="max-w-5xl mx-auto px-4 h-18 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-edutext-muted tracking-wider">
              {examMode === 'preview' ? 'Pratinjau Gratis' : 'Simulasi Try Out Penuh'}
            </span>
            <h2 className="text-sm sm:text-base font-black font-display text-edutext">
              Soal {currentIndex + 1} dari {totalQuestions}
            </h2>
          </div>

          {/* Global Countdown Timer Well */}
          <div className="flex items-center gap-3">
            <div className={`timer-well ${timeLeft < 60 ? 'timer-critical' : ''}`}>
              <Timer size={20} weight="bold" className="mr-2" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => setConfirmSubmitModal(true)}
              className="btn-accent text-xs py-2 px-4 font-bold"
            >
              <span>Selesai Ujian</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="raised p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <span className="badge-chip text-[11px] font-bold">
                  {currentQuestion?.topic || 'Matematika'}
                </span>
                <span className="text-xs font-mono font-bold text-edutext-muted">
                  {currentQuestion?.type === 'input' ? 'Isian' : 'Pilihan Ganda'}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-base sm:text-lg font-bold font-display text-edutext leading-relaxed">
                {currentQuestion?.question}
              </p>

              {/* Answer Choices (WITHOUT ANY INSTANT FEEDBACK!) */}
              {currentQuestion?.type === 'input' ? (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-black text-edutext uppercase tracking-wider">
                    Masukkan Jawabanmu:
                  </label>
                  <input
                    type="text"
                    className="input-inset text-base font-bold font-mono"
                    placeholder="Ketik angka atau jawaban..."
                    value={currentAnswer}
                    onChange={(e) => handleInputAnswer(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {currentQuestion?.options?.map((opt) => {
                    const isSelected = currentAnswer.toLowerCase() === opt.label.toLowerCase()
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectOption(opt.label)}
                        className={`w-full text-left flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${
                          isSelected
                            ? 'inset border-2 border-edupink text-edupink font-bold'
                            : 'raised-sm hover:border-edupink text-edutext font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
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
              )}

              {/* Bottom Nav inside question card: Prev, Ragu-ragu, Next */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/60">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft size={16} weight="bold" />
                  <span>Sebelumnya</span>
                </button>

                <button
                  onClick={toggleDoubtful}
                  className={`btn-secondary text-xs py-2 px-3.5 font-bold ${
                    isCurrentDoubtful ? 'inset text-amber-700 font-black border border-amber-400' : 'text-edutext-muted'
                  }`}
                >
                  <Question size={16} weight="bold" />
                  <span>{isCurrentDoubtful ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="btn-accent text-xs py-2.5 px-5 font-bold"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmSubmitModal(true)}
                    className="btn-accent text-xs py-2.5 px-5 font-bold"
                  >
                    <Check size={16} weight="bold" />
                    <span>Kumpulkan Ujian</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Question Palette (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="raised p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-xs text-edutext">
                  <ListNumbers size={18} weight="bold" className="text-edupink" />
                  <span>Lembar Jawaban</span>
                </div>
                <span className="badge-chip text-[10px] font-bold">
                  {answeredCount}/{totalQuestions} Terisi
                </span>
              </div>

              {/* Number Grid */}
              <div className="grid grid-cols-5 gap-2">
                {activeQuestions.map((q, idx) => {
                  const hasAnswer = !!(answers[q.id] && answers[q.id].trim())
                  const isDoubt = !!doubtful[q.id]
                  const isCur = currentIndex === idx

                  let btnClass = 'raised-sm text-edutext-muted'
                  if (isDoubt) {
                    btnClass = 'inset text-amber-800 border-2 border-amber-400 font-black'
                  } else if (hasAnswer) {
                    btnClass = 'inset text-edupink border-2 border-edupink font-black'
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer ${btnClass} ${
                        isCur ? 'ring-2 ring-edupink-dark' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-white/60 space-y-1.5 text-[11px] text-edutext-muted font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded inset border border-edupink bg-edupink/20" />
                  <span>Sudah dijawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded inset border border-amber-400 bg-amber-100" />
                  <span>Ragu-ragu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded raised-sm border border-white" />
                  <span>Belum dijawab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal to Submit */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edutext/40 backdrop-blur-sm animate-pop-in">
          <div className="raised p-6 sm:p-8 max-w-md w-full space-y-5">
            <h3 className="text-xl font-black font-display text-edutext">
              Kumpulkan Lembar Jawaban?
            </h3>
            <p className="text-xs text-edutext-muted leading-relaxed font-medium">
              Kamu telah menjawab <strong>{answeredCount}</strong> dari total <strong>{totalQuestions}</strong> soal. Masih ada sisa waktu <strong>{formatTimer(timeLeft)}</strong>.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => finishExam(false)}
                className="btn-accent flex-1 text-xs py-3 font-bold"
              >
                Ya, Kumpulkan Sekarang
              </button>
              <button
                onClick={() => setConfirmSubmitModal(false)}
                className="btn-secondary text-xs py-3 px-5 font-bold"
              >
                Lanjut Mengerjakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Up Notification Modal */}
      {timeExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edutext/50 backdrop-blur-sm animate-pop-in">
          <div className="raised p-6 sm:p-8 max-w-md w-full space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl inset text-edudanger mx-auto flex items-center justify-center">
              <Timer size={36} weight="bold" />
            </div>
            <h3 className="text-xl font-black font-display text-edutext">
              Waktu Ujian Habis!
            </h3>
            <p className="text-xs text-edutext-muted leading-relaxed font-medium">
              Waktu 2 menit per soal telah berakhir. Sistem telah mengumpulkan jawabanmu secara otomatis.
            </p>
            <button
              onClick={() => setTimeExpiredModal(false)}
              className="btn-accent w-full text-xs py-3 font-bold"
            >
              Lihat Hasil & Pembahasan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
