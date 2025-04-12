import { ResourceCard } from "@/components/resource-card"

// Sample resource data
const resources: Array<{
  title: string
  description: string
  category: string
  slug: string
  color?: "orange" | "green" | "blue" | "purple"
}> = [
    {
      title: "Prime Minister's Employment Generation Programme (PMEGP)",
      description: "Learn about the PMEGP scheme that provides financial assistance to set up micro-enterprises.",
      category: "Financial Assistance",
      slug: "pmegp",
      color: "orange",
    },
    {
      title: "Credit Linked Capital Subsidy Scheme (CLCSS)",
      description: "Understand how CLCSS helps MSMEs upgrade their technology with capital subsidies.",
      category: "Technology Upgrade",
      slug: "clcss",
      color: "green",
    },
    {
      title: "Pradhan Mantri MUDRA Yojana (PMMY)",
      description: "Explore how MUDRA loans can help fund your non-corporate small business.",
      category: "Loans",
      slug: "mudra",
      color: "blue",
    },
    {
      title: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
      description: "Find out how CGTMSE can help you secure collateral-free credit for your business.",
      category: "Credit Guarantee",
      slug: "cgtmse",
      color: "purple",
    },
    {
      title: "Scheme of Fund for Regeneration of Traditional Industries (SFURTI)",
      description: "Discover how SFURTI can help traditional industry clusters become more competitive.",
      category: "Traditional Industries",
      slug: "sfurti",
      color: "orange",
    },
    {
      title: "A Scheme for Promotion of Innovation, Rural Industries and Entrepreneurship (ASPIRE)",
      description: "Learn how ASPIRE promotes innovation and rural entrepreneurship through incubation centers.",
      category: "Innovation",
      slug: "aspire",
      color: "green",
    },
  ]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 bg-[#fffbf2]">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Resources & Information</h1>
        <p className="text-muted-foreground">
          Explore detailed information about MSME grants, subsidies, and support programs
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.slug}
            title={resource.title}
            description={resource.description}
            category={resource.category}
            slug={resource.slug}
            color={resource.color}
          />
        ))}
      </div>
    </div>
  )
}

