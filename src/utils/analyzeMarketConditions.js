/**
 * Analyzes market conditions based on crypto data
 * @param {Array} cryptoData - Array of crypto objects with { name, price, change24h, volume }
 * @returns {Object} { summary: string, confidenceScore: number, narratives: array, risks: array }
 */
export function analyzeMarketConditions(cryptoData) {
  if (!cryptoData || cryptoData.length === 0) {
    return {
      summary: 'Insufficient data to analyze market conditions.',
      confidenceScore: 0,
      narratives: [],
      risks: [],
    }
  }

  const narratives = []
  const risks = []
  let confidenceScore = 50

  // Calculate aggregate metrics
  const totalCoins = cryptoData.length
  const avgChange = cryptoData.reduce((sum, coin) => sum + coin.change24h, 0) / totalCoins
  const avgVolume = cryptoData.reduce((sum, coin) => sum + coin.volume, 0) / totalCoins
  
  const gainers = cryptoData.filter((c) => c.change24h > 0)
  const losers = cryptoData.filter((c) => c.change24h < 0)
  const strongGainers = cryptoData.filter((c) => c.change24h > 5)
  const strongLosers = cryptoData.filter((c) => c.change24h < -5)
  
  // Market breadth analysis
  const bullishBreadth = (gainers.length / totalCoins) * 100
  const bearishBreadth = (losers.length / totalCoins) * 100

  // Identify market narratives
  if (bullishBreadth > 70) {
    narratives.push({
      type: 'bullish',
      label: 'Broad-based rally',
      description: `${Math.round(bullishBreadth)}% of tracked assets are positive — strong risk-on sentiment.`,
    })
    confidenceScore += 15
  } else if (bullishBreadth > 50) {
    narratives.push({
      type: 'neutral',
      label: 'Mixed momentum',
      description: `Moderate bullish tilt with ${Math.round(bullishBreadth)}% gainers, but conviction is uneven.`,
    })
    confidenceScore += 5
  } else if (bearishBreadth > 60) {
    narratives.push({
      type: 'bearish',
      label: 'Risk-off rotation',
      description: `${Math.round(bearishBreadth)}% of assets are declining — defensive positioning.`,
    })
    confidenceScore += 10
  }

  // Volume analysis
  const highVolumeCoins = cryptoData.filter((c) => c.volume > avgVolume * 1.5)
  if (highVolumeCoins.length > totalCoins * 0.4) {
    narratives.push({
      type: 'volume',
      label: 'Elevated activity',
      description: `${highVolumeCoins.length} assets show above-average volume — institutional or retail interest rising.`,
    })
    confidenceScore += 10
  }

  // Momentum divergence
  if (strongGainers.length > 0 && strongLosers.length === 0) {
    narratives.push({
      type: 'momentum',
      label: 'Upside breakout',
      description: `${strongGainers.length} strong gainers without offsetting losers — potential continuation.`,
    })
    confidenceScore += 8
  } else if (strongLosers.length > strongGainers.length * 2) {
    narratives.push({
      type: 'momentum',
      label: 'Downside pressure',
      description: `Heavy losses outnumber gains 2:1 — capitulation or distribution phase likely.`,
    })
    confidenceScore += 8
  }

  // Risk scouter: Liquidity traps
  cryptoData.forEach((coin) => {
    if (coin.change24h > 20 && coin.volume < avgVolume * 0.5) {
      risks.push({
        type: 'liquidity-trap',
        severity: 'high',
        coin: coin.name,
        description: `${coin.name} surged ${coin.change24h.toFixed(1)}% on weak volume — potential pump or low liquidity trap.`,
      })
      confidenceScore -= 5
    }
  })

  // Risk scouter: Flash crash candidates
  cryptoData.forEach((coin) => {
    if (coin.change24h < -15 && coin.volume > avgVolume * 2) {
      risks.push({
        type: 'flash-crash',
        severity: 'medium',
        coin: coin.name,
        description: `${coin.name} dropped ${Math.abs(coin.change24h).toFixed(1)}% on heavy volume — forced liquidations or panic selling.`,
      })
      confidenceScore -= 3
    }
  })

  // Risk scouter: Stagnation
  const stagnant = cryptoData.filter((c) => Math.abs(c.change24h) < 1 && c.volume < avgVolume * 0.7)
  if (stagnant.length > totalCoins * 0.5) {
    risks.push({
      type: 'stagnation',
      severity: 'low',
      coin: 'Multiple',
      description: `${stagnant.length} assets show minimal movement and low volume — market indecision or accumulation.`,
    })
  }

  // Cap confidence score
  confidenceScore = Math.max(0, Math.min(100, confidenceScore))

  // Generate summary
  let summary = ''
  if (avgChange > 3) {
    summary = `Market shows strong bullish momentum (+${avgChange.toFixed(2)}% avg). `
  } else if (avgChange > 0) {
    summary = `Market trends mildly positive (+${avgChange.toFixed(2)}% avg). `
  } else if (avgChange > -3) {
    summary = `Market edges lower (${avgChange.toFixed(2)}% avg) with caution prevailing. `
  } else {
    summary = `Market faces heavy selling pressure (${avgChange.toFixed(2)}% avg). `
  }

  if (narratives.length > 0) {
    summary += narratives[0].description
  } else {
    summary += 'Awaiting clearer directional signals.'
  }

  if (risks.length > 0) {
    summary += ` Monitor ${risks.length} risk flag${risks.length > 1 ? 's' : ''}.`
  }

  return {
    summary,
    confidenceScore,
    narratives,
    risks,
    metrics: {
      avgChange,
      avgVolume,
      bullishBreadth,
      bearishBreadth,
      totalCoins,
    },
  }
}
