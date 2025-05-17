import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/tabs/OverviewTab';
import GdpTab from './components/tabs/GdpTab';
import CreditCardUsageTab from './components/tabs/CreditCardUsageTab';
import InflationTab from './components/tabs/InflationTab';
import CpiTab from './components/tabs/CpiTab';
import MobileInternetBankingTab from './components/tabs/MobileInternetBankingTab';
import DocumentationTab from './components/tabs/DocumentationTab';
import Footer from './components/Footer';

export type TabType = 'overview' | 'gdp' | 'creditCardUsage' | 'inflation' | 'cpi' | 'mobileInternetBanking' | 'documentation';

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
        {activeTab === 'inflation' && <InflationTab />}
        {activeTab === 'cpi' && <CpiTab />}
        {activeTab === 'mobileInternetBanking' && <MobileInternetBankingTab />}
        {activeTab === 'documentation' && <DocumentationTab />}
      </main>
      <Footer />
    </div>
  );
}

export default App;