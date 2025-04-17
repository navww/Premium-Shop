'use client';

import { motion } from 'framer-motion';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type: 'product' | 'cart-item' | 'order';
  count?: number;
}

export default function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="skeleton-product">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-title" />
              <div className="skeleton-price" />
              <div className="skeleton-button" />
            </div>
          </div>
        );

      case 'cart-item':
        return (
          <div className="skeleton-cart-item">
            <div className="skeleton-image small" />
            <div className="skeleton-content">
              <div className="skeleton-title" />
              <div className="skeleton-price small" />
            </div>
            <div className="skeleton-quantity" />
          </div>
        );

      case 'order':
        return (
          <div className="skeleton-order">
            <div className="skeleton-order-header">
              <div className="skeleton-order-id" />
              <div className="skeleton-order-date" />
            </div>
            <div className="skeleton-order-items">
              <div className="skeleton-image small" />
              <div className="skeleton-image small" />
              <div className="skeleton-image small" />
            </div>
            <div className="skeleton-order-total" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
}
