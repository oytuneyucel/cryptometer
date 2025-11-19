import { ColumnDef } from "@tanstack/react-table";
import { CryptoData } from "../../interfaces/crypto.interface";
import { formatPrice, formatVolume } from "../../utils/text-formatter";

const columns: ColumnDef<CryptoData>[] = [
  {
    header: "Currency",
    accessorKey: "lastPrice",
    cell: ({ cell, row }: any) => (
      <div className="flex flex-col">
        <div className="flex items-center">
          <div
            className={`w-2 h-3 mr-2 ${
              row.original.priceChange >= 0 ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="font-bold">{row.original.symbol}</span>
        </div>
        <div
          className={`font-extrabold text-xl ${
            row.original.priceChange >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatPrice(cell.getValue())}

          {row.original.lastPrice >= row.original.high && (
            <span className="ml-2 text-blue-600">↑</span>
          )}
          {row.original.lastPrice <= row.original.low && (
            <span className="ml-2 text-blue-600">↓</span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "24h Change",
    accessorKey: "priceChangePercent",
    cell: ({ row }) => {
      const changePercent = row.getValue("priceChangePercent") as number;
      return (
        <div
          className={`font-semibold ${
            changePercent >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {changePercent >= 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </div>
      );
    },
  },
  {
    header: "24h Volume",
    accessorKey: "volume",
    cell: ({ cell }) => (
      <div className="text-sm text-gray-700">
        {formatVolume(cell.getValue() as number)}
      </div>
    ),
  },
  {
    header: "High",
    accessorKey: "high",
    cell: ({ row }) => (
      <div className="relative group">
        {formatPrice(row.getValue("high"))}
        <div className="absolute left-0 bottom-full mb-1 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <p>Previous Highs:</p>
          {row.original.prevHigh.map((high: number) => (
            <p key={high}>{formatPrice(high)}</p>
          ))}
        </div>
      </div>
    ),
  },
  {
    header: "Low",
    accessorKey: "low",
    cell: ({ row }) => (
      <div className="relative group">
        {formatPrice(row.getValue("low"))}

        <div className="absolute left-0 bottom-full mb-1 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <p>Previous Lows:</p>
          {row.original.prevLow.map((low: number) => (
            <p key={low}>{formatPrice(low)}</p>
          ))}
        </div>
      </div>
    ),
  },
  {
    header: "Open",
    accessorKey: "open",
    cell: ({ cell }) => formatPrice(cell.getValue() as number),
  },
  {
    header: "Close",
    accessorKey: "close",
    cell: ({ cell }) => formatPrice(cell.getValue() as number),
  },
];

export default columns;
