import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

// Import db inside functions to avoid initialization issues
async function getDb() {
  const { db } = await import('@/lib/db')
  return db
}

export async function getCurrentUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    return null
  }

  const db = await getDb()
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id }
  })

  return dbUser
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }
  
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  return user
}

export async function checkRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser()
  
  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/')
  }
  
  return user
}