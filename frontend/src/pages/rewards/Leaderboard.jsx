import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/rewards.service';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { FiUser } from 'react-icons/fi';

const PODIUM_COLORS = ['text-yellow-500', 'text-stone-400', 'text-orange-500'];
const MEDALS = ['#1', '#2', '#3'];

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard({ period, limit: 50 })
      .then((r) => setEntries(r.data.leaderboard || []))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-5">Community Leaderboard</h1>

        <div className="flex gap-2 mb-6">
          {[['all', 'All Time'], ['month', 'This Month'], ['week', 'This Week']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setPeriod(v); setLoading(true); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                period === v
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-stone-400 py-10">Loading...</div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, idx) => {
              const isMe = entry.userId === user?._id || entry.userId?._id === user?._id;
              return (
                <div
                  key={entry.userId?._id || idx}
                  className={`flex items-center gap-4 bg-white rounded-2xl border shadow-sm p-4 transition-colors ${
                    isMe ? 'border-[#8ED462] ring-1 ring-[#8ED462]/30' : 'border-stone-100'
                  }`}
                >
                  <div className={`text-sm font-bold w-8 text-center ${PODIUM_COLORS[idx] || 'text-stone-400'}`}>
                    {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F2] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {entry.avatar
                      ? <img src={entry.avatar} alt="" className="w-full h-full object-cover" />
                      : <FiUser size={16} className="text-stone-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${ isMe ? 'text-[#5c8a00]' : 'text-[#1a1a1a]'}`}>
                      {entry.name} {isMe && <span className="text-xs font-normal text-stone-400">(You)</span>}
                    </p>
                    <p className="text-xs text-stone-400">{entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#5c8a00]">{entry.totalPoints?.toLocaleString()}</p>
                    <p className="text-xs text-stone-400">pts</p>
                  </div>
                </div>
              );
            })}
            {entries.length === 0 && (
              <p className="text-center text-stone-400 py-10">No entries yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
