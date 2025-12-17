/**
 * Analyzes portfolio health based on holdings and market data
 * @param {Array} holdings - Array of { symbol, amount, category } objects
 * @param {Array} marketData - Array of crypto market data with volatility
 * @returns {Object} { grade, score, suggestions, metrics }
 */
export function portfolioHealthCheck(holdings, marketData) {
  if (!holdings || holdings.length === 0) {
    return {
      grade: 'N/A',
      score: 0,
      suggestions: ['Add holdings to analyze your portfolio health.'],
      metrics: { diversification: 0, volatilityScore: 0, totalValue: 0 },
    }
  }

  // Build market lookup
  const marketLookup = marketData.reduce((acc, coin) => {
    acc[coin.symbol.toLowerCase()] = coin
    return acc
  }, {})

  // Calculate portfolio metrics
  let totalValue = 0
  const categoryDistribution = {}
  const volatilityScores = []

  holdings.forEach((holding) => {
    const market = marketLookup[holding.symbol.toLowerCase()]
    if (!market) return

    const value = holding.amount * market.price
    totalValue += value

    // Track category distribution
    const category = holding.category || 'other'
    categoryDistribution[category] = (categoryDistribution[category] || 0) + value

    // Track volatility (use absolute 24h change as proxy)
    volatilityScores.push({
      symbol: holding.symbol,
      volatility: Math.abs(market.change24h),
      value,
    })
  })

  // Calculate percentages
  const categoryPercentages = {}
  Object.keys(categoryDistribution).forEach((cat) => {
    categoryPercentages[cat] = (categoryDistribution[cat] / totalValue) * 100
  })

  // Diversification score (0-100, higher is better)
  const numAssets = holdings.length
  const diversificationScore = Math.min(100, numAssets * 15) // Cap at 100

  // Volatility score (0-100, higher volatility = lower score)
  const avgVolatility = volatilityScores.reduce((sum, v) => sum + v.volatility, 0) / volatilityScores.length
  const volatilityScore = Math.max(0, 100 - avgVolatility * 3)

  // Category risk score
  const memecoinPct = categoryPercentages.memecoin || 0
  const stablePct = categoryPercentages.stablecoin || 0
  const bluechipPct = (categoryPercentages.bluechip || 0) + (categoryPercentages['layer-1'] || 0)

  let categoryRiskScore = 100
  if (memecoinPct > 50) categoryRiskScore -= 40
  else if (memecoinPct > 30) categoryRiskScore -= 25
  else if (memecoinPct > 10) categoryRiskScore -= 10

  if (stablePct > 80) categoryRiskScore -= 30 // Too conservative
  if (bluechipPct < 20) categoryRiskScore -= 20 // Not enough stability

  // Overall score
  const overallScore = Math.round(
    diversificationScore * 0.3 + volatilityScore * 0.4 + categoryRiskScore * 0.3
  )

  // Determine grade
  let grade
  if (overallScore >= 90) grade = 'A'
  else if (overallScore >= 80) grade = 'B'
  else if (overallScore >= 70) grade = 'C'
  else if (overallScore >= 60) grade = 'D'
  else grade = 'F'

  // Generate suggestions
  const suggestions = []

  if (memecoinPct > 80) {
    suggestions.push(
      `Your portfolio is ${Math.round(memecoinPct)}% memecoins. Consider rebalancing to BTC/ETH for stability.`
    )
  } else if (memecoinPct > 50) {
    suggestions.push(
      `Memecoins represent ${Math.round(memecoinPct)}% of your portfolio. High volatility risk detected.`
    )
  } else if (memecoinPct > 30) {
    suggestions.push(
      `${Math.round(memecoinPct)}% memecoin exposure may be excessive. Monitor closely.`
    )
  }

  if (numAssets < 3) {
    suggestions.push(`Low diversification detected (${numAssets} asset${numAssets > 1 ? 's' : ''}). Consider adding 2-3 more positions.`)
  } else if (numAssets > 15) {
    suggestions.push(`High diversification (${numAssets} assets) may dilute gains. Consider consolidation.`)
  }

  if (avgVolatility > 15) {
    suggestions.push(`Average volatility is ${avgVolatility.toFixed(1)}%. High-risk portfolio — ensure proper risk management.`)
  } else if (avgVolatility < 3 && stablePct < 50) {
    suggestions.push(`Low volatility detected. Consider exposure to growth assets for higher returns.`)
  }

  if (bluechipPct < 20 && memecoinPct < 30) {
    suggestions.push(`Add blue-chip exposure (BTC, ETH) for a stronger foundation.`)
  }

  if (stablePct > 70) {
    suggestions.push(`${Math.round(stablePct)}% in stablecoins is conservative. Consider allocating to appreciating assets.`)
  }

  // Ensure we always have suggestions
  if (suggestions.length === 0) {
    if (grade === 'A') {
      suggestions.push('Portfolio is well-balanced. Continue monitoring market conditions.')
    } else {
      suggestions.push('Review asset allocation and adjust based on risk tolerance.')
    }
  }

  // Limit to 3 suggestions
  const topSuggestions = suggestions.slice(0, 3)

  return {
    grade,
    score: overallScore,
    suggestions: topSuggestions,
    metrics: {
      diversification: diversificationScore,
      volatilityScore,
      categoryRiskScore,
      totalValue,
      avgVolatility,
      categoryPercentages,
      numAssets,
    },
  }
}
