import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Loader2 } from 'lucide-react'

/**
 * Parses user query to detect intent and extract filters
 * @param {string} query - User input query
 * @returns {Object} { intent: string, filters: object }
 */
function parseQuery(query) {
  const lower = query.toLowerCase()
  const numberMatch = lower.match(/\b(?:under|below|less than|over|above|greater than)\s*\$?(\d+(?:\.\d+)?)/i)
  const limitMatch = lower.match(/\btop\s*(\d{1,3})\b/)
  
  // Define keyword patterns
  const patterns = {
    cheapest: /\b(cheap|cheapest|low price|under|affordable|budget)\b/i,
    gainers: /\b(gain|gainer|gainers|winner|winners|up|rising|pumping|moon)\b/i,
    losers: /\b(los(s|ing|ers?)|down|falling|dump|crash|red)\b/i,
    risky: /\b(risk|risky|volatile|volatility|danger|unstable|high risk)\b/i,
    top: /\b(top|best|highest|leading)\b/i,
    stable: /\b(stable|stablecoin|safe|low volatility|quiet|range[- ]?bound)\b/i,
    volume: /\b(volume|liquid|liquidity|traded|high volume|low volume)\b/i,
    recent: /\b(recent|new|latest|today)\b/i,
    momentum: /\b(momentum|trending|breakout|spike|spiking|pump|dump)\b/i,
    majors: /\b(majors?|blue\s*chips?|btc|bitcoin|eth|ethereum|bnb)\b/i,
    alts: /\b(alts?|altcoins?)\b/i,
    penny: /\b(penny|micro|under\s*\$?1|<\s*\$?1)\b/i,
    liquidityTrap: /\b(liquidity\s*trap|low\s*liquidity)\b/i,
  }

  const detected = {
    cheapest: patterns.cheapest.test(lower),
    gainers: patterns.gainers.test(lower),
    losers: patterns.losers.test(lower),
    risky: patterns.risky.test(lower),
    top: patterns.top.test(lower),
    stable: patterns.stable.test(lower),
    volume: patterns.volume.test(lower),
    recent: patterns.recent.test(lower),
    momentum: patterns.momentum.test(lower),
    majors: patterns.majors.test(lower),
    alts: patterns.alts.test(lower),
    penny: patterns.penny.test(lower),
    liquidityTrap: patterns.liquidityTrap.test(lower),
  }

  // Determine primary intent
  let intent = 'general'
  let filters = {}

  if (detected.risky) {
    intent = 'risky'
    filters.minVolatility = 10 // High volatility threshold
  } else if (detected.momentum) {
    intent = 'momentum'
    filters.minVolatility = 5
    filters.sortBy = 'change24h'
    filters.sortOrder = 'desc'
  } else if (detected.gainers) {
    intent = 'gainers'
    filters.minChange = 0
    filters.sortBy = 'change24h'
    filters.sortOrder = 'desc'
  } else if (detected.losers) {
    intent = 'losers'
    filters.maxChange = 0
    filters.sortBy = 'change24h'
    filters.sortOrder = 'asc'
  } else if (detected.cheapest) {
    intent = 'cheapest'
    filters.sortBy = 'price'
    filters.sortOrder = 'asc'
  } else if (detected.top) {
    intent = 'top'
    filters.sortBy = 'volume'
    filters.sortOrder = 'desc'
  } else if (detected.stable) {
    intent = 'stable'
    filters.maxVolatility = 3
  } else if (detected.volume) {
    intent = 'volume'
    filters.sortBy = 'volume'
    filters.sortOrder = 'desc'
  }

  // Price thresholds
  if (numberMatch) {
    const value = parseFloat(numberMatch[1])
    if (/\b(under|below|less than)\b/.test(lower)) {
      filters.maxPrice = value
      if (intent === 'general') intent = 'price-under'
    } else if (/\b(over|above|greater than)\b/.test(lower)) {
      filters.minPrice = value
      if (intent === 'general') intent = 'price-over'
    }
  }

  // Penny/micro
  if (detected.penny) {
    filters.maxPrice = Math.min(filters.maxPrice ?? Infinity, 1)
    if (intent === 'general') intent = 'penny'
  }

  // Liquidity trap intent
  if (detected.liquidityTrap) {
    intent = 'liquidity-trap'
    filters.minChange = Math.max(filters.minChange ?? -Infinity, 20)
    filters.lowVolumeRelative = true
  }

  // Majors vs alts
  if (detected.majors) {
    filters.onlyMajors = true
    if (intent === 'general') intent = 'majors'
  }
  if (detected.alts) {
    filters.onlyAlts = true
    if (intent === 'general') intent = 'alts'
  }

  // Limit (top N)
  if (limitMatch) {
    filters.limit = parseInt(limitMatch[1], 10)
  }

  return { intent, filters, detected }
}

/**
 * Applies filters to crypto data based on parsed query
 * @param {Array} data - Crypto data array
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered and sorted crypto data
 */
