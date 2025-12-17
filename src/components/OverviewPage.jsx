import { motion } from 'framer-motion'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatCompactCurrency } from '../utils/currency'
import { getUserTransactions } from '../services/transactions'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Target, Zap, AlertCircle, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

// Mock data
const priceHistoryData = [
  { time: '00:00', BTC: 68000, ETH: 3400, SOL: 140 },
  { time: '04:00', BTC: 68500, ETH: 3450, SOL: 142 },
  { time: '08:00', BTC: 67800, ETH: 3380, SOL: 138 },
  { time: '12:00', BTC: 69200, ETH: 3500, SOL: 145 },
  { time: '16:00', BTC: 68900, ETH: 3460, SOL: 143 },
  { time: '20:00', BTC: 69500, ETH: 3520, SOL: 147 },
  { time: '24:00', BTC: 68240, ETH: 3420, SOL: 142 },
]

const portfolioData = [
  { name: 'Bitcoin', value: 45, color: '#F7931A' },
  { name: 'Ethereum', value: 30, color: '#627EEA' },
  { name: 'Solana', value: 15, color: '#14F195' },
  { name: 'Others', value: 10, color: '#6B7280' },
]

const performanceData = [
  { asset: 'BTC', today: 2.1, week: 5.3, month: 12.5 },
  { asset: 'ETH', today: -0.8, week: 3.2, month: 8.1 },
  { asset: 'SOL', today: 5.2, week: 18.5, month: 35.2 },
  { asset: 'BNB', today: 1.4, week: 2.1, month: 5.8 },
]

export default function OverviewPage({ allCryptoData }) {
  const { currency, convert } = useCurrency()
  const { user } = useAuth()
  const recentTransactions = user ? getUserTransactions(user.username).slice(0, 5) : []
  
  const metrics = [
    { label: 'Portfolio Value', valueUSD: 125450, change: '+2.5%', icon: TrendingUp, positive: true },
    { label: '24h Volume', valueUSD: 2.3e12, change: '+15.2%', icon: Zap, positive: true },
    { label: 'Market Cap', valueUSD: 2.1e12, change: '-1.2%', icon: Target, positive: false },
    { label: 'Dominance', value: 'BTC 52%', change: '+2.1%', icon: AlertCircle, positive: true },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="muted text-sm mt-1">Real-time insights into crypto markets</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          const displayValue = metric.value
            ? metric.value
            : metric.label === 'Portfolio Value'
              ? formatCurrency(convert(metric.valueUSD, currency), currency, 0)
              : formatCompactCurrency(convert(metric.valueUSD, currency), currency)
          return (
            <div key={idx} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="muted text-xs">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{displayValue}</div>
                </div>
                <Icon className={`h-5 w-5 ${metric.positive ? 'text-success-400' : 'text-danger-500'}`} />
              </div>
              <div className={`mt-2 text-xs ${metric.positive ? 'text-success-400' : 'text-danger-500'}`}>
                {metric.change}
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Price History */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Price History (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="BTC" stroke="#F7931A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ETH" stroke="#627EEA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SOL" stroke="#14F195" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Allocation */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Performance Comparison */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="asset" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="today" fill="#22C55E" name="Today %" />
            <Bar dataKey="week" fill="#3B82F6" name="Week %" />
            <Bar dataKey="month" fill="#F59E0B" name="Month %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity & Top Movers Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-400" />
              Recent Activity
            </h3>
            {user && recentTransactions.length > 0 && (
              <span className="text-xs text-accent-400">{recentTransactions.length} transactions</span>
            )}
          </div>
          <div className="space-y-3">
            {!user ? (
              <div className="py-8 text-center">
                <p className="text-sm muted">Login to see your recent transactions</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm muted">No transactions yet</p>
                <p className="text-xs muted mt-1">Start trading to see your activity here</p>
              </div>
            ) : (
              recentTransactions.map((tx, idx) => {
                const isBuy = tx.type === 'buy'
                return (
                  <div key={tx.id || idx} className="flex items-center justify-between py-2 border-b border-obsidian-800 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isBuy ? 'bg-success-600/20' : 'bg-danger-600/20'
                      }`}>
                        {isBuy ? (
                          <ArrowDownRight className="h-4 w-4 text-success-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-danger-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {isBuy ? 'Bought' : 'Sold'} {tx.symbol.toUpperCase()}
                        </div>
                        <div className="text-xs muted">
                          {tx.quantity} @ {formatCurrency(convert(tx.execPriceUSD, currency), currency)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${isBuy ? 'text-success-400' : 'text-danger-400'}`}>
                        {formatCurrency(convert(tx.totalUSD, currency), currency)}
                      </div>
                      <div className="text-xs muted">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Top Movers */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Top Movers</h3>
          <div className="space-y-3">
            {allCryptoData?.slice(0, 5).map((coin, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-obsidian-800 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-600/20 flex items-center justify-center text-xs font-semibold">
                    {coin.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{coin.name}</div>
                    <div className="text-xs muted">{formatCurrency(convert(coin.price, currency), currency)}</div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${coin.change24h >= 0 ? 'text-success-400' : 'text-danger-500'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
