"use client";

import { getCurrentUserDetails, logoutAdmin } from "@/helper/apiservices/adminService";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const newContext = createContext();

const ContextFun = ({ children }) => {
  const [garbageUser, setGarbageUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {replace} = useRouter();
  const load = async () => {
    const currUser = await getCurrentUserDetails();
    if (currUser) {
      setGarbageUser(currUser.user);
    } else {
      console.warn("user not found");
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result.success === true) {
        setGarbageUser(null);
        replace('/login')
      }
    } catch (error) {
      toast.error("logout error");
    }
  };



  return (
    <newContext.Provider
      value={{ garbageUser, handleLogout, setGarbageUser, load,loading,setLoading }}
    >
      {children}
    </newContext.Provider>
  );
};

export default ContextFun;
export { newContext };
