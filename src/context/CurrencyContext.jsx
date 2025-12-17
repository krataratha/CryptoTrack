import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CurrencyContext = createContext({
  currency: 'USD',
  rates: { USD: 1 },
  setCurrency: () => {},
  convert: (value) => value,
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.80, JPY: 145.0, INR: 90.43, CAD: 1.35, AUD: 1.50 });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch('https://api.exchangerate.host/latest?base=USD');
        const data = await res.json();
        if (data && data.rates) {
          setRates({ USD: 1, ...data.rates });
          setLastUpdated(new Date().toISOString());
        }
      } catch (e) {
        console.warn('Failed to fetch exchange rates, using fallback');
      }
    }
    fetchRates();
  }, []);

  const convert = (valueUSD, targetCurrency) => {
    const cur = targetCurrency || currency;
    const rate = rates[cur] || 1;
    return valueUSD * rate;
  };

  const value = useMemo(() => ({ currency, rates, lastUpdated, setCurrency, convert }), [currency, rates, lastUpdated]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
