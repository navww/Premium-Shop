import React from 'react';

interface OrderSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="order-success-modal-overlay">
      <div className="order-success-modal">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order is being processed.</p>
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
