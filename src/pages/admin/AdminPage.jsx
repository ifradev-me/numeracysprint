import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LockKey,
  UsersThree,
  BookOpenText,
  PencilSimpleLine,
  IdentificationBadge,
  SignOut,
  ArrowLeft,
  Sparkle,
  TrendUp,
  CreditCard,
  Target,
  ArrowRight,
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
      setError('Password yang Anda masukkan salah!')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="card-blue-vibrant w-full max-w-sm text-center relative shadow-2xl border-2 border-white/30">
          <div className="w-16 h-16 rounded-3xl bg-white text-turquoise-deep flex items-center justify-center mx-auto mb-4 shadow-soft">
            <LockKey size={34} weight="bold" />
          </div>

          <span className="badge-pink mb-2">
            <Sparkle size={13} weight="fill" /> Portal Admin
          </span>
          <h1 className="text-2xl font-black font-roboto text-white tracking-tight">Login Admin</h1>
          <p className="text-white/85 text-xs mb-6 font-medium">
            Masukkan password untuk mengelola data siswa, materi, dan soal numerasi.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-field-dark text-sm font-semibold"
                placeholder="Masukkan kata sandi admin..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoFocus
              />
              {error && (
                <div className="mt-2 text-xs font-bold text-white bg-pink-soft/90 p-2.5 rounded-xl border border-white/30 animate-pop-in">
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="btn-accent w-full text-sm py-3 font-black shadow-pink">
              <span>Buka Panel Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/15 text-center">
            <Link to="/" className="text-xs text-white/80 hover:text-white flex items-center justify-center gap-1 font-bold">
              <ArrowLeft size={14} weight="bold" />
              <span>Kembali ke Halaman Siswa</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Siswa', value: allUsers.length, icon: UsersThree },
    { label: 'Akun Pro (Lunas)', value: paidUsersCount, icon: CreditCard },
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
      title: 'Data Siswa & Pembayaran',
      desc: 'Lihat profil, hasil diagnostik, dan verifikasi toggle status pembayaran.',
      badge: `${allUsers.length} Siswa`,
    },
    {
      path: '/admin/materials',
      icon: BookOpenText,
      title: 'Kelola Materi Microlearning',
      desc: 'Tambah materi kustom, upload gambar ilustrasi, dan pasang video YouTube edukatif.',
      badge: 'Editor Materi',
    },
    {
      path: '/admin/exercises',
      icon: PencilSimpleLine,
      title: 'Kelola Soal & Import CSV',
      desc: 'Input soal kontekstual manual atau unggah massal melalui berkas CSV.',
      badge: 'CSV Import Ready',
    },
    {
      path: '/admin/team',
      icon: IdentificationBadge,
      title: 'Edit Tim & Kontak Admin',
      desc: 'Perbarui nama dan nomor WhatsApp admin yang tertera pada jendela paywall.',
      badge: 'Kontak Paywall',
    },
  ]

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-turquoise text-white flex items-center justify-center shadow-soft font-bold">
              <LockKey size={20} weight="bold" />
            </div>
            <div>
              <span className="font-black text-gray-900 font-roboto text-sm sm:text-base">
                Admin <span className="text-turquoise">NumeracySprint</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-bold text-gray-500 hover:text-turquoise flex items-center gap-1.5 bg-gray-50 hover:bg-turquoise-light/50 px-3 py-1.5 rounded-xl border border-gray-100 transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Ke Halaman Siswa</span>
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('admin_auth')
                setAuthed(false)
              }}
              className="text-xs font-bold text-pink-soft hover:text-pink-hover flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-pink-light transition-colors cursor-pointer"
            >
              <SignOut size={16} weight="bold" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="mb-6">
          <span className="badge-pink mb-1">
            <Sparkle size={13} weight="fill" /> Pusat Kendali
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-roboto text-gray-900 tracking-tight">
            Dashboard Pengelola
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Pantau hasil belajar siswa, verifikasi pembayaran, kelola konten dan latihan soal.
          </p>
        </div>

        {/* Stats Grid - Blue Cards with pattern */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="card-blue !p-5 relative border border-white/20 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shadow-soft">
                    <Icon size={22} weight="bold" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-roboto tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-white/90 font-bold mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Menu Cards Grid - Blue Cards with pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {adminMenus.map((menu) => {
            const Icon = menu.icon
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className="card-blue group hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 border border-white/20 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white text-turquoise-deep flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                      <Icon size={26} weight="bold" />
                    </div>
                    <span className="badge-glass text-[11px] font-bold">{menu.badge}</span>
                  </div>

                  <h3 className="text-lg font-black font-roboto text-white tracking-tight">
                    {menu.title}
                  </h3>
                  <p className="text-white/90 text-xs mt-1.5 leading-relaxed font-normal">{menu.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white group-hover:text-pink-light transition-colors">
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
