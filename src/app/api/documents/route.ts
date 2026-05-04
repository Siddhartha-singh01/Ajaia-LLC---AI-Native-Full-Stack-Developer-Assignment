import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/mockAuth'

// GET /api/documents
// Returns { owned: Document[], shared: Document[] } for the current user
export async function GET(req: NextRequest) {
  try {
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
  } catch (error: any) {
    console.error('[DOCS_GET_ERROR]', error)
    return NextResponse.json({ 
      error: 'Failed to fetch documents', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/documents
// Body: { title?: string, content?: string }
// Creates a new document owned by the current user
export async function POST(req: NextRequest) {
  try {
    const userId = getCurrentUserId(req)

    let body: { title?: string; content?: string } = {}
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

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
  } catch (error: any) {
    console.error('[DOCS_POST_ERROR_FULL]', error)
    return NextResponse.json({ 
      error: 'Failed to create document', 
      details: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
