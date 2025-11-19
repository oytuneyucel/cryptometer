import React, { useState } from "react";
import { PortfolioHolding } from "../interfaces/crypto.interface";
import { formatPrice } from "../utils/text-formatter";

interface PortfolioTrackerProps {
  holdings: PortfolioHolding[];
  currentPrices: { [symbol: string]: number };
  onAddHolding: (symbol: string, quantity: number, avgBuyPrice: number) => void;
  onUpdateHolding: (symbol: string, quantity: number, avgBuyPrice: number) => void;
  onRemoveHolding: (symbol: string) => void;
  portfolioValue: number;
  totalProfitLoss: number;
}

const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  holdings,
  currentPrices,
  onAddHolding,
  onUpdateHolding,
  onRemoveHolding,
  portfolioValue,
  totalProfitLoss,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newAvgPrice, setNewAvgPrice] = useState("");

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseFloat(newQuantity);
    const avgPrice = parseFloat(newAvgPrice);
    
    if (newSymbol && !isNaN(quantity) && quantity > 0 && !isNaN(avgPrice) && avgPrice > 0) {
      onAddHolding(newSymbol.toUpperCase(), quantity, avgPrice);
      setNewSymbol("");
      setNewQuantity("");
      setNewAvgPrice("");
    }
  };

  const calculateProfitLoss = (holding: PortfolioHolding) => {
    const currentPrice = currentPrices[holding.symbol] || 0;
    const currentValue = holding.quantity * currentPrice;
    const costBasis = holding.quantity * holding.avgBuyPrice;
    return currentValue - costBasis;
  };

  const calculateProfitLossPercent = (holding: PortfolioHolding) => {
    const currentPrice = currentPrices[holding.symbol] || 0;
    if (holding.avgBuyPrice === 0) return 0;
    return ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
      >
        <span>💼</span>
        <span>Portfolio ({holdings.length} holdings)</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Portfolio Summary */}
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Portfolio Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatPrice(portfolioValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total P/L</p>
                <p
                  className={`text-2xl font-bold ${
                    totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalProfitLoss >= 0 ? "+" : ""}
                  {formatPrice(totalProfitLoss)}
                </p>
              </div>
            </div>
          </div>

          {/* Add New Holding Form */}
          <form onSubmit={handleAddHolding} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Symbol"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              step="0.00000001"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Avg Buy Price"
              value={newAvgPrice}
              onChange={(e) => setNewAvgPrice(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Add Holding
            </button>
          </form>

          {/* Holdings List */}
          {holdings.length === 0 ? (
            <p className="text-gray-500 text-sm">No holdings added</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left">Symbol</th>
                    <th className="px-3 py-2 text-right">Quantity</th>
                    <th className="px-3 py-2 text-right">Avg Buy</th>
                    <th className="px-3 py-2 text-right">Current</th>
                    <th className="px-3 py-2 text-right">Value</th>
                    <th className="px-3 py-2 text-right">P/L</th>
                    <th className="px-3 py-2 text-right">P/L %</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => {
                    const currentPrice = currentPrices[holding.symbol] || 0;
                    const currentValue = holding.quantity * currentPrice;
                    const profitLoss = calculateProfitLoss(holding);
                    const profitLossPercent = calculateProfitLossPercent(holding);

                    return (
                      <tr key={holding.symbol} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 font-semibold">{holding.symbol}</td>
                        <td className="px-3 py-2 text-right">{holding.quantity.toFixed(8)}</td>
                        <td className="px-3 py-2 text-right">{formatPrice(holding.avgBuyPrice)}</td>
                        <td className="px-3 py-2 text-right">{formatPrice(currentPrice)}</td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {formatPrice(currentValue)}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-semibold ${
                            profitLoss >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {profitLoss >= 0 ? "+" : ""}
                          {formatPrice(profitLoss)}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-semibold ${
                            profitLossPercent >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {profitLossPercent >= 0 ? "+" : ""}
                          {profitLossPercent.toFixed(2)}%
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => onRemoveHolding(holding.symbol)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioTracker;
