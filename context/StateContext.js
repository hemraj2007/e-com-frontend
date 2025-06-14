'use client'; // Yeh line bata rahi hai ki ye pura component client-side par run karega

import React, { createContext, useContext, useState } from "react";    // Context create karne, use karne aur state handle karne ke liye React se import

import { toast } from "react-hot-toast";   // Notifications ya alerts dikhane ke liye react-hot-toast se import


// 1️⃣ Context create kar rahe hain
const Context = createContext();

// 2️⃣ StateContext component banaya jo saari state ko children components ko provide karega
export const StateContext = ({ children }) => {
  // Cart ke liye states
  const [showCart, setShowCart] = useState(false); // Cart dikhana ya nahi
  const [cartItems, setCartItems] = useState([]); // Cart me added items
  const [totalPrice, setTotalPrice] = useState(0); // Total cart price
  const [totalQty, setTotalQty] = useState(0); // Total cart quantity
  const [qty, setQty] = useState(1); // Ek item ka quantity (add karne ke time)
  
  // Wishlist ke liye state
  const [wishlistItems, setWishlistItems] = useState([]); 

  //  Product ko cart me add karne ka function
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item.id === product.id);
    
    // Total price aur quantity update karo
    setTotalPrice((prev) => prev + product.net_price * quantity);
    setTotalQty((prev) => prev + quantity);

    if (checkProductInCart) {
      // Agar product already hai cart me, to uski quantity badhao
      const updatedCartItems = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      // Naya product add karo cart me
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  // 🗑️ Product ko cart se hatao
  const onRemove = (product) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    setCartItems(updatedCartItems);
    setTotalPrice((prev) => prev - product.net_price * product.quantity);
    setTotalQty((prev) => prev - product.quantity);
    toast.success(`${product.name} removed from cart.`);
  };

  // 🔄 Cart me product quantity increase/decrease karo
  const toggleCartItemQuantity = (id, value) => {
    const foundProduct = cartItems.find((item) => item.id === id);
    if (foundProduct) {
      if (value === 'inc') {

        // Increase quantity
        const updatedCartItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCartItems);
        setTotalPrice((prev) => prev + foundProduct.net_price);
        setTotalQty((prev) => prev + 1);
      } else if (value === 'dec') {

        // Decrease quantity (1 se kam nahi honi chahiye)
        if (foundProduct.quantity > 1) {
          const updatedCartItems = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          );
          setCartItems(updatedCartItems);
          setTotalPrice((prev) => prev - foundProduct.net_price);
          setTotalQty((prev) => prev - 1);
        }
      }
    }
  };

  // ❤️ Product ko wishlist me add karo
  const onAddToWishlist = (product) => {
    const checkProductInWishlist = wishlistItems.find((item) => item.id === product.id);
    if (!checkProductInWishlist) {
      setWishlistItems([...wishlistItems, { ...product }]);
      toast.success(`${product.name} added to the wishlist.`);
    }
  };

  // ❌ Wishlist se product hatao
  const onRemoveFromWishlist = (product) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== product.id));
    toast.success(`${product.name} removed from wishlist.`);
  };

  // 💥 Wishlist se item ko cart me bhejo
  const moveToCart = (product) => {
    onAdd(product, 1); // 1 quantity ke saath cart me bhejo
    onRemoveFromWishlist(product); // Wishlist se hatao
    toast.success(`${product.name} moved to cart.`);
  };

  // 🔄 Saari values ko context ke through provide kar rahe hain
  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        totalQty,
        setTotalQty,
        qty,
        setQty,
        onAdd,
        onRemove,
        toggleCartItemQuantity,
        wishlistItems,
        onAddToWishlist,
        onRemoveFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// 🔁 Yeh hook use karke context ko easily access kar sakte ho kisi bhi component me
export const useStateContext = () => useContext(Context);
