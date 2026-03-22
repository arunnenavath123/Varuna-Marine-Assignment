import { useState, useEffect } from 'react';
import type { ShipCompliance, BankEntry } from '../../core/domain/ComplianceTypes';

interface BankingTabProps {
  fetchAllCb: (year: number) => Promise<ShipCompliance[]>;
  fetchBankingRecords: (shipId: string, year: number) => Promise<BankEntry[]>;
  bankSurplus: (shipId: string, year: number, amount: number) => Promise<BankEntry>;
  applyBanked: (shipId: string, year: number, amount: number) => Promise<BankEntry>;
}

export function BankingTab({ fetchAllCb, fetchBankingRecords, bankSurplus, applyBanked }: BankingTabProps) {
  const [year, setYear] = useState<number>(2024);
  const [compliances, setCompliances] = useState<ShipCompliance[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [records, setRecords] = useState<BankEntry[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const loadCompliances = async () => {
    try {
      setCompliances(await fetchAllCb(year));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to fetch compliance balance');
    }
  };

  const loadRecords = async () => {
    try {
      setRecords(await fetchBankingRecords(selectedRoute, year));
      setError('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to fetch banking records');
    }
  };

  useEffect(() => {
    loadCompliances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    if (selectedRoute) {
      loadRecords();
    } else {
      setRecords([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute, year]);

  const handleBank = async () => {
    if (!amount || Number(amount) <= 0) return;
    try {
      await bankSurplus(selectedRoute, year, Number(amount));
      setAmount('');
      await loadRecords();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to bank surplus');
    }
  };

  const handleApply = async () => {
    if (!amount || Number(amount) <= 0) return;
    try {
      await applyBanked(selectedRoute, year, Number(amount));
      setAmount('');
      await loadRecords();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to apply banked surplus');
    }
  };

  const currentCb = compliances.find(c => c.routeId === selectedRoute)?.cbGco2eq ?? 0;
  // If there are records, the latest cbAfter is the actual current available balance 
  // Wait, if I bank surplus, my balance drops.
  const displayCb = records.length > 0 ? records[records.length - 1].cbAfter : currentCb;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Banking (Article 20)</h2>
      
      <div className="flex gap-4 mb-6">
        <div>
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
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Route</label>
          <select 
            value={selectedRoute} 
            onChange={e => setSelectedRoute(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 w-64 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Select a Route --</option>
            {compliances.map(c => (
              <option key={c.routeId} value={c.routeId}>{c.routeId} (Base CB: {c.cbGco2eq.toFixed(2)})</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-6">
          {error}
        </div>
      )}

      {selectedRoute && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Status</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${displayCb >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {displayCb > 0 ? '+' : ''}{displayCb.toFixed(2)}
                </span>
                <span className="text-slate-500 font-medium">gCO₂e/MJ</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {displayCb >= 0 ? 'You have a surplus.' : 'You have a deficit.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Execute Action</h3>
              <div className="flex gap-3 mb-4">
                <input 
                  type="number" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="border border-slate-300 rounded-md px-3 py-2 flex-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBank}
                  disabled={displayCb <= 0 || !amount || Number(amount) <= 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Bank Surplus
                </button>
                <button
                  onClick={handleApply}
                  disabled={displayCb >= 0 || !amount || Number(amount) <= 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Apply Banked
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Banking History</h3>
            {records.length === 0 ? (
              <p className="text-slate-500 italic">No banking records found for this route.</p>
            ) : (
              <div className="space-y-3">
                {records.map(record => (
                  <div key={record.id} className="border border-slate-200 rounded-md p-3 text-sm">
                    <div className="flex justify-between font-medium mb-1">
                      <span className="capitalize text-slate-800">{record.action}</span>
                      <span className={record.action === 'bank' ? 'text-indigo-600' : 'text-emerald-600'}>
                        {record.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-xs">
                      <span>Before: {record.cbBefore.toFixed(2)}</span>
                      <span>After: {record.cbAfter.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
