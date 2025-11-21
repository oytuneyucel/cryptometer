import React from "react";

interface DataExportImportProps {
  watchlist: string[];
  onImportWatchlist: (symbols: string[]) => void;
}

const DataExportImport: React.FC<DataExportImportProps> = ({
  watchlist,
  onImportWatchlist,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleExportCSV = () => {
    const csvContent = ["Symbol"].concat(watchlist).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cryptometer-watchlist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      watchlist,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cryptometer-watchlist-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let symbols: string[] = [];

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content);
          symbols = data.watchlist || [];
        } else if (file.name.endsWith(".csv")) {
          symbols = content
            .split("\n")
            .filter((line) => line.trim() && line !== "Symbol")
            .map((line) => line.trim());
        }

        if (symbols.length > 0) {
          onImportWatchlist(symbols);
          alert(`Successfully imported ${symbols.length} symbols`);
        } else {
          alert("No valid symbols found in file");
        }
      } catch (error) {
        alert("Error parsing file. Please ensure it's a valid CSV or JSON file.");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = "";
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <span>📥📤</span>
        <span>Import/Export</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-3">
            {/* Export Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Export Watchlist</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Export as CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Export as JSON
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Download your watchlist to backup or share with others
              </p>
            </div>

            {/* Import Section */}
            <div className="border-t pt-3">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Import Watchlist</h3>
              <label className="block">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleImport}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Upload a CSV or JSON file to import symbols
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExportImport;
