"use client";
import { UserDetailContext } from "@/context/userDetail.context";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Provider = ({ children }) => {
  const { user } = useUser();

  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    if (user) {
      createUser();
    }
  }, [user]);

  const createUser = async () => {
    const result = await axios.post("/api/user", {
      name: user?.fullName,
      email: user?.emailAddresses[0].emailAddress,
    })
    setUserDetail(result.data);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail , setUserDetail }}>
      
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
};

export default Provider;
