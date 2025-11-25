// Public endpoint for receiving leads from embedded forms and external sources

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { LeadSource } from '@prisma/client'

// Allow requests from your domains
const ALLOWED_ORIGINS = [
  'https://tridentmusic.com',
  'https://tridentfilms.com',
  'https://tridenteventgroup.com',
  // Add your Framer domains
  'https://tridentmusic.framer.app',
  'https://tridentfilms.framer.app',
  // Add localhost for development
  'http://localhost:3000',
]

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin')
    const body = await req.json()

    const {
      // Contact info
      firstName,
      lastName,
      email,
      phone,
      
      // Event type
      eventType,
      
      // Conditional fields
      fianceFirstName,
      fianceLastName,
      companyName,
      schoolName,
      
      // Event details
      eventDate,
      eventLocation,
      bookingStage,
      hearAboutUs,
      eventDetails,
      eventName,
      
      // Meta
      service,        // Which service form (Trident Music, Trident Films, etc.)
      source,         // Lead source
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required contact information' },
        { status: 400 }
      )
    }

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Build the client name
    const clientName = `${firstName} ${lastName}`
    
    // Build notes with all the extra info
    const notesArray = []
    
    if (fianceFirstName && fianceLastName) {
      notesArray.push(`Fiancé: ${fianceFirstName} ${fianceLastName}`)
    }
    if (companyName) {
      notesArray.push(`Company: ${companyName}`)
    }
    if (schoolName) {
      notesArray.push(`School: ${schoolName}`)
    }
    if (bookingStage) {
      notesArray.push(`Booking Stage: ${bookingStage}`)
    }
    if (hearAboutUs) {
      notesArray.push(`How they heard about us: ${hearAboutUs}`)
    }
    if (eventDetails) {
      notesArray.push(`Event Details: ${eventDetails}`)
    }
    if (service) {
      notesArray.push(`Service: ${service}`)
    }

    const notes = notesArray.join('\n\n')

    // Determine lead source
    let leadSource: LeadSource = LeadSource.WEBSITE_FORM
    if (hearAboutUs) {
      if (hearAboutUs.toLowerCase().includes('google')) {
        leadSource = LeadSource.WEBSITE_FORM
      } else if (['facebook', 'instagram', 'tiktok'].some(s => hearAboutUs.toLowerCase().includes(s))) {
        leadSource = LeadSource.SOCIAL_MEDIA
      } else if (hearAboutUs.toLowerCase().includes('friend') || hearAboutUs.toLowerCase().includes('family') || hearAboutUs.toLowerCase().includes('vendor')) {
        leadSource = LeadSource.REFERRAL
      }
    }

    // Create the lead
    const lead = await db.lead.create({
      data: {
        clientName,
        clientEmail: email,
        clientPhone: phone,
        eventName: eventName || `${eventType} - ${clientName}`,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventLocation: eventLocation || null,
        notes,
        source: leadSource,
        status: 'NEW',
      },
    })

    // Build response with CORS headers
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Lead received successfully',
        leadId: lead.id 
      },
      { status: 201 }
    )

    // Set CORS headers
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else {
      // Allow all origins for now (you can restrict this later)
      response.headers.set('Access-Control-Allow-Origin', '*')
    }

    return response

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    )
  }
}

// Handle preflight requests (CORS)
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin')
  
  const response = new NextResponse(null, { status: 204 })
  
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}