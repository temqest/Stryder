import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, categoryId, name, email, emergencyContact, shirtSize } = body

    if (!eventId || !categoryId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert user (assuming email is unique)
    const user = await prisma.stryderUser.upsert({
      where: { email },
      update: { name, emergencyContact, shirtSize },
      create: { name, email, emergencyContact, shirtSize }
    })

    const existingCount = await prisma.registration.count({
      where: { category: { eventId } }
    })
    const bibNumber = String(1000 + existingCount + 1)

    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        categoryId: categoryId,
        status: 'CONFIRMED',
        bibNumber
      }
    })

    return NextResponse.json({ success: true, registrationId: registration.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
