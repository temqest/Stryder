import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, categoryId, name, email, emergencyContact, shirtSize } = body

    if (!eventId || !categoryId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch event details for the email
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { event: true }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
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

    // Send confirmation email asynchronously
    resend.emails.send({
      from: 'Stryder <onboarding@resend.dev>', // using resend test domain
      to: [email],
      subject: `Registration Confirmed: ${category.event.name}`,
      html: `
        <h1>You're all set, ${name}!</h1>
        <p>Thank you for registering for <strong>${category.event.name}</strong>.</p>
        <p><strong>Distance:</strong> ${category.distance}</p>
        <p><strong>Bib Number:</strong> ${bibNumber}</p>
        <p><strong>Shirt Size:</strong> ${shirtSize || 'N/A'}</p>
        <br/>
        <p>Your registration is tied to this email. You can view your history later by creating a password with this email address.</p>
        <p>Good luck on race day!</p>
      `
    }).catch(err => {
      console.error('Failed to send email:', err)
    });

    return NextResponse.json({ success: true, registrationId: registration.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
