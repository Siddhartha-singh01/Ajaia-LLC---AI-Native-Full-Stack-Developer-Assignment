import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/mockAuth'

type Params = { params: Promise<{ id: string }> }

// Returns document if user is owner OR has a share record. Else null.
async function getAccessibleDoc(docId: string, userId: string) {
  const doc = await prisma.document.findUnique({
    where: { id: docId },
    include: { owner: true, shares: true },
  })
  if (!doc) return null
  const allowed = doc.ownerId === userId || doc.shares.some(s => s.userId === userId)
  return allowed ? doc : null
}

// GET /api/documents/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  const userId = getCurrentUserId(req)
  const doc = await getAccessibleDoc(id, userId)

  if (!doc) {
    return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
  }
  return NextResponse.json(doc)
}

// PUT /api/documents/[id]
// Body: { title?: string, content?: string }
// Owner OR shared user can update content. Only owner can rename.
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const userId = getCurrentUserId(req)
  const doc = await getAccessibleDoc(id, userId)

  if (!doc) {
    return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
  }

  let body: { title?: string; content?: string } = {}
  try { body = await req.json() } catch {}

  if (body.title !== undefined && body.title.length > 200) {
    return NextResponse.json({ error: 'Title too long (max 200 chars)' }, { status: 400 })
  }

  // Only owner can rename
  if (body.title !== undefined && doc.ownerId !== userId) {
    return NextResponse.json({ error: 'Only the owner can rename this document' }, { status: 403 })
  }

  const updated = await prisma.document.update({
    where: { id: id },
    data: {
      ...(body.title   !== undefined && { title:   body.title   }),
      ...(body.content !== undefined && { content: body.content }),
    },
    include: { owner: true },
  })

  return NextResponse.json(updated)
}

// DELETE /api/documents/[id]
// Only owner can delete
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const userId = getCurrentUserId(req)

  const doc = await prisma.document.findUnique({ where: { id: id } })
  if (!doc || doc.ownerId !== userId) {
    return NextResponse.json({ error: 'Not found or not owner' }, { status: 403 })
  }

  await prisma.document.delete({ where: { id: id } })
  return NextResponse.json({ success: true })
}
