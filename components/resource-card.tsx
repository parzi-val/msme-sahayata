import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResourceCardProps {
  title: string
  description: string
  category: string
  slug: string
  color?: "orange" | "green" | "blue" | "purple"
}

export function ResourceCard({ title, description, category, slug, color = "orange" }: ResourceCardProps) {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    green: "bg-green-100 text-green-800 hover:bg-green-200",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  }

  return (
    <Link href={`/resources/${slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className={`${colorClasses[color]} p-4`}>
          <Badge variant="outline" className="w-fit">
            {category}
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-end p-4 pt-0">
          <span className="flex items-center text-sm font-medium text-primary">
            Read more <ChevronRight className="ml-1 h-4 w-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

