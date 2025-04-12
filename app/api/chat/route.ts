import { type NextRequest, NextResponse } from "next/server"

// Type for the request body
type ChatRequest = {
  message: string
  source?: "text" | "audio"
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest
    const { message, source = "text" } = body

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    const response = await fetch('http://localhost:8000/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        message,
        context: "MSME grants and subsidies in India"
      })
    })
    
    const result = await response.json()
    return NextResponse.json({ response: result.response, language: result.language}) // Return the response from the AI API

    // Log the incoming message and its source
    

  } catch (error) {
    console.error("Error processing message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
