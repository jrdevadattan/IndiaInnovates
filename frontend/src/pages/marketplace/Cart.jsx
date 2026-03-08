import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';
import { initiateCheckout } from '../../services/marketplace.service';
import { FiShoppingCart, FiPackage, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      await initiateCheckout({ items });
      toast.success('Order placed! Razorpay integration enabled on backend.');
      clearCart();
      navigate('/marketplace/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-stone-500 hover:text-[#1a1a1a] text-sm mb-5 transition-colors"
        >
          <FiArrowLeft size={15} /> Back
        </button>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 text-center py-20 px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F5F2] flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart size={24} className="text-stone-400" />
            </div>
            <p className="text-stone-500 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-[#1a1a1a] hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.productId} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F5F5F2] rounded-xl overflow-hidden flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-stone-300"><FiPackage size={22} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a1a1a] truncate">{item.name}</p>
                    <p className="text-[#5c8a00] text-sm">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 bg-[#F5F5F2] hover:bg-stone-200 rounded-lg text-sm font-bold text-[#1a1a1a] transition-colors"
                    >-</button>
                    <span className="text-sm w-7 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 bg-[#F5F5F2] hover:bg-stone-200 rounded-lg text-sm font-bold text-[#1a1a1a] transition-colors"
                    >+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1a1a1a]">₹{(item.price * item.quantity).toFixed(0)}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-stone-400 hover:text-red-500 mt-1 flex items-center gap-1 ml-auto transition-colors"
                    >
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium text-[#1a1a1a]">₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-stone-500">Delivery</span>
                <span className="text-[#5c8a00] font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-stone-100 pt-4">
                <span className="text-[#1a1a1a]">Total</span>
                <span className="text-[#5c8a00]">₹{getTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-[#1a1a1a] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
