import { useEffect, useState } from 'react';
import './App.css';
import { RouteApiService } from './adapters/infrastructure/RouteApiService';
import { createRouteUseCases } from './core/application/routeUseCases';
import type { Route } from './core/domain/Route';
import type { ComparisonResult } from './core/domain/Comparison';
import { RoutesTab } from './adapters/ui/RoutesTab';
import { CompareTab } from './adapters/ui/CompareTab';
import { ComplianceApiService } from './adapters/infrastructure/ComplianceApiService';
import { createComplianceUseCases } from './core/application/complianceUseCases';
import { BankingTab } from './adapters/ui/BankingTab';
import { PoolingTab } from './adapters/ui/PoolingTab';

const routeService = new RouteApiService();
const { fetchRoutes, setBaseline, fetchComparison } = createRouteUseCases(routeService);

const complianceService = new ComplianceApiService();
const { fetchAllCb, fetchBankingRecords, bankSurplus, applyBanked, fetchAllAdjustedCb, createPool } = createComplianceUseCases(complianceService);

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const loadRoutes = async () => {
    try {
      setRoutes(await fetchRoutes());
    } catch (error) {
      console.error(error);
    }
  };

  const loadComparison = async () => {
    try {
      setComparison(await fetchComparison());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoutes()
      .then(setRoutes)
      .catch(console.error);
  }, []);

  const handleSetBaseline = async (routeId: string) => {
    await setBaseline(routeId);
    await loadRoutes();
  };

  function tabClass(tab: Tab) {
    return activeTab === tab
      ? 'px-6 py-3 border-b-2 border-indigo-600 text-indigo-700 font-semibold transition-colors'
      : 'px-6 py-3 text-slate-500 font-medium hover:text-indigo-600 transition-colors';
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">
              FuelEU Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
          {(['routes', 'compare', 'banking', 'pooling'] as Tab[]).map((tab) => (
            <button key={tab} className={tabClass(tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'routes' && <RoutesTab routes={routes} onSetBaseline={handleSetBaseline} />}
          {activeTab === 'compare' && <CompareTab comparison={comparison} onLoad={loadComparison} />}
          {activeTab === 'banking' && (
            <BankingTab 
              fetchAllCb={fetchAllCb} 
              fetchBankingRecords={fetchBankingRecords} 
              bankSurplus={bankSurplus} 
              applyBanked={applyBanked} 
            />
          )}
          {activeTab === 'pooling' && (
            <PoolingTab 
              fetchAllAdjustedCb={fetchAllAdjustedCb}
              createPool={createPool}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
