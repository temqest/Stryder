'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { StaffRole } from '@/generated/prisma/client'

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
