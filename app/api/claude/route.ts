import { NextRequest, NextResponse } from 'next/server'
import { sendMessageToClaude, type ClaudeMessage } from '@/lib/claude-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, options } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Validate messages format
    const isValidMessages = messages.every(
      (msg: any) => 
        typeof msg === 'object' && 
        ['user', 'assistant'].includes(msg.role) && 
        typeof msg.content === 'string'
    )

    if (!isValidMessages) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    const response = await sendMessageToClaude(messages as ClaudeMessage[], options)

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Optionally, you can also add a GET endpoint to check if the API is configured
export async function GET() {
  const isConfigured = !!process.env.ANTHROPIC_API_KEY
  
  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured 
      ? 'Claude API is configured and ready' 
      : 'Claude API key is not configured'
  })
} 