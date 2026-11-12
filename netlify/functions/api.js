// Netlify Serverless Function Backend for NumeracySprint
// Uses Netlify Blobs for persistent storage (not in-memory — stateless serverless!)
// Docs: https://docs.netlify.com/blobs/overview/

import { getStore } from '@netlify/blobs'

// Default values
const DEFAULT_TEAM = {
  name: 'Admin NumeracySprint',
  role: 'Pengembang & Layanan Siswa',
  phone: '6281234567890',
  whatsappMessage:
    'Halo Admin NumeracySprint, saya ingin berlangganan akses penuh materi Microlearning!',
}

// Helper: Get a blob store for a given collection
function getCollection(name) {
  return getStore({ name, consistency: 'strong' })
}

// Helper: Read JSON from blob store with a default fallback
async function readBlob(store, key, defaultValue) {
  try {
    const raw = await store.get(key, { type: 'json' })
    return raw ?? defaultValue
  } catch {
    return defaultValue
  }
}

// Helper: Write JSON to blob store
async function writeBlob(store, key, value) {
  await store.setJSON(key, value)
}

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  // Normalize path: strip /.netlify/functions/api and /api prefix
  const path =
    event.path
      .replace(/\/\.netlify\/functions\/api/, '')
      .replace(/^\/api/, '') || '/'
  const method = event.httpMethod

  try {
    // ─────────────────────────────────────────────────────────────
    // 1. GET /bootstrap — load all config (team, users, materials, exercises)
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && (path === '/bootstrap' || path === '/data' || path === '/')) {
      const configStore = getCollection('config')
      const usersStore = getCollection('users')
      const materialsStore = getCollection('materials')
      const exercisesStore = getCollection('exercises')

      const [team, users, customMaterials, customExercises] = await Promise.all([
        readBlob(configStore, 'team', DEFAULT_TEAM),
        readBlob(usersStore, 'all', []),
        readBlob(materialsStore, 'custom', []),
        readBlob(exercisesStore, 'custom', []),
      ])

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { team, users, customMaterials, customExercises },
        }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. POST /user/sync — upsert user record (login / diagnostic save / payment check)
    // ─────────────────────────────────────────────────────────────
    if (method === 'POST' && path === '/user/sync') {
      const body = JSON.parse(event.body || '{}')
      const { name, diagnostic, isPaid } = body

      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name is required' }),
        }
      }

      const store = getCollection('users')
      const users = await readBlob(store, 'all', [])

      let user = users.find((u) => u.name.toLowerCase() === name.toLowerCase())
      if (user) {
        if (diagnostic !== undefined) user.diagnostic = diagnostic
        if (typeof isPaid === 'boolean') user.isPaid = isPaid
        user.lastActive = new Date().toISOString()
      } else {
        user = {
          name,
          loginAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          isPaid: isPaid ?? false,
          diagnostic: diagnostic || null,
        }
        users.push(user)
      }

      await writeBlob(store, 'all', users)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, user }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. GET /user/:name — get one user by name (payment status check)
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path.startsWith('/user/')) {
      const userName = decodeURIComponent(path.replace('/user/', ''))
      const store = getCollection('users')
      const users = await readBlob(store, 'all', [])
      const user = users.find((u) => u.name.toLowerCase() === userName.toLowerCase())

      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, user }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. POST /admin/toggle-paid — admin toggles paid status for a user
    // ─────────────────────────────────────────────────────────────
    if (method === 'POST' && path === '/admin/toggle-paid') {
      const body = JSON.parse(event.body || '{}')
      const { name, isPaid } = body

      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name is required' }),
        }
      }

      const store = getCollection('users')
      const users = await readBlob(store, 'all', [])

      let user = users.find((u) => u.name.toLowerCase() === name.toLowerCase())
      if (user) {
        user.isPaid = !!isPaid
      } else {
        // Create user record if it doesn't exist yet
        user = {
          name,
          loginAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          isPaid: !!isPaid,
          diagnostic: null,
        }
        users.push(user)
      }

      await writeBlob(store, 'all', users)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, user, allUsers: users }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 5. GET /admin/users — get all users (admin only)
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path === '/admin/users') {
      const store = getCollection('users')
      const users = await readBlob(store, 'all', [])
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, users }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 6. GET /admin/team — get team info
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path === '/admin/team') {
      const store = getCollection('config')
      const team = await readBlob(store, 'team', DEFAULT_TEAM)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, team }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 7. POST /admin/team — admin updates developer team contact info
    // ─────────────────────────────────────────────────────────────
    if (method === 'POST' && path === '/admin/team') {
      const body = JSON.parse(event.body || '{}')
      const store = getCollection('config')
      const existing = await readBlob(store, 'team', DEFAULT_TEAM)
      const updated = { ...existing, ...body }
      await writeBlob(store, 'team', updated)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, team: updated }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 8. GET /admin/materials — get custom materials
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path === '/admin/materials') {
      const store = getCollection('materials')
      const materials = await readBlob(store, 'custom', [])
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, materials }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 9. POST /admin/materials — save custom materials (full replace)
    // ─────────────────────────────────────────────────────────────
    if (method === 'POST' && path === '/admin/materials') {
      const body = JSON.parse(event.body || '{}')
      const materials = body.materials || []
      const store = getCollection('materials')
      await writeBlob(store, 'custom', materials)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: materials.length }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 10. GET /admin/exercises — get custom exercises
    // ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path === '/admin/exercises') {
      const store = getCollection('exercises')
      const exercises = await readBlob(store, 'custom', [])
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, exercises }),
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 11. POST /admin/exercises — save custom exercises (full replace)
    // ─────────────────────────────────────────────────────────────
    if (method === 'POST' && path === '/admin/exercises') {
      const body = JSON.parse(event.body || '{}')
      const exercises = body.exercises || []
      const store = getCollection('exercises')
      await writeBlob(store, 'custom', exercises)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: exercises.length }),
      }
    }

    // Default 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Route ${method} ${path} not found` }),
    }
  } catch (err) {
    console.error('[api.js] Error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
