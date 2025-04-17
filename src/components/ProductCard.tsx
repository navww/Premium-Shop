'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  // Simulated multiple product images
  const images = [
    product.image,
    product.image.replace('.jpg', '-2.jpg'),
    product.image.replace('.jpg', '-3.jpg'),
  ];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!user) {
      addToast('Please login to add items to cart', 'info');
      router.push('/auth/login');
      return;
    }
    addItem(product);
    addToast('Added to cart!', 'success');
  };

  return (
    <motion.div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Link href={`/products/${product.id}`} className="product-image-container">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={product.title}
          className="product-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {isHovered && (
          <>
            <button className="image-nav prev" onClick={handlePrevImage}>
              <ChevronLeftIcon className="nav-icon" />
            </button>
            <button className="image-nav next" onClick={handleNextImage}>
              <ChevronRightIcon className="nav-icon" />
            </button>
          </>
        )}
      </Link>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button 
          onClick={handleAddToCart}
          className="add-to-cart-button"
          disabled={!user}
        >
          <ShoppingBagIcon className="cart-icon" />
          {user ? 'Add to Cart' : 'Login to Add'}
        </button>
      </div>
    </motion.div>
  );
}
