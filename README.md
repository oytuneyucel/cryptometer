
![alt text](src/cryptometer-logo.svg)
# CRYPTOMETER - Cryptocurrency Tracker

Cryptometer is a simple dashboard that displays up to date data for the cryptocurrencies listed on Binance. It utilizes Binance's [24hr data API](https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics) to fetch the daily data and the [Web Socket API](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api#symbol-price-ticker) to get instantaneous price information for the currencies.

## Features

- Uses React Table library to display the data with a better state management
- Utilizes Tailwind queries for responsive display
- Displays whether the socket connection is active and when the data was last updated, as well as any errors that might occur



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

- Per project requirements, this application uses **Binance Web Socket API**. Web Socket Stream, served over at _wss://stream.binance.com_, provides a better subscription solution as rate limits are defined by the socket publishing strategies instead of directly managed by the application. However, the socket API provides the freedom to accelerate / decelerate the requests, allowing additional operations should the user choose to perform actions on their wallets using an access token.
- As this application revolves around a single component, subcomponents have been designed to receive data via prop drilling. This can easily be extracted to a context or a lightweight store management library such as `zustand`
- Since we're already sending an array of currencies, it's quite easy to make the app dynamic, by providing an input field and remove button. This would be simpler to manage with the use of the state management strategies above.
- Rate has been reduced to once per second to properly reflect the visual requirement of displaying a green color if the value stays the same. Increasing this rate makes the red blink momentarily should the currency stay at the same price after a brief dip.

### Scripts

In the project directory, you can run:

`npm start` Runs the app in the development mode.\
`npm run build` Builds the app for production to the `build` folder


The build is minified and the filenames include the hashes.\
\
Your app is ready to be deployed: Once pushed to the remote, it will automatically be buil with Vercel and served at  

---

Built by [*Oytun Emre Yücel*](https://github.com/oytuneyucel)