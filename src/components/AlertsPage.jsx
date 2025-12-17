import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  X,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

const alerts = [
  {
    id: 1,
    type: 'price',
    coin: 'Bitcoin',
    symbol: 'BTC',
    message: 'BTC has crossed $70,000 for the first time',
    severity: 'info',
    time: '2 min ago',
    icon: TrendingUp,
    color: 'success',
  },
  {
    id: 2,
    type: 'whale',
    coin: 'Ethereum',
    symbol: 'ETH',
    message: '5,000 ETH whale transfer detected on Coinbase',
    severity: 'warning',
    time: '15 min ago',
    icon: Zap,
    color: 'warning',
  },
  {
    id: 3,
    type: 'trend',
    coin: 'Solana',
    symbol: 'SOL',
    message: 'SOL entering strong uptrend with volume spike',
    severity: 'info',
    time: '1 hour ago',
    icon: TrendingUp,
    color: 'success',
  },
  {
    id: 4,
    type: 'volatility',
    coin: 'Dogecoin',
    symbol: 'DOGE',
    message: 'High volatility detected: 12.5% swing in 30 minutes',
    severity: 'warning',
    time: '2 hours ago',
    icon: AlertTriangle,
    color: 'warning',
  },
  {
    id: 5,
    type: 'price',
    coin: 'Cardano',
    symbol: 'ADA',
    message: 'ADA has fallen below $0.60 support level',
    severity: 'danger',
    time: '3 hours ago',
    icon: TrendingDown,
    color: 'danger',
  },
  {
    id: 6,
    type: 'volume',
    coin: 'BNB',
    symbol: 'BNB',
    message: '200% volume spike detected on BNB/USDT pair',
    severity: 'info',
    time: '4 hours ago',
    icon: Zap,
    color: 'info',
  },
]

const activeAlerts = [
  {
    id: 101,
    coin: 'Bitcoin',
    symbol: 'BTC',
    condition: 'Price above $72,000',
    active: true,
    createdAt: '3 days ago',
  },
  {
    id: 102,
    coin: 'Ethereum',
    symbol: 'ETH',
    condition: 'Price below $3,000',
    active: true,
    createdAt: '1 week ago',
  },
  {
    id: 103,
    coin: 'Solana',
    symbol: 'SOL',
    condition: 'Volume spike > 200%',
    active: false,
    createdAt: '2 weeks ago',
  },
]

const severityStyles = {
  success: 'bg-success-600/10 border-success-600/30 text-success-400',
  warning: 'bg-warning-600/10 border-warning-600/30 text-warning-400',
  danger: 'bg-danger-600/10 border-danger-600/30 text-danger-500',
  info: 'bg-cyan-600/10 border-cyan-600/30 text-cyan-400',
}

const alertTypeLabels = {
  price: 'Price Alert',
  whale: 'Whale Alert',
  trend: 'Trend Alert',
  volatility: 'Volatility Alert',
  volume: 'Volume Alert',
}

export default function AlertsPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="muted text-sm mt-1">Real-time notifications and market alerts</p>
      </motion.div>

      {/* Alert Summary */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        <div className="card p-4 border-l-4 border-success-600">
          <div className="muted text-xs">Active Alerts</div>
          <div className="text-3xl font-bold mt-1">2</div>
          <div className="text-xs muted mt-2">monitoring conditions</div>
        </div>
        <div className="card p-4 border-l-4 border-warning-600">
          <div className="muted text-xs">Recent Notifications</div>
          <div className="text-3xl font-bold mt-1">6</div>
          <div className="text-xs muted mt-2">in the last 24 hours</div>
        </div>
        <div className="card p-4 border-l-4 border-cyan-600">
          <div className="muted text-xs">Alert Types</div>
          <div className="text-3xl font-bold mt-1">5</div>
          <div className="text-xs muted mt-2">price, whale, trend, volume, volatility</div>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <motion.div variants={itemVariants} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-accent-400" />
          <h3 className="text-sm font-semibold">Active Alerts</h3>
        </div>
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-obsidian-800/50">
              <div>
                <div className="text-sm font-semibold">{alert.coin}</div>
                <div className="text-xs muted mt-0.5">{alert.condition}</div>
                <div className="text-xs muted mt-1">Created {alert.createdAt}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${alert.active ? 'bg-success-500' : 'bg-neutral-600'}`} />
                <button className="p-1 hover:bg-obsidian-700 rounded transition">
                  <X className="h-4 w-4 text-neutral-400 hover:text-neutral-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon
            const colorClass = severityStyles[alert.color]
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`card p-4 border-l-2 border-${alert.color}-600 hover:bg-obsidian-800/80 transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{alert.coin}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${alert.color}-600/20 text-${alert.color}-400 border border-${alert.color}-600/30`}>
                          {alertTypeLabels[alert.type]}
                        </span>
                      </div>
                      <p className="text-sm muted mt-1">{alert.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs muted">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-obsidian-700 rounded transition">
                    <X className="h-4 w-4 text-neutral-400 hover:text-neutral-200" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Alert Settings */}
      <motion.div variants={itemVariants} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Alert Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'Price Alerts', enabled: true, desc: 'Get notified on significant price movements' },
            { label: 'Whale Alerts', enabled: true, desc: 'Large transfer and whale movements' },
            { label: 'Trend Alerts', enabled: true, desc: 'Major trend reversals and patterns' },
            { label: 'Volume Alerts', enabled: false, desc: 'Unusual trading volume spikes' },
            { label: 'Volatility Alerts', enabled: true, desc: 'High volatility periods' },
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-obsidian-800/50">
              <div>
                <div className="text-sm font-semibold">{pref.label}</div>
                <div className="text-xs muted mt-0.5">{pref.desc}</div>
              </div>
              <button className={`relative w-10 h-6 rounded-full transition ${pref.enabled ? 'bg-success-600' : 'bg-obsidian-700'}`}>
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
                    pref.enabled ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
