import { useEffect, useState, useCallback, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";

interface CurrencyData {
  symbol: string;
  price: string;
}

interface WebSocketResponse {
  id: string;
  status: number;
  result: CurrencyData[];
}

const MAX_REQUESTS_PER_MINUTE = 60;
const INTERVAL_MS = 60000 / MAX_REQUESTS_PER_MINUTE;

// const webSocketUrl = "wss://testnet.binance.vision/ws-api/v3";
const webSocketUrl = "wss://ws-api.binance.com:443/ws-api/v3";

/**
 * useRealTimeData hook is used to fetch real-time data from the Binance WebSocket API.
 * This hook does not utilize the endpoint to fetch the maximum number of requests per minute,
 * but rather uses the information that is provided by the WebSocket API documentation.
 * Despite this, any changes to the rate limit will be reflected in the hook, as safety measures
 * have been implemented to avoid hitting the rate limit.
 * @param symbols list of symbols to track
 * @returns
 */
export const useRealTimeData = (symbols: string[]) => {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const lastRequestTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket<WebSocketResponse>(webSocketUrl, {
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
      onOpen: () => console.log("WebSocket connection established."),
      onError: (event) => console.error("WebSocket error:", event),
      onClose: (event) =>
        console.log("WebSocket connection closed:", event.code, event.reason),
    });

  const sendTickerRequest = useCallback(() => {
    const now = Date.now();
    const timeElapsed = now - lastRequestTime.current;

    if (timeElapsed < INTERVAL_MS) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        sendTickerRequest,
        INTERVAL_MS - timeElapsed
      );
      return;
    }

    const payload = {
      id: uuidv4(),
      method: "ticker.price",
      params: { symbols },
    };
    sendJsonMessage(payload);
    lastRequestTime.current = now;

    timeoutRef.current = setTimeout(sendTickerRequest, INTERVAL_MS);
  }, [sendJsonMessage, symbols]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendTickerRequest();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [readyState, sendTickerRequest]);

  useEffect(() => {
    if (lastJsonMessage) {
      const { status, result } = lastJsonMessage;

      if (status === 429 || status === 418) {
        console.error("Rate limited:", lastJsonMessage);
        getWebSocket()?.close();
        setError("Rate limit exceeded. Please try again later.");
      } else if (result) {
        setData(
          result.reduce((a, r) => {
            a[r.symbol] = r.price;
            return a;
          }, {} as any)
        );
      }
    }
  }, [lastJsonMessage, getWebSocket]);

  const connect = useCallback(() => {
    if (readyState === ReadyState.OPEN) {
      sendTickerRequest();
    }
  }, [readyState, sendTickerRequest]);

  return { data, readyState, error, connect };
};
