import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  Brain,
  Gauge,
  ClipboardText,
  BookOpenText,
  Timer,
  UsersThree,
  SignOut,
  User,
  Crown,
} from '@phosphor-icons/react'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: Gauge },
  { path: '/diagnostic', label: 'Evaluasi', icon: ClipboardText },
  { path: '/materi', label: 'Materi', icon: BookOpenText, alias: '/microlearning' },
  { path: '/tryout', label: 'Try Out', icon: Timer, alias: '/exercise' },
  { path: '/about', label: 'Tentang', icon: UsersThree, alias: '/tentang' },
]

export default function Navbar() {
  const { user, logout } = useUser()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-edubg/95 backdrop-blur-md border-b border-white/60 shadow-raised-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo EduSpark */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl raised-sm flex items-center justify-center relative">
            <Brain size={24} weight="bold" className="text-eduaccent" />
            <span className="w-2.5 h-2.5 rounded-full bg-eduaccent absolute -top-1 -right-1 ring-2 ring-edubg" />
          </div>
          <div>
            <span className="font-black font-display text-lg sm:text-xl tracking-tight flex items-center">
              <span className="text-edutext">Edu</span>
              <span className="text-edupink">Spark</span>
            </span>
            <span className="hidden sm:block text-[10px] text-edutext-muted font-bold -mt-1 tracking-wider uppercase">
              Matematika UTBK-SNBT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.path || (link.alias && pathname === link.alias)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                  isActive
                    ? 'inset text-eduaccent font-extrabold shadow-inset-sm'
                    : 'text-edutext-muted hover:text-eduaccent hover:bg-edupink-soft/40'
                }`}
              >
                <Icon size={18} weight={isActive ? 'bold' : 'regular'} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User Status & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl raised-sm border border-white/60">
            <div className="w-7 h-7 rounded-full inset flex items-center justify-center font-black text-xs text-eduaccent font-display">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="text-xs font-bold text-edutext max-w-[100px] sm:max-w-[130px] truncate">
              {user?.name || 'Siswa'}
            </span>
            {user?.isPaid ? (
              <span className="badge-accent !py-0.5 !px-2 text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Crown size={12} weight="fill" /> Pro
              </span>
            ) : (
              <span className="badge-chip !py-0.5 !px-2 text-[10px] uppercase tracking-wider text-edutext-muted">
                Gratis
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="flex items-center gap-1.5 text-xs text-edutext-muted hover:text-edudanger font-bold px-2.5 py-2 rounded-xl raised-sm hover:inset transition-all active:scale-95"
          >
            <SignOut size={16} weight="bold" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
