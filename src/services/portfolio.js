import { getUserTransactions } from './transactions';

/**
 * Calculate user's portfolio balance for each coin
 * @param {string} username - Username
 * @returns {Object} { coinSymbol: balance }
 */
export function calculatePortfolioBalance(username) {
  if (!username) return {};

  const transactions = getUserTransactions(username);
  const balances = {};

  transactions.forEach((tx) => {
    const symbol = tx.symbol.toUpperCase();
    if (!balances[symbol]) {
      balances[symbol] = 0;
    }

    if (tx.type === 'buy') {
      balances[symbol] += tx.quantity;
    } else if (tx.type === 'sell') {
      balances[symbol] -= tx.quantity;
    }
  });

  // Filter out zero balances
  return Object.fromEntries(Object.entries(balances).filter(([, balance]) => balance > 0));
}

/**
 * Get available balance for a specific coin
 * @param {string} username - Username
 * @param {string} coinSymbol - Coin symbol (e.g., 'BTC')
 * @returns {number} Available balance (0 if not held)
 */
export function getCoinBalance(username, coinSymbol) {
  const balances = calculatePortfolioBalance(username);
  return balances[coinSymbol.toUpperCase()] || 0;
}

/**
 * Check if user can sell a certain quantity
 * @param {string} username - Username
 * @param {string} coinSymbol - Coin symbol
 * @param {number} quantity - Quantity to sell
 * @returns {Object} { canSell: boolean, available: number, deficit: number }
 */
export function validateSellOrder(username, coinSymbol, quantity) {
  const available = getCoinBalance(username, coinSymbol);
  const canSell = available >= quantity;
  const deficit = Math.max(0, quantity - available);

  return { canSell, available, deficit };
}

/**
 * Get total portfolio value in USD
 * @param {string} username - Username
 * @param {Array} cryptoData - Array of coin data with prices
 * @returns {number} Total portfolio value in USD
 */
export function getTotalPortfolioValue(username, cryptoData = []) {
  const balances = calculatePortfolioBalance(username);
  let total = 0;

  Object.entries(balances).forEach(([symbol, quantity]) => {
    const coinData = cryptoData.find((c) => c.symbol.toUpperCase() === symbol);
    if (coinData) {
      total += quantity * (coinData.price || 0);
    }
  });

  return total;
}

/**
 * Get detailed portfolio with current values
 * @param {string} username - Username
 * @param {Array} cryptoData - Array of coin data with prices
 * @returns {Array} Array of { symbol, name, quantity, currentPrice, value }
 */
export function getDetailedPortfolio(username, cryptoData = []) {
  const balances = calculatePortfolioBalance(username);
  const portfolio = [];

  Object.entries(balances).forEach(([symbol, quantity]) => {
    const coinData = cryptoData.find((c) => c.symbol.toUpperCase() === symbol);
    if (coinData) {
      portfolio.push({
        symbol,
        name: coinData.name,
        quantity,
        currentPrice: coinData.price || 0,
        value: quantity * (coinData.price || 0),
      });
    }
  });

  return portfolio;
}
