import { useState, useEffect } from 'react';
import { getReports, updateReportStatus } from '../../services/reports.service';
import { getNgoDashboard, assignVolunteer } from '../../services/ngo.service';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const STATUS_COLS = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
const STATUS_COLOR = {
  SUBMITTED:   'bg-stone-100 border border-stone-200',
  ASSIGNED:    'bg-blue-50 border border-blue-100',
  IN_PROGRESS: 'bg-amber-50 border border-amber-100',
  RESOLVED:    'bg-[#8ED462]/10 border border-[#8ED462]/20',
};
const STATUS_LABEL_COLOR = {
  SUBMITTED:   'text-stone-500',
  ASSIGNED:    'text-blue-600',
  IN_PROGRESS: 'text-amber-600',
  RESOLVED:    'text-[#5c8a00]',
};

export default function NGODashboard() {
  const { user } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    if (!user?.ngoId) return;
    Promise.all([
      getReports({ ngoId: user.ngoId, limit: 100 }),
      getNgoDashboard(user.ngoId),
    ]).then(([rRes, dRes]) => {
      setReports(rRes.data.reports || []);
      setStats(dRes.data.stats || null);
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDrop = async (newStatus) => {
    if (!dragging) return;
    try {
      await updateReportStatus(dragging._id, newStatus);
      setReports((prev) =>
        prev.map((r) => (r._id === dragging._id ? { ...r, status: newStatus } : r))
      );
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
    setDragging(null);
  };

  const byStatus = (status) => reports.filter((r) => r.status === status);

  if (loading) return <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">NGO Operations Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Cases', value: stats.totalCases },
            { label: 'Active',      value: stats.activeCases },
            { label: 'Resolved',    value: stats.resolvedCases },
            { label: 'Volunteers',  value: stats.volunteers },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <div className="text-3xl font-bold text-[#5c8a00]">{s.value ?? 0}</div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLS.map((status) => (
          <div
            key={status}
            className={`min-w-[260px] ${STATUS_COLOR[status]} rounded-2xl p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(status)}
          >
            <div className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between ${STATUS_LABEL_COLOR[status]}`}>
              {status.replace('_', ' ')}
              <span className="bg-white text-[#1a1a1a] text-xs px-2 py-0.5 rounded-full shadow-sm border border-stone-100">{byStatus(status).length}</span>
            </div>
            <div className="space-y-2">
              {byStatus(status).map((r) => (
                <div
                  key={r._id}
                  draggable
                  onDragStart={() => setDragging(r)}
                  className="bg-white rounded-xl p-3 cursor-grab active:cursor-grabbing border border-stone-100 hover:border-[#8ED462]/50 hover:shadow-sm transition-all"
                >
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">{r.title}</p>
                  <p className="text-xs text-stone-400 mt-1 truncate">{r.category} · {r.city}</p>
                  <div className="flex gap-1 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.severity === 'HIGH' || r.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-600'
                        : r.severity === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-stone-100 text-stone-500'
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                </div>
              ))}
              {byStatus(status).length === 0 && (
                <p className="text-xs text-stone-400 text-center py-4">No cases</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
