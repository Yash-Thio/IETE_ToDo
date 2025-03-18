"use client";

import { useEffect, useState } from "react";
import useUserStorage from "@/hooks/useUserStorage";
import { useSession } from "next-auth/react";

export default function UserIdDisplay() {
  const { userId, loading } = useUserStorage();
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get user data from localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (!mounted || loading) {
    return <div className="text-sm text-gray-500">Loading user info...</div>;
  }

  if (!userId && !session) {
    return <div className="text-sm text-gray-500">No user logged in</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-medium">Current User Info:</h3>
      <div className="mt-2 space-y-1 text-sm">
        <div>
          <span className="font-semibold">User ID: </span>
          <code className="bg-gray-200 p-1 rounded">{userId}</code>
        </div>

        {userData && (
          <>
            <div>
              <span className="font-semibold">Email: </span>
              {userData.email}
            </div>
            <div>
              <span className="font-semibold">Name: </span>
              {userData.name}
            </div>
            {userData.lastLogin && (
              <div>
                <span className="font-semibold">Last Login: </span>
                {new Date(userData.lastLogin).toLocaleString()}
              </div>
            )}
          </>
        )}

        {userData?.image && (
          <div className="mt-2">
            <img
              src={userData.image}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
