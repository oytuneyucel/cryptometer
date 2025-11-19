import { useState, useEffect, useCallback } from "react";
import { PriceAlert } from "../interfaces/crypto.interface";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./useLocalStorage.hook";

/**
 * Hook to manage price alerts for cryptocurrencies
 * Stores alerts in local storage and checks them against current prices
 */
export const usePriceAlerts = (currentPrices: { [symbol: string]: number }) => {
  const [alerts, setAlerts] = useLocalStorage<PriceAlert[]>("price_alerts", []);
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);

  // Check alerts against current prices
  useEffect(() => {
    const newTriggeredAlerts: PriceAlert[] = [];

    alerts.forEach((alert) => {
      if (!alert.enabled || alert.triggered) return;

      const currentPrice = currentPrices[alert.symbol];
      if (!currentPrice) return;

      let shouldTrigger = false;
      if (alert.type === "above" && currentPrice >= alert.price) {
        shouldTrigger = true;
      } else if (alert.type === "below" && currentPrice <= alert.price) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        const triggeredAlert = { ...alert, triggered: true };
        newTriggeredAlerts.push(triggeredAlert);

        // Show browser notification if supported
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Price Alert: ${alert.symbol}`, {
            body: `${alert.symbol} is now ${alert.type} $${alert.price.toFixed(2)}. Current price: $${currentPrice.toFixed(2)}`,
            icon: "/cryptometer-logo.svg",
          });
        }
      }
    });

    if (newTriggeredAlerts.length > 0) {
      setTriggeredAlerts((prev) => [...prev, ...newTriggeredAlerts]);
      
      // Update alerts to mark them as triggered
      setAlerts((prev) =>
        prev.map((alert) => {
          const triggered = newTriggeredAlerts.find((t) => t.id === alert.id);
          return triggered ? { ...alert, triggered: true } : alert;
        })
      );
    }
  }, [currentPrices, alerts, setAlerts]);

  const addAlert = useCallback(
    (symbol: string, type: "above" | "below", price: number) => {
      const newAlert: PriceAlert = {
        id: uuidv4(),
        symbol,
        type,
        price,
        enabled: true,
        triggered: false,
        createdAt: new Date(),
      };
      setAlerts((prev) => [...prev, newAlert]);
      return newAlert;
    },
    [setAlerts]
  );

  const removeAlert = useCallback(
    (id: string) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    },
    [setAlerts]
  );

  const toggleAlert = useCallback(
    (id: string) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
        )
      );
    },
    [setAlerts]
  );

  const resetAlert = useCallback(
    (id: string) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, triggered: false } : alert
        )
      );
    },
    [setAlerts]
  );

  const clearTriggeredAlerts = useCallback(() => {
    setTriggeredAlerts([]);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  return {
    alerts,
    triggeredAlerts,
    addAlert,
    removeAlert,
    toggleAlert,
    resetAlert,
    clearTriggeredAlerts,
    requestNotificationPermission,
    notificationPermission: "Notification" in window ? Notification.permission : "denied",
  };
};
