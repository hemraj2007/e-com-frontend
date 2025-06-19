"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
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
  };

  useEffect(() => {
    fetchProfile();
    // ✅ Add event listener for logout
    const handleTokenChange = () => fetchProfile();
    window.addEventListener("tokenSet", handleTokenChange);
    window.addEventListener("tokenRemoved", () => setUserInfo(null)); // ✅ Logout handler
    return () => {
      window.removeEventListener("tokenSet", handleTokenChange);
      window.removeEventListener("tokenRemoved", () => setUserInfo(null));
    };
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);