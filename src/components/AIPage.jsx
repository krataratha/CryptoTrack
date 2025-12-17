import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, Lightbulb, TrendingUp, RefreshCw } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'
import AIQueryBar from './AIQueryBar'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
}

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(6, 182, 212, 0.3)',
      '0 0 40px rgba(6, 182, 212, 0.5)',
      '0 0 20px rgba(6, 182, 212, 0.3)',
    ],
    transition: { duration: 3, repeat: Infinity },
  },
}

const insights = [
  {
    title: 'Market Momentum',
    description: 'Strong bullish sentiment detected with 72% positive signals across major indicators',
    icon: TrendingUp,
    color: 'success',
    intensity: 85,
  },
  {
    title: 'Whale Movement',
    description: '500K BTC transferring between exchanges indicates potential volatility spike',
    icon: Sparkles,
    color: 'warning',
    intensity: 65,
  },
  {
    title: 'Volume Analysis',
    description: 'Unusual volume spike on altcoins suggests emerging opportunities',
    icon: Zap,
    color: 'info',
    intensity: 72,
  },
  {
    title: 'Risk Assessment',
    description: 'Portfolio diversification optimal, but monitor correlation during volatility',
    icon: Brain,
    color: 'cyan',
    intensity: 58,
  },
]

const predictionsBase = [
  {
    coin: 'Bitcoin',
    confidence: 78,
    sentiment: 'Bullish',
    timeframe: '24h',
    lowUSD: 70500,
    highUSD: 72000,
  },
  {
    coin: 'Ethereum',
    confidence: 65,
    sentiment: 'Neutral',
    timeframe: '24h',
    lowUSD: 3380,
    highUSD: 3550,
  },
  {
    coin: 'Solana',
    confidence: 82,
    sentiment: 'Very Bullish',
    timeframe: '24h',
    lowUSD: 155,
    highUSD: 165,
  },
]

