import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  orders: Order[];
  wishlist: Product[];
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserState {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  hasHydrated: boolean;
  addOrder: (order: Order) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      user: null,
      users: [],
      addOrder: (order) => {
        set(state => {
          if (!state.user) return {};
          // Add the new order to the user's orders
          const updatedUser = {
            ...state.user,
            orders: [...state.user.orders, order],
          };
          // Also update the user in the users array if needed
          const updatedUsers = state.users.map(u =>
            u.id === state.user!.id ? updatedUser : u
          );
          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },
      login: async (email, password) => {
        const state = get();
        const user = state.users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        set({ user: { ...user, password: '' } });
      },
      register: async (name, email, password) => {
        const state = get();
        if (state.users.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
          orders: [],
          wishlist: [],
        };

        set(state => ({
          users: [...state.users, newUser],
          user: { ...newUser, password: '' }, // Set the user as logged in after registration
        }));

        return Promise.resolve(); // Return a resolved promise to match the async signature
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
      },
      addToWishlist: (product) => {
        set(state => {
          if (!state.user) return state;
          const user = { ...state.user };
          if (!user.wishlist.some(p => p.id === product.id)) {
            user.wishlist = [...user.wishlist, product];
          }
          return { user };
        });
      },
      removeFromWishlist: (productId) => {
        set(state => {
          if (!state.user) return state;
          const user = { ...state.user };
          user.wishlist = user.wishlist.filter(p => p.id !== productId);
          return { user };
        });
      },
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: (state) => {
        return () => {
          
          (state as any)?.setState?.({ hasHydrated: true });
        };
      },
      partialize: (state) => ({
        users: state.users,
        user: state.user, // Persist the logged-in user!
      }),
    }
  )
);
