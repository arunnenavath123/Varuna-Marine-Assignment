import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ComparisonResult, ComparisonResultItem } from '../../core/domain/Comparison';

interface CompareTabProps {
  comparison: ComparisonResult | null;
  onLoad: () => Promise<void>;
}

export function CompareTab({ comparison, onLoad }: CompareTabProps) {
  const chartData = comparison ? [
    { name: comparison.baseline.routeId, ghgIntensity: comparison.baseline.ghgIntensity, type: 'Baseline' },
    ...comparison.others.map((o: ComparisonResultItem) => ({ name: o.routeId, ghgIntensity: o.ghgIntensity, type: 'Comparison' }))
  ] : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Compliance Comparison</h2>
        <button 
          onClick={onLoad} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Load Comparison Data
        </button>
      </div>

      {!comparison && (
        <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
          Click the button above to load and compare route intensities against the baseline.
        </div>
      )}

      {comparison && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Baseline: <span className="text-indigo-600">{comparison.baseline.routeId}</span> ({comparison.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ)
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-3 font-semibold">Route</th>
                    <th className="p-3 font-semibold">GHG Intensity</th>
                    <th className="p-3 font-semibold">Difference vs Baseline</th>
                    <th className="p-3 font-semibold text-center">Target (89.33) Compliant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparison.others.map((item: ComparisonResultItem) => {
                    const diffColor = item.percentDiff > 0 ? 'text-amber-600' : 'text-emerald-600';
                    return (
                      <tr key={item.routeId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{item.routeId}</td>
                        <td className="p-3 text-slate-700">{item.ghgIntensity.toFixed(2)}</td>
                        <td className={`p-3 font-medium ${diffColor}`}>
                          {item.percentDiff > 0 ? '+' : ''}{item.percentDiff.toFixed(2)}%
                        </td>
                        <td className="p-3 text-center">
                          {item.ghgIntensity <= 89.3368 ? '✅ Yes' : '❌ No'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-4 text-center">GHG Intensity Chart</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} />
                  <Legend />
                  <ReferenceLine y={89.3368} stroke="#ef4444" strokeDasharray="4 4" label="Target (89.33)" />
                  <ReferenceLine y={comparison.baseline.ghgIntensity} stroke="#6366f1" strokeDasharray="4 4" label="Baseline" />
                  <Bar dataKey="ghgIntensity" name="GHG Intensity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
