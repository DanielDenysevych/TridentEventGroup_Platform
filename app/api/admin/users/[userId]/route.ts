import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { UserRole, EmploymentType } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params for Next.js 15
    const { userId } = await params
    
    // Check if current user is admin
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      employmentType,
      jobTitle,
      hourlyRate,
      isActive,
    } = body

    // Validate role
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Validate employment type
    if (employmentType && !Object.values(EmploymentType).includes(employmentType)) {
      return NextResponse.json(
        { error: 'Invalid employment type' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role,
        employmentType,
        jobTitle: jobTitle || null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        isActive,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params for Next.js 15
    const { userId } = await params
    
    // Check if current user is admin
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Soft delete - set isActive to false
    await db.user.update({
      where: { id: userId },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}