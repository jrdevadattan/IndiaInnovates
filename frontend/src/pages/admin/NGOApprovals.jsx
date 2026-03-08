import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NGOApprovals() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/ngos?status=PENDING_APPROVAL&limit=100')
      .then((r) => setNgos(r.data.ngos || []))
      .catch(() => toast.error('Failed to load NGO applications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (ngoId, action) => {
    try {
      await api.patch(`/admin/ngos/${ngoId}/${action}`);
      toast.success(`NGO ${action === 'approve' ? 'approved' : 'rejected'}`);
      setNgos((prev) => prev.filter((n) => n._id !== ngoId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">NGO Approval Queue</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : ngos.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-4xl mb-3">✅</p>
          <p>No pending NGO applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ngos.map((ngo) => (
            <div key={ngo._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{ngo.name}</h3>
                  <p className="text-sm text-gray-400">{ngo.email}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>Reg: {ngo.registrationNumber}</span>
                    <span>City: {ngo.city}</span>
                    <span>State: {ngo.state}</span>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {ngo.categories?.map((c) => (
                      <span key={c} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 mt-3">{ngo.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAction(ngo._id, 'approve')}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(ngo._id, 'reject')}
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
