import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 text-center text-gray-600 text-sm border-t border-gray-200 mt-auto">
      <p>© {currentYear} <a href='https://jovian.company' className='hover:drop-shadow-md hover:text-yellow-400 transition-all duration-300'>Jovian BV</a>. All rights reserved.</p>
    </footer>
  );
};

export default Footer; 