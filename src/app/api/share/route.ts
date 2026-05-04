import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/mockAuth'

// POST /api/share
// Body: { documentId: string, shareWithUserId: string }
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req)

  let body: { documentId?: string; shareWithUserId?: string } = {}
  try { body = await req.json() } catch {}

  const { documentId, shareWithUserId } = body

  if (!documentId || !shareWithUserId) {
    return NextResponse.json(
      { error: 'documentId and shareWithUserId are required' },
      { status: 400 }
    )
  }

  if (shareWithUserId === userId) {
    return NextResponse.json({ error: 'You cannot share a document with yourself' }, { status: 400 })
  }

  const doc = await prisma.document.findUnique({ where: { id: documentId } })
  if (!doc || doc.ownerId !== userId) {
    return NextResponse.json({ error: 'Only the document owner can share it' }, { status: 403 })
  }

  const targetUser = await prisma.user.findUnique({ where: { id: shareWithUserId } })
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const share = await prisma.share.upsert({
    where: { documentId_userId: { documentId, userId: shareWithUserId } },
    update: {},
    create: { documentId, userId: shareWithUserId },
  })

  return NextResponse.json({ success: true, share })
}

// DELETE /api/share
// Body: { documentId: string, shareWithUserId: string }
// Revokes access. Only owner can revoke.
export async function DELETE(req: NextRequest) {
  const userId = getCurrentUserId(req)

  let body: { documentId?: string; shareWithUserId?: string } = {}
  try { body = await req.json() } catch {}

  const { documentId, shareWithUserId } = body

  if (!documentId || !shareWithUserId) {
    return NextResponse.json({ error: 'documentId and shareWithUserId are required' }, { status: 400 })
  }

  const doc = await prisma.document.findUnique({ where: { id: documentId } })
  if (!doc || doc.ownerId !== userId) {
    return NextResponse.json({ error: 'Only the document owner can revoke access' }, { status: 403 })
  }

  await prisma.share.deleteMany({
    where: { documentId, userId: shareWithUserId },
  })

  return NextResponse.json({ success: true })
}
