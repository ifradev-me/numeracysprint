import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { defaultMaterials } from '../../data/materials'
import DynamicIcon from '../../components/DynamicIcon'
import { saveCustomMaterials, loadCustomMaterials } from '../../services/api'
import { parseMaterialsCSV } from '../../utils/csvParser'
import {
  BookOpenText,
  Plus,
  Trash,
  PencilSimple,
  ArrowLeft,
  ImageSquare,
  Video,
  X,
  LockKey,
  CheckCircle,
  FloppyDisk,
  Sparkle,
  FileCsv,
} from '@phosphor-icons/react'

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
      setMaterials(serverMaterials)
    })
  }, [])

  const persistMaterials = async (updated) => {
    setMaterials(updated)
    await saveCustomMaterials(updated)
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

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Judul dan konten materi wajib diisi!')
      return
    }

    let updated
    if (editId) {
      updated = materials.map((m) => (m.id === editId ? { ...form, id: editId } : m))
    } else {
      updated = [...materials, { ...form, id: Date.now() }]
    }

    await persistMaterials(updated)
    setForm(emptyForm)
    setEditId(null)
    setShowForm(false)
  }

  const remove = async (id) => {
    if (!confirm('Apakah kamu yakin ingin menghapus materi ini?')) return
    const updated = materials.filter((m) => m.id !== id)
    await persistMaterials(updated)
  }

  const startEdit = (mat) => {
    setForm({
      title: mat.title,
      iconName: mat.iconName || 'BookBookmark',
      isPremium: !!mat.isPremium,
      summary: mat.summary || '',
      content: mat.content || '',
      media: mat.media || [],
    })
    setEditId(mat.id)
    setShowForm(true)
  }

  const addMedia = () => {
    if (!mediaInput.url.trim()) return
    setForm((f) => ({ ...f, media: [...(f.media || []), { ...mediaInput }] }))
    setMediaInput({ type: 'image', url: '', caption: '' })
  }

  const removeMedia = (idx) => {
    setForm((f) => ({ ...f, media: f.media.filter((_, i) => i !== idx) }))
  }

  const allMaterials = [...defaultMaterials, ...materials]

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
          <span className="badge-pink text-xs font-bold">Kelola Microlearning</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-roboto text-gray-900 tracking-tight">
              Kelola Materi Microlearning
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Total {allMaterials.length} materi ({defaultMaterials.length} bawaan + {materials.length} kustom).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {materials.length > 0 && (
              <button
                onClick={clearAllCustomMaterials}
                className="text-xs py-2 px-3 font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                title="Hapus semua materi kustom"
              >
                <Trash size={16} weight="bold" />
                <span>Bersihkan ({materials.length})</span>
              </button>
            )}

            <a
              href="/template_materi.csv"
              download="template_materi.csv"
              className="text-xs py-2 px-3 font-bold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              title="Download file template CSV materi"
            >
              <FileCsv size={16} weight="bold" />
              <span>Template CSV</span>
            </a>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
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
              <span>Tambah Materi Baru</span>
            </button>
          </div>
        </div>

        {/* CSV Format Guide Card */}
        <div className="card-inner-white mb-6 border-2 border-turquoise/20">
          <div className="flex items-center gap-2 font-bold text-gray-800 text-xs mb-2">
            <FileCsv size={20} weight="bold" className="text-pink-soft" />
            <span>Format Kolom CSV untuk Import Materi:</span>
          </div>
          <code className="text-xs font-mono bg-turquoise-light/50 p-2.5 rounded-xl block text-turquoise-deep font-semibold">
            title,iconName,isPremium,summary,content,mediaType,mediaUrl,mediaCaption
          </code>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            Unduh <strong>Template CSV</strong> di atas, buka di Excel/Google Sheets, isi modul materi, lalu klik <strong>Import CSV</strong>. Tanda petik ganda dan teks multiline (paragraf) didukung penuh.
          </p>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="card-blue mb-8 border-2 border-white/30 shadow-2xl animate-pop-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-roboto text-white flex items-center gap-2">
                <BookOpenText size={22} weight="bold" />
                <span>{editId ? 'Edit Materi' : 'Buat Materi Baru'}</span>
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Nama Ikon Phosphor:
                  </label>
                  <input
                    className="input-field-light text-xs font-mono font-semibold"
                    placeholder="Contoh: Percent, ChartBar, Scales"
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Judul Topik Materi *:
                  </label>
                  <input
                    className="input-field-light text-xs font-semibold"
                    placeholder="Contoh: Menghitung Rasio Campuran"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>

              {/* Toggle Premium / Free */}
              <div className="card-inner-glass flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2 text-xs text-white">
                  <LockKey size={18} weight="fill" className="text-white" />
                  <div>
                    <p className="font-bold">Kunci Materi dengan Paywall (Premium)</p>
                    <p className="text-[11px] text-white/70">
                      Siswa harus berstatus &ldquo;Sudah Bayar&rdquo; untuk dapat membaca materi ini.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="premiumCheck"
                  checked={form.isPremium}
                  onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                  className="w-5 h-5 accent-pink-soft rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Ringkasan Singkat:
                </label>
                <input
                  className="input-field-light text-xs font-semibold"
                  placeholder="Ringkasan 1 kalimat..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Konten Edukasi Lengkap *:
                </label>
                <textarea
                  className="input-field-light text-xs font-normal resize-y min-h-[140px]"
                  placeholder="Tulis materi penjelasan, rumus, contoh kasus..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              {/* Media Section */}
              <div className="card-inner-glass space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageSquare size={16} weight="bold" />
                  Media Pendukung (Gambar atau Video YouTube):
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    className="input-field-light text-xs sm:w-32 font-bold"
                    value={mediaInput.type}
                    onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value })}
                  >
                    <option value="image">Gambar</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    className="input-field-light text-xs flex-1 font-mono"
                    placeholder="URL gambar (https://...) atau link YouTube"
                    value={mediaInput.url}
                    onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
                  />
                  <input
                    className="input-field-light text-xs sm:w-44"
                    placeholder="Keterangan / Caption"
                    value={mediaInput.caption}
                    onChange={(e) => setMediaInput({ ...mediaInput, caption: e.target.value })}
                  />
                  <button onClick={addMedia} className="btn-accent text-xs py-2 px-4 shrink-0 font-bold">
                    + Tambah
                  </button>
                </div>

                {form.media?.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {form.media.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/20 text-white text-xs"
                      >
                        <span className="truncate">
                          {med.type === 'image' ? '🖼️ Gambar' : '🎬 Video'}: {med.url}
                        </span>
                        <button
                          onClick={() => removeMedia(idx)}
                          className="w-5 h-5 rounded-full bg-pink-soft text-white flex items-center justify-center shrink-0"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="btn-accent text-xs py-2.5 px-6 font-bold shadow-pink">
                  <FloppyDisk size={18} weight="bold" />
                  <span>Simpan Materi</span>
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline-white text-xs py-2.5 px-5">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Items List */}
        <div className="space-y-3">
          {allMaterials.map((mat, i) => {
            const isDefault = i < defaultMaterials.length
            return (
              <div
                key={mat.id}
                className="card-blue flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20 shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white text-turquoise-dark flex items-center justify-center font-bold shadow-soft shrink-0">
                    <DynamicIcon name={mat.iconName || 'BookBookmark'} size={24} weight="bold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base font-roboto">{mat.title}</h3>
                      {isDefault && (
                        <span className="badge-glass text-[10px] text-white/80 py-0.5 px-2">Default</span>
                      )}
                      {mat.isPremium && (
                        <span className="badge-pink text-[10px] py-0.5 px-2 flex items-center gap-1 font-bold">
                          <LockKey size={12} weight="fill" /> Berbayar
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/80 mt-0.5 line-clamp-1">{mat.summary}</p>
                  </div>
                </div>

                {!isDefault && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => startEdit(mat)}
                      className="text-xs font-bold py-2 px-3.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                      <PencilSimple size={14} weight="bold" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => remove(mat.id)}
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
