import React from 'react';
import logo from './assets/noun-asean-2430956-FFFFFF.svg';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Header: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const handleLogout = async () => {
    await signOut(auth);
    if (onLogout) onLogout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="ASEAN Logo" className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">ASEAN Economic Dashboard</h1>
              <p className="text-sm text-blue-100">Powered by World Bank Data</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto bg-white text-blue-900 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition border border-blue-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;