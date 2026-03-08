import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#8ED462', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function PublicImpactDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((r) => setStats(r.data.stats))
      .catch(() => toast.error('Could not load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">
      Loading impact data...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-1">Community Impact Dashboard</h1>
        <p className="text-stone-400 text-sm mb-8">Real-time civic engagement and resolution statistics</p>

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Reports', value: stats.totalReports,    color: 'text-blue-600' },
                { label: 'Resolved',      value: stats.resolvedReports, color: 'text-[#5c8a00]' },
                { label: 'Active NGOs',   value: stats.activeNgos,      color: 'text-purple-600' },
                { label: 'Volunteers',    value: stats.volunteers,      color: 'text-orange-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
                  <div className={`text-3xl font-bold ${s.color}`}>{(s.value ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {stats.monthlyCounts && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 mb-6">
                <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Reports Per Month</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.monthlyCounts}>
                    <XAxis dataKey="month" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', color: '#1a1a1a', borderRadius: 12 }} />
                    <Bar dataKey="count" fill="#8ED462" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {stats.categoryBreakdown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
                  <h2 className="text-base font-bold text-[#1a1a1a] mb-4">By Category</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={stats.categoryBreakdown} dataKey="count" nameKey="category" innerRadius={60} outerRadius={90} paddingAngle={3}>
                        {stats.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', color: '#1a1a1a', borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {stats.categoryBreakdown.map((d, i) => (
                      <span key={i} className="text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-stone-500">{d.category}: {d.count}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {stats.resolutionTrend && (
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
                    <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Resolution Rate Trend</h2>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={stats.resolutionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="date" tick={{ fill: '#a8a29e', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#a8a29e', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', color: '#1a1a1a', borderRadius: 12 }} />
                        <Line type="monotone" dataKey="rate" stroke="#8ED462" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
