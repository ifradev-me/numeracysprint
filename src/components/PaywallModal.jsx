import React from 'react'
import { Lock, WhatsappLogo, X, CheckCircle, Sparkle, ShieldCheck } from '@phosphor-icons/react'
import { useUser } from '../context/UserContext'

export default function PaywallModal({ isOpen, onClose, materialTitle }) {
  const { teamInfo, user } = useUser()

  if (!isOpen) return null

  const cleanPhone = (teamInfo?.phone || '6281234567890').replace(/\D/g, '')
  const customMessage = encodeURIComponent(
    `Halo ${teamInfo?.name || 'Admin EduSpark'}, saya ${user?.name || 'Siswa'} ingin mengaktifkan akun Pro untuk membuka modul materi "${materialTitle || 'Matematika'}" dan fitur lengkap lainnya!`
  )
  const waUrl = `https://wa.me/${cleanPhone}?text=${customMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-edutext/40 backdrop-blur-sm animate-pop-in">
      <div className="raised max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/60">
          <div className="space-y-1">
            <span className="badge-chip text-[11px]">
              <Sparkle size={12} weight="fill" className="text-edupink" /> Akses Berbayar
            </span>
            <h3 className="text-xl font-black font-display text-edutext mt-1">
              Buka Seluruh Materi
            </h3>
            <p className="text-xs text-edutext-muted font-medium">
              Modul &ldquo;{materialTitle || 'Materi Pembelajaran'}&rdquo; termasuk materi berbayar EduSpark.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full raised-sm flex items-center justify-center text-edutext hover:text-edudanger shrink-0"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="inset p-4 rounded-2xl text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-black text-edupink">
            <ShieldCheck size={18} weight="bold" />
            <span>Keuntungan Paket Pro EduSpark:</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-edutext">
            <CheckCircle size={16} weight="fill" className="text-edupink shrink-0" />
            <span>Materi lengkap 3 mapel: PK, PM, dan Penalaran Kuantitatif</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-edutext">
            <CheckCircle size={16} weight="fill" className="text-edupink shrink-0" />
            <span>Try Out ber-timer penuh tanpa batasan</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-edutext">
            <CheckCircle size={16} weight="fill" className="text-edupink shrink-0" />
            <span>Status Pro tersimpan di cloud database (sinkron di semua gadget)</span>
          </div>
        </div>

        {/* Admin note */}
        <div className="text-center space-y-0.5 text-xs">
          <p className="text-edutext-muted">
            Untuk aktivasi, hubungi admin EduSpark:
          </p>
          <p className="font-bold text-edutext text-sm">{teamInfo?.name || 'Admin EduSpark'}</p>
          <p className="text-xs text-edutext-muted font-mono">+{cleanPhone}</p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent w-full text-xs py-3 flex items-center justify-center gap-2"
          >
            <WhatsappLogo size={18} weight="fill" />
            <span>Hubungi Admin via WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="btn-secondary w-full text-xs py-2.5 text-edutext-muted"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  )
}
