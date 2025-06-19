'use client';

import React, { useRef, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';
import getStripe from '@/lib/getStripe';
import { useRouter } from 'next/navigation';

const Cart = () => {
  const cartRef = useRef();
  const router = useRouter();
  const { cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity, user } = useStateContext();

  // Automatic redirection based on auth status
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      toast.error('Please login to access your cart');
    } else if (user && cartItems.length === 0) {
      // If logged in but cart is empty, redirect to products page
      router.push('/products');
      toast('Your cart is empty, browse our products', { icon: '🛒' });
    }
  }, [user, cartItems.length, router]);

  const handleCheckout = async () => {
    try {
      const stripe = await getStripe();
      toast.loading('Processing your checkout...');

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      toast.dismiss();
      stripe.redirectToCheckout({ sessionId: data.id });

    } catch (error) {
      toast.dismiss();
      toast.error('Checkout failed. Please try again');
      console.error('Checkout error:', error);
    }
  };

  // If not logged in, this component will redirect before rendering
  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 ? (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
              <button 
                className='btn' 
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className='item-card'>
                <div className='item-image'>
                  {/* Product image would go here */}
                </div>

                <div className='item-details'>
                  <div className='name-and-remove'>
                    <h3>{item.name}</h3>
                    <button 
                      type='button' 
                      onClick={() => onRemove(item)} 
                      className='remove-item'
                    >
                      <HiOutlineTrash size={28} />
                    </button>
                  </div>

                  <p className='item-tag'>{item.category || 'Product'}</p>
                  <p className='delivery-est'>Delivery Estimation</p>
                  <p className='delivery-days'>5 Working Days</p>

                  <div className='price-and-qty'>
                    <span className='price'>₹{item.net_price * item.quantity}</span>
                    <div>
                      <span 
                        className='minus' 
                        onClick={() => toggleCartItemQuantity(item.id, 'dec')}
                      >
                        <AiOutlineMinus />
                      </span>
                      <span className='num'>{item.quantity}</span>
                      <span 
                        className='plus' 
                        onClick={() => toggleCartItemQuantity(item.id, 'inc')}
                      >
                        <AiOutlinePlus />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length >= 1 && (
          <div className='order-summary'>
            <h3>Order Summary</h3>
            <div className='qty'>
              <p>Quantity</p>
              <span>{totalQty} {totalQty > 1 ? 'Products' : 'Product'}</span>
            </div>
            <div className='subtotal'>
              <p>Sub Total</p>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <button 
              className='btn' 
              type='button' 
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;