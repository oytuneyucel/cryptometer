
![alt text](src/cryptometer-logo.svg)
# CRYPTOMETER - Cryptocurrency Tracker

Cryptometer is a powerful cryptocurrency dashboard that displays real-time data for cryptocurrencies from Binance. It utilizes Binance's [24hr data API](https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics) to fetch daily data and the [Web Socket API](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api#symbol-price-ticker) to get instantaneous price information.

## Features

### Core Features
- **Real-time Price Updates** - WebSocket-based live price tracking
- **Responsive Design** - Optimized for desktop and mobile devices
- **Sortable Columns** - Click any column header to sort (price, volume, change %, etc.)
- **Dynamic Watchlist** - Add or remove cryptocurrencies with search functionality
- **Connection Status** - Visual indicators for WebSocket connection and last update time

### Advanced Features 🚀

#### 📊 Enhanced Data Display
- **24h Trading Volume** - See market liquidity with formatted volume (K/M/B)
- **Price Change %** - Color-coded 24-hour percentage changes
- **Historical Highs/Lows** - Hover tooltips showing previous price extremes

#### 🔔 Price Alerts
- Set custom price alerts for any cryptocurrency
- Choose "above" or "below" threshold alerts
- Browser notifications when alerts trigger
- Enable/disable/reset alerts individually
- Persistent storage of alert configurations

#### 💼 Portfolio Tracking
- Track holdings with quantity and average buy price
- Real-time portfolio valuation
- Profit/Loss calculation per coin and total
- Color-coded gains and losses
- Comprehensive portfolio summary dashboard

#### 📥📤 Data Export & Import
- Export watchlist to CSV or JSON formats
- Import watchlist from files
- Automatic duplicate detection
- Timestamped backup files

#### ⚙️ Advanced Settings
- Configurable WebSocket refresh rate (500ms to 10s)
- Display options (show/hide columns)
- Theme preferences (UI ready)
- Currency preference selector
- Reset to default settings

For detailed information about advanced features, see [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md).

### Technical Stack
- **React** with TypeScript for type-safe development
- **TanStack React Table** for advanced table functionality with sorting
- **Tailwind CSS** for responsive styling
- **react-use-websocket** for WebSocket connections
- **Axios** for HTTP requests
- **LocalStorage** for data persistence


### Folder Structure

While this application is not complex in nature, a simple folder structure has been establish to indicate how a larger project might be structured, adding folders such as `store`, `api`, `lib` etc. As there are not too many files that will need to share functions and interfaces, these files have been deliberately placed within the respective folders to reflect a large project structure

```
 src
 ├── components     # folder to store all application components
 ├── hooks          # place to store common hooks
 ├── interfaces     # type definitions for the project
 └── utils          # various text utilities
```

### Areas of Improvement

The following improvements have been **implemented** in this version:
- ✅ **Dynamic Cryptocurrency Management** - Search and add/remove cryptocurrencies with persistent storage
- ✅ **Advanced Table Features** - Sortable columns for all data points
- ✅ **Price Alerts** - Custom alerts with browser notifications
- ✅ **Portfolio Tracking** - Track holdings with profit/loss calculations
- ✅ **Data Export/Import** - CSV and JSON support for watchlists
- ✅ **Enhanced Data Display** - Volume and percentage change columns

Potential future enhancements:
- **Multi-Exchange Support** - Compare prices across Binance, Coinbase, Kraken
- **Advanced Filtering** - Filter cryptocurrencies by price range, volume, or change %
- **Historical Charts** - Visual price history with candlestick charts
- **Dark Mode** - Theme customization (UI framework is ready)
- **API Integration** - Support for custom API keys to increase rate limits
- Per project requirements, this application uses **Binance Web Socket API**. Web Socket Stream, served over at _wss://stream.binance.com_, provides a better subscription solution as rate limits are defined by the socket publishing strategies instead of directly managed by the application. However, the socket API provides the freedom to accelerate / decelerate the requests, allowing additional operations should the user choose to perform actions on their wallets using an access token.

### Scripts

In the project directory, you can run:

`npm start` Runs the app in the development mode.\
`npm run build` Builds the app for production to the `build` folder


The build is minified and the filenames include the hashes.\
\
Your app is ready to be deployed: Once pushed to the remote, it will automatically be buil with Vercel and served at  

---

Built by [*Oytun Emre Yücel*](https://github.com/oytuneyucel)