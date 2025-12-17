export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  CAD: '$',
  AUD: '$',
};

export function formatCurrency(value, currency = 'USD', maximumFractionDigits = 2) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${Number(value).toFixed(maximumFractionDigits)}`;
  }
}

export function formatCompactCurrency(value, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] || '$'
    if (value >= 1e12) return `${symbol}${(value / 1e12).toFixed(1)}T`
    if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(1)}M`
    return `${symbol}${Number(value).toFixed(1)}`
  }
}
