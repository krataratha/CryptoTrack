import { motion } from 'framer-motion'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency, formatCompactCurrency } from '../utils/currency'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Eye, Volume2 } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

const volumeData = [
  { time: '00:00', volume: 45000 },
  { time: '04:00', volume: 52000 },
  { time: '08:00', volume: 38000 },
  { time: '12:00', volume: 61000 },
  { time: '16:00', volume: 55000 },
  { time: '20:00', volume: 67000 },
  { time: '24:00', volume: 58000 },
]

const gainersLosersData = [
  { symbol: 'BTC', change: 2.1, volume: 45.2, trend: 'up' },
  { symbol: 'ETH', change: -0.8, volume: 32.1, trend: 'down' },
  { symbol: 'SOL', change: 5.2, volume: 28.5, trend: 'up' },
  { symbol: 'BNB', change: 1.4, volume: 19.3, trend: 'up' },
  { symbol: 'ADA', change: -2.1, volume: 15.7, trend: 'down' },
  { symbol: 'XRP', change: 3.8, volume: 22.4, trend: 'up' },
]

const trendingCoins = [
  { symbol: 'PEPE', name: 'Pepe', price: 0.0000085, change24h: 25.3, volumeUSD: 2.1e9, category: 'Memecoin' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.38, change24h: 8.2, volumeUSD: 1.8e9, category: 'Memecoin' },
  { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000019, change24h: 15.7, volumeUSD: 1.2e9, category: 'Memecoin' },
  { symbol: 'FET', name: 'Fetch.ai', price: 2.45, change24h: 12.1, volumeUSD: 850e6, category: 'AI' },
  { symbol: 'TAO', name: 'Bittensor', price: 425.30, change24h: 18.5, volumeUSD: 950e6, category: 'AI' },
  { symbol: 'ICP', name: 'Internet Computer', price: 12.80, change24h: 9.3, volumeUSD: 650e6, category: 'Layer-1' },
]

export default function MarketsPage({ allCryptoData, filteredData }) {
  const { currency, convert } = useCurrency()
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        <p className="muted text-sm mt-1">Real-time trading data and market trends</p>
      </motion.div>

      {/* Volume Chart */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Trading Volume (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="volume" fill="#06B6D4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gainers and Losers */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Top Gainers */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-success-400" />
            <h3 className="text-sm font-semibold">Top Gainers</h3>
          </div>
          <div className="space-y-2">
            {gainersLosersData.filter((d) => d.trend === 'up').map((coin, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-obsidian-800 last:border-b-0">
                <div>
                  <div className="text-sm font-semibold">{coin.symbol}</div>
                  <div className="text-xs muted">Vol: {formatCompactCurrency(convert(coin.volume * 1e9, currency), currency)}</div>
                </div>
                <span className="text-sm font-semibold text-success-400">+{coin.change}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-4 w-4 text-danger-500" />
            <h3 className="text-sm font-semibold">Top Losers</h3>
          </div>
          <div className="space-y-2">
            {gainersLosersData.filter((d) => d.trend === 'down').map((coin, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-obsidian-800 last:border-b-0">
                <div>
                  <div className="text-sm font-semibold">{coin.symbol}</div>
                  <div className="text-xs muted">Vol: {formatCompactCurrency(convert(coin.volume * 1e9, currency), currency)}</div>
                </div>
                <span className="text-sm font-semibold text-danger-500">{coin.change}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Trending */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Trending This Week</h3>
        <div className="space-y-3">
          {trendingCoins.map((coin, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-obsidian-800/50 hover:bg-obsidian-800 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-600/20 flex items-center justify-center text-xs font-semibold">
                  {coin.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{coin.name}</div>
                  <div className="text-xs muted">{coin.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatCurrency(convert(coin.price, currency), currency, 6)}</div>
                <div className={`text-xs ${coin.change24h >= 0 ? 'text-success-400' : 'text-danger-500'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Table */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">All Markets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-obsidian-800">
                <th className="text-left py-2 px-2 muted">Name</th>
                <th className="text-right py-2 px-2 muted">Price</th>
                <th className="text-right py-2 px-2 muted">24h Change</th>
                <th className="text-right py-2 px-2 muted">Volume</th>
              </tr>
            </thead>
            <tbody>
              {(filteredData || allCryptoData)?.map((coin, idx) => (
                <tr key={idx} className="border-b border-obsidian-800/50 hover:bg-obsidian-800/30 transition">
                  <td className="py-3 px-2 font-semibold">{coin.name}</td>
                  <td className="text-right py-3 px-2">{formatCurrency(convert(coin.price || 0, currency), currency)}</td>
                  <td className={`text-right py-3 px-2 ${coin.change24h >= 0 ? 'text-success-400' : 'text-danger-500'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                  </td>
                  <td className="text-right py-3 px-2 muted">{formatCompactCurrency(convert(2.1e9, currency), currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
