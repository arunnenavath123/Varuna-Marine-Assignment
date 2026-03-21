import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { RouteApiService } from './adapters/infrastructure/RouteApiService';
import { createRouteUseCases } from './core/application/routeUseCases';
import { Route } from './core/domain/Route';

const routeService = new RouteApiService();
const { fetchRoutes, setBaseline, fetchComparison } = createRouteUseCases(routeService);

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(console.error);
  }, []);

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      return (
        (!filters.vesselType || r.vesselType === filters.vesselType) &&
        (!filters.fuelType || r.fuelType === filters.fuelType) &&
        (!filters.year || String(r.year) === filters.year)
      );
    });
  }, [routes, filters]);

  const loadComparison = async () => {
    setComparison(await fetchComparison());
  };

  function tabClass(tab: Tab) {
    return activeTab === tab ? 'px-4 py-2 border-b-2 border-indigo-600 font-bold' : 'px-4 py-2 text-slate-600 hover:text-indigo-600';
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">FuelEU Maritime Dashboard</h1>
        <div className="flex space-x-2 mb-4">
          {(['routes', 'compare', 'banking', 'pooling'] as Tab[]).map((tab) => (
            <button key={tab} className={tabClass(tab)} onClick={() => setActiveTab(tab)}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'routes' && (
          <div>
            <div className="mb-4 flex gap-2">
              <input value={filters.vesselType} onChange={(e) => setFilters((prev) => ({ ...prev, vesselType: e.target.value }))} className="border p-2 rounded" placeholder="vesselType" />
              <input value={filters.fuelType} onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))} className="border p-2 rounded" placeholder="fuelType" />
              <input value={filters.year} onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))} className="border p-2 rounded" placeholder="year" />
            </div>
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Route ID</th>
                  <th className="border p-2">Vessel</th>
                  <th className="border p-2">Fuel</th>
                  <th className="border p-2">Year</th>
                  <th className="border p-2">GHG Intensity</th>
                  <th className="border p-2">Baseline</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.routeId}>
                    <td className="border p-2">{route.routeId}</td>
                    <td className="border p-2">{route.vesselType}</td>
                    <td className="border p-2">{route.fuelType}</td>
                    <td className="border p-2">{route.year}</td>
                    <td className="border p-2">{route.ghgIntensity.toFixed(2)}</td>
                    <td className="border p-2">{route.isBaseline ? '✅' : '❌'}</td>
                    <td className="border p-2">
                      <button
                        className="bg-indigo-500 text-white rounded px-2 py-1"
                        onClick={async () => {
                          await setBaseline(route.routeId);
                          setRoutes(await fetchRoutes());
                        }}
                      >
                        Set Baseline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            <button onClick={loadComparison} className="mb-4 bg-green-500 text-white px-3 py-2 rounded">Load Comparison</button>
            {comparison && (
              <div>
                <h2 className="font-bold">Baseline {comparison.baseline.routeId}</h2>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Route</th>
                      <th className="border p-2">GHG</th>
                      <th className="border p-2">Diff%</th>
                      <th className="border p-2">Compliant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.others.map((item: any) => (
                      <tr key={item.routeId}>
                        <td className="border p-2">{item.routeId}</td>
                        <td className="border p-2">{item.ghgIntensity.toFixed(2)}</td>
                        <td className="border p-2">{item.percentDiff.toFixed(2)}%</td>
                        <td className="border p-2">{item.ghgIntensity <= 89.3368 ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'banking' && <div>Banking tab (work in progress)</div>}
        {activeTab === 'pooling' && <div>Pooling tab (work in progress)</div>}
      </div>
    </div>
  );
}

export default App;
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
