import React from 'react'
import { LockKey, WhatsappLogo, X, CheckCircle, Sparkle, ShieldCheck } from '@phosphor-icons/react'
import { useUser } from '../context/UserContext'

export default function PaywallModal({ isOpen, onClose, materialTitle }) {
  const { teamInfo, user } = useUser()

  if (!isOpen) return null

  const cleanPhone = (teamInfo?.phone || '6281234567890').replace(/\D/g, '')
  const customMessage = encodeURIComponent(
    `Halo ${teamInfo?.name || 'Admin NumeracySprint'}, saya ${user?.name || 'Siswa'} ingin mengaktifkan akun Premium untuk membuka materi "${materialTitle || 'Microlearning'}" dan fitur lengkap lainnya!`
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${customMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-turquoise">
        {/* Header Banner - Turquoise Card with pattern */}
        <div className="bg-gradient-to-br from-turquoise via-turquoise-dark to-[#0e5c63] p-6 text-white text-center relative border-b-2 border-white/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white active:scale-95 cursor-pointer"
          >
            <X size={20} weight="bold" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-white text-pink-soft mx-auto flex items-center justify-center mb-3 shadow-pink">
            <LockKey size={34} weight="fill" />
          </div>

          <span className="badge-pink mb-2">
            <Sparkle size={14} weight="fill" /> Akses Premium
          </span>
          <h3 className="text-xl font-black font-roboto tracking-tight">Buka Seluruh Materi</h3>
          <p className="text-white/90 text-xs mt-1 font-medium">
            Materi &ldquo;{materialTitle || 'Microlearning'}&rdquo; termasuk modul level lanjutan.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-turquoise-surface p-4 rounded-2xl text-xs space-y-2.5 text-turquoise-deep border border-turquoise/20">
            <div className="flex items-center gap-2 font-black text-sm text-turquoise-dark">
              <ShieldCheck size={18} weight="fill" />
              <span>Keuntungan Akses Penuh Pro:</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle size={16} weight="fill" className="text-turquoise shrink-0" />
              <span>Akses ke seluruh topik microlearning & studi kasus</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle size={16} weight="fill" className="text-turquoise shrink-0" />
              <span>Video interaktif dan visualisasi grafik nyata</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle size={16} weight="fill" className="text-turquoise shrink-0" />
              <span>Status akun Pro resmi di sistem NumeracySprint</span>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-gray-500 mb-1">
              Untuk aktivasi instan, hubungi tim pengembang via WhatsApp:
            </p>
            <p className="font-black text-gray-900 text-sm">{teamInfo?.name || 'Admin NumeracySprint'}</p>
            <p className="text-xs text-gray-400 font-mono font-bold">+{cleanPhone}</p>
          </div>

          {/* Action CTA */}
          <div className="space-y-2 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full text-sm py-3.5 shadow-pink font-black flex items-center justify-center gap-2"
            >
              <WhatsappLogo size={22} weight="fill" />
              <span>Hubungi Admin via WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors font-bold cursor-pointer"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
