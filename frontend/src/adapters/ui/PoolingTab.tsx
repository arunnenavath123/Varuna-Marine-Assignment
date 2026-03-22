import { useState, useEffect } from 'react';
import type { AdjustedCbSnapshot, Pool } from '../../core/domain/ComplianceTypes';

interface PoolingTabProps {
  fetchAllAdjustedCb: (year: number) => Promise<AdjustedCbSnapshot[]>;
  createPool: (year: number, members: { routeId: string, cbBefore: number }[]) => Promise<Pool>;
}

export function PoolingTab({ fetchAllAdjustedCb, createPool }: PoolingTabProps) {
  const [year, setYear] = useState<number>(2024);
  const [cbs, setCbs] = useState<AdjustedCbSnapshot[]>([]);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [poolResult, setPoolResult] = useState<Pool | null>(null);

  const loadAdjustedCb = async () => {
    try {
      setCbs(await fetchAllAdjustedCb(year));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to fetch adjusted balances');
    }
  };

  useEffect(() => {
    loadAdjustedCb();
    setSelectedRoutes([]);
    setPoolResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const handleToggleRoute = (routeId: string) => {
    if (selectedRoutes.includes(routeId)) {
      setSelectedRoutes(selectedRoutes.filter(id => id !== routeId));
    } else {
      setSelectedRoutes([...selectedRoutes, routeId]);
    }
  };

  const selectedMembers = cbs.filter(c => selectedRoutes.includes(c.routeId));
  const poolSum = selectedMembers.reduce((sum, member) => sum + member.adjustedCb, 0);
  const isValidPool = selectedRoutes.length >= 2 && poolSum >= 0;

  const handleCreatePool = async () => {
    if (!isValidPool) return;
    try {
      const result = await createPool(
        year, 
        selectedMembers.map(m => ({ routeId: m.routeId, cbBefore: m.adjustedCb }))
      );
      setPoolResult(result);
      setError('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to create pool');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Pooling (Article 21)</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Select Year</label>
        <select 
          value={year} 
          onChange={e => setYear(Number(e.target.value))}
          className="border border-slate-300 rounded-md px-3 py-2 w-32 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-6">
          {error}
        </div>
      )}

      {poolResult ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-emerald-800 mb-4">Pool Created Successfully!</h3>
          <p className="text-emerald-700 mb-4">Pool ID: <span className="font-mono">{poolResult.id}</span></p>
          
          <table className="min-w-full text-left bg-white rounded-md overflow-hidden border border-emerald-100">
            <thead className="bg-emerald-100/50">
              <tr>
                <th className="p-3 font-semibold text-emerald-800">Route</th>
                <th className="p-3 font-semibold text-emerald-800">CB Before Pool</th>
                <th className="p-3 font-semibold text-emerald-800">CB After Pool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {poolResult.members.map(m => (
                <tr key={m.routeId}>
                  <td className="p-3 text-slate-800 font-medium">{m.routeId}</td>
                  <td className="p-3 text-slate-600">{m.cbBefore.toFixed(2)}</td>
                  <td className="p-3 font-bold text-slate-800">{m.cbAfter.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            onClick={() => { setPoolResult(null); setSelectedRoutes([]); loadAdjustedCb(); }}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Create Another Pool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Select Members (Adjusted CB)</h3>
            <div className="border border-slate-200 rounded-md divide-y divide-slate-100">
              {cbs.map(c => (
                <label key={c.routeId} className="flex items-center p-3 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedRoutes.includes(c.routeId)}
                    onChange={() => handleToggleRoute(c.routeId)}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-3 font-medium text-slate-900 w-24">{c.routeId}</span>
                  <span className={`ml-auto font-bold ${c.adjustedCb >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {c.adjustedCb > 0 ? '+' : ''}{c.adjustedCb.toFixed(2)}
                  </span>
                </label>
              ))}
              {cbs.length === 0 && (
                <div className="p-4 text-slate-500 text-center">No routes found for this year.</div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Pool Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Selected Members:</span>
                  <span className="font-bold text-slate-800">{selectedRoutes.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Adjusted CB:</span>
                  <span className={`text-xl font-bold ${poolSum >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {poolSum > 0 ? '+' : ''}{poolSum.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-4">{selectedRoutes.length >= 2 ? '✅' : '❌'}</span>
                  <span className={selectedRoutes.length >= 2 ? 'text-slate-700' : 'text-red-500'}>Must have at least 2 members</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-4">{poolSum >= 0 ? '✅' : '❌'}</span>
                  <span className={poolSum >= 0 ? 'text-slate-700' : 'text-red-500'}>Sum of Adjusted CB must be ≥ 0</span>
                </p>
              </div>

              <button
                onClick={handleCreatePool}
                disabled={!isValidPool}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors"
              >
                Create Pool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
