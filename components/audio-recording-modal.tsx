"use client"

import { useEffect, useState, useRef } from "react"
import { Mic, Pause, Play, Send, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AudioRecordingModalProps {
    isOpen: boolean
    onClose: () => void
    onRecordingComplete: (audioBlob: Blob) => void
}

export function AudioRecordingModal({ isOpen, onClose, onRecordingComplete }: AudioRecordingModalProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [audioLevel, setAudioLevel] = useState(0)
    const [recordingTime, setRecordingTime] = useState(0)
    const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const [audioChunks, setAudioChunks] = useState<Blob[]>([])

    const streamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Start recording when modal opens
    useEffect(() => {
        if (isOpen) {
            startRecording()
        } else {
            cleanupRecording()
        }

        return () => {
            cleanupRecording()
        }
    }, [isOpen])

    // Timer for recording duration
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRecording && !isPaused) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)
        } else if (interval) {
            clearInterval(interval)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRecording, isPaused])

    const cleanupRecording = () => {
        if (silenceTimer) clearTimeout(silenceTimer)
        setSilenceTimer(null)

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop()
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        if (audioContextRef.current) {
            audioContextRef.current.close().catch(console.error)
            audioContextRef.current = null
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }

        setIsRecording(false)
        setIsPaused(false)
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            const recorder = new MediaRecorder(stream)
            setMediaRecorder(recorder)
            setAudioChunks([])
            setIsRecording(true)
            setIsPaused(false)
            setRecordingTime(0)

            // Set up audio analyzer to detect silence
            const audioContext = new AudioContext()
            audioContextRef.current = audioContext

            const audioSource = audioContext.createMediaStreamSource(stream)
            const analyser = audioContext.createAnalyser()
            analyserRef.current = analyser

            analyser.fftSize = 256
            audioSource.connect(analyser)

            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const checkAudioLevel = () => {
                if (!isRecording || isPaused) return

                analyser.getByteFrequencyData(dataArray)
                let sum = 0
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i]
                }

                const average = sum / bufferLength
                setAudioLevel(average)

                // Check for silence (low audio level)
                if (average < 5) {
                    if (silenceTimer === null) {
                        setSilenceTimer(
                            setTimeout(() => {
                                pauseRecording()
                            }, 2500), // Pause after 2.5 seconds of silence
                        )
                    }
                } else {
                    // Reset silence timer if sound is detected
                    if (silenceTimer) {
                        clearTimeout(silenceTimer)
                        setSilenceTimer(null)
                    }
                }

                animationFrameRef.current = requestAnimationFrame(checkAudioLevel)
            }

            checkAudioLevel()

            // Collect audio chunks
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    setAudioChunks((prev) => [...prev, e.data])
                }
            }

            recorder.start(100) // Collect data every 100ms
        } catch (error) {
            console.error("Error accessing microphone:", error)
        }
    }

    const pauseRecording = () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.pause()
            setIsPaused(true)

            if (silenceTimer) {
                clearTimeout(silenceTimer)
                setSilenceTimer(null)
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
        }
    }

    const resumeRecording = () => {
        if (mediaRecorder && mediaRecorder.state === "paused") {
            mediaRecorder.resume()
            setIsPaused(false)

            // Resume audio level monitoring
            if (analyserRef.current) {
                const bufferLength = analyserRef.current.frequencyBinCount
                const dataArray = new Uint8Array(bufferLength)

                const checkAudioLevel = () => {
                    if (!isRecording || isPaused) return

                    analyserRef.current!.getByteFrequencyData(dataArray)
                    let sum = 0
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i]
                    }

                    const average = sum / bufferLength
                    setAudioLevel(average)

                    // Check for silence (low audio level)
                    if (average < 5) {
                        if (silenceTimer === null) {
                            setSilenceTimer(
                                setTimeout(() => {
                                    pauseRecording()
                                }, 2500), // Pause after 2.5 seconds of silence
                            )
                        }
                    } else {
                        // Reset silence timer if sound is detected
                        if (silenceTimer) {
                            clearTimeout(silenceTimer)
                            setSilenceTimer(null)
                        }
                    }

                    animationFrameRef.current = requestAnimationFrame(checkAudioLevel)
                }

                checkAudioLevel()
            }
        }
    }

    const finalizeRecording = () => {
        if (mediaRecorder) {
            // Stop the media recorder if it's not already stopped
            if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop()
            }

            // Create the final audio blob from all chunks
            setTimeout(() => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
                onRecordingComplete(audioBlob)

                // Clean up
                cleanupRecording()
                onClose()
            }, 100) // Small delay to ensure all chunks are collected
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-4 text-xl font-semibold">Recording Audio</h3>

                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
                        {/* Animated recording circles */}
                        <div
                            className="absolute rounded-full bg-red-500/20 transition-all duration-300"
                            style={{
                                height: `${100 + audioLevel * 1.5}px`,
                                width: `${100 + audioLevel * 1.5}px`,
                                opacity: isRecording && !isPaused ? 0.7 : 0,
                            }}
                        />
                        <div
                            className="absolute rounded-full bg-red-500/40 transition-all duration-200"
                            style={{
                                height: `${80 + audioLevel}px`,
                                width: `${80 + audioLevel}px`,
                                opacity: isRecording && !isPaused ? 0.8 : 0,
                            }}
                        />
                        <div
                            className={`absolute flex h-16 w-16 items-center justify-center rounded-full text-white transition-colors ${isPaused ? "bg-primary" : "bg-red-500"
                                }`}
                        >
                            <Mic size={24} />
                        </div>
                    </div>

                    <p className="mb-2 text-sm text-muted-foreground">
                        {isRecording && !isPaused
                            ? "Listening... (will pause after 2-3 seconds of silence)"
                            : isPaused
                                ? "Recording paused"
                                : "Processing your audio..."}
                    </p>

                    <div className="mb-4 text-lg font-mono">{formatTime(recordingTime)}</div>

                    <div className="flex gap-3">
                        {isPaused ? (
                            <>
                                <Button variant="outline" size="icon" onClick={resumeRecording} className="h-10 w-10 rounded-full">
                                    <Play size={18} />
                                </Button>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={finalizeRecording}
                                    className="h-10 w-10 rounded-full bg-primary"
                                >
                                    <Send size={18} />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={pauseRecording}
                                className="h-10 w-10 rounded-full"
                                disabled={!isRecording}
                            >
                                <Pause size={18} />
                            </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={onClose} className="h-10 w-10 rounded-full">
                            <X size={18} />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
