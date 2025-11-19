import React, { useState } from "react";
import { PriceAlert } from "../interfaces/crypto.interface";

interface PriceAlertsProps {
  alerts: PriceAlert[];
  onAddAlert: (symbol: string, type: "above" | "below", price: number) => void;
  onRemoveAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  onResetAlert: (id: string) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({
  alerts,
  onAddAlert,
  onRemoveAlert,
  onToggleAlert,
  onResetAlert,
  notificationPermission,
  onRequestPermission,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAlertSymbol, setNewAlertSymbol] = useState("");
  const [newAlertType, setNewAlertType] = useState<"above" | "below">("above");
  const [newAlertPrice, setNewAlertPrice] = useState("");

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newAlertPrice);
    if (newAlertSymbol && !isNaN(price) && price > 0) {
      onAddAlert(newAlertSymbol.toUpperCase(), newAlertType, price);
      setNewAlertSymbol("");
      setNewAlertPrice("");
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        <span>🔔</span>
        <span>Price Alerts ({alerts.filter(a => a.enabled && !a.triggered).length})</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Notification Permission */}
          {notificationPermission !== "granted" && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">
                Enable browser notifications to receive alerts
              </p>
              <button
                onClick={onRequestPermission}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Enable Notifications
              </button>
            </div>
          )}

          {/* Add New Alert Form */}
          <form onSubmit={handleAddAlert} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Symbol (e.g., BTCUSDT)"
              value={newAlertSymbol}
              onChange={(e) => setNewAlertSymbol(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              value={newAlertType}
              onChange={(e) => setNewAlertType(e.target.value as "above" | "below")}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Add Alert
            </button>
          </form>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-sm">No price alerts set</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    alert.triggered
                      ? "bg-green-100 border border-green-300"
                      : alert.enabled
                      ? "bg-white border border-gray-300"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={alert.enabled}
                      onChange={() => onToggleAlert(alert.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {alert.symbol} {alert.type === "above" ? ">" : "<"} ${alert.price.toFixed(2)}
                      </p>
                      {alert.triggered && (
                        <p className="text-xs text-green-700">✓ Triggered</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {alert.triggered && (
                      <button
                        onClick={() => onResetAlert(alert.id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => onRemoveAlert(alert.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
