import { CryptoData } from "../../interfaces/crypto.interface";
import { formatPrice } from "../../utils/text-formatter";
import SwipeToDelete from "../SwipeToDelete";

interface MobileViewProps {
  data: CryptoData[];
  editMode: boolean;
  onDelete: (symbol: string) => void;
}

const MobileView = ({ data, editMode, onDelete }: MobileViewProps) => {
  return (
    <div className="space-y-1 sm:hidden h-[60vh] overflow-scroll">
      {data.map((currency) => (
        
          <SwipeToDelete 
            key={currency.symbol}
            onDelete={() => onDelete(currency.symbol)}
          >
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl">{currency.symbol}</span>
                <span
                  className={`text-xl font-bold ${
                    currency.priceChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPrice(currency.lastPrice)}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="relative group">
                  High: {formatPrice(currency.high)}
                  <div className="absolute left-0 bottom-full mb-1 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <p>Previous Highs:</p>
                    {currency.prevHigh.map((high: number) => (
                      <p key={high}>{formatPrice(high)}</p>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                  Low: {formatPrice(currency.low)}
                  <div className="absolute left-0 bottom-full mb-1 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <p>Previous Lows:</p>
                    {currency.prevLow.map((low: number) => (
                      <p key={low}>{formatPrice(low)}</p>
                    ))}
                  </div>
                </div>
                <div>Open: {formatPrice(currency.open)}</div>
                <div>Close: {formatPrice(currency.close)}</div>
              </div>
              
            </div>
          </SwipeToDelete>
      
      ))}
    </div>
  );
};

export default MobileView;
