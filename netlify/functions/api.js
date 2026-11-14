// Netlify Functions Backend for NumeracySprint
// Works with both Netlify Functions v2 (standard Request/Response) and v1 (Lambda event)
// Uses Netlify Blobs for persistent storage across devices & sessions
// Docs: https://docs.netlify.com/blobs/overview/

import { getStore, connectLambda } from '@netlify/blobs'

export const config = {
  path: '/api/*',
}

// Default team contact information
const DEFAULT_TEAM = {
  name: 'Admin NumeracySprint',
  role: 'Pengembang & Layanan Siswa',
  phone: '6281234567890',
  whatsappMessage:
    'Halo Admin NumeracySprint, saya ingin berlangganan akses penuh materi Microlearning!',
}

// In-memory fallback cache in case Blobs is unavailable or initializing
const MEMORY_CACHE = {
  config: { team: DEFAULT_TEAM },
  users: { all: [] },
  materials: { custom: [] },
  exercises: { custom: [] },
}

// Helper: Safely get a blob store instance
function getCollection(name) {
  try {
    return getStore(name)
  } catch (err) {
    console.warn(`[blobs] getStore(${name}) note:`, err?.message)
    return null
  }
}

// Helper: Read JSON from blob store with fallback
async function readBlob(storeName, key, defaultValue) {
  try {
    const store = getCollection(storeName)
    if (!store) {
      return MEMORY_CACHE[storeName]?.[key] ?? defaultValue
    }
    const raw = await store.get(key, { type: 'json' })
    if (raw !== null && raw !== undefined) {
      if (!MEMORY_CACHE[storeName]) MEMORY_CACHE[storeName] = {}
      MEMORY_CACHE[storeName][key] = raw
      return raw
    }
    return MEMORY_CACHE[storeName]?.[key] ?? defaultValue
  } catch (err) {
    console.warn(`[blobs] readBlob(${storeName}, ${key}) error:`, err?.message)
    return MEMORY_CACHE[storeName]?.[key] ?? defaultValue
  }
}

// Helper: Write JSON to blob store with memory cache update
async function writeBlob(storeName, key, value) {
  if (!MEMORY_CACHE[storeName]) MEMORY_CACHE[storeName] = {}
  MEMORY_CACHE[storeName][key] = value

  try {
    const store = getCollection(storeName)
    if (store) {
      await store.setJSON(key, value)
    }
  } catch (err) {
    console.error(`[blobs] writeBlob(${storeName}, ${key}) error:`, err?.message)
  }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
}

