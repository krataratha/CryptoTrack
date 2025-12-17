import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Sparkles } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currency'

export default function CryptoTable({ data = [] }) {
  const [flashStates, setFlashStates] = useState({})
  const prevPricesRef = useRef({})
  const { currency, convert } = useCurrency()

  useEffect(() => {
    const newFlashStates = {}
    
    data.forEach((coin) => {
      const prevPrice = prevPricesRef.current[coin.id]
      if (prevPrice !== undefined && prevPrice !== coin.price) {
        newFlashStates[coin.id] = coin.price > prevPrice ? 'up' : 'down'
        
        setTimeout(() => {
          setFlashStates((prev) => {
            const updated = { ...prev }
            delete updated[coin.id]
            return updated
          })
        }, 500)
      }
    })
    
    if (Object.keys(newFlashStates).length > 0) {
      setFlashStates((prev) => ({ ...prev, ...newFlashStates }))
    }
    
    prevPricesRef.current = data.reduce((acc, coin) => {
      acc[coin.id] = coin.price
      return acc
    }, {})
  }, [data])

  function displayPrice(priceUSD) {
    const converted = convert(priceUSD, currency)
    const digits = priceUSD < 1 ? 6 : 2
    return formatCurrency(converted, currency, digits)
  }

  function formatChange(change) {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
  }

  function getPredictionLabel(prediction) {
    if (prediction >= 0.7) return { label: 'Strong Buy', color: 'success' }
    if (prediction >= 0.5) return { label: 'Buy', color: 'success' }
    if (prediction >= 0.3) return { label: 'Hold', color: 'warning' }
    if (prediction >= 0.1) return { label: 'Sell', color: 'danger' }
    return { label: 'Strong Sell', color: 'danger' }
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-obsidian-800">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                Coin
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-400">
                Price
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-400">
                24h Change
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-400">
                AI Prediction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {data.map((coin) => {
              const flashState = flashStates[coin.id]
              const prediction = getPredictionLabel(coin.aiPrediction)
              const isPositiveChange = coin.change24h >= 0

              return (
                <tr
                  key={coin.id}
                  className="hover:bg-obsidian-900/50 transition-colors"
                >
                  {/* Coin Name & Symbol */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {coin.icon && (
                        <div className="size-8 rounded-full bg-obsidian-800/60 grid place-items-center text-xs font-medium">
                          {coin.icon}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-neutral-100">
                          {coin.name}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price with Flash Effect */}
                  <td
                    className={`px-5 py-4 text-right text-sm font-semibold tabular-nums transition-colors ${
                      flashState === 'up'
                        ? 'bg-success-600/20 text-success-400'
                        : flashState === 'down'
                          ? 'bg-danger-600/20 text-danger-400'
                          : 'text-neutral-100'
                    }`}
                  >
                    {displayPrice(coin.price)}
                  </td>

                  {/* 24h Change */}
                  <td className="px-5 py-4 text-right">
                    <div
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        isPositiveChange ? 'text-success-400' : 'text-danger-500'
                      }`}
                    >
                      {isPositiveChange ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      )}
                      {formatChange(coin.change24h)}
                    </div>
                  </td>

                  {/* AI Prediction */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles
                        className={`size-4 ${
                          prediction.color === 'success'
                            ? 'text-success-400'
                            : prediction.color === 'warning'
                              ? 'text-warning-500'
                              : 'text-danger-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          prediction.color === 'success'
                            ? 'bg-success-600/20 text-success-400 border border-success-600/30'
                            : prediction.color === 'warning'
                              ? 'bg-warning-600/20 text-warning-400 border border-warning-600/30'
                              : 'bg-danger-600/20 text-danger-400 border border-danger-600/30'
                        }`}
                      >
                        {prediction.label}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-neutral-400">
          No crypto data available
        </div>
      )}
    </div>
  )
}
