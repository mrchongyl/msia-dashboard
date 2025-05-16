import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/tabs/OverviewTab';
import GdpTab from './components/tabs/GdpTab';
import CreditCardUsageTab from './components/tabs/CreditCardUsageTab';
import Footer from './components/Footer';

export type TabType = 'overview' | 'gdp' | 'creditCardUsage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'gdp' && <GdpTab />}
        {activeTab === 'creditCardUsage' && <CreditCardUsageTab />}
      </main>
      <Footer />
    </div>
  );
}

export default App;