import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { defaultExercises } from '../../data/exercises'
import { saveCustomExercises, loadCustomExercises } from '../../services/api'
import {
  PencilSimpleLine,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  FileCsv,
  Sparkle,
  FloppyDisk,
  X,
  CheckCircle,
  Question,
  ListNumbers,
} from '@phosphor-icons/react'

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((s) => s.trim().toLowerCase())
  return lines
    .slice(1)
    .map((line, i) => {
      // Basic CSV splitter that handles potential quoted strings
      const vals = line.split(',').map((s) => s.trim().replace(/^"|"$/g, ''))
      const obj = {}
      headers.forEach((h, idx) => {
        obj[h] = vals[idx] || ''
      })

      return {
        id: Date.now() + i,
        topic: obj.topic || 'Persentase',
        question: obj.question || '',
        type: 'input',
        answer: (obj.answer || '').replace(/\./g, '').replace(/,/g, ''),
        answerDisplay: obj.answer || '',
        explanation: obj.explanation || 'Pembahasan telah disediakan.',
        hint: obj.hint || '',
      }
    })
    .filter((q) => q.question.length > 0)
}

const emptyForm = {
  topic: '',
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
      setExercises(serverExercises)
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
    if (!confirm('Hapus soal ini?')) return
    const updated = exercises.filter((e) => e.id !== id)
    await persistExercises(updated)
  }

  const startEdit = (ex) => {
    setForm({
      topic: ex.topic || '',
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
      const parsed = parseCSV(evt.target.result)
      if (parsed.length === 0) {
        alert('File CSV tidak memiliki baris data yang valid.')
        return
      }

      const updated = [...exercises, ...parsed]
      await persistExercises(updated)
      alert(`Berhasil mengimpor ${parsed.length} soal numerasi baru dari CSV!`)
    }
    reader.readAsText(file)
  }

  const allExercises = [...defaultExercises, ...exercises]

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs font-bold text-gray-500 hover:text-turquoise flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <span className="badge-pink text-xs font-bold">Kelola Soal & CSV</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-roboto text-gray-900 tracking-tight">
              Kelola Soal & Import CSV
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Total {allExercises.length} soal numerasi siap dikerjakan siswa di halaman latihan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-accent text-xs py-2.5 px-4 font-bold shadow-pink flex items-center gap-2"
            >
              <FileCsv size={18} weight="bold" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => {
                setShowForm(true)
                setEditId(null)
                setForm(emptyForm)
              }}
              className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-2"
            >
              <Plus size={18} weight="bold" />
              <span>Tambah Soal</span>
            </button>
          </div>
        </div>

        {/* CSV Format Guide Card */}
        <div className="card-inner-white mb-6 border-2 border-turquoise/20">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-xs mb-2">
            <FileCsv size={20} weight="bold" className="text-pink-soft" />
            <span>Format Kolom CSV untuk Import Soal:</span>
          </div>
          <code className="text-xs font-mono bg-turquoise-light/50 p-2.5 rounded-xl block text-turquoise-deep font-semibold">
            topic,question,answer,explanation,hint
          </code>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Contoh baris data: <br />
            <code className="text-[10px] text-gray-600 font-mono">
              Persentase,Berapa 10% dari Rp500.000?,50000,10/100 * 500000 = 50000,Gunakan rumus persentase dasar
            </code>
          </p>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="card-blue mb-8 border-2 border-white/30 shadow-2xl animate-pop-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-roboto text-white flex items-center gap-2">
                <PencilSimpleLine size={22} weight="bold" />
                <span>{editId ? 'Edit Soal Numerasi' : 'Tambah Soal Baru'}</span>
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Topik / Kategori *:
                  </label>
                  <input
                    className="input-field-light text-xs font-semibold"
                    placeholder="Contoh: Persentase, Rata-rata, Rasio"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Tipe Soal:
                  </label>
                  <select
                    className="input-field-light text-xs font-bold"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="input">Isian Teks / Angka</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Pertanyaan Soal Kontekstual *:
                </label>
                <textarea
                  className="input-field-light text-xs font-normal resize-y min-h-[90px]"
                  placeholder="Tulis soal cerita atau permasalahan numerasi..."
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Kunci Jawaban (Angka / Teks) *:
                  </label>
                  <input
                    className="input-field-light text-xs font-mono font-bold"
                    placeholder="Contoh: 180000"
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Format Tampilan Jawaban (Opsional):
                  </label>
                  <input
                    className="input-field-light text-xs font-semibold"
                    placeholder="Contoh: Rp180.000"
                    value={form.answerDisplay}
                    onChange={(e) => setForm({ ...form, answerDisplay: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Pembahasan / Penjelasan Jawaban:
                </label>
                <input
                  className="input-field-light text-xs font-normal"
                  placeholder="Langkah perhitungan yang benar..."
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Petunjuk / Hint (Opsional):
                </label>
                <input
                  className="input-field-light text-xs font-normal"
                  placeholder="Petunjuk rumus atau konsep awal..."
                  value={form.hint}
                  onChange={(e) => setForm({ ...form, hint: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={save} className="btn-accent text-xs py-2.5 px-6 font-bold shadow-pink">
                  <FloppyDisk size={18} weight="bold" />
                  <span>Simpan Soal</span>
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline-white text-xs py-2.5 px-5">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="space-y-3">
          {allExercises.map((ex, i) => {
            const isDefault = i < defaultExercises.length
            return (
              <div
                key={ex.id}
                className="card-blue flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20 shadow-md"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-turquoise-dark flex items-center justify-center font-black text-xs shadow-soft shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-pink text-[10px] py-0.5 px-2 font-bold uppercase tracking-wider">
                        {ex.topic}
                      </span>
                      {isDefault && (
                        <span className="badge-glass text-[10px] text-white/80 py-0.5 px-2">Default</span>
                      )}
                    </div>
                    <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
                      {ex.question}
                    </p>
                    <p className="text-[11px] text-white/70 mt-1">
                      Kunci: <strong className="text-yellow-300">{ex.answerDisplay || ex.answer}</strong>
                    </p>
                  </div>
                </div>

                {!isDefault && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => startEdit(ex)}
                      className="text-xs font-bold py-2 px-3.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                      <PencilSimple size={14} weight="bold" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => remove(ex.id)}
                      className="text-xs font-bold py-2 px-3 rounded-xl bg-pink-soft/80 hover:bg-pink-soft text-white transition-colors flex items-center gap-1"
                    >
                      <Trash size={14} weight="bold" />
                      <span>Hapus</span>
                    </button>
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
