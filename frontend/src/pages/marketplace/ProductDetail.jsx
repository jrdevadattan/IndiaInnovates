import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../services/marketplace.service';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    getProduct(id)
      .then((r) => setProduct(r.data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-stone-400">Loading...</div>
  );
  if (!product) return (
    <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center text-red-500">Product not found.</div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-stone-500 hover:text-[#1a1a1a] text-sm mb-5 transition-colors"
        >
          <FiArrowLeft size={15} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden h-80 mb-3 shadow-sm">
              {product.images?.length > 0 ? (
                <img src={product.images[img]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-200">
                  <FiPackage size={56} />
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImg(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === img ? 'border-[#8ED462]' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">{product.category?.replace('_', ' ')}</span>
            <h1 className="text-2xl font-bold text-[#1a1a1a] mt-1">{product.name}</h1>
            <p className="text-3xl font-bold text-[#5c8a00] mt-3">₹{product.price}</p>
            <p className="text-sm text-stone-500 mt-4 leading-relaxed">{product.description}</p>
            <p className="text-xs text-stone-400 mt-2">{product.stock} in stock</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center bg-[#F5F5F2] rounded-xl overflow-hidden border border-stone-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 hover:bg-stone-200 font-bold text-[#1a1a1a] transition-colors"
                >-</button>
                <span className="px-4 py-2 font-medium text-[#1a1a1a]">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2.5 hover:bg-stone-200 font-bold text-[#1a1a1a] transition-colors"
                >+</button>
              </div>
              <button
                onClick={() => { addItem(product, qty); toast.success('Added to cart!'); }}
                disabled={product.stock < 1}
                className="flex-1 bg-[#1a1a1a] hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
