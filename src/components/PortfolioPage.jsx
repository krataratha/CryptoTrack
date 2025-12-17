import { motion } from 'framer-motion'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { FileText, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

const holdingsData = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.5, value: 34120, category: 'bluechip', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', amount: 3, value: 10260, category: 'bluechip', color: '#627EEA' },
  { symbol: 'SOL', name: 'Solana', amount: 50, value: 7117.5, category: 'layer-1', color: '#14F195' },
  { symbol: 'BNB', name: 'BNB', amount: 10, value: 6122, category: 'layer-1', color: '#F3BA2F' },
  { symbol: 'ADA', name: 'Cardano', amount: 1000, value: 582, category: 'memecoin', color: '#0033AD' },
]

const portfolioGrowth = [
  { month: 'Jan', value: 95000 },
  { month: 'Feb', value: 102000 },
  { month: 'Mar', value: 98000 },
  { month: 'Apr', value: 115000 },
  { month: 'May', value: 125000 },
  { month: 'Jun', value: 125450 },
]

const categoryAllocation = [
  { name: 'Bluechip', value: 44.42, color: '#22C55E' },
  { name: 'Layer-1', value: 21.4, color: '#3B82F6' },
  { name: 'Memecoin', value: 0.46, color: '#EF4444' },
  { name: 'Stablecoin', value: 33.72, color: '#A78BFA' },
]

export default function PortfolioPage({ openHealthCheck, mockHoldings, allCryptoData }) {
  const { currency, convert } = useCurrency()
  const totalValue = holdingsData.reduce((sum, h) => sum + h.value, 0)
  const totalGain = ((totalValue - 100000) / 100000 * 100).toFixed(2)
  const totalValueDisplay = formatCurrency(convert(totalValue, currency), currency, 0)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="muted text-sm mt-1">Your holdings and investment analytics</p>
      </motion.div>

      {/* Portfolio Summary */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="muted text-xs mb-2">Total Portfolio Value</div>
          <div className="text-3xl font-bold">{totalValueDisplay}</div>
          <div className={`text-sm mt-2 ${totalGain >= 0 ? 'text-success-400' : 'text-danger-500'}`}>
            {totalGain >= 0 ? '+' : ''}{totalGain}% from initial investment
          </div>
        </div>
        <div className="card p-5">
          <div className="muted text-xs mb-2">Total Assets</div>
          <div className="text-3xl font-bold">{holdingsData.length}</div>
          <div className="text-sm muted mt-2">Across 3 categories</div>
        </div>
        <div className="card p-5 cursor-pointer hover:bg-obsidian-800/80 transition" onClick={openHealthCheck}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-accent-400" />
            <span className="muted text-xs">Health Check</span>
          </div>
          <div className="text-lg font-semibold text-accent-400">Run Analysis</div>
          <div className="text-xs muted mt-2">Click to see recommendations</div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Portfolio Growth */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Portfolio Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Allocation */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Category Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryAllocation.map((entry, index) => (
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

      {/* Holdings Table */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Your Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-obsidian-800">
                <th className="text-left py-2 px-2 muted">Asset</th>
                <th className="text-right py-2 px-2 muted">Amount</th>
                <th className="text-right py-2 px-2 muted">Current Price</th>
                <th className="text-right py-2 px-2 muted">Value</th>
                <th className="text-right py-2 px-2 muted">% of Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {holdingsData.map((holding, idx) => {
                const coin = allCryptoData?.find((c) => c.symbol === holding.symbol)
                const priceDisplay = coin?.price ? formatCurrency(convert(coin.price, currency), currency) : 'N/A'
                const valueDisplay = formatCurrency(convert(holding.value, currency), currency, 0)
                const percentage = ((holding.value / totalValue) * 100).toFixed(1)
                return (
                  <tr key={idx} className="border-b border-obsidian-800/50 hover:bg-obsidian-800/30 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: holding.color }}
                        />
                        <span className="font-semibold">{holding.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">{holding.amount}</td>
                    <td className="text-right py-3 px-2">{priceDisplay}</td>
                    <td className="text-right py-3 px-2 font-semibold">{valueDisplay}</td>
                    <td className="text-right py-3 px-2 muted">{percentage}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-accent-400" />
          <h3 className="text-sm font-semibold">Portfolio Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-success-600/10 border border-success-600/30">
            <div className="text-sm font-medium text-success-400">✓ Well Diversified</div>
            <p className="text-xs muted mt-1">Your portfolio includes blue chips, layer-1 tokens, and emerging projects.</p>
          </div>
          <div className="p-3 rounded-lg bg-warning-600/10 border border-warning-600/30">
            <div className="text-sm font-medium text-warning-400">⚠ Monitor Volatility</div>
            <p className="text-xs muted mt-1">SOL and emerging assets have higher volatility. Consider rebalancing in volatile markets.</p>
          </div>
          <div className="p-3 rounded-lg bg-info-600/10 border border-cyan-600/30">
            <div className="text-sm font-medium text-cyan-400">→ Rebalancing Suggestion</div>
            <p className="text-xs muted mt-1">Run the Health Check to get AI-powered recommendations based on current market conditions.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