// Core business logic router
async function handleApiLogic(method, pathname, rawBody) {
  // Normalize path: strip /api and trailing slashes
  const path = pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/'

  // 1. GET /bootstrap or /data or /
  if (method === 'GET' && (path === '/bootstrap' || path === '/data' || path === '')) {
    const [team, users, customMaterials, customExercises] = await Promise.all([
      readBlob('config', 'team', DEFAULT_TEAM),
      readBlob('users', 'all', []),
      readBlob('materials', 'custom', []),
      readBlob('exercises', 'custom', []),
    ])

    return {
      status: 200,
      data: {
        success: true,
        data: { team, users, customMaterials, customExercises },
      },
    }
  }

  // 2. POST /user/sync — upsert user from student login / diagnostic save
  if (method === 'POST' && path === '/user/sync') {
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {})
    const { name, diagnostic, isPaid } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return { status: 400, data: { error: 'Name is required' } }
    }

    const cleanName = name.trim()
    const users = await readBlob('users', 'all', [])

    let user = users.find((u) => u.name.toLowerCase() === cleanName.toLowerCase())
    if (user) {
      // PRESERVE DIAGNOSTIC: only overwrite if incoming is a valid diagnostic object
      if (diagnostic && typeof diagnostic === 'object' && diagnostic.score !== undefined) {
        user.diagnostic = diagnostic
      }
      // PRESERVE PRO STATUS: never downgrade isPaid from true to false via student sync
      if (isPaid === true) {
        user.isPaid = true
      }
      user.lastActive = new Date().toISOString()
    } else {
      user = {
        name: cleanName,
        loginAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isPaid: isPaid === true,
        diagnostic: diagnostic || null,
      }
      users.push(user)
    }

    await writeBlob('users', 'all', users)
    return { status: 200, data: { success: true, user } }
  }

  // 3. GET /user/:name — get single user by name
  if (method === 'GET' && path.startsWith('/user/')) {
    const userName = decodeURIComponent(path.replace('/user/', '')).trim()
    const users = await readBlob('users', 'all', [])
    const user = users.find((u) => u.name.toLowerCase() === userName.toLowerCase())

    if (!user) {
      return { status: 404, data: { error: 'User not found' } }
    }
    return { status: 200, data: { success: true, user } }
  }

  // 4. POST /admin/toggle-paid — admin toggles paid status
  if (method === 'POST' && path === '/admin/toggle-paid') {
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {})
    const { name, isPaid } = body

    if (!name) {
      return { status: 400, data: { error: 'Name is required' } }
    }

    const users = await readBlob('users', 'all', [])
    let user = users.find((u) => u.name.toLowerCase() === name.toLowerCase())
    if (user) {
      user.isPaid = !!isPaid
    } else {
      user = {
        name,
        loginAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isPaid: !!isPaid,
        diagnostic: null,
      }
      users.push(user)
    }

    await writeBlob('users', 'all', users)
    return { status: 200, data: { success: true, user, allUsers: users } }
  }

  // 5. GET /admin/users — get all registered users
  if (method === 'GET' && path === '/admin/users') {
    const users = await readBlob('users', 'all', [])
    return { status: 200, data: { success: true, users } }
  }

  // 6. GET /admin/team — get team contact info
  if (method === 'GET' && path === '/admin/team') {
    const team = await readBlob('config', 'team', DEFAULT_TEAM)
    return { status: 200, data: { success: true, team } }
  }

  // 7. POST /admin/team — update team info
  if (method === 'POST' && path === '/admin/team') {
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {})
    const existing = await readBlob('config', 'team', DEFAULT_TEAM)
    const updated = { ...existing, ...body }
    await writeBlob('config', 'team', updated)
    return { status: 200, data: { success: true, team: updated } }
  }

  // 8. GET /admin/materials — get custom materials
  if (method === 'GET' && path === '/admin/materials') {
    const materials = await readBlob('materials', 'custom', [])
    return { status: 200, data: { success: true, materials } }
  }

  // 9. POST /admin/materials — save custom materials
  if (method === 'POST' && path === '/admin/materials') {
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {})
    const materials = body.materials || []
    await writeBlob('materials', 'custom', materials)
    return { status: 200, data: { success: true, count: materials.length } }
  }

  // 10. GET /admin/exercises — get custom exercises
  if (method === 'GET' && path === '/admin/exercises') {
    const exercises = await readBlob('exercises', 'custom', [])
    return { status: 200, data: { success: true, exercises } }
  }

  // 11. POST /admin/exercises — save custom exercises
  if (method === 'POST' && path === '/admin/exercises') {
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : (rawBody || {})
    const exercises = body.exercises || []
    await writeBlob('exercises', 'custom', exercises)
    return { status: 200, data: { success: true, count: exercises.length } }
  }

  return { status: 404, data: { error: `Route ${method} ${pathname} not found` } }
}

// ==============================================================
// 1. PRIMARY EXPORT: Netlify Functions v2 (Standard Web API)
// ==============================================================
export default async function (req, context) {
  // If invoked via legacy AWS Lambda style (event, context)
  if (!req || typeof req.headers?.get !== 'function') {
    return handleLegacyLambda(req, context)
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  try {
    const url = new URL(req.url)
    const pathname = url.pathname
    const method = req.method

    let rawBody = null
    if (method === 'POST' || method === 'PUT') {
      try {
        rawBody = await req.json()
      } catch {
        rawBody = {}
      }
    }

    const { status, data } = await handleApiLogic(method, pathname, rawBody)
    return new Response(JSON.stringify(data), {
      status,
      headers: CORS_HEADERS,
    })
  } catch (err) {
    console.error('[api.js v2] Internal error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: CORS_HEADERS,
    })
  }
}

// ==============================================================
// 2. LEGACY FALLBACK: AWS Lambda style (handler)
// ==============================================================
export async function handler(event, context) {
  return handleLegacyLambda(event, context)
}

async function handleLegacyLambda(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  // Connect Lambda event to Netlify Blobs if present
  try {
    if (event?.blobs && typeof connectLambda === 'function') {
      connectLambda(event)
    }
  } catch (err) {
    console.warn('[blobs] connectLambda note:', err?.message)
  }

  try {
    const method = event.httpMethod
    const pathname = event.path || '/'
    const rawBody = event.body

    const { status, data } = await handleApiLogic(method, pathname, rawBody)
    return {
      statusCode: status,
      headers: CORS_HEADERS,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error('[api.js v1] Internal error:', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
