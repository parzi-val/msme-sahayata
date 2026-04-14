"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  direction = "up",
  distance = 50,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, once])

  const getDirectionStyles = () => {
    switch (direction) {
      case "up":
        return `translate-y-[${distance}px]`
      case "down":
        return `translate-y-[-${distance}px]`
      case "left":
        return `translate-x-[${distance}px]`
      case "right":
        return `translate-x-[-${distance}px]`
      case "none":
        return ""
      default:
        return `translate-y-[${distance}px]`
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "transform-none opacity-100" : `${getDirectionStyles()} opacity-0`,
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

