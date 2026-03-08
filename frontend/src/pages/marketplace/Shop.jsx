import { useState, useEffect } from 'react';
import { getProducts } from '../../services/marketplace.service';
import useCartStore from '../../store/cartStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiPackage, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['ALL', 'HANDICRAFTS', 'ORGANIC_FOOD', 'ECO_FRIENDLY', 'ART', 'CLOTHING', 'OTHER'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const { addItem, getCount } = useCartStore();

  useEffect(() => {
    const params = {};
    if (category !== 'ALL') params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then((r) => setProducts(r.data.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {};
    if (category !== 'ALL') params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then((r) => setProducts(r.data.products || []))
      .catch(() => toast.error('Search failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">NGO Marketplace</h1>
          <Link
            to="/marketplace/cart"
            className="relative flex items-center gap-2 bg-[#1a1a1a] hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <FiShoppingCart size={15} />
            Cart
            {getCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8ED462] text-[#1a1a1a] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{getCount()}</span>
            )}
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-stone-400 focus:outline-none focus:border-[#8ED462] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FiSearch size={14} />
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === c
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-stone-400 py-20">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md hover:border-[#8ED462]/40 transition-all group">
                <Link to={`/marketplace/product/${p._id}`}>
                  <div className="h-44 bg-[#F5F5F2] overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <FiPackage size={40} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/marketplace/product/${p._id}`}>
                    <p className="font-semibold text-[#1a1a1a] text-sm truncate hover:text-[#5c8a00] transition-colors">{p.name}</p>
                  </Link>
                  <p className="text-xs text-stone-400 mt-0.5 truncate uppercase tracking-wide">{p.category?.replace('_', ' ')}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#5c8a00] font-bold text-base">₹{p.price}</span>
                    <button
                      onClick={() => { addItem(p); toast.success('Added to cart!'); }}
                      disabled={p.stock < 1}
                      className="bg-[#1a1a1a] hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      {p.stock < 1 ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-stone-400 py-20">No products found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
