import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { defaultMaterials } from '../../data/materials'
import DynamicIcon from '../../components/DynamicIcon'
import { saveCustomMaterials, loadCustomMaterials } from '../../services/api'
import {
  BookOpenText,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  ImageSquare,
  Video,
  X,
  Lock,
  LockOpen,
  CheckCircle,
  Sparkle,
  FileCsv,
  DownloadSimple,
} from '@phosphor-icons/react'
import { parseMaterialsCSV } from '../../utils/csvParser'

const emptyForm = {
  title: '',
  iconName: 'BookBookmark',
  isPremium: false,
  summary: '',
  content: '',
  media: [],
}

export default function AdminMaterials() {
  const [materials, setMaterials] = useState(() => {
    return JSON.parse(localStorage.getItem('numeracy_custom_materials') || '[]')
  })
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [mediaInput, setMediaInput] = useState({ type: 'image', url: '', caption: '' })
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef(null)

  // Load fresh custom materials from server on mount
  useEffect(() => {
    loadCustomMaterials().then((serverMaterials) => {
      if (serverMaterials) setMaterials(serverMaterials)
    })
  }, [])

  const persistMaterials = async (updated) => {
    setMaterials(updated)
    await saveCustomMaterials(updated)
  }

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Judul dan konten materi wajib diisi!')
      return
    }

    let updated
    if (editId) {
      updated = materials.map((m) => (m.id === editId ? { ...form, id: editId } : m))
    } else {
      const newId = Date.now()
      updated = [...materials, { ...form, id: newId }]
    }

    await persistMaterials(updated)
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const startEdit = (m) => {
    setForm({
      title: m.title,
      iconName: m.iconName || 'BookBookmark',
      isPremium: m.isPremium || false,
      summary: m.summary || '',
      content: m.content || '',
      media: m.media || [],
    })
    setEditId(m.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (window.confirm('Yakin ingin menghapus topik materi kustom ini?')) {
      const updated = materials.filter((m) => m.id !== id)
      await persistMaterials(updated)
    }
  }

  const handleCSVImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const parsed = parseMaterialsCSV(evt.target.result)
        if (parsed.length === 0) {
          alert('File CSV tidak memiliki baris materi yang valid atau format header tidak sesuai.')
          return
        }

        const updated = [...materials, ...parsed]
        await persistMaterials(updated)
        alert(`Berhasil mengimpor ${parsed.length} materi baru dari CSV!`)
      } catch (err) {
        alert('Gagal membaca file CSV: ' + err.message)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const clearAllCustomMaterials = async () => {
    if (
      window.confirm(
        `Yakin ingin menghapus seluruh ${materials.length} materi tambahan kustom? (Materi bawaan sistem tidak akan terhapus)`
      )
    ) {
      await persistMaterials([])
      alert('Semua materi tambahan kustom berhasil dibersihkan.')
    }
  }

  const addMedia = () => {
    if (!mediaInput.url.trim()) return
    setForm((prev) => ({
      ...prev,
      media: [...prev.media, { ...mediaInput }],
    }))
    setMediaInput({ type: 'image', url: '', caption: '' })
  }

  const removeMedia = (idx) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== idx),
    }))
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVImport}
        className="hidden"
      />

      {/* Top Bar */}
      <nav className="bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <span className="badge-chip text-xs font-bold">Kelola Materi</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Kelola Materi Microlearning
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm mt-1">
              Tambahkan modul materi kustom baru, ilustrasi gambar, video edukatif, atau import via CSV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {materials.length > 0 && (
              <button
                onClick={clearAllCustomMaterials}
                className="btn-secondary text-xs py-2.5 px-3 font-bold flex items-center gap-1.5 text-edudanger hover:text-red-700"
                title="Hapus semua materi kustom tambahan (misal yang sempat salah format)"
              >
                <Trash size={16} weight="bold" />
                <span>Bersihkan ({materials.length})</span>
              </button>
            )}

            <a
              href="/template_materi.csv"
              download="template_materi.csv"
              className="btn-secondary text-xs py-2.5 px-3.5 font-bold flex items-center gap-1.5"
              title="Download file template CSV untuk diisi di Excel"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Template CSV</span>
            </a>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-xs py-2.5 px-3.5 font-bold flex items-center gap-1.5"
            >
              <FileCsv size={16} weight="bold" className="text-edupink" />
              <span>Import CSV</span>
            </button>

            {!showForm && (
              <button
                onClick={() => {
                  setForm(emptyForm)
                  setEditId(null)
                  setShowForm(true)
                }}
                className="btn-accent text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
              >
                <Plus size={16} weight="bold" />
                <span>Tambah Manual</span>
              </button>
            )}
          </div>
        </div>

        {/* CSV Guide Box */}
        <div className="raised p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-edutext text-xs">
            <FileCsv size={20} weight="bold" className="text-edupink" />
            <span>Format Header File CSV Materi:</span>
          </div>
          <code className="block inset p-3 font-mono text-[11px] text-edutext overflow-x-auto">
            title,iconName,isPremium,summary,content,mediaType,mediaUrl,mediaCaption
          </code>
          <p className="text-[11px] text-edutext-muted">
            Kamu bisa download file <strong>template_materi.csv</strong> di atas, buka di Excel/Notepad, isi materi sebanyak mungkin, lalu klik <strong>Import CSV</strong>.
          </p>
        </div>

        {/* Form Modal/Card */}
        {showForm && (
          <div className="raised p-6 sm:p-8 space-y-5 animate-pop-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/60">
              <h2 className="text-lg font-black font-display text-edutext">
                {editId ? 'Edit Materi Kustom' : 'Buat Materi Baru'}
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
                  Judul Materi
                </label>
                <input
                  type="text"
                  className="input-inset text-sm"
                  placeholder="Contoh: Logika Matriks & Determinan"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Ringkasan Singkat
                </label>
                <input
                  type="text"
                  className="input-inset text-sm"
                  placeholder="Ringkasan 1-2 kalimat untuk kartu materi"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="premiumCheck"
                  checked={form.isPremium}
                  onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                  className="w-4 h-4 rounded text-edupink accent-edupink cursor-pointer"
                />
                <label htmlFor="premiumCheck" className="text-xs font-bold text-edutext cursor-pointer">
                  Materi Berbayar (Pro) &bull; Memerlukan akses akun berbayar
                </label>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  Konten Materi (Dukung Markdown **tebal**)
                </label>
                <textarea
                  rows={6}
                  className="input-inset text-sm"
                  placeholder="Tuliskan rumus, konsep utama, dan contoh kasus di sini..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              {/* Media Attachments Section */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-black uppercase tracking-wider">Lampiran Gambar / Video</p>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <select
                    className="sm:col-span-3 input-inset text-xs font-bold"
                    value={mediaInput.type}
                    onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value })}
                  >
                    <option value="image">Gambar (URL)</option>
                    <option value="video">Video (YouTube URL)</option>
                  </select>
                  <input
                    type="text"
                    className="sm:col-span-6 input-inset text-xs"
                    placeholder="Tautan URL gambar atau YouTube"
                    value={mediaInput.url}
                    onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={addMedia}
                    className="sm:col-span-3 btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Tambahkan</span>
                  </button>
                </div>

                {/* Media list */}
                {form.media.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {form.media.map((m, idx) => (
                      <div key={idx} className="inset p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-mono truncate max-w-sm">
                          [{m.type}] {m.url}
                        </span>
                        <button
                          onClick={() => removeMedia(idx)}
                          className="text-edudanger hover:underline font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                Simpan Materi
              </button>
            </div>
          </div>
        )}

        {/* Existing Custom Materials List */}
        <div className="space-y-4">
          <h2 className="text-base font-black font-display text-edutext">
            Daftar Materi Kustom ({materials.length})
          </h2>

          {materials.length === 0 ? (
            <div className="raised p-8 text-center text-xs text-edutext-muted space-y-2">
              <BookOpenText size={36} weight="bold" className="mx-auto text-edupink opacity-40" />
              <p className="font-bold text-edutext">Belum ada modul materi</p>
              <p>Tambahkan modul baru secara manual atau unduh template lalu import berkas CSV.</p>
            </div>
          ) : (
            materials.map((m) => (
              <div key={m.id} className="raised p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-edutext">{m.title}</h3>
                    {m.isPremium ? (
                      <span className="badge-chip text-[10px] text-edupink">Pro</span>
                    ) : (
                      <span className="badge-chip text-[10px] text-edupink">Gratis</span>
                    )}
                  </div>
                  <p className="text-xs text-edutext-muted line-clamp-1">{m.summary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(m)}
                    className="w-8 h-8 rounded-xl raised-sm flex items-center justify-center text-edutext hover:text-edupink"
                    title="Edit Materi"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="w-8 h-8 rounded-xl raised-sm flex items-center justify-center text-edutext hover:text-edudanger"
                    title="Hapus Materi"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
