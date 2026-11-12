import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toggleUserPaidStatus, loadAllUsers } from '../../services/api'
import {
  UsersThree,
  DownloadSimple,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Crown,
  Sparkle,
  CalendarBlank,
  Target,
  ToggleLeft,
  ToggleRight,
} from '@phosphor-icons/react'

export default function AdminUsers() {
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('numeracy_all_users') || '[]')
  })

  // Load fresh data from server on mount
  useEffect(() => {
    loadAllUsers().then((serverUsers) => {
      if (serverUsers.length > 0) setUsers(serverUsers)
    })
  }, [])

  const handleTogglePaid = async (userName, currentStatus) => {
    const newStatus = !currentStatus
    const updated = await toggleUserPaidStatus(userName, newStatus)
    setUsers([...updated])
  }

  const exportCSV = () => {
    const header = 'Nama,Status_Bayar,Tanggal_Login,Skor_Diagnostik,Level,Soal_Benar,Total_Soal'
    const rows = users.map((u) => {
      const loginDate = u.loginAt ? new Date(u.loginAt).toLocaleDateString('id-ID') : '-'
      const isPaid = u.isPaid ? 'Sudah Bayar' : 'Belum Bayar'
      const score = u.diagnostic?.score ?? '-'
      const level = u.diagnostic?.levelInfo?.level ?? '-'
      const correct = u.diagnostic?.correct ?? '-'
      const total = u.diagnostic?.total ?? '-'
      return `"${u.name}","${isPaid}","${loginDate}","${score}","${level}","${correct}","${total}"`
    })

    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-siswa-numeracysprint-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Top Bar */}
      <nav className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-xs font-bold text-gray-500 hover:text-turquoise flex items-center gap-1.5"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Dashboard Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="badge-pink text-xs font-bold">Kelola Siswa</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-roboto text-gray-900 tracking-tight">
              Data Siswa & Status Pembayaran
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Toggle status bayar siswa di sini untuk membuka akses materi Microlearning premium.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={users.length === 0}
            className="btn-accent text-xs py-2.5 px-4 font-bold shadow-pink shrink-0 disabled:opacity-40"
          >
            <DownloadSimple size={18} weight="bold" />
            <span>Export CSV</span>
          </button>
        </div>

        {users.length === 0 ? (
          <div className="card-inner-white text-center py-16 text-gray-400">
            <UsersThree size={48} weight="duotone" className="mx-auto mb-3 text-turquoise/40" />
            <p className="font-bold text-gray-600">Belum ada siswa terdaftar</p>
            <p className="text-xs mt-1">Siswa akan otomatis muncul saat login pertama kali.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((u, i) => {
              const isPaid = !!u.isPaid
              const hasDiagnostic = !!u.diagnostic

              return (
                <div
                  key={i}
                  className="card-blue flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/20 shadow-md"
                >
                  {/* Left: User Identity */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white text-turquoise-dark flex items-center justify-center font-black text-base shadow-soft shrink-0">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base font-roboto">{u.name}</h3>
                        {isPaid ? (
                          <span className="badge-pink text-[10px] py-0.5 px-2 uppercase font-bold tracking-wider flex items-center gap-1">
                            <Crown size={12} weight="fill" /> Lunas / Pro
                          </span>
                        ) : (
                          <span className="badge-glass text-[10px] text-white/80 py-0.5 px-2">
                            Reguler / Belum Bayar
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1">
                        <CalendarBlank size={13} weight="bold" />
                        Masuk: {u.loginAt ? new Date(u.loginAt).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Diagnostic info */}
                  <div className="card-inner-glass !py-2 !px-3 text-xs flex items-center gap-4 text-white">
                    {hasDiagnostic ? (
                      <>
                        <div>
                          <p className="text-[10px] text-white/70 uppercase font-bold">Diagnostik</p>
                          <p className="font-black text-sm text-yellow-300">
                            {u.diagnostic.score}/100
                          </p>
                        </div>
                        <div className="h-6 w-px bg-white/20" />
                        <div>
                          <p className="text-[10px] text-white/70 uppercase font-bold">Level</p>
                          <p className="font-bold text-white">{u.diagnostic.levelInfo?.level}</p>
                        </div>
                      </>
                    ) : (
                      <span className="text-white/60 italic text-xs">Belum tes diagnostik</span>
                    )}
                  </div>

                  {/* Right: Toggle Payment Status Button (Requirement 6) */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleTogglePaid(u.name, isPaid)}
                      className={`text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shadow-soft ${
                        isPaid
                          ? 'bg-white text-turquoise-deep border-2 border-white'
                          : 'bg-white hover:bg-gray-100 text-gray-800 border-2 border-transparent'
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle size={18} weight="fill" className="text-turquoise" />
                          <span>Status: Sudah Bayar</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} weight="bold" className="text-pink-soft" />
                          <span>Klik: Tandai Lunas</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
