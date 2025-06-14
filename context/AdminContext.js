// context/AdminContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("Profile fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchUserProfile().finally(() => setLoading(false));
  }, []);

  return (
    <AdminContext.Provider value={{ userInfo, setUserInfo, loading, fetchUserProfile }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
