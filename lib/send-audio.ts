/**
 * Sends audio recording to the backend for processing
 */
export async function sendAudioToBackend(audioBlob: Blob): Promise<{ response: string; language: string }>  {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")
  
      const response = await fetch("https://msme-sahayata.onrender.com/transcribe", {
        method: "POST",
        body: formData,
      })

      console.log(response)
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
  
      const data = await response.json()
      return { response: data.transcription, language: data.language}
    } catch (error) {
      console.error("Error sending audio to backend:", error)
      throw error
    }
  }
  