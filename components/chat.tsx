"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Send, Headphones, Globe } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AudioRecordingModal } from "@/components/audio-recording-modal"
import { sendAudioToBackend } from "@/lib/send-audio"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  source?: "text" | "audio"
  translatedContent?: string // Store the translated version
  showTranslation?: boolean // Track which version to show
  srcLang?: string // Store the source language of the message
}

export function Chat() {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your MSME Grants & Subsidies assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
      showTranslation: false,
      srcLang: "english", // Default first message is in English
    },
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      source: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      let data;

      if (response.ok) {
        data = await response.json()
      }

      // Add assistant response with language information
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.response || "Sorry, I couldn't process your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        showTranslation: false,
        srcLang: data?.language || "english", // Store the language from API
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        showTranslation: false,
        srcLang: "english", // Error messages are in English
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsRecording(false)
    setIsProcessingAudio(true)

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "Audio Message",
        role: "user",
        timestamp: new Date(),
        source: "audio",
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Send audio to backend and get transcription
      const transcription = await sendAudioToBackend(audioBlob)

      // Add transcribed message as user input with audio source
      if (transcription) {
        // Add assistant response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: transcription.response || "Sorry, I couldn't process your audio. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          showTranslation: false,
          srcLang: transcription.language || "english", // Store language from audio transcription
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your audio. Please try again or type your message.",
        role: "assistant",
        timestamp: new Date(),
        showTranslation: false,
        srcLang: "english", // Error messages are in English
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessingAudio(false)
      setIsLoading(false)
    }
  }

  // New function to handle language toggle
  const handleLanguageToggle = async (messageId: string) => {
    // Find the message by ID
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex === -1) return

    const message = messages[messageIndex]

    // If this is the first toggle and we don't have translation yet, fetch it
    if (!message.translatedContent) {
      try {
        // Create a temporary "loading" state for this specific message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, translatedContent: "Translating..." }
              : msg
          )
        )

        // Call the translation API
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message.content }),
        })

        if (!response.ok) {
          throw new Error("Failed to translate message")
        }

        const data = await response.json()

        // Update the message with the translated content and toggle visibility
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, translatedContent: data.response, showTranslation: true }
              : msg
          )
        )
      } catch (error) {
        console.error("Error translating message:", error)

        // Show error in translation field
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, translatedContent: "Translation failed. Try again.", showTranslation: false }
              : msg
          )
        )
      }
    } else {
      // We already have the translation, just toggle visibility
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, showTranslation: !msg.showTranslation }
            : msg
        )
      )
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex max-w-[80%] items-start gap-3">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/agent.svg?height=32&width=32" alt="Bot" className="object-cover rounded-full border-2 p-1" />
                      <AvatarFallback>BOT</AvatarFallback>
                    </Avatar>
                  )}
                  <Card className={`p-3 relative ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                    {/* Toggle language button for assistant messages only if language is not English */}
                    {message.role === "assistant" && message.srcLang && message.srcLang !== "english" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1 h-6 w-6 p-1 opacity-70 hover:opacity-100"
                        onClick={() => handleLanguageToggle(message.id)}
                        title={message.showTranslation ? "Show original" : "Translate to English"}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}

                    {message.source === "audio" ? (
                      <div className="flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        <p>{message.content}</p>
                      </div>
                    ) : message.role === "assistant" ? (
                      <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.showTranslation && message.translatedContent
                            ? message.translatedContent
                            : message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </Card>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>YOU</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/agent.svg?height=32&width=32" alt="Bot" className="object-cover rounded-full border-2 p-1" />
                    <AvatarFallback>BOT</AvatarFallback>
                  </Avatar>
                  <Card className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-primary"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="border-t p-4 sticky bottom-0 bg-white z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Ask about MSME grants and subsidies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isRecording || isProcessingAudio || isLoading}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleStartRecording}
            disabled={isRecording || isProcessingAudio || isLoading}
            aria-label="Record audio message"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isRecording || isProcessingAudio || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Audio Recording Modal */}
      <AudioRecordingModal
        isOpen={isRecording}
        onClose={handleStopRecording}
        onRecordingComplete={handleRecordingComplete}
      />
    </div >
  )
}