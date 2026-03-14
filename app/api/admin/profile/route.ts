import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    let profile = await prisma.profile.findFirst()

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data,
      })
    } else {
      profile = await prisma.profile.create({ data })
    }

    revalidatePath('/')
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
