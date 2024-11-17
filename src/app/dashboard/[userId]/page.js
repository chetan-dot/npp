"use client";
import Cardbutton from "@/components/cardbutton";
import { fetchUserDetails } from "@/helper/apiservices/fetchUserDetails";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

const UserComponent = ({ params }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetchUserDetails(params.userId);
        setUserDetails(response.result);
      } catch (error) {
        console.log(error,'error')
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, [params.userId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-start py-10 rounded-md">
      <div className=" w-auto sm:w-8/12  xl:w-1/2 bg-white shadow-md overflow-hidden mx-4 sm:ml-4 sm:mr-0 rounded-md">
        <h1 className="text-2xl font-bold text-left px-4 bg-primary text-white py-4">
          User Details
        </h1>
        {userDetails && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 p-5">
            <div className=" flex flex-col md:flex-row justify-start  ">
              <p className="font-bold ">Unique Property ID :</p>
              <p> {userDetails.Unique_Property_ID}</p>
            </div>
            <div className=" flex flex-col md:flex-row  justify-start ">
              <p className="font-bold "> Name of Household Owner :</p>
              <p > {userDetails.Name_of_Household_Owner}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-start ">
              <p className="font-bold "> Name of Locality :</p>
              <p> {userDetails.Name_of_Localaty}</p>
            </div>
            <div className="flex flex-col md:flex-row  justify-start">
              <p className="font-bold"> Mobile No :</p>
              <p> {userDetails.Mobile_No}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-start">
              <p className="font-bold"> Ward :</p>
              <p>{userDetails.Ward}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-start">
              <p className="font-bold"> Your Garbage Collected Status Is :</p>
              <p> {userDetails.Garbage_Collected ? "✅" : "❌"}</p>
            </div>
          </div>
        )}
      </div>
      <Cardbutton userDetails={userDetails}/>
    </div>
  );
};

export default UserComponent;