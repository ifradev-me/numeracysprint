import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { defaultExercises } from '../../data/exercises'
import { saveCustomExercises, loadCustomExercises } from '../../services/api'
import { parseExercisesCSV } from '../../utils/csvParser'
import {
  Timer,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  FileCsv,
  Sparkle,
  X,
  CheckCircle,
  ListNumbers,
  Question,
  ArrowsClockwise,
} from '@phosphor-icons/react'

const emptyForm = {
  topic: 'Pengetahuan Kuantitatif',
  question: '',
  type: 'input',
  answer: '',
  answerDisplay: '',
  explanation: '',
  hint: '',
}

export default function AdminExercises() {
  const [exercises, setExercises] = useState(() => {
    return JSON.parse(localStorage.getItem('numeracy_custom_exercises') || '[]')
  })
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef()

  // Load fresh data from server on mount
  useEffect(() => {
    loadCustomExercises().then((serverExercises) => {
      if (serverExercises) setExercises(serverExercises)
    })
  }, [])

  const persistExercises = async (updated) => {
    setExercises(updated)
    await saveCustomExercises(updated)
  }

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      alert('Pertanyaan dan jawaban wajib diisi!')
      return
    }

    let updated
    if (editId) {
      updated = exercises.map((e) => (e.id === editId ? { ...form, id: editId } : e))
    } else {
      updated = [...exercises, { ...form, id: Date.now() }]
    }

    await persistExercises(updated)
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const remove = async (id) => {
    if (window.confirm('Yakin ingin menghapus soal ini?')) {
      const updated = exercises.filter((e) => e.id !== id)
      await persistExercises(updated)
    }
  }

  const startEdit = (ex) => {
    setForm({
      topic: ex.topic || 'Pengetahuan Kuantitatif',
      question: ex.question || '',
      type: ex.type || 'input',
      answer: ex.answer || '',
      answerDisplay: ex.answerDisplay || '',
      explanation: ex.explanation || '',
      hint: ex.hint || '',
    })
    setEditId(ex.id)
    setShowForm(true)
  }

  const handleCSVImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const parsed = parseExercisesCSV(evt.target.result)
        if (parsed.length === 0) {
          alert('File CSV tidak memiliki baris data soal yang valid atau format header tidak sesuai.')
          return
        }

        const updated = [...exercises, ...parsed]
        await persistExercises(updated)
        alert(`Berhasil mengimpor ${parsed.length} soal try out baru dari CSV!`)
      } catch (err) {
        alert('Gagal membaca file CSV: ' + err.message)
      } finally {
        if (fileRef.current) fileRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const clearAllCustomExercises = async () => {
    if (
      window.confirm(
        `Yakin ingin menghapus seluruh ${exercises.length} soal tambahan kustom? (Soal bawaan sistem tidak akan terhapus)`
      )
    ) {
      await persistExercises([])
      alert('Semua soal tambahan kustom berhasil dibersihkan.')
    }
  }

  const allExercises = [...defaultExercises, ...exercises]

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
          <span className="badge-chip text-xs font-bold">Kelola Soal & CSV</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Kelola Soal Try Out & Import CSV
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm mt-1">
              Total {allExercises.length} soal ({defaultExercises.length} bawaan + {exercises.length} kustom) siap dikerjakan dalam Try Out.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {exercises.length > 0 && (
              <button
                onClick={clearAllCustomExercises}
                className="btn-secondary text-xs py-2.5 px-3 font-bold flex items-center gap-1.5 text-edudanger hover:text-red-700"
                title="Hapus semua soal kustom (misal yang sempat salah format)"
              >
                <Trash size={16} weight="bold" />
                <span>Bersihkan ({exercises.length})</span>
              </button>
            )}

            <a
              href="/template_soal.csv"
              download="template_soal.csv"
              className="btn-secondary text-xs py-2.5 px-3.5 font-bold flex items-center gap-1.5"
              title="Download file template CSV untuk diisi di Excel"
            >
              <FileCsv size={16} weight="bold" />
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
              onClick={() => fileRef.current?.click()}
              className="btn-secondary text-xs py-2.5 px-3.5 font-bold flex items-center gap-1.5"
            >
              <FileCsv size={16} weight="bold" className="text-eduaccent" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => {
                setShowForm(true)
                setEditId(null)
                setForm(emptyForm)
              }}
              className="btn-accent text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
            >
              <Plus size={16} weight="bold" />
              <span>Tambah Soal</span>
            </button>
          </div>
        </div>

        {/* CSV Format Guide */}
        <div className="raised p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-edutext text-xs">
            <FileCsv size={20} weight="bold" className="text-eduaccent" />
            <span>Format Header File CSV yang Didukung:</span>
          </div>
          <code className="block inset p-3 font-mono text-[11px] text-edutext overflow-x-auto">
            topic,question,answer,explanation,hint
          </code>
          <p className="text-[11px] text-edutext-muted">
            Contoh baris: Pengetahuan Kuantitatif,"Jika 2x + 6 = 16, berapakah nilai x?",5,"2x = 10 maka x = 5","Pindah ruas 6"
          </p>
        </div>

        {/* Form Modal/Card */}
        {showForm && (
          <div className="raised p-6 sm:p-8 space-y-5 animate-pop-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h2 className="text-lg font-black font-display text-edutext">
                {editId ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full raised-sm flex items-center justify-center text-edutext hover:text-edudanger"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Subtes / Topik
                </label>
                <select
                  className="input-inset text-sm font-bold"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  <option value="Pengetahuan Kuantitatif">Pengetahuan Kuantitatif (PK)</option>
                  <option value="Penalaran Matematika">Penalaran Matematika (PM)</option>
                  <option value="Penalaran Kuantitatif">Penalaran Kuantitatif (PKu)</option>
                  <option value="Persentase & Diskon">Persentase & Diskon</option>
                  <option value="Rata-rata Data">Rata-rata Data</option>
                  <option value="Perbandingan & Rasio">Perbandingan & Rasio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Teks Pertanyaan
                </label>
                <textarea
                  rows={3}
                  className="input-inset text-sm"
                  placeholder="Ketik soal cerita atau persamaan matematika..."
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    Kunci Jawaban (Angka / Teks)
                  </label>
                  <input
                    type="text"
                    className="input-inset text-sm"
                    placeholder="Contoh: 180000 atau 5"
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    Tampilan Jawaban (Label)
                  </label>
                  <input
                    type="text"
                    className="input-inset text-sm"
                    placeholder="Contoh: Rp180.000 atau 5 kg"
                    value={form.answerDisplay}
                    onChange={(e) => setForm({ ...form, answerDisplay: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Pembahasan Detail
                </label>
                <textarea
                  rows={3}
                  className="input-inset text-sm"
                  placeholder="Penjelasan langkah demi langkah penyelesaian soal..."
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Petunjuk / Hint (Opsional)
                </label>
                <input
                  type="text"
                  className="input-inset text-sm"
                  placeholder="Petunjuk singkat sebelum menjawab..."
                  value={form.hint}
                  onChange={(e) => setForm({ ...form, hint: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/60">
              <button
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Batal
              </button>
              <button
                onClick={save}
                className="btn-accent text-xs py-2.5 px-6 font-bold"
              >
                Simpan Soal
              </button>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-4">
          <h2 className="text-base font-black font-display text-edutext">
            Daftar Soal Try Out ({allExercises.length})
          </h2>

          <div className="space-y-3">
            {allExercises.map((ex, idx) => {
              const isDefault = defaultExercises.some((d) => d.id === ex.id)
              return (
                <div key={ex.id} className="raised p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge-chip text-[10px]">
                        Soal #{idx + 1}
                      </span>
                      <span className="badge-chip text-[10px] text-eduaccent">
                        {ex.topic}
                      </span>
                      {isDefault && (
                        <span className="text-[10px] text-edutext-muted font-bold">
                          [Bawaan Sistem]
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-sm text-edutext mt-1 whitespace-pre-line">{ex.question}</p>
                    <p className="text-xs text-edutext-muted">
                      Kunci: <strong className="text-eduaccent">{ex.answerDisplay || ex.answer}</strong>
                    </p>
                  </div>

                  {!isDefault && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(ex)}
                        className="w-8 h-8 rounded-xl raised-sm flex items-center justify-center text-edutext hover:text-eduaccent"
                      >
                        <PencilSimple size={16} weight="bold" />
                      </button>
                      <button
                        onClick={() => remove(ex.id)}
                        className="w-8 h-8 rounded-xl raised-sm flex items-center justify-center text-edutext hover:text-edudanger"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
