"use client";

import { useState, useEffect } from "react";

export default function useUserStorage() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load userId from localStorage on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
      setLoading(false);
    }
  }, []);

  // Save or remove userId from localStorage
  const saveUserId = async (user) => {
    if (user) {
      // Store user ID in localStorage
      localStorage.setItem("userId", user.uid);

      // Also store additional user info that might be useful
      const userData = {
        email: user.email,
        name: user.displayName || user.email?.split("@")[0] || "User",
        image: user.photoURL || null,
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      setUserId(user.uid);
      return user.uid;
    } else {
      // Remove user data when signing out
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      setUserId(null);
      return null;
    }
  };

  return { userId, loading, saveUserId };
}
