// Client service for Netlify Functions Backend
// Falls back to localStorage when backend is unavailable (local dev without netlify dev)

const API_BASE = '/api'

export const defaultTeamInfo = {
  name: 'Admin EduSpark',
  role: 'Layanan Siswa & Bantuan Belajar',
  phone: '6281234567890',
  whatsappMessage:
    'Halo Admin EduSpark, saya ingin konfirmasi pembayaran untuk aktivasi akun Pro Matematika UTBK!',
}

// ─── Helper fetch ────────────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    // Safety check: ensure response is JSON and not an HTML SPA fallback
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn(`[api] Endpoint ${endpoint} returned non-JSON (${contentType})`)
      return null
    }

    if (!res.ok) {
      console.warn(`[api] Endpoint ${endpoint} returned HTTP ${res.status}`)
      return null
    }

    return await res.json()
  } catch (err) {
    console.warn(`[api] Request error on ${endpoint}:`, err?.message)
    return null // Graceful fallback — caller uses localStorage
  }
}

// ─── Team Info ───────────────────────────────────────────────────────────────

/** Read team info: server first, then localStorage, then default */
export async function getTeamInfo() {
  const serverResult = await request('/admin/team')
  if (serverResult?.team) {
    localStorage.setItem('numeracy_team_info', JSON.stringify(serverResult.team))
    return serverResult.team
  }
  const saved = localStorage.getItem('numeracy_team_info')
  return saved ? JSON.parse(saved) : defaultTeamInfo
}

/** Synchronous local-only read (for components that can't await) */
export function getLocalTeam() {
  const saved = localStorage.getItem('numeracy_team_info')
  return saved ? JSON.parse(saved) : defaultTeamInfo
}

/** Save team info to server and localStorage */
export async function saveTeamInfo(teamData) {
  localStorage.setItem('numeracy_team_info', JSON.stringify(teamData))
  await request('/admin/team', {
    method: 'POST',
    body: JSON.stringify(teamData),
  })
  return teamData
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

/**
 * Load all initial data from server in one round-trip.
 * Returns { team, users, customMaterials, customExercises } or null if offline.
 */
export async function bootstrap() {
  const result = await request('/bootstrap')
  if (result?.data) {
    const { team, users, customMaterials, customExercises } = result.data
    if (team) localStorage.setItem('numeracy_team_info', JSON.stringify(team))
    if (users) localStorage.setItem('numeracy_all_users', JSON.stringify(users))
    if (customMaterials) localStorage.setItem('numeracy_custom_materials', JSON.stringify(customMaterials))
    if (customExercises) localStorage.setItem('numeracy_custom_exercises', JSON.stringify(customExercises))
    return result.data
  }
  return null
}

// ─── User Sync ───────────────────────────────────────────────────────────────

/**
 * Sync user to server and read back authoritative isPaid status & diagnostic result.
 * Always writes to localStorage first so UI is never blocked.
 */
export async function syncUserWithBackend(userData) {
  // 1. Write to localStorage immediately
  const allUsers = JSON.parse(localStorage.getItem('numeracy_all_users') || '[]')
  const idx = allUsers.findIndex(
    (u) => u.name.toLowerCase() === userData.name.toLowerCase()
  )
  const merged = idx >= 0 ? { ...allUsers[idx], ...userData } : { isPaid: false, ...userData }
  if (idx >= 0) allUsers[idx] = merged
  else allUsers.push(merged)
  localStorage.setItem('numeracy_all_users', JSON.stringify(allUsers))

  // 2. Send to server
  const serverResult = await request('/user/sync', {
    method: 'POST',
    body: JSON.stringify(merged),
  })

  // 3. If server returns authoritative user record, trust it
  if (serverResult?.user) {
    if (typeof serverResult.user.isPaid === 'boolean') {
      merged.isPaid = serverResult.user.isPaid
    }
    if (serverResult.user.diagnostic) {
      merged.diagnostic = serverResult.user.diagnostic
    }

    const idx2 = allUsers.findIndex(
      (u) => u.name.toLowerCase() === merged.name.toLowerCase()
    )
    if (idx2 >= 0) allUsers[idx2] = merged
    else allUsers.push(merged)
    localStorage.setItem('numeracy_all_users', JSON.stringify(allUsers))
  }

  return merged
}

/**
 * Fetch a single user's payment status from the server.
 */
export async function fetchUserPaidStatus(name) {
  const result = await request(`/user/${encodeURIComponent(name)}`)
  return result?.user?.isPaid ?? null
}

// ─── Admin: Toggle Paid ───────────────────────────────────────────────────────

/** Admin toggles paid status — updates server and localStorage */
export async function toggleUserPaidStatus(userName, newPaidStatus) {
  // Update localStorage immediately
  const allUsers = JSON.parse(localStorage.getItem('numeracy_all_users') || '[]')
  const user = allUsers.find(
    (u) => u.name.toLowerCase() === userName.toLowerCase()
  )
  if (user) {
    user.isPaid = newPaidStatus
    localStorage.setItem('numeracy_all_users', JSON.stringify(allUsers))
  }

  // Also update current logged-in user if same person
  const currentUser = JSON.parse(localStorage.getItem('numeracy_user') || 'null')
  if (currentUser && currentUser.name.toLowerCase() === userName.toLowerCase()) {
    currentUser.isPaid = newPaidStatus
    localStorage.setItem('numeracy_user', JSON.stringify(currentUser))
  }

  // Persist to server
  await request('/admin/toggle-paid', {
    method: 'POST',
    body: JSON.stringify({ name: userName, isPaid: newPaidStatus }),
  })

  return allUsers
}

// ─── Admin: Materials ─────────────────────────────────────────────────────────

/** Save custom materials array to server and localStorage */
export async function saveCustomMaterials(materials) {
  localStorage.setItem('numeracy_custom_materials', JSON.stringify(materials))
  await request('/admin/materials', {
    method: 'POST',
    body: JSON.stringify({ materials }),
  })
  return materials
}

/** Load custom materials (server first, then localStorage) */
export async function loadCustomMaterials() {
  const result = await request('/admin/materials')
  if (result?.materials) {
    localStorage.setItem('numeracy_custom_materials', JSON.stringify(result.materials))
    return result.materials
  }
  const saved = localStorage.getItem('numeracy_custom_materials')
  return saved ? JSON.parse(saved) : []
}

// ─── Admin: Exercises ─────────────────────────────────────────────────────────

/** Save custom exercises array to server and localStorage */
export async function saveCustomExercises(exercises) {
  localStorage.setItem('numeracy_custom_exercises', JSON.stringify(exercises))
  await request('/admin/exercises', {
    method: 'POST',
    body: JSON.stringify({ exercises }),
  })
  return exercises
}

/** Load custom exercises (server first, then localStorage) */
export async function loadCustomExercises() {
  const result = await request('/admin/exercises')
  if (result?.exercises) {
    localStorage.setItem('numeracy_custom_exercises', JSON.stringify(result.exercises))
    return result.exercises
  }
  const saved = localStorage.getItem('numeracy_custom_exercises')
  return saved ? JSON.parse(saved) : []
}

// ─── Admin: All Users ─────────────────────────────────────────────────────────

/** Load all users from server (admin view) */
export async function loadAllUsers() {
  const result = await request('/admin/users')
  if (result?.users) {
    localStorage.setItem('numeracy_all_users', JSON.stringify(result.users))
    return result.users
  }
  const saved = localStorage.getItem('numeracy_all_users')
  return saved ? JSON.parse(saved) : []
}
