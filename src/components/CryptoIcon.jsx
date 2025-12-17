export default function CryptoIcon({ symbol, size = 32 }) {
  const sizeClass = size === 24 ? 'size-6' : size === 32 ? 'size-8' : 'size-10'
  
  const icons = {
    btc: (
      <svg className={sizeClass} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#F7931A" stroke="#F7931A" strokeWidth="2"/>
        <path d="M20.5 14.5c.5-1.5-.5-2.5-2-3l.5-2-1.5-.5-.5 2c-.5 0-1 0-1.5-.5l.5-2-1.5-.5-.5 2c-.5 0-1 0-1.5 0v-.5l-2-.5-.5 1.5s1 0 1 0c.5 0 .5.5.5.5l-1.5 6c0 .5-.5.5-.5.5 0 0-1 0-1 0l-.5 1.5 2 .5v.5l.5 2 1.5-.5-.5-2c.5 0 1 .5 1.5.5l-.5 2 1.5.5.5-2c2.5.5 4 0 4.5-1.5.5-1.5-.5-2-1.5-2.5.5 0 1.5-.5 1.5-1.5zm-3 4c-.5 1-2.5.5-3.5.5l.5-2.5c1 0 3 .5 3 2zm.5-4c-.5 1-2 .5-3 .5l.5-2c1 0 2.5.5 2.5 1.5z" fill="white"/>
      </svg>
    ),
    eth: (
      <svg className={sizeClass} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#627EEA" stroke="#627EEA" strokeWidth="2"/>
        <path d="M16 4L15.7 5.2V20.8L16 21.1L22.5 17L16 4Z" fill="white" fillOpacity="0.6"/>
        <path d="M16 4L9.5 17L16 21.1V4Z" fill="white"/>
        <path d="M16 22.6L15.8 22.9V27.5L16 28.1L22.5 18.5L16 22.6Z" fill="white" fillOpacity="0.6"/>
        <path d="M16 28.1V22.6L9.5 18.5L16 28.1Z" fill="white"/>
        <path d="M16 21.1L22.5 17L16 13.5V21.1Z" fill="white" fillOpacity="0.2"/>
        <path d="M9.5 17L16 21.1V13.5L9.5 17Z" fill="white" fillOpacity="0.6"/>
      </svg>
    ),
    sol: (
      <svg className={sizeClass} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#14F195" stroke="#14F195" strokeWidth="2"/>
        <path d="M10.5 19L13 16.5H25.5L23 19H10.5Z" fill="url(#sol1)"/>
        <path d="M10.5 13L13 10.5H25.5L23 13H10.5Z" fill="url(#sol2)"/>
        <path d="M10.5 22.5L13 20H25.5L23 22.5H10.5Z" fill="url(#sol3)"/>
        <defs>
          <linearGradient id="sol1" x1="10.5" y1="17.75" x2="25.5" y2="17.75">
            <stop stopColor="#9945FF"/>
            <stop offset="1" stopColor="#8A53F4"/>
          </linearGradient>
          <linearGradient id="sol2" x1="10.5" y1="11.75" x2="25.5" y2="11.75">
            <stop stopColor="#14F195"/>
            <stop offset="1" stopColor="#13D186"/>
          </linearGradient>
          <linearGradient id="sol3" x1="10.5" y1="21.25" x2="25.5" y2="21.25">
            <stop stopColor="#14F195"/>
            <stop offset="1" stopColor="#9945FF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    bnb: (
      <svg className={sizeClass} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#F3BA2F" stroke="#F3BA2F" strokeWidth="2"/>
        <path d="M16 8L13 11L16 14L19 11L16 8Z" fill="white"/>
        <path d="M11 13L8 16L11 19L14 16L11 13Z" fill="white"/>
        <path d="M21 13L18 16L21 19L24 16L21 13Z" fill="white"/>
        <path d="M16 18L13 21L16 24L19 21L16 18Z" fill="white"/>
        <path d="M16 12.5L13.5 15L16 17.5L18.5 15L16 12.5Z" fill="white"/>
      </svg>
    ),
    ada: (
      <svg className={sizeClass} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#0033AD" stroke="#0033AD" strokeWidth="2"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
        <circle cx="16" cy="9" r="2" fill="white"/>
        <circle cx="16" cy="23" r="2" fill="white"/>
        <circle cx="23" cy="16" r="2" fill="white"/>
        <circle cx="9" cy="16" r="2" fill="white"/>
        <circle cx="21" cy="11" r="1.5" fill="white"/>
        <circle cx="11" cy="21" r="1.5" fill="white"/>
        <circle cx="21" cy="21" r="1.5" fill="white"/>
        <circle cx="11" cy="11" r="1.5" fill="white"/>
      </svg>
    ),
  }

  return icons[symbol.toLowerCase()] || (
    <div className={`${sizeClass} rounded-full bg-obsidian-800/60 grid place-items-center text-xs font-bold text-neutral-300`}>
      {symbol.charAt(0).toUpperCase()}
    </div>
  )
}
