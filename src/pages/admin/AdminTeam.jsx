import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { saveTeamInfo, defaultTeamInfo } from '../../services/api'
import {
  IdentificationBadge,
  FloppyDisk,
  WhatsappLogo,
  ArrowLeft,
  CheckCircle,
  Sparkle,
  Phone,
  User,
  ChatCircleText,
} from '@phosphor-icons/react'

export default function AdminTeam() {
  const { teamInfo, reloadTeamInfo } = useUser()
  const [form, setForm] = useState(() => ({
    name: teamInfo?.name || defaultTeamInfo.name,
    role: teamInfo?.role || defaultTeamInfo.role,
    phone: teamInfo?.phone || defaultTeamInfo.phone,
    whatsappMessage: teamInfo?.whatsappMessage || defaultTeamInfo.whatsappMessage,
  }))
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      alert('Nama dan Nomor WhatsApp wajib diisi!')
      return
    }

    await saveTeamInfo(form)
    reloadTeamInfo()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  const cleanPhone = (form.phone || '').replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs font-bold text-gray-500 hover:text-turquoise flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <span className="badge-pink text-xs font-bold">Edit Kontak Paywall</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="mb-6">
          <span className="badge-pink mb-1">
            <Sparkle size={13} weight="fill" /> Pengaturan Kontak & Tim
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-roboto text-gray-900 tracking-tight">
            Edit Tim & Kontak Admin
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Data kontak ini akan otomatis tampil di halaman <strong>Tentang Kami</strong> dan tombol <strong>&ldquo;Hubungi Admin&rdquo; pada Paywall</strong>.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle size={20} weight="fill" className="text-emerald-500 shrink-0" />
            <span>Informasi kontak tim & nomor WhatsApp berhasil diperbarui dan disinkronkan!</span>
          </div>
        )}

        {/* Edit Form - BLUE CARD */}
        <div className="card-blue relative border border-white/20 shadow-2xl">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User size={16} weight="bold" />
                Nama Tim / Admin:
              </label>
              <input
                type="text"
                className="input-field-light text-sm font-semibold"
                placeholder="Contoh: Admin NumeracySprint"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <IdentificationBadge size={16} weight="bold" />
                Peran / Jabatan:
              </label>
              <input
                type="text"
                className="input-field-light text-sm font-semibold"
                placeholder="Contoh: Pengembang Platform & Layanan Siswa"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone size={16} weight="bold" />
                Nomor WhatsApp Admin (diawali kode negara 62):
              </label>
              <input
                type="text"
                className="input-field-light text-sm font-semibold font-mono"
                placeholder="Contoh: 6281234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <p className="text-[11px] text-white/70 mt-1">
                Format angka internasional tanpa tanda plus, misalnya: <strong>6281234567890</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ChatCircleText size={16} weight="bold" />
                Template Pesan Awal WhatsApp Paywall:
              </label>
              <textarea
                className="input-field-light text-sm font-medium resize-y min-h-[90px]"
                placeholder="Pesan yang otomatis diketik saat siswa klik hubungi admin..."
                value={form.whatsappMessage}
                onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
              />
            </div>

            {/* Preview Box */}
            <div className="card-inner-glass text-xs space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <WhatsappLogo size={16} weight="fill" className="text-white" />
                Live Preview Link WhatsApp:
              </p>
              <p className="text-white/80 font-mono text-[11px] truncate">
                https://wa.me/{cleanPhone || '6281234567890'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-accent w-full text-sm py-3.5 font-bold shadow-pink flex items-center justify-center gap-2"
              >
                <FloppyDisk size={20} weight="bold" />
                <span>Simpan Perubahan Kontak</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

