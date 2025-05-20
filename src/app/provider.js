"use client";
import { UserDetailContext } from "@/context/userDetail.context";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({ children }) => {
  const { isLoaded, user } = useUser();
  const [userDetail, setUserDetail] = useState();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only create user when both component is mounted and user data is loaded
    if (mounted && isLoaded && user) {
      createUser();
    }
  }, [mounted, isLoaded, user]);

  const createUser = async () => {
    try {
      const result = await axios.post("/api/user", {
        name: user?.fullName,
        email: user?.emailAddresses[0].emailAddress,
      });
      setUserDetail(result.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Use a simple div wrapper to avoid any potential styling issues
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default Provider;
