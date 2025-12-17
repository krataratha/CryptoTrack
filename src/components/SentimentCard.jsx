import { HelpCircle } from 'lucide-react'

/**
 * SentimentCard
 * Props:
 * - sentiment: 'bullish' | 'neutral' | 'bearish'
 * - score: number (0-100)
 * - reason: string (tooltip content)
 */
export default function SentimentCard({ sentiment = 'neutral', score = 62, reason = 'Large exchange inflows detected.' }) {
  const variant = sentiment

  const title = variant === 'bullish' ? 'Bullish' : variant === 'bearish' ? 'Bearish' : 'Neutral'

  const accentGlow =
    variant === 'bullish'
      ? 'from-success-500/35 via-success-600/30 to-success-500/35'
      : variant === 'bearish'
        ? 'from-danger-500/35 via-danger-600/30 to-danger-500/35'
        : 'from-warning-500/35 via-warning-600/30 to-warning-500/35'

  const badge =
    variant === 'bullish'
      ? 'bg-success-600/15 text-success-400 border border-success-600/30'
      : variant === 'bearish'
        ? 'bg-danger-600/15 text-danger-400 border border-danger-600/30'
        : 'bg-warning-600/15 text-warning-400 border border-warning-600/30'

  const bar =
    variant === 'bullish'
      ? 'bg-success-600'
      : variant === 'bearish'
        ? 'bg-danger-600'
        : 'bg-warning-600'

  return (
    <section className="relative group">
      {/* Glow */}
      <div aria-hidden className={`absolute -inset-0.5 rounded-2xl bg-linear-to-r ${accentGlow} opacity-60 blur-md group-hover:opacity-90 transition duration-500`} />

      <div className="relative rounded-2xl border border-obsidian-800 bg-obsidian-900/70 p-5 backdrop-blur shadow-[0_0_30px_rgba(0,0,0,0.25)]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>{title}</span>
            <span className="text-xs text-neutral-400">AI Sentiment</span>
          </div>

          {/* Why tooltip */}
          <div className="relative group/why">
            <button type="button" className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white">
              <HelpCircle className="size-4 text-neutral-400" /> Why?
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-64 rounded-lg border border-obsidian-800 bg-obsidian-900/95 p-3 text-xs text-neutral-200 shadow-obsidian backdrop-blur group-hover/why:block">
              {reason}
              <div className="absolute -top-1 right-3 size-2 rotate-45 bg-obsidian-900 border-r border-t border-obsidian-800" />
            </div>
          </div>
        </header>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-300">Confidence</div>
            <div className="text-sm font-semibold tabular-nums text-neutral-100">{Math.max(0, Math.min(100, Math.round(score)))}%</div>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-obsidian-800">
            <div className={`h-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
          </div>
          <div className="mt-2 text-[11px] text-neutral-400">Dynamically colored glow and progress reflect current sentiment.
          </div>
        </div>
      </div>
    </section>
  )
}
