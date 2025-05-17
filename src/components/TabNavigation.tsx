import React from 'react';
import { Home, TrendingUp, CreditCard, Percent, CircleDollarSign, Wifi } from 'lucide-react';
import { TabType } from '../App';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <button
          className={`tab flex items-center ${
            activeTab === 'overview' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <Home className="w-4 h-4 mr-2 " />
          Overview
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'gdp' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('gdp')}
        >
          <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
          GDP Per Capita
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'inflation' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('inflation' as TabType)}
        >
          <Percent className="w-4 h-4 mr-2 text-purple-600" />
          Inflation
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'cpi' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('cpi' as TabType)}
        >
          <CircleDollarSign className="w-4 h-4 mr-2 text-orange-500" />
          CPI
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'creditCardUsage' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('creditCardUsage' as TabType)}
        >
          <CreditCard className="w-4 h-4 mr-2 text-green-500"  />
          Credit Card Usage
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'mobileInternetBanking' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('mobileInternetBanking' as TabType)}
        >
          <Wifi className="w-4 h-4 mr-2 text-red-500" />
          Mobile & Internet Banking
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'documentation' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('documentation' as TabType)}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-yellow-400 inline-block" />
          Documentation
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;