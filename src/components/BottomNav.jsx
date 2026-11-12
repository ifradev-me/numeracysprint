import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Gauge,
  Stethoscope,
  BookOpenText,
  PencilSimpleLine,
  UsersThree,
} from '@phosphor-icons/react'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: Gauge },
  { path: '/diagnostic', label: 'Diagnostik', icon: Stethoscope },
  { path: '/microlearning', label: 'Materi', icon: BookOpenText },
  { path: '/exercise', label: 'Latihan', icon: PencilSimpleLine },
  { path: '/about', label: 'Tentang', icon: UsersThree },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '2px solid rgba(45, 185, 195, 0.25)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px -4px rgba(24,141,151,0.15), 0 -2px 8px -2px rgba(255,107,154,0.10)',
      }}
    >
      {/* Top gradient accent line */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #24b8c4 0%, #1b9ca8 50%, #ff6b9a 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      />
      <div className="flex justify-around px-1 pt-1.5 pb-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all duration-200 active:scale-95"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(45,210,223,0.18) 0%, rgba(255,107,154,0.10) 100%)',
                      color: '#126f77',
                    }
                  : { color: '#9ca3af' }
              }
            >
              <div
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #24b8c4 0%, #10666f 100%)',
                        boxShadow: '0 4px 12px -2px rgba(24,141,151,0.4)',
                        color: '#fff',
                      }
                    : {}
                }
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              </div>
              <span
                className="text-[9px] font-black tracking-wide"
                style={isActive ? { color: '#10666f' } : {}}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

