export default function AppLogo({ size = 'md' }) {
  const dimensions = size === 'sm' ? 'size-8' : size === 'md' ? 'size-10' : 'size-12'
  
  return (
    <svg className={dimensions} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Outer hexagon */}
      <path 
        d="M24 2L42 14V34L24 46L6 34V14L24 2Z" 
        fill="url(#logoGrad1)" 
        fillOpacity="0.1"
        stroke="url(#logoGrad1)" 
        strokeWidth="2"
      />
      
      {/* Inner chart bars */}
      <rect x="14" y="26" width="4" height="12" fill="url(#logoGrad2)" rx="1"/>
      <rect x="20" y="20" width="4" height="18" fill="url(#logoGrad2)" rx="1"/>
      <rect x="26" y="24" width="4" height="14" fill="url(#logoGrad2)" rx="1"/>
      <rect x="32" y="18" width="4" height="20" fill="url(#logoGrad2)" rx="1"/>
      
      {/* AI sparkle */}
      <circle cx="36" cy="12" r="2" fill="#22d3ee"/>
      <path d="M36 8V10M36 14V16M34 12H32M38 12H40" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
