import React from "react";
import CryptoTable from "./components/crypto-table";
import Footer from "./components/Footer";
import useIsMobile from './hooks/useIsMobile';

const App: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-blue-500 flex flex-col font-roboto">
      

      <div className="flex-1 sm:mx-8 flex flex-col items-center justify-center py-6">
      <div className="py-3 mx-8 sm:mx-auto">
        <h1 className="nabla-thicc flex justify-center">
          {"KRYPTOMETER".split('').map((letter, index) => (
            <span 
              key={index}
              className="inline-block"
              style={isMobile ? {
                fontSize: isMobile ? 50 : 80,
                background: 'linear-gradient(-45deg, #ff7e5f, #feb47b, #ffcb80, #ff7e5f)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',

                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(255, 255, 255, 0.)',
                animation: `bounce-letter 0.5s ease infinite alternate, gradient 3s ease infinite`,
                animationDelay: `${index * 0.1}s`
              } : {
                fontSize: isMobile ? 50 : 80,

                animation: `bounce-letter 0.5s ease infinite alternate, gradient 3s ease infinite`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-700 shadow-lg transform -skew-y-2 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl"></div>
          <CryptoTable />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
