import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'LogicNote API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
} 