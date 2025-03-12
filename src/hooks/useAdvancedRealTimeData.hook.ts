import { useEffect, useState, useCallback, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";

interface RateLimitInfo {
  limit: number;
  current: number;
  resetTime: number;
}

interface CurrencyData {
  symbol: string;
  price: string;
}
interface RateLimitResponse {
  count: number;
  interval: string;
  intervalNum: number;
  limit: number;
  rateLimitType: string;
}
interface WebSocketResponse {
  id: string;
  status: number;
  result: CurrencyData[];
  ratelimits: RateLimitResponse[];
}

const MAX_REQUESTS_PER_MINUTE = 10750;
const RATE_LIMIT_BUFFER = 50; // Buffer to avoid hitting the exact limit

const webSocketUrl = "wss://testnet.binance.vision/ws-api/v3";
// const webSocketUrl = "wss://ws-api.binance.com:443/ws-api/v3"

/**
 * @deprecated not properly working at the moment
 * useAdvancedRealTimeData hook is used to fetch real-time data from the Binance WebSocket API.
 * This hook does not utilize the endpoint to fetch the maximum number of requests per minute,
 * but rather uses the information that is provided by the WebSocket API documentation.
 * Despite this, any changes to the rate limit will be reflected in the hook, as safety measures
 * have been implemented to avoid hitting the rate limit.
 * @param symbols list of symbols to track
 * @returns
 */
export const useAdvancedRealTimeData = (symbols: string[]) => {
  const [data, setData] = useState<CurrencyData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    limit: MAX_REQUESTS_PER_MINUTE,
    current: 0,
    resetTime: Date.now() + 60000,
  });

  const requestQueue = useRef<(() => void)[]>([]);
  const processingQueue = useRef(false);
  const isRateLimitReached = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    sendJsonMessage,
    lastMessage,
    readyState,
    getWebSocket,
    lastJsonMessage,
  } = useWebSocket<WebSocketResponse>(webSocketUrl, {
    shouldReconnect: (closeEvent) => false, // TODO: Reconnect on close
    reconnectInterval: 5000, // Reconnect every 5 seconds
    reconnectAttempts: 10, // Attempt to reconnect 10 times
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onError: (event) => {
      console.error("WebSocket error:", event);
      // setError(
      //   "WebSocket connection error. Real-time updates may not be available."
      // );
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
    },
    onClose: (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    },
  });

  // const updateRateLimit = useCallback((used: number) => {
  //   setRateLimitInfo((prev) => {
  //     const now = Date.now();
  //     if (now > prev.resetTime) {
  //       return {
  //         limit: MAX_REQUESTS_PER_MINUTE,
  //         current: used,
  //         resetTime: now + 60000,
  //       };
  //     }
  //     return { ...prev, current: prev.current + used };
  //   });
  // }, []);

  const updateRateLimit = useCallback((used: number) => {
    setRateLimitInfo((prev) => {
      const now = Date.now();
      if (now > prev.resetTime) {
        return {
          limit: MAX_REQUESTS_PER_MINUTE,
          current: used,
          resetTime: now + 60000,
        };
      }
      const newCurrent = prev.current + used;
      if (newCurrent >= prev.limit - RATE_LIMIT_BUFFER) {
        isRateLimitReached.current = true;
      }
      return { ...prev, current: newCurrent };
    });
  }, []);

  const processQueue = useCallback(() => {
    if (processingQueue.current || error || isRateLimitReached.current) return;
    processingQueue.current = true;

    const processNext = () => {
      if (requestQueue.current.length === 0) {
        processingQueue.current = false;
        return;
      }

      const now = Date.now();
      if (now > rateLimitInfo.resetTime) {
        setRateLimitInfo({
          limit: MAX_REQUESTS_PER_MINUTE,
          current: 0,
          resetTime: now + 60000,
        });
        isRateLimitReached.current = false;
      }

      if (
        rateLimitInfo.current < rateLimitInfo.limit - RATE_LIMIT_BUFFER &&
        !isRateLimitReached.current
      ) {
        const request = requestQueue.current.shift();
        if (request) {
          request();
          updateRateLimit(1);
        }
        setTimeout(processNext, 60000 / MAX_REQUESTS_PER_MINUTE);
      } else {
        isRateLimitReached.current = true;
        const delay = Math.max(rateLimitInfo.resetTime - now, 1000);
        setTimeout(processNext, delay);
      }
    };

    processNext();
  }, [error, rateLimitInfo, updateRateLimit]);

  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    if (now > rateLimitInfo.resetTime) {
      setRateLimitInfo({
        limit: MAX_REQUESTS_PER_MINUTE,
        current: 0,
        resetTime: now + 60000,
      });
      isRateLimitReached.current = false;
      return true;
    }
    return (
      rateLimitInfo.current < rateLimitInfo.limit - RATE_LIMIT_BUFFER &&
      !isRateLimitReached.current
    );
  }, [rateLimitInfo]);

  const enqueueRequest = useCallback(
    (request: () => void) => {
      if (canMakeRequest()) {
        requestQueue.current.push(request);
        processQueue();
      }
    },
    [canMakeRequest, processQueue]
  );

  const sendTickerRequest = useCallback(() => {
    const payload = {
      id: uuidv4(),
      method: "ticker.price",
      params: { symbols },
    };
    sendJsonMessage(payload);
  }, [sendJsonMessage, symbols]);

  const handleTooManyRequests = useCallback(
    (data: any) => {
      const { serverTime, retryAfter } = data.error.data;
      const delay = retryAfter - serverTime;

      isRateLimitReached.current = true;

      setError(`Rate limit exceeded. Retrying after ${delay / 1000} seconds.`);

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        setError(null);
        setRateLimitInfo({
          limit: MAX_REQUESTS_PER_MINUTE,
          current: 0,
          resetTime: Date.now() + 60000,
        });
        isRateLimitReached.current = false;
        processQueue();
      }, delay);
    },
    [processQueue]
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      enqueueRequest(() => sendTickerRequest());
    }
  }, [readyState, symbols, enqueueRequest, sendTickerRequest]);

  const connect = useCallback(() => {
    if (readyState === ReadyState.OPEN && !isRateLimitReached.current) {
      enqueueRequest(() => sendTickerRequest());
    }
  }, [readyState, enqueueRequest, sendTickerRequest]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const scheduleNextUpdate = () => {
      if (!isRateLimitReached.current) {
        intervalId = setTimeout(() => {
          connect();
          scheduleNextUpdate();
        }, 60000 / MAX_REQUESTS_PER_MINUTE); // Adjust this interval as needed
      } else {
        // If rate limit is reached, wait for the reset
        const delay = Math.max(rateLimitInfo.resetTime - Date.now(), 1000);
        intervalId = setTimeout(scheduleNextUpdate, delay);
      }
    };

    scheduleNextUpdate();

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [connect, rateLimitInfo.resetTime]);

  useEffect(() => {
    console.log("Last message:", lastJsonMessage);
    if (lastJsonMessage !== undefined && lastJsonMessage !== null) {
      const { status, result } = lastJsonMessage;

      if (status === 429) {
        console.error("Too many requests:", lastJsonMessage);
        handleTooManyRequests(lastJsonMessage);
      } else if (status === 418) {
        console.error("Rate limited:", lastJsonMessage);
        getWebSocket()?.close();
        setError("Rate limit exceeded. Please try again later.");
      } else if (result) {
        setData(result);
      }
    }
  }, [lastJsonMessage, handleTooManyRequests, getWebSocket]);

  // Reinitialize connection every 24 hours to avoid automatic close
  useEffect(() => {
    const reinitializeInterval = setInterval(() => {
      getWebSocket()?.close();
    }, 86400000); // 24 hours

    return () => clearInterval(reinitializeInterval);
  }, [getWebSocket]);

  return {
    data,
    readyState,
    error,
    connect,
  };
};
