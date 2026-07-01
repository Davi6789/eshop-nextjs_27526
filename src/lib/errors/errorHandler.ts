// src/lib/errors/errorHandler.ts 

import { NextResponse } from 'next/server'
import { AppError } from './AppError'

export function handleError(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }

  // Prisma Fehler
  if (error instanceof Error && error.message.includes('Prisma')) {
    return NextResponse.json(
      { error: 'Datenbankfehler' },
      { status: 500 }
    )
  }

  // Supabase Fehler
  if (error instanceof Error && error.message.includes('Supabase')) {
    return NextResponse.json(
      { error: 'Datenbankverbindungsfehler' },
      { status: 500 }
    )
  }

  // Unbekannter Fehler
  return NextResponse.json(
    { error: process.env.NODE_ENV === 'production' 
        ? 'Interner Serverfehler' 
        : error instanceof Error ? error.message : 'Unbekannter Fehler'
    },
    { status: 500 }
  )
}