import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/mockAuth'

// GET /api/documents
// Returns { owned: Document[], shared: Document[] } for the current user
export async function GET(req: NextRequest) {
  const userId = getCurrentUserId(req)

  const [ownedRaw, sharesRaw] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: userId },
      include: { owner: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.share.findMany({
      where: { userId },
      include: { document: { include: { owner: true } } },
      orderBy: { grantedAt: 'desc' },
    }),
  ])

  const shared = sharesRaw.map(s => ({
    ...s.document,
    sharedAt: s.grantedAt,
  }))

  return NextResponse.json({ owned: ownedRaw, shared })
}

// POST /api/documents
// Body: { title?: string, content?: string }
// Creates a new document owned by the current user
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req)

  let body: { title?: string; content?: string } = {}
  try { body = await req.json() } catch {}

  if (body.title && body.title.length > 200) {
    return NextResponse.json({ error: 'Title too long (max 200 chars)' }, { status: 400 })
  }

  const document = await prisma.document.create({
    data: {
      title:   body.title   ?? 'Untitled Document',
      content: body.content ?? '',
      ownerId: userId,
    },
    include: { owner: true },
  })

  return NextResponse.json(document, { status: 201 })
}
