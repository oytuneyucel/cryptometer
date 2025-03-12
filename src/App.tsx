import React from "react";
import logo from "./cryptometer-logo.svg";
import CryptoTable from "./components/crypto-table";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-yellow-400 py-6 flex flex-col sm:py-12 font-roboto">
      <div className="py-3 mx-8 sm:mx-auto">
        <img src={logo} alt="logo" />
      </div>

      <div className="flex-1 sm:mx-8 flex items-center justify-center">
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-light-blue-500 shadow-lg transform -skew-y-2 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl"></div>
          <CryptoTable />
        </div>
      </div>
    </div>
  );
};

export default App;
