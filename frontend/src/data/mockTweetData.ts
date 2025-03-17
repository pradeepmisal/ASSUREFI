
interface Tweet {
  date: string;
  id: string;
  content: string;
  username: string;
  language: string;
  cleaned_content: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  sentiment_score: number;
  coins: string;
  topics: string;
  urgent: boolean;
}

export const mockTweetData: Tweet[] = [
  {
    "date": "Mar 15, 2025 · 6:43 PM UTC",
    "id": "1900981248593412204#m",
    "content": "🚨 بوت عملة جديد | بمهمة واحدة فقط...!   ◪️ المهمة هي :10 إحالات وتحصل على الإيردروب  ◪️إنضم الآن وشارك الرابط مع أصدقائك ومبروك عليك 💰 ثما انتظر فقط التوزيع بعد إنتهاء المهلة   ◪️ تبقى 11 يوم فقط  https://t.me/treasury_official_bot/app?startapp=5214564106 #BTC #Bitcoin #اليمن #صنعاء #الولايات_المتحدة #NFTs",
    "username": "@g4_p6",
    "language": "en",
    "cleaned_content": "10 11 https t me treasury official bot app startapp 5214564106 BTC Bitcoin NFTs",
    "sentiment": "Positive",
    "sentiment_score": 0.2023,
    "coins": "Bitcoin, Bitcoin Cash",
    "topics": "Market News",
    "urgent": false
  },
  {
    "date": "Mar 15, 2025 · 6:46 PM UTC",
    "id": "1900982030269075635#m",
    "content": "🚨 BREAKING NEWS: BITCOIN FEAR & GREED INDEX INCREASES TO 46, NEUTRAL  🚨 BREAKING NEWS: Heerka Cabsida BITcoin & Damaca Hungurigu waxa ay  Waxay maraysaa 46, dhexdhexaad ah    #SFC",
    "username": "@Mohafahiye",
    "language": "en",
    "cleaned_content": "BREAKING NEWS BITCOIN FEAR GREED INDEX INCREASES TO 46 NEUTRAL BREAKING NEWS Heerka Cabsida BITcoin Damaca Hungurigu waxa ay Waxay maraysaa 46 dhexdhexaad ah SFC",
    "sentiment": "Negative",
    "sentiment_score": -0.8109,
    "coins": "Bitcoin, Bitcoin Cash",
    "topics": "Market News",
    "urgent": true
  },
  {
    "date": "Feb 7, 2025 · 12:26 PM UTC",
    "id": "1887840463157448704#m",
    "content": "🚨 Big news from 🇨🇿! The Czech Republic now exempts Bitcoin from capital gains tax if held for 3+ years. A major win for long-term investors & regulatory clarity! Will other EU nations follow? 🤔 #Bitcoin #Crypto #CryptoTax #Blockchain #MiCA #CzechRepublic https://crispybull.com/czech-republic-embraces-bitcoin-new-law-exempts-long-term-holders-from-capital-gains-tax/",
    "username": "@CrispyBull",
    "language": "en",
    "cleaned_content": "Big news from The Czech Republic now exempts Bitcoin from capital gains tax if held for 3 years A major win for long term investors regulatory clarity Will other EU nations follow Bitcoin Crypto CryptoTax Blockchain MiCA CzechRepublic https crispybull com czech republic embraces bitcoin new law exempts long term holders from capital gains tax",
    "sentiment": "Positive",
    "sentiment_score": 0.946,
    "coins": "Bitcoin, Chainlink, Bitcoin Cash",
    "topics": "Market News",
    "urgent": false
  },
  {
    "date": "Mar 15, 2025 · 8:00 AM UTC",
    "id": "1900819259518853555#m",
    "content": "🚨 Big News! 🚨  👀 We've not only updated the list of top 20 DReps with the largest voting power  🔥 Plus, you can now dig deeper with the \"Show More\" button in every section, unlocking 10 extra results per click! 🤯  👉 Dive in & explore: https://tempo.vote/dreps #Cardano #Governance #DRep #Tempo #CardanoCommunity",
    "username": "@tempo_vote",
    "language": "en",
    "cleaned_content": "Big News We ve not only updated the list of top 20 DReps with the largest voting power Plus you can now dig deeper with the Show More button in every section unlocking 10 extra results per click Dive in explore https tempo vote dreps Cardano Governance DRep Tempo CardanoCommunity",
    "sentiment": "Positive",
    "sentiment_score": 0.2023,
    "coins": "Cardano, Uniswap, Toncoin",
    "topics": "Exchange Listing, Regulation",
    "urgent": false
  },
  {
    "date": "Mar 14, 2025 · 3:15 PM UTC",
    "id": "1900123456789012345#m",
    "content": "ETH just broke $5000! This is huge for the entire ecosystem. Expect altcoins to follow. #Ethereum #DeFi #Crypto",
    "username": "@crypto_analyst",
    "language": "en",
    "cleaned_content": "ETH just broke 5000 This is huge for the entire ecosystem Expect altcoins to follow Ethereum DeFi Crypto",
    "sentiment": "Positive",
    "sentiment_score": 0.887,
    "coins": "Ethereum, Bitcoin",
    "topics": "Market News",
    "urgent": false
  },
  {
    "date": "Mar 14, 2025 · 5:22 PM UTC",
    "id": "1900234567890123456#m",
    "content": "🚨 ALERT: Major exchange hack reported. Withdrawals suspended on CryptoExchange. Check your funds NOW! #CryptoSecurity #Hack",
    "username": "@security_alert",
    "language": "en",
    "cleaned_content": "ALERT Major exchange hack reported Withdrawals suspended on CryptoExchange Check your funds NOW CryptoSecurity Hack",
    "sentiment": "Negative",
    "sentiment_score": -0.954,
    "coins": "Bitcoin, Ethereum",
    "topics": "Security, Exchange Listing",
    "urgent": true
  },
  {
    "date": "Mar 15, 2025 · 9:05 AM UTC",
    "id": "1900345678901234567#m",
    "content": "New regulations coming from the SEC could impact how DeFi protocols operate. Time to adapt or face consequences. #Regulation #DeFi #Crypto",
    "username": "@defi_lawyer",
    "language": "en",
    "cleaned_content": "New regulations coming from the SEC could impact how DeFi protocols operate Time to adapt or face consequences Regulation DeFi Crypto",
    "sentiment": "Neutral",
    "sentiment_score": -0.102,
    "coins": "Ethereum, Cardano, Solana",
    "topics": "Regulation",
    "urgent": false
  },
  {
    "date": "Mar 15, 2025 · 11:30 AM UTC",
    "id": "1900456789012345678#m",
    "content": "Just bought more $SOL at this price. The ecosystem is growing fast and the technology is superior. Long term bullish! #Solana #Crypto #Investment",
    "username": "@crypto_investor",
    "language": "en", 
    "cleaned_content": "Just bought more SOL at this price The ecosystem is growing fast and the technology is superior Long term bullish Solana Crypto Investment",
    "sentiment": "Positive",
    "sentiment_score": 0.765,
    "coins": "Solana",
    "topics": "Market News",
    "urgent": false
  },
  {
    "date": "Mar 14, 2025 · 7:45 PM UTC",
    "id": "1900567890123456789#m",
    "content": "🚨 WARNING: New rug pull detected in the BSC ecosystem. Project 'MoonLambo' has disappeared with over $2M in investor funds. Be careful out there! #BSC #RugPull #CryptoScam",
    "username": "@scam_detector",
    "language": "en",
    "cleaned_content": "WARNING New rug pull detected in the BSC ecosystem Project MoonLambo has disappeared with over 2M in investor funds Be careful out there BSC RugPull CryptoScam",
    "sentiment": "Negative",
    "sentiment_score": -0.879,
    "coins": "Binance Coin",
    "topics": "Security, Scam Alert",
    "urgent": true
  },
  {
    "date": "Mar 13, 2025 · 2:10 PM UTC",
    "id": "1900678901234567890#m",
    "content": "Chainlink just announced major partnership with a FAANG company. This is the real adoption we've been waiting for! #Chainlink #Adoption #Crypto",
    "username": "@link_marine",
    "language": "en",
    "cleaned_content": "Chainlink just announced major partnership with a FAANG company This is the real adoption we ve been waiting for Chainlink Adoption Crypto",
    "sentiment": "Positive",
    "sentiment_score": 0.893,
    "coins": "Chainlink",
    "topics": "Partnership, Market News",
    "urgent": false
  },
  {
    "date": "Mar 15, 2025 · 1:20 PM UTC",
    "id": "1900789012345678901#m",
    "content": "Market seems to be consolidating after the recent pump. What's your strategy - buy, sell or hold? #Crypto #Trading #BTC",
    "username": "@market_watcher",
    "language": "en",
    "cleaned_content": "Market seems to be consolidating after the recent pump What s your strategy buy sell or hold Crypto Trading BTC",
    "sentiment": "Neutral",
    "sentiment_score": 0.032,
    "coins": "Bitcoin",
    "topics": "Market News, Trading",
    "urgent": false
  },
  {
    "date": "Mar 14, 2025 · 10:15 AM UTC",
    "id": "1900890123456789012#m",
    "content": "BREAKING: Cardano successfully implements new hard fork. Network performance improved by 40%! This is massive for $ADA #Cardano #Blockchain #Crypto",
    "username": "@cardano_update",
    "language": "en",
    "cleaned_content": "BREAKING Cardano successfully implements new hard fork Network performance improved by 40 This is massive for ADA Cardano Blockchain Crypto",
    "sentiment": "Positive",
    "sentiment_score": 0.912,
    "coins": "Cardano",
    "topics": "Technology Update",
    "urgent": false
  },
  {
    "date": "Mar 13, 2025 · 4:35 PM UTC",
    "id": "1900901234567890123#m",
    "content": "🚨 SCAM ALERT: Fake Ethereum 2.0 staking sites stealing private keys. Double check URLs before connecting your wallet! #Ethereum #SecurityAlert #Crypto",
    "username": "@eth_security",
    "language": "en",
    "cleaned_content": "SCAM ALERT Fake Ethereum 2 0 staking sites stealing private keys Double check URLs before connecting your wallet Ethereum SecurityAlert Crypto",
    "sentiment": "Negative",
    "sentiment_score": -0.843,
    "coins": "Ethereum",
    "topics": "Security, Scam Alert",
    "urgent": true
  },
  {
    "date": "Mar 15, 2025 · 9:50 AM UTC",
    "id": "1901012345678901234#m",
    "content": "XRP lawsuit with SEC might be settled soon according to inside sources. This could change everything for Ripple! #XRP #Ripple #SECLawsuit",
    "username": "@xrp_lawyer",
    "language": "en",
    "cleaned_content": "XRP lawsuit with SEC might be settled soon according to inside sources This could change everything for Ripple XRP Ripple SECLawsuit",
    "sentiment": "Positive",
    "sentiment_score": 0.587,
    "coins": "XRP",
    "topics": "Regulation, Legal",
    "urgent": false
  },
  {
    "date": "Mar 14, 2025 · 8:05 PM UTC",
    "id": "1901123456789012345#m",
    "content": "Polkadot ecosystem continues to grow with 5 new parachains launching this month. The multichain future is here! #Polkadot #Parachains #Crypto",
    "username": "@dot_watcher",
    "language": "en",
    "cleaned_content": "Polkadot ecosystem continues to grow with 5 new parachains launching this month The multichain future is here Polkadot Parachains Crypto",
    "sentiment": "Positive",
    "sentiment_score": 0.762,
    "coins": "Polkadot",
    "topics": "Technology Update, Ecosystem",
    "urgent": false
  }
];
