import { analyzeMarketConditions } from '../utils/analyzeMarketConditions';

// Enhanced AI engine that handles various types of crypto and general questions
export async function getAIResponse(query, { allCryptoData = [] } = {}) {
  const q = (query || '').toLowerCase().trim();
  const coins = allCryptoData || [];

  if (!q) {
    return 'Please ask me anything about cryptocurrency markets, trading, or specific coins!';
  }

  // Extract ticker mentions
  const tickers = coins
    .map((c) => c.symbol)
    .filter((sym) => q.includes(sym.toLowerCase()));

  // Categorize query types
  const isGreeting = /^(hi|hello|hey|greetings|good morning|good evening)/.test(q);
  const isWhat = /what is|what are|what's|define|explain|tell me about/.test(q);
  const isHow = /how to|how do|how does|how can/.test(q);
  const isWhy = /why is|why are|why does|why should/.test(q);
  const isWhen = /when to|when should|when is|best time/.test(q);
  const isShould = /should i|should we|is it good|worth it/.test(q);
  const isComparison = /vs|versus|compare|difference between|better than/.test(q);
  
  // Topic detection
  const isBlockchain = /blockchain|distributed ledger|decentralized/.test(q);
  const isMining = /mining|miners|hash rate|proof of work|pow/.test(q);
  const isStaking = /staking|stake|proof of stake|pos|validator/.test(q);
  const isWallet = /wallet|cold wallet|hot wallet|hardware wallet|metamask/.test(q);
  const isExchange = /exchange|cex|dex|binance|coinbase/.test(q);
  const isDefi = /defi|decentralized finance|yield farming|liquidity pool/.test(q);
  const isNft = /nft|non-fungible|collectible|opensea/.test(q);
  const isSmart = /smart contract|solidity|ethereum|dapp/.test(q);
  const isSecurity = /security|hack|scam|phishing|safe|secure/.test(q);
  const isTax = /tax|taxes|capital gains|irs|reporting/.test(q);
  const isStrategy = /strategy|strategies|trading|invest|portfolio/.test(q);
  const isAnalysis = /analysis|technical|fundamental|chart|indicator/.test(q);
  const isSentiment = /sentiment|bullish|bearish|neutral|market mood/.test(q);
  const isRisk = /risk|drawdown|volatility|exposure|diversification|danger/.test(q);
  const isPrediction = /predict|target|forecast|price|next|24h|tomorrow|week/.test(q);
  const isWhale = /whale|accumulation|exchange flow|large transfer/.test(q);
  const isSearch = /search|find|list|show|top|gainer|loser|trending|best|worst/.test(q);
  const isMarketCap = /market cap|marketcap|mcap|total value/.test(q);
  const isVolume = /volume|trading volume|liquidity/.test(q);
  const isBuyingSelling = /buy|sell|purchase|trade|order/.test(q);

  const market = coins.length > 0 ? analyzeMarketConditions(coins) : null;
  const lines = [];

  // Handle greetings
  if (isGreeting) {
    lines.push("👋 Hello! I'm your crypto AI assistant. I can help you with:");
    lines.push("• Market analysis and coin data");
    lines.push("• Trading strategies and risk assessment");
    lines.push("• Crypto concepts and education");
    lines.push("• Price predictions and sentiment");
    lines.push("Ask me anything about cryptocurrency!");
    return lines.join('\n');
  }

  // Handle ticker-specific questions
  if (tickers.length > 0) {
    const coin = coins.find(c => c.symbol.toLowerCase() === tickers[0].toLowerCase());
    if (coin) {
      lines.push(`📊 ${coin.name} (${coin.symbol.toUpperCase()}):`);
      lines.push(`💰 Price: $${coin.price?.toFixed(coin.price < 1 ? 4 : 2) || 'N/A'}`);
      lines.push(`📈 24h Change: ${coin.change24h > 0 ? '+' : ''}${coin.change24h?.toFixed(2) || 0}%`);
      lines.push(`📊 Volume: $${(coin.volume / 1e9).toFixed(2)}B`);
      lines.push(`🎯 Market Cap: $${(coin.marketCap / 1e9).toFixed(2)}B`);
      
      if (isPrediction) {
        const base = coin.price || 0;
        const trendMultiplier = coin.change24h > 0 ? 1.02 : 0.98;
        const rangeLow = (base * 0.97 * trendMultiplier).toFixed(base < 1 ? 4 : 2);
        const rangeHigh = (base * 1.03 * trendMultiplier).toFixed(base < 1 ? 4 : 2);
        lines.push(`🔮 24h Forecast: $${rangeLow} - $${rangeHigh}`);
      }
      return lines.join('\n');
    }
  }

  // Educational content
  if (isWhat && isBlockchain) {
    return "🔗 Blockchain is a distributed ledger technology that records transactions across multiple computers. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, creating an immutable chain. This decentralized structure ensures transparency, security, and eliminates the need for intermediaries.";
  }

  if (isWhat && isMining) {
    return "⛏️ Crypto mining is the process of validating transactions and adding them to the blockchain using computational power. Miners solve complex mathematical puzzles (Proof of Work) to create new blocks and are rewarded with newly minted coins and transaction fees. Popular mining coins include Bitcoin, Litecoin, and Monero.";
  }

  if (isWhat && isStaking) {
    return "🏦 Staking is the process of locking up cryptocurrency to support blockchain operations in Proof of Stake (PoS) networks. By staking, you help validate transactions and secure the network, earning rewards (typically 4-20% APY). Unlike mining, staking is energy-efficient and doesn't require specialized hardware.";
  }

  if (isWhat && isWallet) {
    return "👛 Crypto wallets store your private keys that give you access to your cryptocurrency. Types: \n• Hot Wallets: Connected to internet (MetaMask, Trust Wallet) - convenient but less secure\n• Cold Wallets: Offline storage (Ledger, Trezor) - most secure for large holdings\n• Paper Wallets: Physical printout of keys\nNever share your private keys or seed phrase!";
  }

  if (isWhat && isDefi) {
    return "💱 DeFi (Decentralized Finance) recreates traditional financial services without banks or intermediaries. Key features:\n• Lending/Borrowing platforms (Aave, Compound)\n• Decentralized Exchanges (Uniswap, PancakeSwap)\n• Yield Farming: Earning rewards by providing liquidity\n• Smart contracts automate everything\nHigher returns but also higher risk!";
  }

  if (isWhat && isNft) {
    return "🎨 NFTs (Non-Fungible Tokens) are unique digital assets on the blockchain representing ownership of items like art, music, videos, or virtual real estate. Unlike cryptocurrencies, each NFT is unique and can't be exchanged 1:1. Popular marketplaces: OpenSea, Rarible, Magic Eden.";
  }

  if (isHow && isBuyingSelling) {
    return "💳 How to buy crypto:\n1. Choose an exchange (Coinbase, Binance, Kraken)\n2. Create account & complete KYC verification\n3. Deposit funds (bank transfer, card, etc.)\n4. Place buy order (market or limit)\n5. Store in exchange or transfer to personal wallet\n\nFor selling: Reverse the process. Always consider fees and tax implications!";
  }

  if (isWhy && /volatile|volatility|price swing/.test(q)) {
    return "📊 Crypto is volatile because:\n• Small market size compared to traditional assets\n• 24/7 trading with no circuit breakers\n• Unregulated markets prone to manipulation\n• Speculative nature and FOMO/FUD cycles\n• News and social media heavily influence sentiment\n• Whale movements can cause rapid price swings\n\nVolatility creates both opportunities and risks!";
  }

  if (isWhen && /buy|invest/.test(q)) {
    return "⏰ Best time to buy:\n• Dollar-Cost Averaging (DCA): Invest fixed amount regularly regardless of price\n• Buy the dip: Purchase during market corrections\n• After FUD (Fear, Uncertainty, Doubt) subsides\n• When fundamentals are strong but price is down\n• NEVER invest more than you can afford to lose\n• Avoid FOMO buying at all-time highs\n\nTime in market > Timing the market!";
  }

  if (isShould) {
    return "🤔 Investment decision factors:\n• Only invest what you can afford to lose\n• Research thoroughly (whitepaper, team, use case)\n• Diversify your portfolio\n• Consider risk tolerance and timeline\n• Understand the technology and market\n• Be aware of scams and red flags\n\nI can't give financial advice, but always DYOR (Do Your Own Research)!";
  }

  if (isSecurity) {
    return "🔒 Crypto security best practices:\n• Use hardware wallets for large holdings\n• Enable 2FA on all accounts\n• Never share private keys or seed phrases\n• Beware of phishing websites and emails\n• Verify smart contracts before interacting\n• Use unique strong passwords\n• Keep software updated\n• Be skeptical of 'guaranteed returns'\n• Double-check wallet addresses before sending";
  }

  if (isTax) {
    return "💰 Crypto tax basics:\n• Most countries treat crypto as property\n• Taxable events: selling, trading, spending crypto\n• Capital gains/losses calculated: Sale Price - Purchase Price\n• Keep detailed records of all transactions\n• Mining/staking rewards are taxable income\n• Holding isn't taxable (only when you dispose)\n• Consult a tax professional for your jurisdiction";
  }

  if (isStrategy) {
    return "📈 Popular crypto strategies:\n• HODLing: Long-term hold through volatility\n• DCA: Regular fixed investments\n• Swing Trading: Trade medium-term trends\n• Day Trading: Short-term active trading (high risk)\n• Staking/Yield Farming: Passive income\n• Diversification: Don't put all eggs in one basket\n• Set stop-losses to limit downside\n• Take profits gradually on the way up";
  }

  if (isAnalysis) {
    return "📊 Crypto analysis types:\n• Technical Analysis: Charts, patterns, indicators (RSI, MACD, moving averages)\n• Fundamental Analysis: Technology, team, adoption, tokenomics\n• On-chain Analysis: Wallet activity, exchange flows, network metrics\n• Sentiment Analysis: Social media, news, fear/greed index\n\nCombine multiple approaches for better decisions!";
  }

  // Market-based responses
  if (market && isSentiment) {
    lines.push(`📊 Overall Market Sentiment: ${market.sentiment.toUpperCase()}`);
    lines.push(`📰 Key Narrative: ${market.narrative}`);
    lines.push(`💡 Recommendation: ${market.recommendation}`);
    return lines.join('\n');
  }

  if (market && isRisk) {
    lines.push(`⚠️ Current Risk Factors:`);
    market.risks.forEach(risk => lines.push(`• ${risk}`));
    lines.push(`\n💡 Always diversify and use stop-losses to manage risk.`);
    return lines.join('\n');
  }

  if (market && isWhale) {
    lines.push('🐋 Whale Activity Monitoring:');
    lines.push('• Large transfers can signal accumulation or distribution');
    lines.push('• Exchange inflows often precede selling pressure');
    lines.push('• Exchange outflows suggest long-term holding');
    lines.push('• Sudden volume spikes indicate whale movements');
    lines.push('⚠️ High volatility risk during whale activity!');
    return lines.join('\n');
  }

  if (market && isSearch) {
    const sorted = [...coins].sort((a, b) => (b.change24h || 0) - (a.change24h || 0));
    const top5 = sorted.slice(0, 5);
    const bottom5 = sorted.slice(-5).reverse();
    
    lines.push('🚀 Top 5 Gainers:');
    top5.forEach(c => lines.push(`  ${c.name} (${c.symbol.toUpperCase()}): +${c.change24h?.toFixed(2)}%`));
    lines.push('\n📉 Top 5 Losers:');
    bottom5.forEach(c => lines.push(`  ${c.name} (${c.symbol.toUpperCase()}): ${c.change24h?.toFixed(2)}%`));
    return lines.join('\n');
  }

  if (market && isPrediction) {
    lines.push('🔮 24h Market Predictions:');
    coins.slice(0, 5).forEach((c) => {
      const base = c.price || 0;
      const trend = c.change24h > 5 ? 1.02 : c.change24h < -5 ? 0.98 : 1;
      const rangeLow = (base * 0.97 * trend).toFixed(base < 1 ? 4 : 2);
      const rangeHigh = (base * 1.03 * trend).toFixed(base < 1 ? 4 : 2);
      const conf = Math.round((Math.abs(c.change24h) / 20 + 0.6) * 100);
      lines.push(`${c.name}: $${rangeLow} - $${rangeHigh} (${conf}% confidence)`);
    });
    lines.push('\n⚠️ Predictions are estimates based on current trends, not financial advice!');
    return lines.join('\n');
  }

  // Default comprehensive response
  lines.push("💡 I'm your crypto AI assistant! I can help with:");
  lines.push("\n📚 Education:");
  lines.push("• What is blockchain/mining/staking/DeFi/NFTs?");
  lines.push("• How to buy/sell crypto safely?");
  lines.push("• Security & wallet best practices");
  lines.push("\n📊 Market Analysis:");
  lines.push("• Current market sentiment & risks");
  lines.push("• Top gainers and losers");
  lines.push("• Price predictions & forecasts");
  lines.push("• Specific coin analysis (mention: btc, eth, etc.)");
  lines.push("\n💼 Trading & Strategy:");
  lines.push("• Investment strategies");
  lines.push("• Risk management");
  lines.push("• Tax implications");
  lines.push("\nAsk me anything specific!");
  
  return lines.join('\n');
}
