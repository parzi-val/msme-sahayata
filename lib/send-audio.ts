/**
 * Sends audio recording directly to the backend for processing
 */
export async function sendAudioToBackend(audioBlob: Blob): Promise<{ response: string; language: string }> {
  try {
    const response = await fetch("https://msme-backend-production.up.railway.app/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": `Bearer ${process.env.API_KEY}`  // Use NEXT_PUBLIC_ prefix if needed
      },
      body: audioBlob
    })

    console.log(response)

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    const data = await response.json()
    return { response: data.response, language: data.language }

  } catch (error) {
    console.error("Error sending audio to backend:", error)
    throw error
  }
}
