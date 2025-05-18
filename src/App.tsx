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
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none', width: '100%' }}>
            <OverviewTab />
          </div>
          <div style={{ display: activeTab === 'gdp' ? 'block' : 'none', width: '100%' }}>
            <GdpTab />
          </div>
          <div style={{ display: activeTab === 'creditCardUsage' ? 'block' : 'none', width: '100%' }}>
            <CreditCardUsageTab />
          </div>
          <div style={{ display: activeTab === 'inflation' ? 'block' : 'none', width: '100%' }}>
            <InflationTab />
          </div>
          <div style={{ display: activeTab === 'cpi' ? 'block' : 'none', width: '100%' }}>
            <CpiTab />
          </div>
          <div style={{ display: activeTab === 'mobileInternetBanking' ? 'block' : 'none', width: '100%' }}>
            <MobileInternetBankingTab />
          </div>
          <div style={{ display: activeTab === 'documentation' ? 'block' : 'none', width: '100%' }}>
            <DocumentationTab />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;