import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Malaysia Economic Dashboard</h1>
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