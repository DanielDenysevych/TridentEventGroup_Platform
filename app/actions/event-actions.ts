"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createEvent(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const date = new Date(formData.get("date") as string)
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const location = formData.get("location") as string
    const address = formData.get("address") as string | null
    const city = formData.get("city") as string | null
    const clientName = formData.get("clientName") as string
    const clientEmail = formData.get("clientEmail") as string
    const clientPhone = formData.get("clientPhone") as string
    const guestCount = formData.get("guestCount") ? parseInt(formData.get("guestCount") as string) : null
    const services = JSON.parse(formData.get("services") as string) as string[]
    const assignments = JSON.parse(formData.get("assignments") as string) as Array<{ userId: string; role: string }>
    const totalPrice = formData.get("totalPrice") ? parseFloat(formData.get("totalPrice") as string) : null
    const deposit = formData.get("deposit") ? parseFloat(formData.get("deposit") as string) : null
    const isPaid = formData.get("isPaid") === "on"
    const notes = formData.get("notes") as string | null
    const internalNotes = formData.get("internalNotes") as string | null

    // Create event with assignments
    const event = await db.event.create({
      data: {
        name,
        type,
        date,
        startTime,
        endTime,
        location,
        address,
        city,
        clientName,
        clientEmail,
        clientPhone,
        guestCount,
        services,
        totalPrice,
        deposit,
        isPaid,
        notes,
        internalNotes,
        status: "SCHEDULED",
        assignments: {
          create: assignments.map(a => ({
            userId: a.userId,
            role: a.role,
            isConfirmed: false
          }))
        }
      }
    })

    console.log("[v0] Event created successfully:", event.id)

    // Revalidate the events page to show the new event
    revalidatePath("/events")
    revalidatePath("/")

    return { success: true, eventId: event.id }
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return { success: false, error: "Failed to create event. Please try again." }
  }
}
