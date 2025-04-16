// /app/api/translate/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const message = body.message;
    ``
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    
    // Call your backend API for translation
    const response = await fetch("https://msme-backend-production.up.railway.app/translate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: "Failed to translate message" },
      { status: 500 }
    );
  }
}