function applyCryptoFilters(data, filters) {
  let filtered = [...data]

  // Apply volatility filters
  if (filters.minVolatility !== undefined) {
    filtered = filtered.filter((coin) => Math.abs(coin.change24h) >= filters.minVolatility)
  }
  if (filters.maxVolatility !== undefined) {
    filtered = filtered.filter((coin) => Math.abs(coin.change24h) <= filters.maxVolatility)
  }

  // Apply change filters
  if (filters.minChange !== undefined) {
    filtered = filtered.filter((coin) => coin.change24h >= filters.minChange)
  }
  if (filters.maxChange !== undefined) {
    filtered = filtered.filter((coin) => coin.change24h <= filters.maxChange)
  }

  // Price filters
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((coin) => coin.price >= filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((coin) => coin.price <= filters.maxPrice)
  }

  // Majors/Alts
  if (filters.onlyMajors) {
    const majors = ['btc', 'bitcoin', 'eth', 'ethereum', 'bnb']
    filtered = filtered.filter((c) => majors.includes(c.symbol?.toLowerCase()) || majors.includes(c.name?.toLowerCase()))
  }
  if (filters.onlyAlts) {
    const majors = ['btc', 'bitcoin', 'eth', 'ethereum', 'bnb']
    filtered = filtered.filter((c) => !(majors.includes(c.symbol?.toLowerCase()) || majors.includes(c.name?.toLowerCase())))
  }

  // Liquidity trap filter: high gain + low relative volume
  if (filters.lowVolumeRelative) {
    const avgVolume = filtered.reduce((s, c) => s + (c.volume ?? 0), 0) / (filtered.length || 1)
    filtered = filtered.filter((c) => c.change24h > 20 && (c.volume ?? 0) < avgVolume * 0.5)
  }

  // Sort
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy]
      const bVal = b[filters.sortBy]
      return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
  }

  // Limit
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export default function AIChatSearch({ cryptoData = [], onFilter }) {
  const [query, setQuery] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [result])

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setIsThinking(true)
    setResult(null)

    // Simulate AI processing delay
    setTimeout(() => {
      const parsed = parseQuery(query)
      const filtered = applyCryptoFilters(cryptoData, parsed.filters)
      
      let resultMessage = ''
      if (parsed.intent === 'risky') {
        resultMessage = `Found ${filtered.length} high-volatility asset${filtered.length !== 1 ? 's' : ''} with >10% movement.`
      } else if (parsed.intent === 'momentum') {
        resultMessage = `Detected ${filtered.length} momentum play${filtered.length !== 1 ? 's' : ''} with strong moves.`
      } else if (parsed.intent === 'gainers') {
        resultMessage = `Showing ${filtered.length} gainer${filtered.length !== 1 ? 's' : ''} sorted by performance.`
      } else if (parsed.intent === 'losers') {
        resultMessage = `Found ${filtered.length} declining asset${filtered.length !== 1 ? 's' : ''}.`
      } else if (parsed.intent === 'cheapest') {
        resultMessage = `Showing ${filtered.length} asset${filtered.length !== 1 ? 's' : ''} sorted by lowest price.`
      } else if (parsed.intent === 'top') {
        resultMessage = `Displaying top ${filtered.length} by volume.`
      } else if (parsed.intent === 'stable') {
        resultMessage = `Found ${filtered.length} stable asset${filtered.length !== 1 ? 's' : ''} with <3% volatility.`
      } else if (parsed.intent === 'price-under') {
        resultMessage = `Found ${filtered.length} asset${filtered.length !== 1 ? 's' : ''} under your price target.`
      } else if (parsed.intent === 'price-over') {
        resultMessage = `Found ${filtered.length} asset${filtered.length !== 1 ? 's' : ''} above your price floor.`
      } else if (parsed.intent === 'penny') {
        resultMessage = `Showing ${filtered.length} sub-$1 assets (penny/micro).`
      } else if (parsed.intent === 'majors') {
        resultMessage = `Showing major assets only (BTC/ETH/BNB).`
      } else if (parsed.intent === 'alts') {
        resultMessage = `Showing altcoins excluding majors.`
      } else if (parsed.intent === 'liquidity-trap') {
        resultMessage = `Flagged ${filtered.length} potential liquidity trap${filtered.length !== 1 ? 's' : ''}.`
      } else {
        resultMessage = `Showing all ${filtered.length} assets.`
      }

      setResult({ message: resultMessage, intent: parsed.intent, count: filtered.length })
      setIsThinking(false)

      // Callback to parent with filtered data
      if (onFilter) {
        onFilter(filtered, parsed.intent)
      }
    }, 1200)
  }

  return (
    <div className="relative">
      {/* Glassmorphic Container */}
      <div className="relative">
        {/* Glow effect */}
        <div
          aria-hidden
          className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-accent-500/30 via-success-500/30 to-accent-600/30 opacity-50 blur-xl"
        />
        
        <form onSubmit={handleSearch} className="relative">
          <div className="relative rounded-2xl border border-obsidian-700/50 bg-obsidian-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 px-5 py-4">
              <Sparkles className="size-5 text-accent-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask AI: 'show me risky coins' or 'cheapest gainers'..."
                className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
              />
              <button
                type="submit"
                disabled={isThinking || !query.trim()}
                className="shrink-0 grid place-items-center size-9 rounded-lg bg-accent-500 hover:bg-accent-600 text-obsidian-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThinking ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </button>
            </div>

            {/* Thinking pulse animation */}
            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-obsidian-800/50"
                >
                  <div className="flex items-center gap-3 px-5 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="size-2 rounded-full bg-accent-400"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400">AI analyzing your query...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Result message */}
        <AnimatePresence>
          {result && !isThinking && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-3 rounded-xl border border-obsidian-800/50 bg-obsidian-900/90 backdrop-blur-xl px-4 py-3 shadow-obsidian"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 text-accent-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-neutral-200">{result.message}</div>
                  <div className="mt-1 text-xs text-neutral-400">
                    Intent: <span className="text-accent-400">{result.intent}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export { parseQuery, applyCryptoFilters }
