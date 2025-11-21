import React from "react";
import useLocalStorage from "../hooks/useLocalStorage.hook";

export interface AdvancedSettings {
  refreshRate: number;
  currency: string;
  theme: string;
  compactMode: boolean;
  showVolume: boolean;
  showChangePercent: boolean;
}

const DEFAULT_SETTINGS: AdvancedSettings = {
  refreshRate: 1000,
  currency: "USD",
  theme: "light",
  compactMode: false,
  showVolume: true,
  showChangePercent: true,
};

interface AdvancedSettingsProps {
  onSettingsChange?: (settings: AdvancedSettings) => void;
}

const AdvancedSettingsComponent: React.FC<AdvancedSettingsProps> = ({
  onSettingsChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = useLocalStorage<AdvancedSettings>(
    "advanced_settings",
    DEFAULT_SETTINGS
  );

  const handleSettingChange = (key: keyof AdvancedSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        <span>⚙️</span>
        <span>Advanced Settings</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Refresh Rate */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Refresh Rate (ms)
              </label>
              <select
                value={settings.refreshRate}
                onChange={(e) =>
                  handleSettingChange("refreshRate", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value={500}>500ms (Very Fast - High API usage)</option>
                <option value={1000}>1 second (Default)</option>
                <option value={2000}>2 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Lower values update faster but may hit API rate limits
              </p>
            </div>

            {/* Currency Preference */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Currency Preference
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange("currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BTC">BTC (₿)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Note: Currently only USD pairs are supported by Binance API
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Theme preference (to be implemented)
              </p>
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) =>
                      handleSettingChange("compactMode", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Compact Mode</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showVolume}
                    onChange={(e) =>
                      handleSettingChange("showVolume", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Show 24h Volume</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showChangePercent}
                    onChange={(e) =>
                      handleSettingChange("showChangePercent", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Show Change Percentage</span>
                </label>
              </div>
            </div>

            {/* Reset to Defaults */}
            <div className="border-t pt-3">
              <button
                onClick={() => {
                  setSettings(DEFAULT_SETTINGS);
                  if (onSettingsChange) {
                    onSettingsChange(DEFAULT_SETTINGS);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettingsComponent;
