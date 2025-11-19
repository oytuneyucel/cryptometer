import { useEffect, useState } from "react";
import axios from "axios";

import { CryptoData } from "../interfaces/crypto.interface";
import { generateSymbolsQuery } from "../utils/text-formatter";

const useFetchHistoricData = (symbols: string[]) => {
  const [historicData, setHistoricData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${generateSymbolsQuery(
            symbols
          )}`
        );

        setHistoricData(
          data.map((d: any) => {
            return {
              symbol: d.symbol,
              open: parseFloat(d.openPrice),
              high: parseFloat(d.highPrice),
              low: parseFloat(d.lowPrice),
              close: parseFloat(d.lastPrice),
              lastPrice: parseFloat(d.lastPrice),
              prevHigh: [parseFloat(d.highPrice)],
              prevLow: [parseFloat(d.lowPrice)],
              priceChange: 0,
              priceChangePercent: parseFloat(d.priceChangePercent),
              volume: parseFloat(d.volume),
              quoteVolume: parseFloat(d.quoteVolume),
            } as CryptoData;
          })
        );

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch initial data. Please try again later.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [symbols]);

  return { historicData, loading, error };
};

export default useFetchHistoricData;
