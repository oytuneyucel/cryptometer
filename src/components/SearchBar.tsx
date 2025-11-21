import React, { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onAddCrypto: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddCrypto }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Common cryptocurrencies for suggestions
  const commonCryptos = React.useMemo(() => [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", 
    "ADAUSDT", "DOGEUSDT", "SHIBUSDT", "DOTUSDT", "LINKUSDT"
  ], []);

  // Hide suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsLoading(true);
      // Filter common cryptos based on search term
      const filteredSuggestions = commonCryptos.filter(crypto => 
        crypto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsLoading(false);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, commonCryptos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onAddCrypto(searchTerm.toUpperCase());
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onAddCrypto(symbol);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto mb-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-l-lg border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Add cryptocurrency (e.g., BTCUSDT)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add
        </button>
      </form>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((symbol) => (
              <div
                key={symbol}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(symbol)}
              >
                {symbol}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 