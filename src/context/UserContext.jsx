import { createContext, useContext, useState, useEffect } from 'react'
import { syncUserWithBackend, getLocalTeam, getTeamInfo, bootstrap } from '../services/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('numeracy_user')
    return saved ? JSON.parse(saved) : null
  })

  const [diagnosticResult, setDiagnosticResult] = useState(() => {
    const saved = localStorage.getItem('numeracy_diagnostic')
    return saved ? JSON.parse(saved) : null
  })

  const [teamInfo, setTeamInfo] = useState(() => getLocalTeam())

  // ── Bootstrap: load server data once on mount ──────────────────────────────
  useEffect(() => {
    async function init() {
      // Load all data from server in one request (team, users, materials, exercises)
      const data = await bootstrap()

      if (data?.team) {
        setTeamInfo(data.team)
      } else {
        // Fallback: try GET /admin/team individually
        const team = await getTeamInfo()
        setTeamInfo(team)
      }

      // After bootstrap, check if current user's isPaid was updated by admin
      if (user?.name && data?.users) {
        const serverUser = data.users.find(
          (u) => u.name.toLowerCase() === user.name.toLowerCase()
        )
        if (serverUser && serverUser.isPaid !== user.isPaid) {
          const updated = { ...user, isPaid: !!serverUser.isPaid }
          setUser(updated)
          localStorage.setItem('numeracy_user', JSON.stringify(updated))
        }
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (name) => {
    // Check if user already exists locally (to restore payment status and past diagnostic)
    const allUsers = JSON.parse(localStorage.getItem('numeracy_all_users') || '[]')
    const existing = allUsers.find((u) => u.name.toLowerCase() === name.toLowerCase())

    const userData = {
      name,
      loginAt: existing?.loginAt || new Date().toISOString(),
      isPaid: existing ? !!existing.isPaid : false,
      diagnostic: existing?.diagnostic || diagnosticResult || null,
    }

    setUser(userData)
    localStorage.setItem('numeracy_user', JSON.stringify(userData))

    if (userData.diagnostic) {
      setDiagnosticResult(userData.diagnostic)
      localStorage.setItem('numeracy_diagnostic', JSON.stringify(userData.diagnostic))
    }

    // Sync to backend — server may return a different isPaid (e.g., admin already marked as paid)
    const synced = await syncUserWithBackend(userData)
    if (synced.isPaid !== userData.isPaid) {
      const updated = { ...userData, isPaid: synced.isPaid }
      setUser(updated)
      localStorage.setItem('numeracy_user', JSON.stringify(updated))
    }
  }

  const logout = () => {
    setUser(null)
    setDiagnosticResult(null)
    localStorage.removeItem('numeracy_user')
    localStorage.removeItem('numeracy_diagnostic')
  }

  const saveDiagnosticResult = async (result) => {
    const data = { ...result, completedAt: new Date().toISOString() }
    setDiagnosticResult(data)
    localStorage.setItem('numeracy_diagnostic', JSON.stringify(data))

    const updatedUser = { ...user, diagnostic: data }
    setUser(updatedUser)
    localStorage.setItem('numeracy_user', JSON.stringify(updatedUser))

    // Sync to backend & allUsers
    await syncUserWithBackend(updatedUser)
  }

  const reloadTeamInfo = async () => {
    const team = await getTeamInfo()
    setTeamInfo(team)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        diagnosticResult,
        teamInfo,
        login,
        logout,
        saveDiagnosticResult,
        reloadTeamInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
