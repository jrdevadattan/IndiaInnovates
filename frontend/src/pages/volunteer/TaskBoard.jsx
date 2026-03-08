import { useState, useEffect } from 'react';
import { getReports } from '../../services/reports.service';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function TaskBoard() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ASSIGNED');

  useEffect(() => {
    getReports({ assignedTo: user?._id, status: filter, limit: 100 })
      .then((r) => setTasks(r.data.reports || []))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [filter, user]);

  const SEVERITY_COLOR = {
    CRITICAL: 'bg-red-100 text-red-600',
    HIGH:     'bg-orange-100 text-orange-600',
    MEDIUM:   'bg-amber-100 text-amber-600',
    LOW:      'bg-stone-100 text-stone-500',
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-5">My Task Board</h1>

        <div className="flex gap-2 flex-wrap mb-6">
          {['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setLoading(true); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-stone-400 py-16">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md hover:border-[#8ED462]/40 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#1a1a1a] text-sm flex-1 mr-2">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${SEVERITY_COLOR[task.severity] || 'bg-stone-100 text-stone-500'}`}>
                    {task.severity}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-medium">{task.category}</span>
                  <span>{task.city}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.slaDeadline && (
                    <span className={new Date(task.slaDeadline) < new Date() ? 'text-red-500 font-medium' : 'text-stone-400'}>
                      SLA: {new Date(task.slaDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="col-span-full text-center text-stone-400 py-16">No tasks found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
