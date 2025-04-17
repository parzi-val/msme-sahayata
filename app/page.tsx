'use client';

import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare, BookOpen, Award, TrendingUp, Users, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { HeroIllustration } from "@/components/hero-illustration"

export default function HomePage() {
  useEffect(() => {
    // Function to wake up the backend
    const wakeUpBackend = async () => {
      try {
        // Replace this URL with your actual Python backend URL
        const response = await fetch('https://api.bala.is-a.dev/wakeup', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Backend wake-up call sent:', response.status);
      } catch (error) {
        console.error('Error waking up backend:', error);
        // Silent fail - we don't want to block the UI or show errors to users
      }
    };

    // Call the function when component mounts
    wakeUpBackend();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-[#fffbf2] px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 bg-[url('/placeholder.svg?height=500&width=500')] bg-center opacity-5"></div>
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-800">
                Government of India Initiative
              </div>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                MSME <span className="text-primary">Sahayata</span>
              </h1>
              <p className="mb-10 max-w-2xl text-xl text-gray-600">
                Discover the grants and subsidies your business is eligible for through our AI-powered assistant
              </p>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/chatbot">
                    Start Chatting <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/resources">
                    Explore Resources <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroIllustration className="h-auto w-full max-w-md mx-auto" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Rest of your existing code */}
      {/* Features Section */}
      <section className="py-20">
        {/* Your existing code */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How MSME Sahayata Helps You</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our platform simplifies the process of finding and applying for government support programs
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={100}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-orange-50 transition-colors duration-300 group-hover:bg-orange-100">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <CardTitle>AI-Powered Assistant</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base">
                    Our intelligent chatbot helps you navigate through various MSME schemes and identifies the ones
                    you're eligible for.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-green-50 transition-colors duration-300 group-hover:bg-green-100">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle>Eligibility Checker</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base">
                    Answer a few simple questions about your business to instantly discover which grants and subsidies
                    you qualify for.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Resource Library</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base">
                    Access comprehensive information about all MSME support programs, including eligibility criteria and
                    application processes.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section className="bg-orange-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Empowering Indian MSMEs</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                The backbone of India's economic growth and development
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={100} direction="left">
              <div className="rounded-lg bg-background p-8 text-center shadow-sm transition-all duration-500 hover:shadow-md">
                <div className="mb-4 flex justify-center">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl font-bold">63.4 Million</div>
                <p className="text-muted-foreground">MSMEs in India</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="rounded-lg bg-background p-8 text-center shadow-sm transition-all duration-500 hover:shadow-md">
                <div className="mb-4 flex justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl font-bold">110+ Million</div>
                <p className="text-muted-foreground">Jobs Created</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="right">
              <div className="rounded-lg bg-background p-8 text-center shadow-sm transition-all duration-500 hover:shadow-md">
                <div className="mb-4 flex justify-center">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div className="mb-2 text-4xl font-bold">30%</div>
                <p className="text-muted-foreground">Contribution to GDP</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Featured Schemes</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Popular government initiatives to support your business growth
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2">
            <ScrollReveal delay={100} direction="left">
              <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-600/5 opacity-50 transition-opacity duration-300 group-hover:opacity-70"></div>
                <div className="relative p-6 sm:p-8">
                  <h3 className="mb-2 text-2xl font-bold">Prime Minister's Employment Generation Programme</h3>
                  <p className="mb-6 text-muted-foreground">
                    Financial assistance to set up micro-enterprises with subsidies ranging from 15% to 35% of the
                    project cost.
                  </p>
                  <Button asChild variant="secondary" className="gap-2">
                    <Link href="/resources/pmegp">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="right">
              <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-600/5 opacity-50 transition-opacity duration-300 group-hover:opacity-70"></div>
                <div className="relative p-6 sm:p-8">
                  <h3 className="mb-2 text-2xl font-bold">Pradhan Mantri MUDRA Yojana</h3>
                  <p className="mb-6 text-muted-foreground">
                    Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises through various financial
                    institutions.
                  </p>
                  <Button asChild variant="secondary" className="gap-2">
                    <Link href="/resources/mudra">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={300}>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/resources">
                  View All Schemes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/90 py-16 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                Ready to Find the Right Support for Your Business?
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Our AI assistant is available 24/7 to help you navigate through government schemes and find the perfect
                match for your business needs.
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/chatbot">
                  Start Chatting Now <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}