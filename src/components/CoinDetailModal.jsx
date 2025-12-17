import { AnimatePresence, motion } from 'framer-motion'
import { X, Info, TrendingUp, TrendingDown, Gauge } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'
import BuySellPanel from './BuySellPanel'

function aiExplainCoin(coin) {
  const change = coin.change24h || 0
  const pred = coin.aiPrediction || 0.5
  const parts = []
  if (change > 3) parts.push('Strong short-term momentum with elevated buy-side pressure.')
  if (change < -3) parts.push('Downside volatility detected; caution on further drawdowns.')
  if (pred >= 0.75) parts.push('Model confidence indicates continued upside potential.')
  if (pred <= 0.35) parts.push('AI models flag weakening momentum; consider risk management.')
  if (parts.length === 0) parts.push('Neutral conditions; monitor volume and trend confirmations.')
  return parts.join(' ')
}

export default function CoinDetailModal({ isOpen, onClose, coin, imageSrc }) {
  const { currency, convert } = useCurrency()
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
            className="relative w-full max-w-xl rounded-2xl border border-obsidian-800 bg-obsidian-900/80 p-6 shadow-obsidian"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-obsidian-800 transition"
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>

            <div className="flex items-start gap-4">
              <img src={imageSrc} alt={coin?.name} className="h-12 w-12 rounded-lg border border-obsidian-700 bg-obsidian-800 object-contain" />
              <div>
                <div className="text-lg font-semibold">{coin?.name} <span className="muted text-xs">({coin?.symbol?.toUpperCase()})</span></div>
                <div className="text-xs muted">Category: {coin?.category || 'Crypto'}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="card p-3">
                <div className="muted text-[11px]">Price</div>
                <div className="text-lg font-semibold">{formatCurrency(convert(coin?.price || 0, currency), currency)}</div>
              </div>
              <div className="card p-3">
                <div className="muted text-[11px]">24h Change</div>
                <div className={`text-lg font-semibold ${coin?.change24h >= 0 ? 'text-success-400' : 'text-danger-500'}`}>{coin?.change24h >= 0 ? '+' : ''}{coin?.change24h?.toFixed(2)}%</div>
              </div>
              <div className="card p-3">
                <div className="muted text-[11px]">AI Confidence</div>
                <div className="text-lg font-semibold">{Math.round((coin?.aiPrediction || 0.5) * 100)}%</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-accent-400" />
                <div className="text-sm font-semibold">AI Explanation</div>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {aiExplainCoin(coin)}
              </p>
              <div className="mt-3 h-2 rounded bg-obsidian-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((coin?.aiPrediction || 0.5) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-linear-to-r from-success-600 via-accent-600 to-cyan-400"
                />
              </div>
            </div>

            {/* Buy/Sell Panel */}
            <BuySellPanel coin={coin} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

