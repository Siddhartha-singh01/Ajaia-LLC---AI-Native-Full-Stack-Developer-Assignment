import { describe, it, expect, beforeAll } from 'vitest'

const BASE = 'http://localhost:3000'
const ALICE = { 'Content-Type': 'application/json', 'x-user-id': 'user_alice' }
const BOB   = { 'Content-Type': 'application/json', 'x-user-id': 'user_bob'   }

let docId = ''

describe('Documents API', () => {
  it('POST /api/documents — creates a document', async () => {
    const res = await fetch(`${BASE}/api/documents`, {
      method: 'POST',
      headers: ALICE,
      body: JSON.stringify({ title: 'Test Doc' }),
    })
    expect(res.status).toBe(201)
    const doc = await res.json()
    expect(doc.title).toBe('Test Doc')
    expect(doc.ownerId).toBe('user_alice')
    docId = doc.id
  })

  it('GET /api/documents — includes the created doc', async () => {
    const res = await fetch(`${BASE}/api/documents`, { headers: ALICE })
    const data = await res.json()
    expect(data.owned.some((d: any) => d.id === docId)).toBe(true)
  })

  it('GET /api/documents/[id] — owner can read', async () => {
    const res = await fetch(`${BASE}/api/documents/${docId}`, { headers: ALICE })
    expect(res.status).toBe(200)
  })

  it('GET /api/documents/[id] — non-owner cannot read', async () => {
    const res = await fetch(`${BASE}/api/documents/${docId}`, { headers: BOB })
    expect(res.status).toBe(404)
  })

  it('PUT /api/documents/[id] — owner can rename', async () => {
    const res = await fetch(`${BASE}/api/documents/${docId}`, {
      method: 'PUT',
      headers: ALICE,
      body: JSON.stringify({ title: 'Renamed Doc' }),
    })
    expect(res.status).toBe(200)
    const doc = await res.json()
    expect(doc.title).toBe('Renamed Doc')
  })

  it('POST /api/share — owner can share with Bob', async () => {
    const res = await fetch(`${BASE}/api/share`, {
      method: 'POST',
      headers: ALICE,
      body: JSON.stringify({ documentId: docId, shareWithUserId: 'user_bob' }),
    })
    expect(res.status).toBe(200)
  })

  it('GET /api/documents/[id] — Bob can now read after share', async () => {
    const res = await fetch(`${BASE}/api/documents/${docId}`, { headers: BOB })
    expect(res.status).toBe(200)
  })

  it('GET /api/documents — Bob sees doc in shared list', async () => {
    const res = await fetch(`${BASE}/api/documents`, { headers: BOB })
    const data = await res.json()
    expect(data.shared.some((d: any) => d.id === docId)).toBe(true)
  })

  it('POST /api/share — cannot share with yourself', async () => {
    const res = await fetch(`${BASE}/api/share`, {
      method: 'POST',
      headers: ALICE,
      body: JSON.stringify({ documentId: docId, shareWithUserId: 'user_alice' }),
    })
    expect(res.status).toBe(400)
  })

  it('DELETE /api/documents/[id] — owner can delete', async () => {
    const res = await fetch(`${BASE}/api/documents/${docId}`, {
      method: 'DELETE',
      headers: ALICE,
    })
    expect(res.status).toBe(200)
  })
})
