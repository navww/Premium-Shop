'use client';

import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart!', {
      icon: '🛍️',
      style: {
        borderRadius: '10px',
        background: 'var(--menu-background)',
        color: 'var(--text-color)',
      },
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-all ${className}`}
    >
      Add to Cart
    </button>
  );
}
