'use client';

import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Product } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import './DraggableCartItem.css';

interface DraggableCartItemProps {
  product: Product;
}

export default function DraggableCartItem({ product }: DraggableCartItemProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const elementRef = useRef<HTMLDivElement>(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
      return;
    }
    addItem(product);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PRODUCT',
    item: product,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        handleAddToCart();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Combine refs
  drag(elementRef);

  return (
    <motion.div
      ref={elementRef}
      className={`draggable-product ${isDragging ? 'dragging' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <button
          className="add-to-cart"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <AnimatePresence>
          {showLoginMessage && (
            <motion.div
              className="login-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Please log in to add items to cart
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
