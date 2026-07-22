import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const dbUser = await prisma.stryderUser.findUnique({
    where: { email: user.email || '' }
  })

  if (!dbUser) {
    return NextResponse.redirect(new URL('/signup', request.url))
  }

  if (dbUser.role === 'ORGANIZER') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } else {
    return NextResponse.redirect(new URL('/runner', request.url))
  }
}
