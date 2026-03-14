import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const items = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const last = await prisma.project.findFirst({ orderBy: { order: 'desc' } })
    const item = await prisma.project.create({
      data: { ...data, order: (last?.order ?? 0) + 1 },
    })
    revalidatePath('/')
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
