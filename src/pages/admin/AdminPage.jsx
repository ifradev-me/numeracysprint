import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LockKey,
  UsersThree,
  BookOpenText,
  Timer,
  IdentificationBadge,
  SignOut,
  ArrowLeft,
  Sparkle,
  TrendUp,
  CreditCard,
  Target,
  ArrowRight,
  Brain,
} from '@phosphor-icons/react'

const ADMIN_PASSWORD = 'admin123'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true')
  const [error, setError] = useState('')

  const allUsers = JSON.parse(localStorage.getItem('numeracy_all_users') || '[]')
  const paidUsersCount = allUsers.filter((u) => u.isPaid).length
  const avgScore = allUsers.length
    ? Math.round(
      allUsers.reduce((s, u) => s + (u.diagnostic?.score || 0), 0) / allUsers.length
    )
    : 0

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
    } else {
      setError('Password salah!')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-edubg text-edutext flex items-center justify-center p-4 selection:bg-edupink selection:text-white">
        <div className="raised w-full max-w-sm text-center p-8 space-y-6">
          <div className="w-16 h-16 rounded-3xl inset text-edupink flex items-center justify-center mx-auto">
            <LockKey size={34} weight="bold" />
          </div>

          <div className="space-y-1">
            <span className="badge-chip text-[11px]">
              <Sparkle size={13} weight="fill" className="text-edupink" /> Portal Pengelola
            </span>
            <h1 className="text-2xl font-black font-display text-edutext">Login Admin EduSpark</h1>
            <p className="text-edutext-muted text-xs font-medium">
              Masukkan password untuk mengelola status paket siswa, materi, dan soal try out.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-edutext uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-inset text-sm font-semibold"
                placeholder="masukan Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoFocus
              />
              {error && (
                <div className="mt-2 text-xs font-bold text-white bg-edudanger p-2.5 rounded-xl animate-pop-in">
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="btn-accent w-full text-xs py-3 font-black">
              <span>Buka Panel Admin</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/60 text-center">
            <Link to="/" className="text-xs text-edutext-muted hover:text-edupink flex items-center justify-center gap-1 font-bold">
              <ArrowLeft size={14} weight="bold" />
              <span>Kembali ke Beranda Siswa</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Siswa', value: allUsers.length, icon: UsersThree },
    { label: 'Akun Pro (Berbayar)', value: paidUsersCount, icon: CreditCard },
    { label: 'Rata-rata Skor', value: `${avgScore}/100`, icon: TrendUp },
    {
      label: 'Level Lanjut',
      value: allUsers.filter((u) => u.diagnostic?.levelInfo?.level === 'Lanjut').length,
      icon: Target,
    },
  ]

  const adminMenus = [
    {
      path: '/admin/users',
      icon: UsersThree,
      title: 'Data Siswa & Status Paket',
      desc: 'Lihat profil, hasil evaluasi, dan toggle status paket Gratis / Berbayar (Pro).',
      badge: `${allUsers.length} Siswa`,
    },
    {
      path: '/admin/materials',
      icon: BookOpenText,
      title: 'Kelola Materi Microlearning',
      desc: 'Tambah materi baru, upload gambar ilustrasi, dan pasang video YouTube edukatif.',
      badge: 'Editor Materi',
    },
    {
      path: '/admin/exercises',
      icon: Timer,
      title: 'Kelola Soal & Import CSV',
      desc: 'Input soal try out ber-timer secara manual atau unggah massal melalui file CSV.',
      badge: 'CSV Import Ready',
    },
    {
      path: '/admin/team',
      icon: IdentificationBadge,
      title: 'Edit Tim & Kontak Admin',
      desc: 'Perbarui kontak WhatsApp admin yang tampil di Beranda dan jendela aktivasi akun.',
      badge: 'Kontak WhatsApp',
    },
  ]

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
      {/* Admin Navbar */}
      <nav className="bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl inset text-edupink flex items-center justify-center font-bold">
              <LockKey size={20} weight="bold" />
            </div>
            <div>
              <span className="font-black font-display text-sm sm:text-base">
                Admin <span className="text-edupink">EduSpark</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Halaman Siswa</span>
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('admin_auth')
                setAuthed(false)
              }}
              className="text-xs font-bold text-edutext-muted hover:text-edudanger flex items-center gap-1 px-3 py-1.5 rounded-xl raised-sm hover:inset transition-all cursor-pointer"
            >
              <SignOut size={16} weight="bold" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        <div className="space-y-1">
          <span className="badge-chip text-[11px]">
            <Sparkle size={13} weight="fill" className="text-edupink" /> Pusat Kendali EduSpark
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
            Dashboard Pengelola
          </h1>
          <p className="text-edutext-muted text-xs sm:text-sm font-medium">
            Pantau hasil belajar siswa, toggle status paket akun, serta kelola konten dan soal try out.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="raised p-5 space-y-2">
                <div className="w-10 h-10 rounded-2xl inset text-edupink flex items-center justify-center">
                  <Icon size={20} weight="bold" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-edutext tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-edutext-muted font-bold">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminMenus.map((menu) => {
            const Icon = menu.icon
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className="raised p-6 flex flex-col justify-between hover:border-edupink transition-all duration-200 group space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl inset text-edupink flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Icon size={24} weight="bold" />
                    </div>
                    <span className="badge-chip text-[11px] font-bold">{menu.badge}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black font-display text-edutext tracking-tight">
                    {menu.title}
                  </h3>
                  <p className="text-edutext-muted text-xs leading-relaxed font-normal">{menu.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/60 flex items-center justify-between text-xs font-bold text-edupink group-hover:translate-x-1 transition-transform">
                  <span>Buka Pengaturan</span>
                  <ArrowRight size={16} weight="bold" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
