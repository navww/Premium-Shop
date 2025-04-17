'use client';

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import './DroppableCart.css';

export default function DroppableCart() {
  const { items, total } = useCartStore();
  const elementRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PRODUCT',
    drop: () => ({ name: 'Cart' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Combine refs
  drop(elementRef);

  return (
    <motion.div
      ref={elementRef}
      className={`droppable-cart ${isOver ? 'drag-over' : ''}`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
                <p className="quantity">Qty: {item.quantity}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-button">Checkout</button>
      </div>
    </motion.div>
  );
}
