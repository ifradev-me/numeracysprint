import React from 'react'
import Navbar from '../components/Navbar'
import { useUser } from '../context/UserContext'
import {
  Brain,
  UsersThree,
  WhatsappLogo,
  Sparkle,
  ShieldCheck,
  DeviceMobile,
  CheckCircle,
  Lightbulb,
  Heart,
} from '@phosphor-icons/react'

export default function AboutPage() {
  const { teamInfo } = useUser()
  const cleanPhone = (teamInfo?.phone || '6281234567890').replace(/\D/g, '')
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Halo Tim EduSpark, saya ingin bertanya seputar platform dan persiapan belajar Matematika UTBK-SNBT!'
  )}`

  return (
    <div className="min-h-screen bg-edubg text-edutext pb-28 selection:bg-edupink selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-10 space-y-6">
        {/* Hero Banner */}
        <div className="raised p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl inset text-eduaccent flex items-center justify-center mx-auto">
            <Brain size={36} weight="bold" />
          </div>

          <div className="space-y-1">
            <span className="badge-chip text-[11px]">
              <Sparkle size={13} weight="fill" className="text-edupink" /> Platform UTBK-SNBT 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-edutext tracking-tight">
              Tentang EduSpark
            </h1>
            <p className="text-edutext-muted text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-medium">
              Platform belajar matematika adaptif untuk persiapan UTBK-SNBT. Berfokus pada Pengetahuan Kuantitatif, Penalaran Matematika, dan Penalaran Kuantitatif dengan metode terarah dan Try Out ber-timer.
            </p>
          </div>
        </div>

        {/* Dynamic Developer Team & Contact */}
        <div className="raised p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl inset text-eduaccent flex items-center justify-center">
              <UsersThree size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-edutext tracking-tight">
                Tim Pengembang & Layanan
              </h2>
              <p className="text-xs text-edutext-muted">Dukungan Belajar & Aktivasi Akun</p>
            </div>
          </div>

          {/* Member Card */}
          <div className="inset p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl raised-sm text-eduaccent flex items-center justify-center font-black text-lg shrink-0">
                {teamInfo?.name ? teamInfo.name.charAt(0).toUpperCase() : 'E'}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-edutext text-base">{teamInfo?.name || 'Admin EduSpark'}</h3>
                <p className="text-xs text-eduaccent font-bold">{teamInfo?.role || 'Layanan Siswa & Bantuan Belajar'}</p>
                <p className="text-xs text-edutext-muted flex items-center gap-1 font-mono">
                  <DeviceMobile size={14} weight="bold" /> +{cleanPhone}
                </p>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent text-xs py-2.5 px-4 font-bold shrink-0 flex items-center gap-2"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Vision & Values */}
        <div className="raised p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-black font-display text-edutext tracking-tight flex items-center gap-2">
            <ShieldCheck size={22} weight="bold" className="text-eduaccent" />
            <span>Tiga Pilar Pembelajaran EduSpark</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="inset p-4 space-y-1.5">
              <p className="font-bold text-xs text-eduaccent">1. Konseptual & Ringkas</p>
              <p className="text-xs text-edutext-muted leading-relaxed">
                Materi disajikan dalam format microlearning yang padat dan fokus pada pola soal yang sering keluar di SNBT.
              </p>
            </div>
            <div className="inset p-4 space-y-1.5">
              <p className="font-bold text-xs text-eduaccent">2. Simulasi Ber-Timer</p>
              <p className="text-xs text-edutext-muted leading-relaxed">
                Try out 2 menit per soal melatih manajemen waktu agar tidak kehabisan waktu saat hari H ujian.
              </p>
            </div>
            <div className="inset p-4 space-y-1.5">
              <p className="font-bold text-xs text-eduaccent">3. Evaluasi & Rekomendasi</p>
              <p className="text-xs text-edutext-muted leading-relaxed">
                Sistem memetakan kelemahan per subtes dan memberikan saran modul yang perlu diulang.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center text-xs text-edutext-muted py-4">
          EduSpark &copy; 2026 &bull; Platform Belajar Matematika UTBK-SNBT
        </div>
      </main>
    </div>
  )
}
