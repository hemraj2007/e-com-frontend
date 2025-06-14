'use client';

import React, { useRef, useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { AiOutlineShopping } from "react-icons/ai";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/navigation";

const Wishlist = () => {
  const wishlistRef = useRef();
  const { wishlistItems = [], onRemoveFromWishlist, onAdd } = useStateContext();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignIn = () => {
    router.push("/login?next=/wishlist");
  };

  const handleStartShopping = () => {
    router.push("/products");
  };

  const handleMoveToCart = (item) => {
    onAdd(item, 1);                  // Cart me add karega 1 quantity ke saath
    onRemoveFromWishlist(item);      // Wishlist se hata dega
  };

  const wishlistCount = wishlistItems.length;

  return (
    <div className="wishlist-wrapper" ref={wishlistRef}>
      <h2>Your Wishlist ({wishlistCount})</h2>

      <div className="wishlist-container">
        {!isLoggedIn ? (
          <div className="empty-wishlist">
            <AiOutlineShopping size={150} />
            <h1>Please Sign In to view your wishlist</h1>
            <button onClick={handleSignIn} className="login-button">
              Sign In
            </button>
          </div>
        ) : wishlistCount === 0 ? (
          <div className="empty-wishlist">
            <AiOutlineShopping size={150} />
            <h1>Your wishlist is empty</h1>
            <button onClick={handleStartShopping} className="start-shopping-button">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-details">
                  <div className="name-and-remove">
                    <h3>{item.name}</h3>
                    <button
                      type="button"
                      onClick={() => onRemoveFromWishlist(item)}
                      className="remove-item"
                    >
                      <HiOutlineTrash size={24} />
                    </button>
                  </div>
                  <p className="price">₹ {item.net_price}</p>

                  <button
                    className="move-to-cart-button"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
