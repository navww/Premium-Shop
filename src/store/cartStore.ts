import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/services/api';
import { useAuthStore } from './authStore';
import { useToastStore } from './toastStore';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isOffline: boolean;
  pendingSync: CartItem[];
  setPendingSync: (items: CartItem[]) => void;
  syncWithServer: () => Promise<void>;
  setOfflineStatus: (status: boolean) => void;
}

const isClient = typeof window !== 'undefined';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pendingSync: [],
      isOffline: false,
      addItem: (product: Product) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
          useToastStore.getState().addToast('Please login to add items to cart', 'error');
          return false;
        }

        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          useToastStore.getState().addToast(`Added another ${product.title} to cart`, 'success');
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
          useToastStore.getState().addToast(`Added ${product.title} to cart`, 'success');
        }
        return true;
      },
      removeItem: (productId: number) => {
        const { items } = get();
        const item = items.find((i) => i.id === productId);
        if (item) {
          set({
            items: items.filter((i) => i.id !== productId),
          });
          useToastStore.getState().addToast(`Removed ${item.title} from cart`, 'info');
        }
      },
      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: 0,
      setPendingSync: (items: CartItem[]) => set({ pendingSync: items }),
      setOfflineStatus: (status: boolean) => set({ isOffline: status }),
      syncWithServer: async () => {
        const { pendingSync } = get();
        // Implement sync logic here
        set({ pendingSync: [] });
      },
    }),
    {
      name: 'shopping-cart',
      partialize: (state) => ({
        items: state.items,
        pendingSync: state.pendingSync,
      }),
    }
  )
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Initialize online/offline listeners only in browser environment
if (isClient) {
  window.addEventListener('online', () => {
    const { syncWithServer, setOfflineStatus } = useCartStore.getState();
    setOfflineStatus(false);
    syncWithServer();
  });

  window.addEventListener('offline', () => {
    useCartStore.getState().setOfflineStatus(true);
  });
}
