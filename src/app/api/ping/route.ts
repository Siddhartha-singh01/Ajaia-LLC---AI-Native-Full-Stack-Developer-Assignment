import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Try to count users
    const count = await prisma.user.count()
    return NextResponse.json({ 
      status: 'ok', 
      database: 'connected', 
      userCount: count,
      db_url_exists: !!process.env.DATABASE_URL,
      direct_url_exists: !!process.env.DIRECT_URL
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    }, { status: 500 })
  }
}
