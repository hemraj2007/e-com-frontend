"use client"; // Next.js me ye bataata hai ki ye component sirf client side pe run karega

// React ke important hooks aur tools import kar rahe hain
import React, { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Ek naya context bana rahe hain jiska naam hai UserContext
const UserContext = createContext();

// 2️⃣ UserProvider component banaya jo context provider ka kaam karega
export const UserProvider = ({ children }) => {
  // 🔄 User info, loading status aur error message ke liye state
  const [userInfo, setUserInfo] = useState(null); // User ki profile info
  const [loading, setLoading] = useState(true);   // API call loading indicator
  const [error, setError] = useState(null);       // Error message agar kuch galat ho

  // 3️⃣ Component mount hote hi user ka profile fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Profile fetch failed");

        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        localStorage.removeItem("token"); // Agar token invalid ho toh clear karo
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures it runs only once

  // 4️⃣ Saare context values provide kar rahe hain
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, error }}>
      {children} {/* ✅ Children components ko wrap kiya hua hai */}
    </UserContext.Provider>
  );
};

// 5️⃣ Custom hook jisse kisi bhi component me user context ko access kiya ja sakta hai
export const useUserContext = () => useContext(UserContext);
