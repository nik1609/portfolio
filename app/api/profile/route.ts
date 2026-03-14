import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    let profile = await prisma.profile.findFirst()
    if (!profile) {
      profile = await prisma.profile.create({ data: {} })
    }
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
