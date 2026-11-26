import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { saveCustomDiagnostic, loadCustomDiagnostic } from '../../services/api'
import { parseDiagnosticCSV } from '../../utils/csvParser'
import {
  ClipboardText,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  FileCsv,
  Sparkle,
  X,
  CheckCircle,
  Check,
  WarningCircle,
  Info,
  DownloadSimple,
  Target,
  Question,
} from '@phosphor-icons/react'

const MAX_DIAGNOSTIC_QUESTIONS = 10

const emptyForm = {
  topic: 'Persentase & Diskon',
  subtest: 'Pengetahuan Kuantitatif',
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A',
  explanation: '',
}

export default function AdminDiagnostic() {
  const [questions, setQuestions] = useState(() => {
    return JSON.parse(localStorage.getItem('numeracy_custom_diagnostic') || '[]')
  })
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef(null)

  // Load fresh diagnostic questions from server on mount
  useEffect(() => {
    loadCustomDiagnostic().then((serverQuestions) => {
      if (serverQuestions) setQuestions(serverQuestions)
    })
  }, [])

  const persistQuestions = async (updated) => {
    const capped = updated.slice(0, MAX_DIAGNOSTIC_QUESTIONS)
    setQuestions(capped)
    await saveCustomDiagnostic(capped)
  }

  const save = async () => {
    if (!form.question.trim()) {
      alert('Teks pertanyaan wajib diisi!')
      return
    }
    if (!form.optionA.trim() || !form.optionB.trim() || !form.optionC.trim() || !form.optionD.trim()) {
      alert('Semua 4 opsi pilihan jawaban (A, B, C, D) wajib diisi!')
      return
    }

    if (!editId && questions.length >= MAX_DIAGNOSTIC_QUESTIONS) {
      alert(`Maksimal ${MAX_DIAGNOSTIC_QUESTIONS} soal tes diagnostik telah tercapai!`)
      return
    }

    const questionObj = {
      id: editId || Date.now(),
      topic: form.topic.trim() || 'Penalaran Matematika',
      subtest: form.subtest.trim() || 'Pengetahuan Kuantitatif',
      question: form.question.trim(),
      options: [
        { label: 'A', text: form.optionA.trim(), correct: form.correctOption === 'A' },
        { label: 'B', text: form.optionB.trim(), correct: form.correctOption === 'B' },
        { label: 'C', text: form.optionC.trim(), correct: form.correctOption === 'C' },
        { label: 'D', text: form.optionD.trim(), correct: form.correctOption === 'D' },
      ],
      explanation: form.explanation.trim() || 'Pembahasan telah disediakan oleh pengajar.',
    }

    let updated
    if (editId) {
      updated = questions.map((q) => (q.id === editId ? questionObj : q))
    } else {
      updated = [...questions, questionObj]
    }

    await persistQuestions(updated)
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const remove = async (id) => {
    if (window.confirm('Yakin ingin menghapus soal tes diagnostik ini?')) {
      const updated = questions.filter((q) => q.id !== id)
      await persistQuestions(updated)
    }
  }

  const startEdit = (q) => {
    const optA = q.options?.find((o) => o.label === 'A')?.text || ''
    const optB = q.options?.find((o) => o.label === 'B')?.text || ''
    const optC = q.options?.find((o) => o.label === 'C')?.text || ''
    const optD = q.options?.find((o) => o.label === 'D')?.text || ''
    const correctOpt = q.options?.find((o) => o.correct)?.label || 'A'

    setForm({
      topic: q.topic || 'Persentase & Diskon',
      subtest: q.subtest || 'Pengetahuan Kuantitatif',
      question: q.question || '',
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      correctOption: correctOpt,
      explanation: q.explanation || '',
    })
    setEditId(q.id)
    setShowForm(true)
  }

  const handleCSVImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const remainingSlots = MAX_DIAGNOSTIC_QUESTIONS - questions.length
    if (remainingSlots <= 0) {
      alert(`Batas maksimal ${MAX_DIAGNOSTIC_QUESTIONS} soal diagnostik sudah penuh! Hapus sebagian soal terlebih dahulu.`)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const parsed = parseDiagnosticCSV(evt.target.result)
        if (parsed.length === 0) {
          alert('File CSV tidak memiliki baris soal diagnostik yang valid atau format kolom tidak sesuai.')
          return
        }

        const toAdd = parsed.slice(0, remainingSlots)
        const updated = [...questions, ...toAdd]
        await persistQuestions(updated)

        if (parsed.length > remainingSlots) {
          alert(`Berhasil mengimpor ${toAdd.length} soal diagnostik (dibatasi kuota maksimal ${MAX_DIAGNOSTIC_QUESTIONS} soal).`)
        } else {
          alert(`Berhasil mengimpor ${toAdd.length} soal diagnostik baru dari CSV!`)
        }
      } catch (err) {
        alert('Gagal membaca file CSV: ' + err.message)
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const clearAllCustomQuestions = async () => {
    if (
      window.confirm(
        `Yakin ingin menghapus seluruh ${questions.length} soal tes diagnostik? Siswa baru tidak akan melihat soal diagnostik hingga soal baru ditambahkan.`
      )
    ) {
      await persistQuestions([])
      alert('Semua soal tes diagnostik berhasil dibersihkan.')
    }
  }

  const isFull = questions.length >= MAX_DIAGNOSTIC_QUESTIONS

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      {/* Top Navbar */}
      <nav className="bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isFull ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'badge-chip'}`}>
              <ClipboardText size={14} weight="bold" className="inline mr-1 text-edupink" />
              {questions.length} / {MAX_DIAGNOSTIC_QUESTIONS} Soal (Maksimal 10)
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Kelola Soal Tes Diagnostik
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm mt-1">
              Atur hingga 10 soal evaluasi diagnostik untuk memetakan level awal siswa secara akurat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {questions.length > 0 && (
              <button
                onClick={clearAllCustomQuestions}
                className="btn-secondary text-xs py-2 px-3 text-edudanger hover:bg-red-50 flex items-center gap-1.5"
                title="Hapus semua soal diagnostik"
              >
                <Trash size={16} weight="bold" />
                <span>Bersihkan ({questions.length})</span>
              </button>
            )}

            <a
              href="/template_diagnostic.csv"
              download="template_diagnostic.csv"
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              title="Download template CSV soal diagnostik"
            >
              <DownloadSimple size={16} weight="bold" className="text-edupink" />
              <span>Template CSV</span>
            </a>

            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
            <button
              onClick={() => {
                if (isFull) {
                  alert(`Kuota maksimal ${MAX_DIAGNOSTIC_QUESTIONS} soal diagnostik sudah penuh. Hapus sebagian soal terlebih dahulu.`)
                  return
                }
                fileRef.current?.click()
              }}
              disabled={isFull}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileCsv size={16} weight="bold" className="text-edupink" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => {
                if (isFull) {
                  alert(`Kuota maksimal ${MAX_DIAGNOSTIC_QUESTIONS} soal diagnostik sudah penuh.`)
                  return
                }
                setShowForm(true)
                setEditId(null)
                setForm(emptyForm)
              }}
              disabled={isFull}
              className="btn-accent text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} weight="bold" />
              <span>Tambah Soal</span>
            </button>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="raised p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-edutext">
              <Target size={16} weight="bold" className="text-edupink" />
              Kapasitas Bank Soal Diagnostik:
            </span>
            <span className={`font-mono ${isFull ? 'text-amber-600' : 'text-edupink'}`}>
              {questions.length} dari {MAX_DIAGNOSTIC_QUESTIONS} Soal Terisi
            </span>
          </div>

          {/* 10 visual slot indicators */}
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: MAX_DIAGNOSTIC_QUESTIONS }).map((_, idx) => {
              const isFilled = idx < questions.length
              return (
                <div
                  key={idx}
                  className={`h-3 rounded-lg transition-all ${
                    isFilled
                      ? 'bg-gradient-to-r from-edupink to-edupink-hover shadow-sm'
                      : 'inset bg-black/5 opacity-60'
                  }`}
                  title={`Slot ${idx + 1}: ${isFilled ? 'Terisi' : 'Kosong'}`}
                />
              )
            })}
          </div>

          {isFull && (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <WarningCircle size={18} weight="fill" className="shrink-0" />
              <span>
                Batas maksimal 10 soal telah tercapai. Anda dapat mengedit atau menghapus soal yang ada untuk melakukan penyesuaian.
              </span>
            </div>
          )}
        </div>

        {/* CSV Format Guide */}
        <div className="raised p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-edutext text-xs">
            <FileCsv size={20} weight="bold" className="text-edupink" />
            <span>Format Kolom File CSV untuk Soal Diagnostik:</span>
          </div>
          <code className="block inset p-3 font-mono text-[11px] text-edutext overflow-x-auto whitespace-nowrap">
            topic,subtest,question,optionA,optionB,optionC,optionD,correctOption,explanation
          </code>
          <p className="text-[11px] text-edutext-muted leading-relaxed">
            Kolom <code>correctOption</code> dapat diisi huruf kunci (misal <strong>A</strong>, <strong>B</strong>, <strong>C</strong>, atau <strong>D</strong>). Unduh <strong>Template CSV</strong> untuk contoh yang langsung siap diedit di Excel.
          </p>
        </div>

        {/* Form Modal/Card */}
        {showForm && (
          <div className="raised p-6 sm:p-8 space-y-5 animate-pop-in border-2 border-edupink/40">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <div className="flex items-center gap-2">
                <span className="badge-chip">
                  <Sparkle size={12} weight="fill" className="text-edupink" /> Form Soal Diagnostik
                </span>
                <h2 className="text-lg font-black font-display text-edutext">
                  {editId ? 'Edit Soal Diagnostik' : 'Tambah Soal Diagnostik Baru'}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full raised-sm flex items-center justify-center text-edutext hover:text-edudanger"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    Subtes Evaluasi
                  </label>
                  <select
                    className="input-inset text-sm font-bold"
                    value={form.subtest}
                    onChange={(e) => setForm({ ...form, subtest: e.target.value })}
                  >
                    <option value="Pengetahuan Kuantitatif">Pengetahuan Kuantitatif (PK)</option>
                    <option value="Penalaran Matematika">Penalaran Matematika (PM)</option>
                    <option value="Penalaran Kuantitatif">Penalaran Kuantitatif (PKu)</option>
                    <option value="Penalaran Umum">Penalaran Umum (PU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    Topik Materi
                  </label>
                  <input
                    type="text"
                    className="input-inset text-sm font-bold"
                    placeholder="Contoh: Persentase & Diskon, Aljabar, dll."
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Teks Pertanyaan Soal
                </label>
                <textarea
                  className="input-inset text-sm font-medium w-full h-24 resize-y"
                  placeholder="Ketik narasi soal atau kasus matematika di sini..."
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>

              {/* 4 Multiple Choice Options with Correct Answer Selector */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-black uppercase tracking-wider">
                  Pilihan Jawaban (Pilih salah satu lingkaran untuk Kunci Jawaban Benar)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((label) => {
                    const isCorrect = form.correctOption === label
                    const fieldKey = `option${label}`
                    return (
                      <div
                        key={label}
                        className={`p-3 rounded-2xl transition-all ${
                          isCorrect ? 'inset border-2 border-edupink' : 'raised-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            isCorrect ? 'bg-edupink text-white' : 'inset text-edutext'
                          }`}>
                            {label}
                          </span>

                          <button
                            type="button"
                            onClick={() => setForm({ ...form, correctOption: label })}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-edupink text-white shadow-sm'
                                : 'text-edutext-muted hover:text-edupink'
                            }`}
                          >
                            <CheckCircle size={14} weight={isCorrect ? 'fill' : 'bold'} />
                            <span>{isCorrect ? 'Kunci Benar' : 'Jadikan Kunci'}</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          className="input-inset text-xs font-semibold w-full"
                          placeholder={`Teks pilihan ${label}...`}
                          value={form[fieldKey]}
                          onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Pembahasan / Penjelasan Jawaban
                </label>
                <textarea
                  className="input-inset text-sm font-medium w-full h-20 resize-y"
                  placeholder="Jelaskan langkah penyelesaian soal agar siswa memahami konsepnya..."
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="btn-accent text-xs py-2.5 px-6 font-bold flex items-center gap-1.5"
                >
                  <Check size={16} weight="bold" />
                  <span>{editId ? 'Simpan Perubahan' : 'Tambahkan Soal'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 && (
            <div className="raised p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl inset text-edutext-muted flex items-center justify-center mx-auto">
                <Question size={32} weight="bold" />
              </div>
              <h3 className="text-base font-black font-display text-edutext">
                Belum Ada Soal Tes Diagnostik
              </h3>
              <p className="text-xs text-edutext-muted max-w-md mx-auto leading-relaxed">
                Buat hingga maksimal 10 soal untuk memetakan level awal pemahaman siswa. Klik tombol <strong>Tambah Soal</strong> atau <strong>Import CSV</strong> di atas.
              </p>
            </div>
          )}

          {questions.map((q, i) => {
            const correctOpt = q.options?.find((o) => o.correct)
            return (
              <div key={q.id} className="raised p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl inset text-edupink font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="badge-chip text-[10px] font-bold">
                        {q.subtest || 'PK'}
                      </span>
                      <span className="badge-accent text-[10px] font-bold">
                        {q.topic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => startEdit(q)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      title="Edit soal ini"
                    >
                      <PencilSimple size={14} weight="bold" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => remove(q.id)}
                      className="btn-secondary text-xs py-1.5 px-2.5 text-edudanger hover:bg-red-50 flex items-center gap-1"
                      title="Hapus soal ini"
                    >
                      <Trash size={14} weight="bold" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-xs sm:text-sm font-bold text-edutext leading-relaxed whitespace-pre-line">
                  {q.question}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options?.map((opt) => {
                    const isCorrect = opt.correct
                    return (
                      <div
                        key={opt.label}
                        className={`p-2.5 rounded-xl flex items-center gap-2.5 ${
                          isCorrect
                            ? 'inset border border-edupink/60 font-bold text-edupink'
                            : 'raised-sm text-edutext font-medium'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-edupink text-white' : 'inset text-edutext'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="truncate">{opt.text}</span>
                        {isCorrect && (
                          <CheckCircle size={14} weight="fill" className="text-edupink ml-auto shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="inset p-3 rounded-xl text-[11px] text-edutext-muted space-y-1">
                    <span className="font-bold text-edupink block">Pembahasan:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
