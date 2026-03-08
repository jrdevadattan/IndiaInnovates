import { useState, useEffect } from 'react';
import { getReports } from '../../services/reports.service';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['ALL', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function NGOCases() {
  const { user } = useAuthStore();
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.ngoId) return;
    getReports({ ngoId: user.ngoId, limit: 200 })
      .then((r) => setCases(r.data.reports || []))
      .catch(() => toast.error('Failed to load cases'))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === 'ALL' ? cases : cases.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Case Management</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
                <th className="pb-2 pr-4">Title</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Severity</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">City</th>
                <th className="pb-2">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-gray-800 transition-colors">
                  <td className="py-3 pr-4 font-medium max-w-[180px] truncate">{c.title}</td>
                  <td className="py-3 pr-4 text-gray-400">{c.category}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${c.severity === 'CRITICAL' ? 'bg-red-800 text-red-200' : c.severity === 'HIGH' ? 'bg-orange-800 text-orange-200' : c.severity === 'MEDIUM' ? 'bg-yellow-800 text-yellow-200' : 'bg-gray-700 text-gray-300'}`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300">{c.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{c.city}</td>
                  <td className="py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No cases found.</p>
          )}
        </div>
      )}
    </div>
  );
}
