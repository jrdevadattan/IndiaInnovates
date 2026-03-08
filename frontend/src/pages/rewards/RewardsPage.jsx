import { useState, useEffect } from 'react';
import { getMyRewards, getCatalog, redeem, downloadCertificate } from '../../services/rewards.service';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiAward, FiFileText, FiZap, FiStar, FiTrendingUp, FiGift } from 'react-icons/fi';

const LEVEL_COLOR = {
  BRONZE:   'text-orange-500 bg-orange-50',
  SILVER:   'text-stone-500 bg-stone-100',
  GOLD:     'text-yellow-600 bg-yellow-50',
  PLATINUM: 'text-cyan-600 bg-cyan-50',
  DIAMOND:  'text-blue-600 bg-blue-50',
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyRewards(), getCatalog()])
      .then(([r, c]) => { setRewards(r.data.rewards); setCatalog(c.data.catalog || []); })
      .catch(() => toast.error('Failed to load rewards'))
      .finally(() => setLoading(false));
  }, []);

  const handleRedeem = async (itemId, cost) => {
    if (rewards?.balance < cost) { toast.error('Insufficient points'); return; }
    try {
      const { data } = await redeem(itemId);
      setRewards((prev) => ({ ...prev, balance: prev.balance - cost }));
      toast.success(data.message || 'Redeemed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Redemption failed');
    }
  };

  const handleCertDownload = async () => {
    try {
      const { data } = await downloadCertificate();
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lifeline-certificate.pdf';
      a.click();
    } catch {
      toast.error('Failed to download certificate');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">My Rewards</h1>
          <div className="flex gap-2">
            <Link
              to="/rewards/leaderboard"
              className="flex items-center gap-2 bg-white border border-stone-200 hover:border-stone-400 text-[#1a1a1a] px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <FiAward size={14} /> Leaderboard
            </Link>
            <button
              onClick={handleCertDownload}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <FiFileText size={14} /> Certificate
            </button>
          </div>
        </div>

        {rewards && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#8ED462]/15 flex items-center justify-center mx-auto mb-2">
                <FiStar size={18} className="text-[#5c8a00]" />
              </div>
              <div className="text-2xl font-bold text-[#1a1a1a]">{rewards.balance.toLocaleString()}</div>
              <div className="text-xs text-stone-400 mt-0.5 font-medium uppercase tracking-wide">Points Balance</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F2] flex items-center justify-center mx-auto mb-2">
                <FiAward size={18} className="text-[#1a1a1a]" />
              </div>
              <div className={`text-2xl font-bold ${LEVEL_COLOR[rewards.level]?.split(' ')[0] || 'text-[#1a1a1a]'}`}>{rewards.level}</div>
              <div className="text-xs text-stone-400 mt-0.5 font-medium uppercase tracking-wide">Level</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
                <FiZap size={18} className="text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-[#1a1a1a]">{rewards.xp}</div>
              <div className="text-xs text-stone-400 mt-0.5 font-medium uppercase tracking-wide">XP</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
                <FiTrendingUp size={18} className="text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-[#1a1a1a]">{rewards.streak}</div>
              <div className="text-xs text-stone-400 mt-0.5 font-medium uppercase tracking-wide">Day Streak</div>
            </div>
          </div>
        )}

        {rewards?.badges?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-[#1a1a1a] mb-3">Badges</h2>
            <div className="flex gap-3 flex-wrap">
              {rewards.badges.map((badge, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 text-center min-w-[80px]">
                  <div className="w-10 h-10 rounded-xl bg-[#8ED462]/15 flex items-center justify-center mx-auto mb-2">
                    <FiAward size={18} className="text-[#5c8a00]" />
                  </div>
                  <div className="text-xs text-stone-500 font-medium">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-base font-bold text-[#1a1a1a] mb-3">Redeem Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {catalog.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F2] flex items-center justify-center mb-3">
                <FiGift size={18} className="text-[#1a1a1a]" />
              </div>
              <p className="font-semibold text-[#1a1a1a] text-[15px]">{item.name}</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[#5c8a00] font-bold text-sm">{item.cost} pts</span>
                <button
                  onClick={() => handleRedeem(item.id, item.cost)}
                  className="bg-[#1a1a1a] hover:bg-black text-white text-xs px-4 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
