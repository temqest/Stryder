'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { StaffRole } from '@/generated/prisma/client'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

// Simulated auth helper
async function getSession() {
  return { user: { id: 'admin-123' } } // Mocked for now, just to show how it works
}

export async function inviteTeamMember(email: string, role: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')

  // Create pending invite
  await prisma.teamMember.create({
    data: {
      ownerId: session.user.id,
      email,
      role: role as StaffRole,
      status: 'PENDING',
    }
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Send invitation email
  try {
    await resend.emails.send({
      from: 'Stryder <onboarding@resend.dev>',
      to: [email],
      subject: `You've been invited to join the Stryder Team`,
      html: `
        <h1>You've been invited!</h1>
        <p>You have been invited to join a Stryder organization as a <strong>${role}</strong>.</p>
        <br/>
        <p><a href="${appUrl}/dashboard">Click here to accept the invitation and log in</a></p>
        <p>Welcome aboard!</p>
      `
    })
  } catch (error) {
    console.error('Failed to send team invite email:', error)
  }

  revalidatePath('/dashboard/team')
}


export async function updateMemberRole(memberId: string, newRole: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.teamMember.update({
    where: {
      id: memberId,
      ownerId: session.user.id // ensure owner
    },
    data: {
      role: newRole as StaffRole
    }
  })

  revalidatePath('/dashboard/team')
}

export async function removeTeamMember(memberId: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.teamMember.delete({
    where: {
      id: memberId,
      ownerId: session.user.id
    }
  })

  revalidatePath('/dashboard/team')
}
