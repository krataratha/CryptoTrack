import { analyzeMarketConditions } from '../utils/analyzeMarketConditions';

// Simple heuristic AI engine that tailors responses to user queries.
// In production, swap this with an API-based model client.
export async function getAIResponse(query, { allCryptoData = [] } = {}) {
  const q = (query || '').toLowerCase();
  const coins = allCryptoData || [];

  // Extract any ticker mentions
  const tickers = coins
    .map((c) => c.symbol)
    .filter((sym) => q.includes(sym));

  const isSentiment = /sentiment|bullish|bearish|neutral/.test(q);
  const isRisk = /risk|drawdown|volatility|exposure|diversification/.test(q);
  const isPrediction = /predict|target|price|next|24h|tomorrow|week/.test(q);
  const isWhale = /whale|accumulation|exchange|transfer/.test(q);
  const isSearch = /search|find|list|top|gainer|loser|trending/.test(q);

  const market = analyzeMarketConditions(coins);

  const lines = [];
  if (tickers.length) {
    lines.push(`Detected tickers: ${tickers.map((t) => t.toUpperCase()).join(', ')}`);
  }

  if (isSentiment) {
    lines.push(`Overall sentiment: ${market.sentiment.toUpperCase()}. Key narrative: ${market.narrative}.`);
  }

  if (isRisk) {
    lines.push(`Risk factors: ${market.risks.join(', ')}.`);
  }

  if (isWhale) {
    lines.push('Whale signals: monitoring exchange flows and large transfers. Volatility risk during spikes.');
  }

  if (isSearch) {
    const sorted = [...coins].sort((a, b) => (b.change24h || 0) - (a.change24h || 0));
    const top = sorted.slice(0, 5).map((c) => `${c.name} (${c.symbol.toUpperCase()}) ${c.change24h?.toFixed(2)}%`);
    lines.push(`Top movers now: ${top.join(' • ')}`);
  }

  if (isPrediction) {
    coins.forEach((c) => {
      const base = c.price || 0;
      const conf = Math.round(((c.aiPrediction || 0.5) * 0.4 + 0.6) * 100);
      const rangeLow = (base * 0.98).toFixed(base < 10 ? 4 : 2);
      const rangeHigh = (base * 1.04).toFixed(base < 10 ? 4 : 2);
      lines.push(`${c.name}: 24h range estimate ${rangeLow} - ${rangeHigh} (confidence ${conf}%)`);
    });
  }

  if (!lines.length) {
    lines.push('I can help with sentiment, risk, predictions, and top movers. Mention coin symbols (e.g., btc, eth) for tailored insights.');
  }

  return lines.join('\n');
}
