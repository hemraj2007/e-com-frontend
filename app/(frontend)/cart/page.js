'use client'; // Client-side component hai ye

import React, { useRef } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';
import getStripe from '@/lib/getStripe';
import { useRouter } from 'next/navigation'; // Navigation ke liye

const Cart = () => {
  const cartRef = useRef();
  const router = useRouter(); // Router initialize kiya

  // Context se user ka data bhi le rahe hain
  const { cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity, user } = useStateContext();

  // Updated handleCheckout function with login check
  const handleCheckout = async () => {
    // Pehle check karo user logged in hai ya nahi
    if (!user) {
      toast.error('Checkout karne ke liye pehle login karein');
      router.push('/login'); // Login page pe redirect
      return; // Yahan function ko rok do
    }

    // User logged in hai toh Stripe process continue karo
    try {
      const stripe = await getStripe();

      // Loading message show karo
      toast.loading('Checkout process shuru kar rahe hain...');

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id // User ID bhi bhejo for server-side verification
        }),
      });

      // Agar error aaya toh
      if (response.statusCode === 500) {
        toast.dismiss();
        toast.error('Checkout process mein error aaya');
        return;
      }

      const data = await response.json();
      toast.dismiss();

      // Stripe checkout page pe redirect
      stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      toast.dismiss();
      toast.error('Kuch toh gadbad hai! Phir se try karein');
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 && (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
              <button 
                className='btn' 
                onClick={() => router.push('/')}
              >
                Shopping continue karein
              </button>
            </div>
          )}

          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div key={item.id} className='item-card'>
                <div className='item-image'>
                  {/* Product image (currently commented) */}
                  {/* <img src={urlFor(item?.image[0])} alt='img' /> */}
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

                  <p className='item-tag'>Dress</p>
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
            ))}
        </div>

        {cartItems.length >= 1 && (
          <div className='order-summary'>
            <h3>Order Summary</h3>
            <div className='qty'>
              <p>Quantity</p>
              <span>{totalQty} Product</span>
            </div>
            <div className='subtotal'>
              <p>Sub Total</p>
              <span>₹{totalPrice}</span>
            </div>
            <div>
              <button 
                className='btn' 
                type='button' 
                onClick={handleCheckout}
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;