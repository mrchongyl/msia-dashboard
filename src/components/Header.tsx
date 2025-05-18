import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center">
          <img src="/src/noun-asean-2430956-FFFFFF.svg" alt="ASEAN Logo" className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">ASEAN Economic Dashboard</h1>
            <p className="text-sm text-blue-100">
              Powered by World Bank Data
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;