export default function AIPage({ allCryptoData }) {
  const { currency, convert } = useCurrency()
  const predictions = predictionsBase.map((p) => ({
    ...p,
    prediction: `${formatCurrency(convert(p.lowUSD, currency), currency)} - ${formatCurrency(convert(p.highUSD, currency), currency)}`,
  }))
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      {/* Animated Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-accent-600/20 via-cyan-600/10 to-accent-600/20 blur-3xl rounded-3xl" />
        <div className="relative rounded-3xl bg-obsidian-900/80 border border-accent-600/30 p-8 backdrop-blur">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-accent-400 to-cyan-400 bg-clip-text text-transparent">
                AI Intelligence Hub
              </h1>
              <p className="muted text-sm mt-2">Advanced market analysis powered by machine learning</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-3 rounded-full bg-accent-600/20 border border-accent-600/30"
            >
              <Brain className="h-8 w-8 text-accent-400" />
            </motion.div>
          </div>

          {/* Real-time Status */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Models Active', value: '7', status: 'online' },
              { label: 'Data Processing', value: '2.3M', status: 'online' },
              { label: 'Accuracy Rate', value: '87.3%', status: 'online' },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stat.status === 'online' ? 'bg-success-500 animate-pulse' : 'bg-danger-500'}`} />
                  <div className="muted text-xs">{stat.label}</div>
                </div>
                <div className="text-lg font-semibold mt-1">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Query Bar */}
      <motion.div variants={itemVariants}>
        <AIQueryBar allCryptoData={allCryptoData} />
      </motion.div>

      {/* AI Insights Cards */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent-400" />
          AI Insights
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, idx) => {
            const Icon = insight.icon
            const colorMap = {
              success: 'from-success-600/30 to-success-600/10',
              warning: 'from-warning-600/30 to-warning-600/10',
              info: 'from-cyan-600/30 to-cyan-600/10',
              cyan: 'from-cyan-600/30 to-cyan-600/10',
            }
            const borderColor = {
              success: 'border-success-600/30',
              warning: 'border-warning-600/30',
              info: 'border-cyan-600/30',
              cyan: 'border-cyan-600/30',
            }

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative rounded-2xl bg-linear-to-br ${colorMap[insight.color]} border ${borderColor[insight.color]} p-5 overflow-hidden hover:border-accent-600/50 transition`}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-accent-600/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`h-5 w-5 text-accent-400`} />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs font-semibold px-2 py-1 rounded-full bg-accent-600/20 text-accent-400 border border-accent-600/30"
                    >
                      {insight.intensity}% confidence
                    </motion.div>
                  </div>

                  <h3 className="text-sm font-semibold mb-2">{insight.title}</h3>
                  <p className="text-xs muted leading-relaxed">{insight.description}</p>

                  {/* Intensity bar */}
                  <div className="mt-4 h-1.5 bg-obsidian-800/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-accent-600 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.intensity}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Price Predictions */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-400" />
          AI Price Predictions (24h)
        </h2>
        <div className="space-y-3">
          {predictions.map((pred, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="card p-5 border-l-4 border-accent-600 hover:bg-obsidian-800/80 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{pred.coin}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pred.sentiment.includes('Bullish')
                        ? 'bg-success-600/20 text-success-400 border border-success-600/30'
                        : 'bg-warning-600/20 text-warning-400 border border-warning-600/30'
                    }`}>
                      {pred.sentiment}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent-400">{pred.prediction}</div>
                  <div className="text-xs muted mt-1">{pred.timeframe}</div>
                </div>
              </div>

              {/* Confidence meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="muted">Prediction Confidence</span>
                  <span className="font-semibold">{pred.confidence}%</span>
                </div>
                <div className="h-2 bg-obsidian-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-success-600 via-accent-600 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.confidence}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Sentiment Analyzer */}
      <motion.div variants={itemVariants} className="card p-6 relative overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-linear-to-br from-accent-600/10 to-cyan-600/10 blur-3xl pointer-events-none"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Brain className="h-6 w-6 text-accent-400" />
            Market Sentiment Analyzer
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {['Bullish', 'Neutral', 'Bearish'].map((sentiment, idx) => {
              const scores = [72, 18, 10]
              const colors = ['success', 'warning', 'danger']
              const icons = ['📈', '→', '📉']

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative group"
                >
                  <motion.div
                    {...glowVariants}
                    className="absolute inset-0 rounded-xl border border-accent-600/30"
                  />

                  <div className="relative rounded-xl bg-obsidian-800/50 p-5 border border-obsidian-700">
                    <div className="text-3xl mb-3">{icons[idx]}</div>
                    <h3 className="text-lg font-semibold mb-2">{sentiment}</h3>
                    <div className="text-4xl font-bold text-accent-400 mb-3">{scores[idx]}%</div>

                    <div className="h-2 bg-obsidian-900 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-linear-to-r ${
                          colors[idx] === 'success'
                            ? 'from-success-600 to-success-400'
                            : colors[idx] === 'warning'
                              ? 'from-warning-600 to-warning-400'
                              : 'from-danger-600 to-danger-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores[idx]}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: idx * 0.2 }}
                      />
                    </div>

                    <p className="text-xs muted mt-3">
                      {sentiment === 'Bullish' && 'Positive indicators and strong momentum'}
                      {sentiment === 'Neutral' && 'Mixed signals, consolidation phase'}
                      {sentiment === 'Bearish' && 'Potential downside risks detected'}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* AI Narrative */}
      <motion.div variants={itemVariants} className="card p-6 bg-linear-to-br from-obsidian-900 to-obsidian-800/50 border border-accent-600/20">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <RefreshCw className="h-5 w-5 text-accent-400 animate-spin" style={{ animationDuration: '3s' }} />
          AI Generated Market Narrative
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm leading-relaxed text-neutral-300">
            The market is currently displaying strong bullish momentum with Bitcoin leading the charge above {formatCurrency(convert(68000, currency), currency)}. 
            Ethereum's consolidation pattern suggests a potential breakout, while Solana continues to outperform the broader 
            market with consistent 5%+ daily gains.
          </p>

          <div className="p-4 rounded-lg bg-accent-600/10 border border-accent-600/20">
            <p className="text-sm text-accent-300">
              <strong>AI Recommendation:</strong> Consider accumulating on dips while maintaining stops above key support levels. 
              Monitor whale movements for potential volatility. Diversification into layer-1 tokens showing strength is advised.
            </p>
          </div>

          <div className="text-xs muted">
            Generated 2 minutes ago • Confidence: 85% • Based on 2,300+ market signals
          </div>
        </motion.div>
      </motion.div>

      {/* Real-time AI Updates */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="text-lg font-semibold">Live AI Updates</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[
            { time: '14:32', update: 'Large ETH accumulation detected on Binance', type: 'whale' },
            { time: '14:28', update: 'SOL volume spike +180% - breakout potential', type: 'volume' },
            { time: '14:25', update: 'AI model confidence in BTC prediction increased to 89%', type: 'prediction' },
            { time: '14:22', update: `Market structure showing strong support at ${formatCurrency(convert(67800, currency), currency)}`, type: 'support' },
            { time: '14:18', update: 'Funding rates rising - long liquidation risk identified', type: 'alert' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-700/50 hover:border-obsidian-700 transition flex items-start gap-3"
            >
              <div className="text-xs muted min-w-12">{item.time}</div>
              <div className="flex-1">
                <p className="text-sm text-neutral-300">{item.update}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent-600/20 text-accent-400 border border-accent-600/30 whitespace-nowrap">
                {item.type}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
