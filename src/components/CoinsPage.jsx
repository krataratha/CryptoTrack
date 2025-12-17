import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight } from 'lucide-react'
import CoinDetailModal from './CoinDetailModal'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

import btcImg from '../assets/coins/btc.svg'
import ethImg from '../assets/coins/eth.svg'
import solImg from '../assets/coins/sol.svg'
import bnbImg from '../assets/coins/bnb.svg'
import adaImg from '../assets/coins/ada.svg'
import xrpImg from '../assets/coins/xrp.svg'
import dogeImg from '../assets/coins/doge.svg'
import ltcImg from '../assets/coins/ltc.svg'
import maticImg from '../assets/coins/matic.svg'
import dotImg from '../assets/coins/dot.svg'

const coinImages = {
  btc: btcImg,
  eth: ethImg,
  sol: solImg,
  bnb: bnbImg,
  ada: adaImg,
  xrp: xrpImg,
  doge: dogeImg,
  ltc: ltcImg,
  matic: maticImg,
  dot: dotImg,
}

const baseCoins = [
  { symbol: 'btc', name: 'Bitcoin', category: 'bluechip' },
  { symbol: 'eth', name: 'Ethereum', category: 'bluechip' },
  { symbol: 'sol', name: 'Solana', category: 'layer-1' },
  { symbol: 'bnb', name: 'BNB', category: 'exchange' },
  { symbol: 'ada', name: 'Cardano', category: 'layer-1' },
  { symbol: 'xrp', name: 'XRP', category: 'payments' },
  { symbol: 'doge', name: 'Dogecoin', category: 'memecoin' },
  { symbol: 'ltc', name: 'Litecoin', category: 'payments' },
  { symbol: 'matic', name: 'Polygon', category: 'layer-2' },
  { symbol: 'dot', name: 'Polkadot', category: 'layer-1' },
]

export default function CoinsPage({ allCryptoData }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const { currency, convert } = useCurrency()
  const mergedCoins = useMemo(() => {
    // merge live data into base list
    return baseCoins.map((c) => {
      const live = allCryptoData?.find((d) => d.symbol === c.symbol)
      return {
        ...c,
        price: live?.price ?? (Math.random() * 1000 + 1),
        change24h: live?.change24h ?? (Math.random() * 10 - 5),
        aiPrediction: live?.aiPrediction ?? Math.random(),
      }
    })
  }, [allCryptoData])

  const filtered = mergedCoins.filter((c) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      c.symbol.includes(q) || c.name.toLowerCase().includes(q) || (c.category || '').includes(q)
    )
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="card p-4 flex items-center gap-3">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coins (name, symbol, category)"
          className="flex-1 bg-transparent text-sm outline-none placeholder:muted"
        />
      </div>

      {/* Coins list */}
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((coin) => (
          <button
            key={coin.symbol}
            onClick={() => setSelected(coin)}
            className="card p-4 text-left hover:bg-obsidian-800/70 transition"
          >
            <div className="flex items-center gap-3">
              <img src={coinImages[coin.symbol]} alt={coin.name} className="h-10 w-10 rounded-lg border border-obsidian-700 bg-obsidian-800 object-contain" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{coin.name} <span className="muted">({coin.symbol.toUpperCase()})</span></div>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="muted">{formatCurrency(convert(coin.price, currency), currency)}</span>
                  <span className={coin.change24h >= 0 ? 'text-success-400' : 'text-danger-500'}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </span>
                  <span className="muted">AI: {Math.round((coin.aiPrediction || 0.5) * 100)}%</span>
                </div>
                <div className="mt-1 text-xs muted">{coin.category}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <CoinDetailModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        coin={selected}
        imageSrc={selected ? coinImages[selected.symbol] : undefined}
      />
    </div>
  )
}
