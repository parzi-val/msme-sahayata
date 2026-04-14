import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

// Sample blog data
const blogs = {
  pmegp: {
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: "Financial Assistance",
    publishedAt: "April 15, 2025",
    content: `
      <h2>Overview</h2>
      <p>The Prime Minister's Employment Generation Programme (PMEGP) is a credit-linked subsidy program administered by the Ministry of Micro, Small and Medium Enterprises, Government of India. Launched in 2008, it aims to generate employment opportunities in rural and urban areas by supporting the establishment of new micro-enterprises.</p>
      
      <h2>Eligibility Criteria</h2>
      <ul>
        <li>Any individual above 18 years of age</li>
        <li>Education qualification: At least 8th grade pass for projects costing above ₹10 lakh in the manufacturing sector and above ₹5 lakh in the service sector</li>
        <li>Self Help Groups, Charitable Trusts, and registered Co-operative Societies</li>
        <li>Existing units and units that have already availed government subsidy under any other scheme are not eligible</li>
      </ul>
      
      <h2>Financial Assistance</h2>
      <p>The maximum cost of the project/unit admissible under manufacturing sector is ₹50 lakh and under service sector is ₹20 lakh.</p>
      
      <h3>Categories of Beneficiaries under PMEGP</h3>
      <table>
        <thead>
          <tr>
            <th>Categories of Beneficiaries</th>
            <th>Beneficiary's Contribution (of project cost)</th>
            <th>Rate of Subsidy (of project cost)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>General Category</td>
            <td>10%</td>
            <td>Urban: 15%, Rural: 25%</td>
          </tr>
          <tr>
            <td>Special Category (SC/ST/OBC/Minorities/Women, Ex-servicemen, Physically handicapped, NER, Hill and Border areas)</td>
            <td>5%</td>
            <td>Urban: 25%, Rural: 35%</td>
          </tr>
        </tbody>
      </table>
      
      <h2>Application Process</h2>
      <ol>
        <li>Register and apply online on the <a href="#">PMEGP e-portal</a></li>
        <li>Applications are initially screened by the District Task Force Committee (DTFC)</li>
        <li>After approval, the application is forwarded to the financing bank</li>
        <li>Upon sanction of the loan, the subsidy is placed with the bank</li>
        <li>The bank disburses the loan excluding the subsidy amount</li>
      </ol>
      
      <h2>Success Stories</h2>
      <p>Thousands of entrepreneurs across India have benefited from the PMEGP scheme. For instance, Mr. Rajesh Kumar from Bihar established a small food processing unit with PMEGP assistance and now employs 15 people from his village. Similarly, Ms. Priya Sharma from Rajasthan started a handloom business that has grown into a successful export venture.</p>
      
      <h2>Contact Information</h2>
      <p>For more information, contact your nearest District Industries Centre (DIC), Khadi and Village Industries Commission (KVIC), or Khadi and Village Industries Board (KVIB) office.</p>
    `,
  },
  mudra: {
    title: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Loans",
    publishedAt: "March 22, 2025",
    content: `
      <h2>Overview</h2>
      <p>Pradhan Mantri MUDRA Yojana (PMMY) is a scheme launched by the Government of India to provide loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. These loans are given by Commercial Banks, RRBs, Small Finance Banks, MFIs and NBFCs.</p>
      
      <h2>Categories of MUDRA Loans</h2>
      <ul>
        <li><strong>Shishu:</strong> Loans up to ₹50,000</li>
        <li><strong>Kishore:</strong> Loans above ₹50,000 and up to ₹5 lakh</li>
        <li><strong>Tarun:</strong> Loans above ₹5 lakh and up to ₹10 lakh</li>
      </ul>
      
      <h2>Eligibility Criteria</h2>
      <p>Any Indian citizen who has a business plan for a non-farm income generating activity such as manufacturing, processing, trading or service sector and whose credit need is less than ₹10 lakh can approach either a Bank, MFI, or NBFC for availing of MUDRA loans under PMMY.</p>
      
      <h2>Activities Covered</h2>
      <ul>
        <li>Small manufacturing units</li>
        <li>Service sector units</li>
        <li>Shopkeepers</li>
        <li>Fruit and vegetable vendors</li>
        <li>Truck operators</li>
        <li>Food service units</li>
        <li>Repair shops</li>
        <li>Machine operators</li>
        <li>Small industries</li>
        <li>Artisans</li>
        <li>Food processors</li>
        <li>Others</li>
      </ul>
      
      <h2>Application Process</h2>
      <ol>
        <li>Prepare a business plan/proposal</li>
        <li>Approach the nearest bank branch/MFI/NBFC</li>
        <li>Submit the application along with required documents</li>
        <li>After verification and approval, the loan is sanctioned</li>
      </ol>
      
      <h2>Required Documents</h2>
      <ul>
        <li>Identity Proof (Aadhaar Card, Voter ID, PAN Card, etc.)</li>
        <li>Address Proof</li>
        <li>Business Plan/Proposal</li>
        <li>Proof of SC/ST/OBC if applicable</li>
        <li>Passport size photograph</li>
        <li>Quotation of machinery to be purchased</li>
      </ul>
      
      <h2>Success Stories</h2>
      <p>The MUDRA scheme has helped millions of small entrepreneurs realize their dreams. For example, Mrs. Lakshmi from Tamil Nadu started a small tailoring business with a Shishu loan of ₹50,000. Today, she employs 5 women from her neighborhood and has upgraded to a Kishore loan to expand her business.</p>
    `,
  },
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const blog = blogs[slug as keyof typeof blogs] || blogs.pmegp // Default to PMEGP if slug not found

  return (
    <div className="container mx-auto py-8 bg-[#fffbf2]">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/resources">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
      </Button>

      <article className="prose prose-slate mx-auto max-w-4xl lg:prose-lg">
        <header className="mb-8 not-prose">
          <div className="mb-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {blog.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{blog.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Published on {blog.publishedAt}</p>
        </header>

        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  )
}

