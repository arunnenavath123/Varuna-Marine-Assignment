import { useMemo, useState } from 'react';
import type { Route } from '../../core/domain/Route';

interface RoutesTabProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => Promise<void>;
}

export function RoutesTab({ routes, onSetBaseline }: RoutesTabProps) {
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      const vFilter = filters.vesselType.trim().toLowerCase();
      const fFilter = filters.fuelType.trim().toLowerCase();
      const yFilter = filters.year.trim().toLowerCase();

      const matchVessel = !vFilter || (r.vesselType && r.vesselType.toLowerCase().includes(vFilter));
      const matchFuel = !fFilter || (r.fuelType && r.fuelType.toLowerCase().includes(fFilter));
      const matchYear = !yFilter || (r.year != null && String(r.year).toLowerCase().includes(yFilter));

      return matchVessel && matchFuel && matchYear;
    });
  }, [routes, filters]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Routes Explorer</h2>
      <div className="mb-6 flex gap-4">
        <input 
          value={filters.vesselType} 
          onChange={(e) => setFilters((prev) => ({ ...prev, vesselType: e.target.value }))} 
          className="border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1" 
          placeholder="Filter by Vessel Type" 
        />
        <input 
          value={filters.fuelType} 
          onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))} 
          className="border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1" 
          placeholder="Filter by Fuel Type" 
        />
        <input 
          value={filters.year} 
          onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))} 
          className="border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32" 
          placeholder="Year" 
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <th className="p-3 font-semibold">Route ID</th>
              <th className="p-3 font-semibold">Vessel</th>
              <th className="p-3 font-semibold">Fuel</th>
              <th className="p-3 font-semibold">Year</th>
              <th className="p-3 font-semibold text-right">GHG Intensity</th>
              <th className="p-3 font-semibold text-center">Baseline</th>
              <th className="p-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRoutes.map((route) => (
              <tr key={route.routeId} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium text-slate-900">{route.routeId}</td>
                <td className="p-3 text-slate-700">{route.vesselType}</td>
                <td className="p-3 text-slate-700">{route.fuelType}</td>
                <td className="p-3 text-slate-700">{route.year}</td>
                <td className="p-3 text-right text-slate-700">{route.ghgIntensity.toFixed(2)}</td>
                <td className="p-3 text-center">{route.isBaseline ? '✅' : '—'}</td>
                <td className="p-3 text-center">
                  {!route.isBaseline && (
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded px-3 py-1.5 transition-colors"
                      onClick={() => onSetBaseline(route.routeId)}
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRoutes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">No routes match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
