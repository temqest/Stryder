'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string
  const dateStr = formData.get('date') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  // Banner Image
  const bannerImageFile = formData.get('bannerImage') as File | null
  let bannerImageUrl = ''
  if (bannerImageFile && bannerImageFile.size > 0) {
    const bytes = await bannerImageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${bannerImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const path = join(process.cwd(), 'public/uploads', filename)
    await writeFile(path, buffer)
    bannerImageUrl = `/uploads/${filename}`
  }
  
  // Gallery Images
  const galleryImageFiles = formData.getAll('galleryImages') as File[]
  const galleryImages = []
  for (const file of galleryImageFiles) {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const path = join(process.cwd(), 'public/uploads', filename)
      await writeFile(path, buffer)
      galleryImages.push(`/uploads/${filename}`)
    }
  }
  
  // Parse Waypoints for Route Map
  const waypoints = []
  let wpIndex = 0
  while (formData.has(`wp_${wpIndex}_label`)) {
    const label = formData.get(`wp_${wpIndex}_label`) as string
    const lng = parseFloat(formData.get(`wp_${wpIndex}_lng`) as string)
    const lat = parseFloat(formData.get(`wp_${wpIndex}_lat`) as string)
    if (label && !isNaN(lng) && !isNaN(lat)) {
      waypoints.push({ label, lng, lat })
    }
    wpIndex++
  }
  const routeMapData = waypoints.length > 0 ? { waypoints } : null

  // Parse categories from form data
  const categories = []
  let index = 0
  while (formData.has(`category_${index}_distance`)) {
    const distance = formData.get(`category_${index}_distance`) as string
    const price = parseFloat(formData.get(`category_${index}_price`) as string)
    const capacity = parseInt(formData.get(`category_${index}_capacity`) as string, 10)
    
    if (distance && !isNaN(price) && !isNaN(capacity)) {
      categories.push({ distance, price, capacity })
    }
    index++
  }

  // Basic validation
  if (!name || !dateStr || categories.length === 0) {
    throw new Error('Name, date, and at least one category are required.')
  }

  // Create the event and its categories in a transaction
  const event = await prisma.event.create({
    data: {
      name,
      date: new Date(dateStr),
      description,
      location,
      bannerImage: bannerImageUrl,
      galleryImages,
      routeMapData: routeMapData ? routeMapData : undefined,
      categories: {
        create: categories.map(cat => ({
          distance: cat.distance,
          price: cat.price,
          capacity: cat.capacity,
        }))
      }
    }
  })

  // Revalidate the dashboard and all events page to show the new data immediately
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/events')

  return { success: true, eventId: event.id }
}

export async function updateEventDetails(eventId: string, formData: FormData) {
  const name = formData.get('name') as string
  const dateStr = formData.get('date') as string
  const location = formData.get('location') as string
  const description = formData.get('description') as string
  const routeMapDataStr = formData.get('routeMapData') as string

  if (!name || !dateStr) {
    throw new Error('Name and date are required')
  }
  
  let routeMapData = undefined
  if (routeMapDataStr) {
    try {
      routeMapData = JSON.parse(routeMapDataStr)
    } catch(e) {
      console.error("Failed to parse routeMapData")
    }
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      name,
      date: new Date(dateStr),
      location,
      description,
      ...(routeMapData !== undefined && { routeMapData })
    }
  })

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/events/${eventId}`)

  return { success: true }
}

export async function checkInParticipant(registrationId: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true, category: { include: { event: true } } }
    })

    if (!registration) {
      return { success: false, error: 'Registration not found' }
    }

    if (registration.checkedInAt) {
      return { success: false, error: 'Participant is already checked in', name: registration.user.name }
    }

    await prisma.registration.update({
      where: { id: registrationId },
      data: { checkedInAt: new Date() }
    })

    revalidatePath('/dashboard/scanner')
    revalidatePath(`/dashboard/events/${registration.category.eventId}`)

    return { 
      success: true, 
      name: registration.user.name, 
      category: registration.category.distance,
      event: registration.category.event.name
    }
  } catch (error) {
    console.error('Error checking in:', error)
    return { success: false, error: 'Failed to process check-in' }
  }
}

export async function saveBibDesign(eventId: string, designData: any) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { bibDesignData: designData }
    })
    revalidatePath(`/dashboard/events/${eventId}/bib-design`)
    return { success: true }
  } catch (error) {
    console.error('Error saving bib design:', error)
    return { success: false, error: 'Failed to save bib design' }
  }
}
