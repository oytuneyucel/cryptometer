import React, { useState, useEffect, useCallback, useRef } from "react";
import { ReadyState } from "react-use-websocket";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import SocketStatus from "./socket-status";
import { CryptoData } from "../../interfaces/crypto.interface";
import useFetchHistoricData from "../../hooks/useFetchHistoricData.hook";
import columns from "./columns";
import MobileView from "./mobile-view";
import { useRealTimeData } from "../../hooks/useRealTimeData.hook";
import SearchBar from "../SearchBar";
import DeleteButton from "../DeleteButton";
import useLocalStorage from "../../hooks/useLocalStorage.hook";
import useIsMobile from "../../hooks/useIsMobile";

// Default symbols to show if no saved data
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "MBLUSDT"];

const CryptoTable: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [savedSymbols, setSavedSymbols] = useLocalStorage<string[]>("crypto_symbols", DEFAULT_SYMBOLS);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const isMobile = useIsMobile();

  const isConnected = useRef(false);

  const {
    historicData,
    loading: historicDataLoading,
    error: historicDataError,
  } = useFetchHistoricData(savedSymbols);

  const {
    data,
    readyState,
    error: realtimeError,
    connect: connectWebSocket,
  } = useRealTimeData(savedSymbols);

  const handleConnect = useCallback(() => {
    if (!isConnected.current && readyState === ReadyState.OPEN) {
      connectWebSocket();
      isConnected.current = true;
    }
  }, [connectWebSocket, readyState]);

  // Set the initial data from the historic data hook and connect the WebSocket afterwards
  useEffect(() => {
    if (!historicDataLoading && !historicDataError) {
      setCryptoData(historicData);
      setLoading(false);
      setLastUpdate(new Date());
      handleConnect();
    }
  }, [historicData, historicDataLoading, historicDataError, handleConnect]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING) {
      isConnected.current = false;
    }
  }, [readyState]);

  useEffect(() => {
    if (data) {
      setCryptoData((prevData) => {
        const newData = prevData.map((crypto) => {
          const newPrice = data[crypto.symbol];
          if (newPrice) {
            const { lastPrice, high, low, prevHigh, prevLow } = crypto;

            if (newPrice > high) {
              crypto.high = newPrice;
              crypto.prevHigh = [...prevHigh, high];
            }
            if (newPrice < low) {
              crypto.low = newPrice;
              crypto.prevLow = [...prevLow, low];
            }
            return {
              ...crypto,
              lastPrice: parseFloat(newPrice),
              priceChange: parseFloat(newPrice) - lastPrice,
            };
          }
          return crypto;
        });

        return newData;
      });
      setLastUpdate(new Date());
    }
  }, [data]);

  // Handle errors from both real-time and historic data hooks
  useEffect(() => {
    if (historicDataError) {
      setError(historicDataError);
    } else if (realtimeError) {
      setError(realtimeError);
    } else {
      setError(null);
    }
  }, [historicDataError, realtimeError]);

  // Handler for adding a new cryptocurrency
  const handleAddCrypto = (symbol: string) => {
    // Don't add if already in the list
    if (savedSymbols.includes(symbol)) {
      alert(`${symbol} is already in your watchlist.`);
      return;
    }
    
    // Add to savedSymbols which will trigger a refresh of the data
    setSavedSymbols([...savedSymbols, symbol]);
  };

  // Handler for removing a cryptocurrency
  const handleRemoveCrypto = (symbol: string) => {
    const newSymbols = savedSymbols.filter(s => s !== symbol);
    setSavedSymbols(newSymbols);
    
    // Also remove from current data
    setCryptoData(prevData => prevData.filter(crypto => crypto.symbol !== symbol));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Create table with delete column if in edit mode
  const tableColumns = editMode 
    ? [...columns, {
        id: 'actions',
        header: 'Actions',
        cell: (info: any) => (
          <DeleteButton 
            symbol={info.row.original.symbol}
            onDelete={handleRemoveCrypto}
          />
        ),
      }] 
    : columns;

  const dataTable = useReactTable({
    columns: tableColumns,
    data: cryptoData,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center py-8 space-y-4 bg-white shadow-lg sm:rounded-3xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        <div className="text-xl font-bold text-gray-700">
          Loading Crypto Data
        </div>
        <div className="text-sm text-gray-500 animate-pulse">
          Fetching real-time prices...
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow-lg sm:rounded-3xl overflow-hidden">
      <div className="px-4 pt-4">
        {!isMobile &&
        <div className="flex justify-end items-center mb-4">
          <button 
            onClick={toggleEditMode}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>}
        <SearchBar onAddCrypto={handleAddCrypto} />
      </div>

      <div className="overflow-x-auto hidden sm:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            {dataTable.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataTable.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <MobileView 
        data={cryptoData} 
        onDelete={handleRemoveCrypto} 
        editMode={editMode} 
      />
      
      <div className="p-4 flex justify-around sticky">
        <div className="text-left text-sm text-gray-600">
          Last update: {lastUpdate?.toLocaleTimeString()}
        </div>
        <SocketStatus status={readyState} error={error} />
      </div>
    </div>
  );
};

export default CryptoTable;
