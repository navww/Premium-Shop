'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import './cart.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  const handleRemoveItem = (id: number, title: string) => {
    removeItem(id);
    toast.success(`Removed ${title} from cart`, {
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: 'var(--menu-background)',
        color: 'var(--text-color)',
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your cart is empty</h1>
        <p>Add some items to your cart to see them here</p>
        <Link href="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="item-image" />
              <div className="item-details">
                <h3>{item.title}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id, item.title)}
                className="remove-item"
                aria-label="Remove item"
              >
                <TrashIcon className="trash-icon" />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
