import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
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
import LoginPage from './components/LoginPage';

export type TabType = 'overview' | 'gdp' | 'creditCardUsage' | 'inflation' | 'cpi' | 'mobileInternetBanking' | 'documentation';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Activity timer
  useEffect(() => {
    if (!isAuthenticated) return;
    const resetTimer = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('scroll', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated]);

  // Logout on inactivity
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
        setIsAuthenticated(false);
        signOut(auth);
      }
    }, 1000 * 30); // check every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><span>Loading...</span></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!isAuthenticated ? (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <Header onLogout={() => setIsAuthenticated(false)} />
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
        </>
      )}
    </div>
  );
}

export default App;