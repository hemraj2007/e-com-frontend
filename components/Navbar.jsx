'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiSearch } from 'react-icons/ci';
import { CgShoppingCart, CgUser, CgHeart } from 'react-icons/cg';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../public/assets/Logo.png';
import { useRouter } from 'next/navigation';
import { useStateContext } from '../context/StateContext';
import { AiOutlineHeart } from 'react-icons/ai';
import { useUserContext } from '@/context/UserContext'; // ✅ Context import karo

const Navbar = () => {
  const { showCart, setShowCart, totalQty, wishlistItems } = useStateContext();
  const { userInfo } = useUserContext(); // ✅ Context se userInfo nikalo
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("tokenRemoved")); // ✅ Context ko trigger karo
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

      {userInfo ? ( // ✅ Context ka userInfo use karo
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

      {/* Mobile Menu (unchanged) */}
      <div className='navbar-smallscreen'>
        {/* ... (same as before) ... */}
      </div>
    </nav>
  );
};

export default Navbar;