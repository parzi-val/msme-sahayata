import { Chat } from "@/components/chat"

export default function ChatbotPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-orange-50/50 px-6 py-4">
        <h1 className="text-2xl font-bold">MSME Grants & Subsidies Assistant</h1>
        <p className="text-muted-foreground">Find the financial support your business is eligible for</p>
      </header>
      <div className="flex-1">
        <Chat />
      </div>
    </div>
  )
}

