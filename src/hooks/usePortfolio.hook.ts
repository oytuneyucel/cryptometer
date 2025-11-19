import { useCallback } from "react";
import { PortfolioHolding } from "../interfaces/crypto.interface";
import useLocalStorage from "./useLocalStorage.hook";

/**
 * Hook to manage portfolio holdings
 */
export const usePortfolio = () => {
  const [holdings, setHoldings] = useLocalStorage<PortfolioHolding[]>("portfolio_holdings", []);

  const addHolding = useCallback(
    (symbol: string, quantity: number, avgBuyPrice: number) => {
      const existingIndex = holdings.findIndex((h) => h.symbol === symbol);
      
      if (existingIndex >= 0) {
        // Update existing holding
        setHoldings((prev) =>
          prev.map((h, i) =>
            i === existingIndex
              ? {
                  symbol,
                  quantity: h.quantity + quantity,
                  avgBuyPrice: ((h.avgBuyPrice * h.quantity) + (avgBuyPrice * quantity)) / (h.quantity + quantity),
                }
              : h
          )
        );
      } else {
        // Add new holding
        setHoldings((prev) => [...prev, { symbol, quantity, avgBuyPrice }]);
      }
    },
    [holdings, setHoldings]
  );

  const updateHolding = useCallback(
    (symbol: string, quantity: number, avgBuyPrice: number) => {
      setHoldings((prev) =>
        prev.map((h) =>
          h.symbol === symbol ? { symbol, quantity, avgBuyPrice } : h
        )
      );
    },
    [setHoldings]
  );

  const removeHolding = useCallback(
    (symbol: string) => {
      setHoldings((prev) => prev.filter((h) => h.symbol !== symbol));
    },
    [setHoldings]
  );

  const getHolding = useCallback(
    (symbol: string) => {
      return holdings.find((h) => h.symbol === symbol);
    },
    [holdings]
  );

  const calculatePortfolioValue = useCallback(
    (currentPrices: { [symbol: string]: number }) => {
      return holdings.reduce((total, holding) => {
        const currentPrice = currentPrices[holding.symbol] || 0;
        return total + holding.quantity * currentPrice;
      }, 0);
    },
    [holdings]
  );

  const calculateTotalProfitLoss = useCallback(
    (currentPrices: { [symbol: string]: number }) => {
      return holdings.reduce((total, holding) => {
        const currentPrice = currentPrices[holding.symbol] || 0;
        const currentValue = holding.quantity * currentPrice;
        const costBasis = holding.quantity * holding.avgBuyPrice;
        return total + (currentValue - costBasis);
      }, 0);
    },
    [holdings]
  );

  return {
    holdings,
    addHolding,
    updateHolding,
    removeHolding,
    getHolding,
    calculatePortfolioValue,
    calculateTotalProfitLoss,
  };
};
