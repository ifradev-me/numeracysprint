import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Gauge,
  ClipboardText,
  BookOpenText,
  Timer,
  UsersThree,
} from '@phosphor-icons/react'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: Gauge },
  { path: '/diagnostic', label: 'Evaluasi', icon: ClipboardText },
  { path: '/materi', label: 'Materi', icon: BookOpenText, alias: '/microlearning' },
  { path: '/tryout', label: 'Try Out', icon: Timer, alias: '/exercise' },
  { path: '/about', label: 'Tentang', icon: UsersThree, alias: '/tentang' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-edubg/95 backdrop-blur-md border-t border-white/60 shadow-raised"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around px-2 pt-1.5 pb-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.path || (link.alias && pathname === link.alias)
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'inset text-eduaccent'
                  : 'text-edutext-muted hover:text-edutext'
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'text-eduaccent' : ''
                }`}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              </div>
              <span className="text-[10px] font-bold tracking-tight">
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
