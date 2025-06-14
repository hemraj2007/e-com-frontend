'use client';

import './globals.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CgUser } from 'react-icons/cg';
import { AdminProvider, useAdminContext } from '../../context/AdminContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <AdminLayout>{children}</AdminLayout>
        </AdminProvider>
      </body>
    </html>
  );
}

function AdminLayout({ children }) {
  const { userInfo, setUserInfo } = useAdminContext();
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/admin') {
      router.replace('/admin'); // Force redirect to login page if not logged in
    }
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    setShowDropdown(false);
    router.replace('/admin');
  };

  const handleLogin = () => {
    router.push('/admin');
  };

  // Prevent hydration error
  if (!isMounted) return null;

  const isLoginPage = pathname === '/admin';

  // If not logged in and not on login page, don't render anything
  if (!userInfo && !isLoginPage) return null;

  return (
    <div className="admin-dashboard">
      {!isLoginPage && (
        <div className="sidebar">
          <div className="logo">Admin Panel</div>
          <nav>
            <ul>
              <li><Link href="/admin/profile">Profile</Link></li>
              <li><Link href="/admin/dashboard">Dashboard</Link></li>
              <li><Link href="/admin/product">Product</Link></li>
              <li><Link href="/admin/category">Category</Link></li>
              <li><Link href="/admin/users">Users</Link></li>
            </ul>
          </nav>
        </div>
      )}

      <div className="main-area">
        {!isLoginPage && (
          <header className="header">
            <h1>Welcome to Admin Panel</h1>
            <div className="header-user">
              {userInfo ? (
                <div className="user-dropdown" ref={dropdownRef}>
                  <div className="user-info" onClick={() => setShowDropdown(prev => !prev)}>
                    <CgUser size={22} />
                    <span>{userInfo.name || userInfo.email}</span>
                  </div>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <Link href="/admin/profile"><p>Update Profile</p></Link>
                      <Link href="/admin/update-password"><p>Update Password</p></Link>
                      <p onClick={handleLogout}>Logout</p>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={handleLogin} className="login-btn">Login</button>
              )}
            </div>
          </header>
        )}

        <main className="main-content">{children}</main>

        {!isLoginPage && (
          <footer className="footer">
            <p>&copy; 2025 Hemraj Admin Panel. All rights reserved.</p>
          </footer>
        )}
      </div>
    </div>
  );
}
