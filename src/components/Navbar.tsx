'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBagIcon, UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import './Navbar.css';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const cartItems = useCartStore((state) => state.items);
  const { user, logout, hasHydrated: userHydrated } = useUserStore();
  const { hasHydrated: authHydrated } = useAuthStore();
  const authLogout = useAuthStore((state) => state.logout);

  // Wait for both stores to hydrate before rendering auth-dependent UI

  const addToast = useToastStore((state) => state.addToast);

  const handleLogout = () => {
    logout();
    authLogout();
    addToast('Successfully logged out!', 'success');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">Premium Shop</Link>
      </div>

      <div className="nav-links">
        <Link href="/products" className={pathname === '/products' ? 'active' : ''}>
          Products
        </Link>
        <Link href="/categories" className={pathname === '/categories' ? 'active' : ''}>
          Categories
        </Link>
      </div>

      <div className="nav-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle" 
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon className="icon" /> : <SunIcon className="icon" />}
        </button>

        <Link href="/cart" className="cart-link">
          <ShoppingBagIcon className="icon" />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </Link>

        {user ? (
          <div className="user-menu">
            <button
              className={`profile-icon-btn ${pathname === '/profile' ? 'active' : ''}`}
              onClick={() => router.push('/profile')}
              aria-label="Go to profile"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <UserIcon className="icon" />
              <span className="user-name">{user?.name}</span>
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className={pathname === '/auth/login' ? 'active' : ''}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
