import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid,
  LineChart,
  Wallet,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import AIInsights from './AIInsights'
import CryptoTable from './CryptoTable'
import SentimentCard from './SentimentCard'
import AIChatSearch from './AIChatSearch'
import PortfolioHealthModal from './PortfolioHealthModal'
import OverviewPage from './OverviewPage'
import MarketsPage from './MarketsPage'
import PortfolioPage from './PortfolioPage'
import AlertsPage from './AlertsPage'
import SettingsPage from './SettingsPage'
import AIPage from './AIPage'
import CoinsPage from './CoinsPage'
import { portfolioHealthCheck } from '../utils/portfolioHealthCheck'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { getLatestTransaction } from '../services/transactions'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import UserDashboard from './UserDashboard'

function useAIMarketHealth() {
  const base = useMemo(() => 65 + Math.random() * 20 - 10, [])
  const [score, setScore] = useState(Math.max(0, Math.min(100, Math.round(base))))
  const [trend, setTrend] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.round((Math.random() - 0.5) * 6)
      setScore((prev) => {
        const next = Math.max(0, Math.min(100, prev + delta))
        setTrend(next - prev)
        return next
      })
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Neutral' : 'Weak'
  const tone = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'
  const icon = trend >= 0 ? TrendingUp : TrendingDown

  return { score, label, tone, trend, icon }
}

function useLiveCryptoData() {
  const [data, setData] = useState([
    { id: 'btc', name: 'Bitcoin', symbol: 'btc', icon: '₿', price: 98500.00, change24h: 2.14, aiPrediction: 0.72 },
    { id: 'eth', name: 'Ethereum', symbol: 'eth', icon: 'Ξ', price: 3420.80, change24h: -0.85, aiPrediction: 0.65 },
    { id: 'sol', name: 'Solana', symbol: 'sol', icon: '◎', price: 142.35, change24h: 5.22, aiPrediction: 0.78 },
    { id: 'bnb', name: 'BNB', symbol: 'bnb', icon: 'B', price: 612.20, change24h: 1.45, aiPrediction: 0.55 },
    { id: 'ada', name: 'Cardano', symbol: 'ada', icon: '₳', price: 0.582, change24h: -2.10, aiPrediction: 0.42 },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) =>
        prev.map((coin) => {
          const priceChange = (Math.random() - 0.5) * 0.02
          const newPrice = coin.price * (1 + priceChange)
          const oldChange = coin.change24h
          const newChange = oldChange + (Math.random() - 0.5) * 0.5
          return {
            ...coin,
            price: newPrice,
            change24h: newChange,
          }
        })
      )
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return data
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
const itemLeft = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }

// Mock user holdings for demo
const mockHoldings = [
  { symbol: 'btc', amount: 0.5, category: 'bluechip' },
  { symbol: 'eth', amount: 3, category: 'bluechip' },
  { symbol: 'sol', amount: 50, category: 'layer-1' },
  { symbol: 'bnb', amount: 10, category: 'layer-1' },
  { symbol: 'ada', amount: 1000, category: 'memecoin' },
]

