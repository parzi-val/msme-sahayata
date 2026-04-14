export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none" aria-hidden="true">
        <circle cx="400" cy="300" r="250" fill="#FFF0E6" />
        <path
          d="M615 300c0 118.7-96.3 215-215 215S185 418.7 185 300s96.3-215 215-215 215 96.3 215 215z"
          stroke="#FF8A4C"
          strokeWidth="10"
          strokeDasharray="20 20"
        />
        <rect x="300" y="150" width="200" height="300" rx="10" fill="white" stroke="#13005A" strokeWidth="4" />
        <rect x="320" y="180" width="160" height="30" rx="5" fill="#FF8A4C" />
        <rect x="320" y="230" width="160" height="10" rx="5" fill="#E5E7EB" />
        <rect x="320" y="250" width="120" height="10" rx="5" fill="#E5E7EB" />
        <rect x="320" y="270" width="140" height="10" rx="5" fill="#E5E7EB" />
        <rect x="320" y="310" width="160" height="40" rx="5" fill="#13005A" />
        <rect x="320" y="370" width="160" height="60" rx="5" fill="#F3F4F6" />
      </svg>
    </div>
  )
}

