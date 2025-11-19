export interface CryptoData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  lastPrice: number;
  prevHigh: number[];
  prevLow: number[];
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  quoteVolume: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  price: number;
  enabled: boolean;
  triggered: boolean;
  createdAt: Date;
}

export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
}
