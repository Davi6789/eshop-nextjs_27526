// src/app/api/health/route.ts

import { supabase } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      auth: 'unknown',
    },
  }

  // Datenbank Check
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (error) throw error
    healthCheck.checks.database = 'connected'
  } catch (error) {
    healthCheck.checks.database = 'disconnected'
    healthCheck.status = 'unhealthy'
  }

  // Auth Check
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`)
    if (response.ok) {
      healthCheck.checks.auth = 'connected'
    } else {
      healthCheck.checks.auth = 'error'
    }
  } catch (error) {
    healthCheck.checks.auth = 'disconnected'
    healthCheck.status = 'unhealthy'
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503
  
  return NextResponse.json(healthCheck, { status: statusCode })
}