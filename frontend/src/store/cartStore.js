import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === product._id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                ngoId: product.ngoId,
                quantity,
              },
            ],
          }));
        }
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return get().removeItem(productId);
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'lifeline-cart' }
  )
);

export default useCartStore;
