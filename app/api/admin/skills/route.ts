import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const items = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const last = await prisma.skill.findFirst({ orderBy: { order: 'desc' } })
    const item = await prisma.skill.create({
      data: { ...data, order: (last?.order ?? 0) + 1 },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
