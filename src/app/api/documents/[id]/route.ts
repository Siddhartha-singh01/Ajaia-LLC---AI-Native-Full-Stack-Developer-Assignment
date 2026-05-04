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
  try {
    const { id } = await params
    const userId = getCurrentUserId(req)
    const doc = await getAccessibleDoc(id, userId)

    if (!doc) {
      return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
    }
    return NextResponse.json(doc)
  } catch (error: any) {
    console.error('[DOC_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch document', details: error.message }, { status: 500 })
  }
}

// PUT /api/documents/[id]
// Body: { title?: string, content?: string }
// Owner OR shared user can update content. Only owner can rename.
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = getCurrentUserId(req)
    const doc = await getAccessibleDoc(id, userId)

    if (!doc) {
      return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 })
    }

    let body: { title?: string; content?: string } = {}
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

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
  } catch (error: any) {
    console.error('[DOC_PUT_ERROR]', error)
    return NextResponse.json({ error: 'Failed to update document', details: error.message }, { status: 500 })
  }
}

// DELETE /api/documents/[id]
// Only owner can delete
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = getCurrentUserId(req)

    const doc = await prisma.document.findUnique({ where: { id: id } })
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    if (doc.ownerId !== userId) {
      return NextResponse.json({ error: 'Only the owner can delete this document' }, { status: 403 })
    }

    await prisma.document.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DOC_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete document', details: error.message }, { status: 500 })
  }
}
