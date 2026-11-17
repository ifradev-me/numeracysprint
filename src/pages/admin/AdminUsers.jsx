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
      if (serverUsers && serverUsers.length > 0) setUsers(serverUsers)
    })
  }, [])

  const handleTogglePaid = async (userName, currentStatus) => {
    const newStatus = !currentStatus
    const updated = await toggleUserPaidStatus(userName, newStatus)
    setUsers([...updated])
  }

  const exportCSV = () => {
    const header = 'Nama,Status_Paket,Tanggal_Login,Skor_Evaluasi,Level,Soal_Benar,Total_Soal'
    const rows = users.map((u) => {
      const loginDate = u.loginAt ? new Date(u.loginAt).toLocaleDateString('id-ID') : '-'
      const isPaid = u.isPaid ? 'Berbayar (Pro)' : 'Gratis'
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
    a.download = `data-siswa-eduspark-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-24 selection:bg-edupink selection:text-white">
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
          <span className="badge-chip text-xs font-bold">Kelola Status Siswa</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Data Siswa & Status Paket
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm mt-1">
              Toggle status paket siswa (Gratis / Berbayar Pro) untuk membuka modul materi dan try out lengkap.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={users.length === 0}
            className="btn-accent text-xs py-2.5 px-4 font-bold shrink-0 disabled:opacity-40"
          >
            <DownloadSimple size={18} weight="bold" />
            <span>Export CSV</span>
          </button>
        </div>

        {users.length === 0 ? (
          <div className="raised text-center py-16 space-y-3">
            <UsersThree size={48} weight="bold" className="mx-auto text-edupink opacity-40" />
            <p className="font-bold text-edutext">Belum ada siswa terdaftar</p>
            <p className="text-xs text-edutext-muted">Siswa akan otomatis muncul saat login pertama kali.</p>
          </div>
        ) : (
          <div className="raised overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/60 text-xs font-black text-edutext uppercase tracking-wider">
                    <th className="py-4 px-5">Siswa</th>
                    <th className="py-4 px-4">Status Paket</th>
                    <th className="py-4 px-4">Aksi Toggle</th>
                    <th className="py-4 px-4">Hasil Evaluasi</th>
                    <th className="py-4 px-5 text-right">Login Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40 text-xs">
                  {users.map((u, idx) => {
                    const score = u.diagnostic?.score
                    const level = u.diagnostic?.levelInfo?.level
                    const loginDate = u.loginAt
                      ? new Date(u.loginAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '-'

                    return (
                      <tr key={idx} className="hover:bg-white/20 transition-colors">
                        {/* Student Name */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full inset flex items-center justify-center font-bold text-edupink shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-edutext">{u.name}</p>
                              <span className="text-[10px] text-edutext-muted font-mono">ID: #{idx + 1}</span>
                            </div>
                          </div>
                        </td>

                        {/* Package Status */}
                        <td className="py-4 px-4">
                          {u.isPaid ? (
                            <span className="badge-accent text-[11px] flex items-center gap-1 w-max">
                              <Crown size={12} weight="fill" /> Berbayar (Pro)
                            </span>
                          ) : (
                            <span className="badge-chip text-[11px] text-edutext-muted w-max">
                              Gratis
                            </span>
                          )}
                        </td>

                        {/* Toggle Button */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleTogglePaid(u.name, u.isPaid)}
                            className={`btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 cursor-pointer ${
                              u.isPaid ? 'text-edupink font-black' : 'text-edutext-muted'
                            }`}
                            title="Klik untuk mengubah status paket siswa"
                          >
                            {u.isPaid ? (
                              <>
                                <ToggleRight size={18} weight="fill" className="text-edupink" />
                                <span>Aktif Pro</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} weight="bold" />
                                <span>Set ke Pro</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Diagnostic score */}
                        <td className="py-4 px-4">
                          {score !== undefined ? (
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-edupink tabular-nums">
                                {score}/100
                              </span>
                              <span className="badge-chip text-[10px]">
                                {level}
                              </span>
                            </div>
                          ) : (
                            <span className="text-edutext-muted italic text-[11px]">Belum Evaluasi</span>
                          )}
                        </td>

                        {/* Login date */}
                        <td className="py-4 px-5 text-right text-edutext-muted font-mono text-[11px]">
                          {loginDate}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
