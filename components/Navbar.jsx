'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiSearch } from 'react-icons/ci';
import { CgShoppingCart, CgUser, CgHeart } from 'react-icons/cg';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../public/assets/Logo.png';
import { useRouter } from 'next/navigation';
import { useStateContext } from '../context/StateContext';
import { AiOutlineHeart } from 'react-icons/ai';

const Navbar = () => {
  const { showCart, setShowCart, totalQty, wishlistItems } = useStateContext();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to fetch profile.");
      setUserInfo(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    window.addEventListener("tokenSet", fetchProfile);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("tokenSet", fetchProfile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    setShowDropdown(false);
    router.replace('/login');
  };

  const handleWishlistClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push('/wishlist');
    } else {
      router.push('/login');
    }
  };
  
  return (
    <nav>
      <Link href='/'><Image src={logo} width={140} height={25} alt='logo' /></Link>
      <ul className='nav-links'>
        <Link href='/female'><li>Female</li></Link>
        <Link href='/male'><li>Male</li></Link>
        <Link href='/kids'><li>Kids</li></Link>
        <Link href='/products'><li>All Products</li></Link>
      </ul>
      <div className='search-bar'><CiSearch /><input type='text' placeholder='What you looking for' /></div>

      {/* Cart */}
      <Link href='/cart'>
        <button className='cart' onClick={() => setShowCart(!showCart)}>
          <CgShoppingCart size={22} />
          <span className='cart-item-qty'>{totalQty}</span>
        </button>
      </Link>

      {/* Wishlist */}
      <button className='wishlist-btn' onClick={handleWishlistClick}>
        <CgHeart size={22} />
        <span className='cart-item-qty'>{wishlistItems.length}</span>
      </button>

      {userInfo ? (
        <div className='user-dropdown' ref={dropdownRef}>
          <div className='user-info' onClick={() => setShowDropdown(!showDropdown)}>
            <CgUser size={22} /><span>{userInfo.name}</span>
          </div>
          {showDropdown && (
            <div className='dropdown-menu'>
              <Link href='/profile'><p>Profile</p></Link>
              <Link href='/update-password'><p>Update Password</p></Link>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      ) : (
        <Link href='/login'>
          <button className='login'><CgUser size={22} /><span>Login</span></button>
        </Link>
      )}

      <div className='navbar-smallscreen'>
        <RiMenu3Line fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className='navbar-smallscreen_overlay'>
            <Link href='/'><Image className='logo-small' src={logo} width={140} height={25} alt='logo' /></Link>
            <RiCloseLine className='close_icon' fontSize={27} onClick={() => setToggleMenu(false)} />
            <ul className='navbar-smallscreen_links'>
              <Link href='/cart'>
                <button className='cart-small-screen' onClick={() => setShowCart(false)}>
                  <CgShoppingCart size={22} />
                  <span className='cart-item-qty'>{totalQty}</span>
                </button>
              </Link>

              <button className='cart-small-screen' onClick={handleWishlistClick}>
                <AiOutlineHeart size={22} />
                <span className='cart-item-qty'>{wishlistItems.length}</span>
              </button>

              <Link href='/female'><li>Female</li></Link>
              <Link href='/male'><li>Male</li></Link>
              <Link href='/kids'><li>Kids</li></Link>
              <Link href='/products'><li>All Products</li></Link>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
