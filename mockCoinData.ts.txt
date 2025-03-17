export interface CoinData {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    image: string;
  }
  
  export const mockCoinData: CoinData[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 51432.67,
      change24h: 2.34,
      marketCap: 986543210000,
      volume24h: 28765432100,
      image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 2798.45,
      change24h: 1.56,
      marketCap: 324567890000,
      volume24h: 15678901234,
      image: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.532,
      change24h: -2.31,
      marketCap: 18765432100,
      volume24h: 1234567890,
      image: "https://cryptologos.cc/logos/cardano-ada-logo.png"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 125.78,
      change24h: 5.67,
      marketCap: 54321098765,
      volume24h: 4567890123,
      image: "https://cryptologos.cc/logos/solana-sol-logo.png"
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.543,
      change24h: -0.87,
      marketCap: 25678901234,
      volume24h: 1987654321,
      image: "https://cryptologos.cc/logos/xrp-xrp-logo.png"
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "BNB",
      price: 324.56,
      change24h: 3.21,
      marketCap: 43210987654,
      volume24h: 3456789012,
      image: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 6.78,
      change24h: -1.23,
      marketCap: 9876543210,
      volume24h: 876543210,
      image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png"
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.0823,
      change24h: 10.45,
      marketCap: 11223344556,
      volume24h: 1122334455,
      image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png"
    },
    {
      id: "avalanche",
      name: "Avalanche",
      symbol: "AVAX",
      price: 34.56,
      change24h: 4.32,
      marketCap: 12345678901,
      volume24h: 987654321,
      image: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      price: 14.32,
      change24h: 2.11,
      marketCap: 7654321098,
      volume24h: 654321098,
      image: "https://cryptologos.cc/logos/chainlink-link-logo.png"
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      price: 0.764,
      change24h: 3.45,
      marketCap: 6789012345,
      volume24h: 567890123,
      image: "https://cryptologos.cc/logos/polygon-matic-logo.png"
    },
    {
      id: "uniswap",
      name: "Uniswap",
      symbol: "UNI",
      price: 6.78,
      change24h: -2.34,
      marketCap: 5432109876,
      volume24h: 432109876,
      image: "https://cryptologos.cc/logos/uniswap-uni-logo.png"
    }
  ];