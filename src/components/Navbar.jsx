import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  MathOperations,
  Gauge,
  Stethoscope,
  BookOpenText,
  PencilSimpleLine,
  UsersThree,
  SignOut,
  User,
  Crown,
  Sparkle,
} from '@phosphor-icons/react'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: Gauge },
  { path: '/diagnostic', label: 'Diagnostik', icon: Stethoscope },
  { path: '/microlearning', label: 'Materi', icon: BookOpenText },
  { path: '/exercise', label: 'Latihan', icon: PencilSimpleLine },
  { path: '/about', label: 'Tentang', icon: UsersThree },
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
    <nav className="bg-white/95 backdrop-blur-md border-b-2 border-turquoise/20 shadow-soft sticky top-0 z-40">
      {/* Top micro vibrant accent line: Turquoise to Pink gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-turquoise via-turquoise-dark to-pink-soft" />

      <div className="max-w-5xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-turquoise to-turquoise-dark flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform border border-white/20">
            <MathOperations size={24} weight="bold" />
          </div>
          <div>
            <span className="font-black text-gray-900 font-roboto text-base sm:text-lg tracking-tight flex items-center gap-1.5">
              Numeracy<span className="text-turquoise">Sprint</span>
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 font-bold -mt-1 tracking-wider uppercase">
              Microlearning Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-turquoise to-turquoise-dark text-white shadow-soft shadow-turquoise/30 scale-105'
                    : 'text-gray-600 hover:text-turquoise-deep hover:bg-turquoise-light/60'
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-turquoise-surface border-2 border-turquoise/30 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-turquoise text-white flex items-center justify-center font-black text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-black text-turquoise-deep max-w-[100px] sm:max-w-[130px] truncate">
              {user?.name || 'Siswa'}
            </span>
            {user?.isPaid && (
              <span className="badge-pink !py-0.5 !px-2 text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-pink">
                <Crown size={12} weight="fill" /> Pro
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Keluar"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-soft font-bold px-2.5 py-2 rounded-xl hover:bg-pink-light transition-colors active:scale-95"
          >
            <SignOut size={18} weight="bold" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex border-t border-gray-100 bg-white/95 px-2 py-1 justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-black transition-all ${
                isActive
                  ? 'text-turquoise bg-turquoise-light/80 scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
