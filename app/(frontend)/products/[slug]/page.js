'use client';

import React, { useState, useEffect } from "react"; // React aur useState, useEffect ko import kar rahe hain
import { useParams, useRouter } from "next/navigation"; // useParams aur useRouter ko import kar rahe hain URL handling ke liye
import { AiOutlineMinus, AiOutlinePlus, AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Icons ko import kar rahe hain jo quantity aur wishlist ke liye use honge
import { CgShoppingCart } from "react-icons/cg"; // Cart icon ko import kar rahe hain
import { useStateContext } from "@/context/StateContext"; // Custom hook ko import kar rahe hain jo cart aur wishlist state ko manage karega

const ProductDetails = () => {
  const { slug } = useParams(); // Slug ko useParams se extract kar rahe hain jo product ko identify karega
  const router = useRouter(); // Router ko useRouter se fetch kar rahe hain taaki navigation kar sakein

  const { onAdd, onAddToWishlist, onRemoveFromWishlist, wishlistItems } = useStateContext(); // Context se cart aur wishlist ke functions ko fetch kar rahe hain
  const [product, setProduct] = useState(null); // Product ka state initialize kar rahe hain, initially null
  const [loading, setLoading] = useState(true); // Loading ka state initialize kar rahe hain, initially true
  const [quantity, setQuantity] = useState(1); // Quantity ka state initialize kar rahe hain, initially 1

  // Product details fetch kar rahe hain jab slug change ho
  useEffect(() => {
    if (!slug) return; // Agar slug nahi hai, toh kuch na karein
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get_product/${slug}`); // Product details ko fetch kar rahe hain
        if (!res.ok) throw new Error("Failed to fetch product details"); // Agar response ok nahi hai, toh error throw karte hain
        const data = await res.json(); // Response ko JSON me convert kar rahe hain
        setProduct(data); // Product ko state me set kar rahe hain
      } catch (e) {
        console.error(e); // Agar koi error hoti hai toh console me error log kar rahe hain
      } finally {
        setLoading(false); // Data fetch hone ke baad loading ko false kar rahe hain
      }
    })();
  }, [slug]); // Jab slug change hoga, tab product fetch hoga

  if (loading) return <p>Loading product...</p>; // Agar loading ho rahi ho, toh loading message dikhayenge
  if (!product) return <p>Product not found</p>; // Agar product nahi milta, toh product not found ka message dikhayenge

  const isInWishlist = wishlistItems.some((item) => item.id === product.id); // Check kar rahe hain ki product wishlist me hai ya nahi

  // Wishlist button handler
  const handleWishlistClick = () => {
    const token = localStorage.getItem("token"); // LocalStorage se token fetch kar rahe hain
    if (!token) {
      router.push(`/login?next=/products/${slug}`); // Agar token nahi milta, toh login page pe redirect karte hain
    } else {
      // Agar product wishlist me hai, toh usse remove karte hain, nahi toh add karte hain
      if (isInWishlist) {
        onRemoveFromWishlist(product); // Wishlist se remove
      } else {
        onAddToWishlist(product); // Wishlist me add
      }
    }
  };

  const incQty = () => setQuantity(prev => prev + 1); // Quantity ko increment karte hain
  const decQty = () => setQuantity(prev => (prev - 1 < 1 ? 1 : prev - 1)); // Quantity ko decrement karte hain, minimum 1 rakhte hain

 return  (
    <div className="product-detail-container">
      <div className="product-images">
        <div className="big-image-container">
          <img src={product.image} alt={product.name} /> {/* Product image ko display kar rahe hain */}
        </div>
      </div>

      <div className="product-details">
        <h3>{product.name}</h3> {/* Product name ko display kar rahe hain */}
        <p>{product.description}</p> {/* Product description ko display kar rahe hain */}

        <div className="quantity-desc">
          <h4>Quantity:</h4>
          <div>
            <span className="minus" onClick={decQty}><AiOutlineMinus /></span> {/* Quantity decrease button */}
            <span className="num">{quantity}</span> {/* Quantity number ko display kar rahe hain */}
            <span className="plus" onClick={incQty}><AiOutlinePlus /></span> {/* Quantity increase button */}
          </div>
        </div>

        <div className="add-to-cart">
          <button
            className={`btn ${isInWishlist ? 'btn-active' : ''}`}
            onClick={handleWishlistClick}
          >
            {isInWishlist ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />} {/* Wishlist me product hai ya nahi, uske hisaab se icon change */}
            {isInWishlist ? " Remove from Wishlist" : " Add to Wishlist"} {/* Button text */}
          </button>

          <button className="btn" onClick={() => onAdd(product, quantity)}> {/* Cart me add karne ka button */}
            <CgShoppingCart size={20} /> Add to Cart
          </button>

          <p className="price">₹ {product.net_price}.00</p> {/* Product price ko display kar rahe hain */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
