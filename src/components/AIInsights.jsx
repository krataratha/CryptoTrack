import { useMemo, useState, useEffect } from 'react'
import { RefreshCw, Waves, AlertTriangle, Gauge, Clock } from 'lucide-react'

const STORAGE_KEY = 'ai-insights-data'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatImpact(impact) {
  if (impact === 'high') return 'High Impact'
  if (impact === 'moderate') return 'Moderate Impact'
  return 'Low Impact'
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function loadCachedData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (parsed.date === getTodayKey()) {
      return parsed
    }
    localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

function saveCachedData(data, timestamp) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getTodayKey(), data, timestamp })
    )
  } catch {}
}

export default function AIInsights({ initial }) {
  const seed = useMemo(() => Math.random().toString(36).slice(2, 7), [])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(() => {
    const cached = loadCachedData()
    return cached ? new Date(cached.timestamp) : new Date()
  })
  const [data, setData] = useState(() => {
    const cached = loadCachedData()
    if (cached) return cached.data
    return (
      initial || {
        narrative:
          'Markets opened mixed as BTC tested resistance while AI signals flagged rotation into high-cap alts. On-chain activity rose and funding rates cooled, hinting at constructive consolidation.',
        whale: {
          message:
            'Whale moved 3,200 BTC from exchange to cold wallet — reduced sell-side pressure likely near-term.',
          impact: 'moderate',
        },
        sentiment: { score: 0.62, label: 'Bullish' },
      }
    )
  })

  useEffect(() => {
    saveCachedData(data, lastUpdate.toISOString())
  }, [data, lastUpdate])

  function refresh() {
    setLoading(true)
    setTimeout(() => {
      const narratives = [
        'Momentum rotated into ETH and L2s as BTC ranged; dips were consistently bought and perp basis normalized across majors.',
        'Risk appetite improved after macro prints; breadth expanded with strong inflows into BTC/ETH while small/mid caps lagged.',
        'Volatility compressed intraday; breakout watch as liquidity clustered near prior highs with improving order book depth.',
      ]
      const whales = [
        { message: 'Whale moved 9,850 ETH to exchange — potential supply overhang if sustained.', impact: 'high' },
        { message: 'Whale accumulated 1,250 BTC off-exchange — accumulation trend intact.', impact: 'moderate' },
        { message: 'Large USDT mint observed on Tron — potential dry powder for risk-on rotation.', impact: 'low' },
      ]
      const sentiments = [
        { score: 0.71, label: 'Bullish' },
        { score: 0.54, label: 'Neutral' },
        { score: 0.32, label: 'Bearish' },
      ]
      const newData = {
        narrative: pick(narratives),
        whale: pick(whales),
        sentiment: pick(sentiments),
      }
      setData(newData)
      setLastUpdate(new Date())
      setLoading(false)
    }, 900)
  }

  function formatTimestamp(date) {
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  const score = data.sentiment.score
  const tone = score >= 0.67 ? 'success' : score >= 0.4 ? 'warning' : 'danger'
  const toneBadge =
    tone === 'success'
      ? 'bg-success-600/20 text-success-400 border border-success-600/30'
      : tone === 'warning'
        ? 'bg-warning-600/20 text-warning-400 border border-warning-600/30'
        : 'bg-danger-600/20 text-danger-400 border border-danger-600/30'

  const impactTone =
    data.whale.impact === 'high' ? 'danger' : data.whale.impact === 'moderate' ? 'warning' : 'success'
  const impactBadge =
    impactTone === 'success'
      ? 'bg-success-600/20 text-success-400 border border-success-600/30'
      : impactTone === 'warning'
        ? 'bg-warning-600/20 text-warning-400 border border-warning-600/30'
        : 'bg-danger-600/20 text-danger-400 border border-danger-600/30'

  return (
    <section aria-label={`AI Insights ${seed}`}>
      {/* Glowing gradient border */}
      <div className="relative group">
        <div
          aria-hidden
          className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-accent-500 via-success-500 to-accent-600 opacity-60 blur-md group-hover:opacity-90 transition duration-500 animate-pulse"
        />
        <div className="relative rounded-2xl border border-obsidian-800 bg-obsidian-900/70 p-5 backdrop-blur shadow-[0_0_30px_rgba(6,182,212,0.18)]">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">AI Insights</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="muted text-xs">Daily narrative, whales, and sentiment</p>
                <span className="text-[10px] muted flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatTimestamp(lastUpdate)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-obsidian-950 px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" /> Refresh AI
                </>
              )}
            </button>
          </header>

          {/* Narrative */}
          <div className="mt-4 text-sm leading-6 text-neutral-200">
            {data.narrative}
          </div>

          {/* Whale Movement Alert */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-obsidian-800 bg-obsidian-900/50 p-3">
            <div className="grid size-9 place-items-center rounded-lg bg-obsidian-800/60">
              <Waves className="size-5 text-accent-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Whale Movement</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${impactBadge}`}>
                  {formatImpact(data.whale.impact)}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-300">{data.whale.message}</p>
            </div>
          </div>

          {/* Sentiment */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="size-4 text-neutral-400" />
                <span className="text-sm font-medium">Sentiment</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${toneBadge}`}>
                  {data.sentiment.label}
                </span>
              </div>
              <div className="text-sm tabular-nums text-neutral-300">{Math.round(score * 100)}%</div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-obsidian-800">
              <div
                className="h-full bg-linear-to-r from-danger-600 via-warning-600 to-success-600"
                style={{ width: `${Math.round(score * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] muted">
              Summary score blends price momentum, funding, breadth, and on-chain velocity.
            </div>
          </div>

          {/* Minor caution note if high impact */}
          {data.whale.impact === 'high' && (
            <div className="mt-4 flex items-center gap-2 text-[11px] text-warning-400">
              <AlertTriangle className="size-3.5" /> Elevated risk from supply influx — monitor exchange flows.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
