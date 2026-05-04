import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/mockAuth'

const ALLOWED_EXTENSIONS = ['.txt', '.md']
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

// POST /api/upload
// multipart/form-data with field name "file"
// Accepts .txt and .md files only
// Creates a new document from the file content
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req)

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided. Use field name "file".' }, { status: 400 })
  }

  const ext = file.name.toLowerCase().endsWith('.md') ? '.md'
    : file.name.toLowerCase().endsWith('.txt') ? '.txt'
    : null

  if (!ext) {
    return NextResponse.json(
      { error: `Unsupported file type. Only ${ALLOWED_EXTENSIONS.join(', ')} are accepted.` },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
  }

  const text = await file.text()

  if (!text.trim()) {
    return NextResponse.json({ error: 'File is empty.' }, { status: 400 })
  }

  // Convert plain text to Tiptap JSON format
  // Split on newlines to preserve paragraph structure
  const paragraphs = text
    .split('\n')
    .map(line => ({
      type: 'paragraph',
      content: line.trim()
        ? [{ type: 'text', text: line }]
        : [],
    }))

  const tiptapContent = JSON.stringify({
    type: 'doc',
    content: paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph' }],
  })

  const title = file.name.replace(/\.(txt|md)$/i, '') || 'Imported Document'

  const document = await prisma.document.create({
    data: {
      title,
      content: tiptapContent,
      ownerId: userId,
    },
    include: { owner: true },
  })

  return NextResponse.json({ success: true, document }, { status: 201 })
}
