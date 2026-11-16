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
    name: teamInfo?.name || 'Admin EduSpark',
    role: teamInfo?.role || 'Layanan Siswa & Bantuan Belajar',
    phone: teamInfo?.phone || '6281234567890',
    whatsappMessage:
      teamInfo?.whatsappMessage ||
      'Halo Admin EduSpark, saya ingin konfirmasi pembayaran untuk aktivasi akun Pro Matematika UTBK!',
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
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      {/* Top Navbar */}
      <nav className="bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <span className="badge-chip text-xs font-bold">Edit Kontak Admin</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        <div>
          <span className="badge-chip text-[11px] mb-1">
            <Sparkle size={13} weight="fill" className="text-edupink" /> Konfigurasi Kontak
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
            Pengaturan Tim & Kontak WhatsApp
          </h1>
          <p className="text-edutext-muted text-xs sm:text-sm mt-1">
            Informasi ini otomatis tampil di Beranda dan jendela aktivasi paket Pro saat siswa menekan tombol "Hubungi Admin".
          </p>
        </div>

        {savedSuccess && (
          <div className="inset p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-eduaccent border border-eduaccent animate-pop-in">
            <CheckCircle size={20} weight="fill" />
            <span>Informasi kontak admin berhasil disimpan ke database cloud!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="raised p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User size={15} weight="bold" className="text-eduaccent" />
              <span>Nama Admin / Narahubung</span>
            </label>
            <input
              type="text"
              className="input-inset text-sm font-semibold"
              placeholder="Contoh: Andi Pratama (Admin EduSpark)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IdentificationBadge size={15} weight="bold" className="text-eduaccent" />
              <span>Peran / Jabatan</span>
            </label>
            <input
              type="text"
              className="input-inset text-sm"
              placeholder="Contoh: Admin Pendaftaran & Bantuan Belajar"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone size={15} weight="bold" className="text-eduaccent" />
              <span>Nomor WhatsApp (Gunakan Kode Negara 62)</span>
            </label>
            <input
              type="text"
              className="input-inset text-sm font-mono font-bold"
              placeholder="Contoh: 6281234567890"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <p className="text-[11px] text-edutext-muted mt-1.5 font-medium">
              Format: angka tanpa spasi atau strip (+ atau 0 otomatis disesuaikan).
            </p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ChatCircleText size={15} weight="bold" className="text-eduaccent" />
              <span>Template Pesan WhatsApp Otomatis</span>
            </label>
            <textarea
              rows={3}
              className="input-inset text-sm"
              placeholder="Pesan pembuka default saat siswa menekan tombol WhatsApp..."
              value={form.whatsappMessage}
              onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
            />
          </div>

          {/* WhatsApp Preview Card */}
          <div className="inset p-4 rounded-2xl space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-edutext-muted">
              Pratinjau Tautan WhatsApp:
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-edutext">
              <WhatsappLogo size={20} weight="fill" className="text-emerald-600 shrink-0" />
              <span className="font-mono truncate">wa.me/{cleanPhone}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/60 flex justify-end">
            <button
              type="submit"
              className="btn-accent text-xs py-3 px-6 font-bold flex items-center gap-2"
            >
              <FloppyDisk size={18} weight="bold" />
              <span>Simpan Pengaturan Kontak</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
