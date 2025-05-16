import React from 'react';
import { Home, TrendingUp, CreditCard } from 'lucide-react';
import { TabType } from '../App';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8">
      <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          className={`tab flex items-center ${
            activeTab === 'overview' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <Home className="w-4 h-4 mr-2" />
          Overview
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'gdp' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('gdp')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          GDP Per Capita
        </button>
        <button
          className={`tab flex items-center ${
            activeTab === 'creditCardUsage' ? 'tab-active' : 'tab-inactive'
          }`}
          onClick={() => setActiveTab('creditCardUsage' as TabType)}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Credit Card Usage
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;