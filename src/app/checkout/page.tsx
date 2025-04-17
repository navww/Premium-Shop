'use client';


import React,{ useState } from 'react';
import OrderSuccessModal from './OrderSuccessModal';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import './checkout.css';

interface ShippingDetails {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user, addOrder } = useUserStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  if (!user || items.length === 0) {
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order
      addOrder({
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        items: items.map(item => ({
          id: String(Date.now()),
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total,
        status: 'processing',
        shippingAddress: shipping,
      });

      // Clear cart and show success
      clearCart();
      setStep(3);
      setShowOrderModal(true);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OrderSuccessModal open={showOrderModal} onClose={() => setShowOrderModal(false)} />
      <div className="checkout-container">
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          Shipping
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          Payment
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          Confirmation
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleShippingSubmit} className="checkout-form">
          <h2>Shipping Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={shipping.fullName}
                onChange={e => setShipping({ ...shipping, fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                value={shipping.street}
                onChange={e => setShipping({ ...shipping, street: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={shipping.city}
                onChange={e => setShipping({ ...shipping, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                value={shipping.state}
                onChange={e => setShipping({ ...shipping, state: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                value={shipping.zipCode}
                onChange={e => setShipping({ ...shipping, zipCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={shipping.country}
                onChange={e => setShipping({ ...shipping, country: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="checkout-button">
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="checkout-form">
          <h2>Payment Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={payment.cardNumber}
                onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={payment.expiryDate}
                onChange={e => setPayment({ ...payment, expiryDate: e.target.value })}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={payment.cvv}
                onChange={e => setPayment({ ...payment, cvv: e.target.value })}
                placeholder="123"
                required
              />
            </div>
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.title} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="back-button"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="confirmation">
          <div className="confirmation-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Your order has been successfully placed.</p>
          <button
            onClick={() => router.push('/profile')}
            className="checkout-button"
          >
            View Order History
          </button>
        </div>
      )}
    </div>
    </>

  );
}