export default function CryptoDashboard() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const { score, label, tone, trend, icon: TrendIcon } = useAIMarketHealth()
  const allCryptoData = useLiveCryptoData()
  const [filteredData, setFilteredData] = useState(allCryptoData)
  const [filterIntent, setFilterIntent] = useState(null)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const [healthData, setHealthData] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [aiSummary, setAiSummary] = useState('AI ready: live analysis enabled.')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  const sentimentVariant = label === 'Strong' ? 'bullish' : label === 'Neutral' ? 'neutral' : 'bearish'
  const { currency, setCurrency } = useCurrency()
  const { user, logout } = useAuth()
  const latestTx = user ? getLatestTransaction(user.username) : null

  useEffect(() => {
    if (!filterIntent) {
      setFilteredData(allCryptoData)
    }
  }, [allCryptoData, filterIntent])

  useEffect(() => {
    function handleClickOutside(e) {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  function handleFilter(filtered, intent) {
    setFilteredData(filtered)
    setFilterIntent(intent)
  }

  function openHealthCheck() {
    const result = portfolioHealthCheck(mockHoldings, allCryptoData)
    setHealthData(result)
    setIsHealthModalOpen(true)
  }

  function scanWalletAndUpdateAI() {
    const result = portfolioHealthCheck(mockHoldings, allCryptoData)
    const suggestion = result?.suggestions?.[0]
    setAiSummary(`Portfolio scan—Grade ${result.grade}: ${suggestion || 'Allocation looks stable.'}`)
  }

  const nav = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'Markets', icon: LineChart },
    { name: 'Coins', icon: LineChart },
    { name: 'AI', icon: Sparkles },
    { name: 'Portfolio', icon: Wallet },
    { name: 'Alerts', icon: Bell },
    { name: 'Settings', icon: Settings },
    { name: 'User', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-obsidian-950 text-neutral-100">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8"
      >
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-obsidian-900/80 border border-obsidian-800 hover:bg-obsidian-800 transition"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-accent-400" />
          ) : (
            <Menu className="h-5 w-5 text-neutral-400" />
          )}
        </button>

        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur z-30"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          variants={itemLeft}
          initial={{ x: -256 }}
          animate={{ x: isSidebarOpen ? 0 : -256 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:static md:translate-x-0 h-[calc(100vh-3rem)] w-64 shrink-0 rounded-2xl bg-obsidian-900/70 border border-obsidian-800 shadow-obsidian backdrop-blur flex flex-col z-40 md:z-auto"
        >
          <div className="px-5 pb-4 pt-5 border-b border-obsidian-800">
            <div className="text-lg font-semibold tracking-tight">CryptoTrack</div>
            <div className="mt-1 text-xs muted">Obsidian AI Dashboard</div>
            {user && (
              <div className="mt-2 text-xs"><span className="muted">Signed in as</span> <span className="font-semibold">{user.username}</span></div>
            )}
          </div>
          <nav className="p-3 space-y-1">
            {nav.map(({ name, icon: Icon }) => {
              const isActive = activeTab === name
              return (
                <button
                  key={name}
                  onClick={() => {
                    setActiveTab(name)
                    setIsSidebarOpen(false)
                    if (name === 'Portfolio') scanWalletAndUpdateAI()
                  }}
                  className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition relative ${
                    isActive
                      ? 'text-accent-400 bg-accent-600/10 border border-accent-600/30'
                      : 'text-neutral-300 hover:text-white hover:bg-obsidian-800/70'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute -left-3 top-0 bottom-0 w-1 rounded-full bg-linear-to-b from-accent-400 to-accent-600 shadow-lg shadow-accent-500/50"
                      layoutId="activeTabBorder"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-4 w-4 ${isActive ? 'text-accent-400' : 'text-neutral-400 group-hover:text-accent-400'}`} />
                  <span className={isActive ? 'font-semibold' : ''}>{name}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-auto p-4 space-y-3">
            <button
              onClick={openHealthCheck}
              className="w-full flex items-center gap-2 rounded-lg bg-accent-600/20 hover:bg-accent-600/30 border border-accent-600/30 px-3 py-2.5 text-sm font-medium text-accent-400 transition"
            >
              <FileText className="h-4 w-4" />
              Health Check
            </button>
            <div className="card p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                  </span>
                  <span className="text-xs font-medium text-success-400">AI engine active</span>
                </div>
                <Sparkles className="h-4 w-4 text-accent-400" />
              </div>
              <div className="mt-1 text-[11px] muted">Status: online • Live analysis</div>
            </div>
          </div>
        </motion.aside>

        {/* Main */}
        <div className="flex-1 mt-12 md:mt-0">
          {/* AI Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-obsidian-800 bg-obsidian-900/60 p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-400" />
              <span className="text-sm">{aiSummary}</span>
            </div>
              <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs muted">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-xs bg-obsidian-800/60 border border-obsidian-700 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="INR">INR</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <div className="h-6 w-px bg-obsidian-800" />
              <button
                onClick={() => setActiveTab('Settings')}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs bg-obsidian-800/60 border border-obsidian-700 text-neutral-300 hover:bg-obsidian-700"
                title="Open Settings"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <div className="h-6 w-px bg-obsidian-800" />
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-obsidian-800/80 border border-obsidian-700 grid place-items-center text-xs font-semibold text-accent-300">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    {latestTx && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success-500 ring-2 ring-obsidian-900" title="Recent transaction" />
                    )}
                  </div>
                  <div className="hidden sm:block text-xs text-neutral-300">
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="muted">Profile</div>
                  </div>
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu((s) => !s)}
                      className="rounded-lg px-2.5 py-1.5 text-xs bg-obsidian-800/60 border border-obsidian-700 text-neutral-300 hover:bg-obsidian-700"
                    >
                      Menu
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-44 rounded-lg border border-obsidian-800 bg-obsidian-900/90 shadow-obsidian backdrop-blur z-9999">
                        <button
                          onClick={() => {
                            setActiveTab('Profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-obsidian-800"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('User');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-obsidian-800"
                        >
                          User Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('Settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-obsidian-800"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setActiveTab('Overview');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-danger-400 hover:bg-obsidian-800"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('Login')}
                    className="rounded-lg px-2.5 py-1.5 text-xs bg-obsidian-800/60 border border-obsidian-700 text-neutral-300 hover:bg-obsidian-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab('Signup')}
                    className="rounded-lg px-2.5 py-1.5 text-xs bg-accent-600/20 border border-accent-600/30 text-accent-300 hover:bg-accent-600/30"
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          {/* Conditional Content Rendering */}
          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewPage allCryptoData={allCryptoData} />
              </motion.div>
            )}

            {activeTab === 'Markets' && (
              <motion.div
                key="markets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <MarketsPage allCryptoData={allCryptoData} filteredData={filteredData} />
              </motion.div>
            )}

            {activeTab === 'AI' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AIPage allCryptoData={allCryptoData} />
              </motion.div>
            )}

            {activeTab === 'Coins' && (
              <motion.div
                key="coins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CoinsPage allCryptoData={allCryptoData} />
              </motion.div>
            )}

            {activeTab === 'Portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <PortfolioPage openHealthCheck={openHealthCheck} mockHoldings={mockHoldings} allCryptoData={allCryptoData} />
              </motion.div>
            )}

            {activeTab === 'Alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AlertsPage />
              </motion.div>
            )}

            {activeTab === 'Settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPage />
              </motion.div>
            )}

            {activeTab === 'User' && (
              <motion.div
                key="user"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <UserDashboard />
              </motion.div>
            )}

            {activeTab === 'Login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            )}

            {activeTab === 'Signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Signup />
              </motion.div>
            )}

            {activeTab === 'Profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Profile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Portfolio Health Modal */}
      <PortfolioHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthData={healthData}
      />
    </div>
  )
}
