import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
      }
      
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const response = await fetch('http://localhost:8000/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: buffer
    })
    
    const result = await response.json()
    return NextResponse.json({ transcription: result.response, language: result.language }) // Return the transcription and language from the AI API


  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
