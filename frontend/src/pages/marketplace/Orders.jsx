import { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/marketplace.service';
import toast from 'react-hot-toast';
import { FiPackage } from 'react-icons/fi';

const STATUS_BADGE = {
  PENDING:   'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-[#8ED462]/20 text-[#5c8a00]',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">Loading...</div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 text-center py-20 px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F5F2] flex items-center justify-center mx-auto mb-4">
              <FiPackage size={24} className="text-stone-400" />
            </div>
            <p className="text-stone-500">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_BADGE[order.status] || 'bg-stone-100 text-stone-500'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-stone-600">{item.name} × {item.quantity}</span>
                      <span className="text-[#5c8a00] font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-stone-100 mt-3">
                  <span className="text-[#1a1a1a]">Total</span>
                  <span className="text-[#5c8a00]">₹{order.totalAmount}</span>
                </div>
                {order.trackingNumber && (
                  <p className="text-xs text-blue-500 mt-2">Tracking: {order.trackingNumber}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
