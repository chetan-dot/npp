"use client";
import React, { useContext, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  fetchUserDetails,
  UpdateUserDetails,
} from "@/helper/apiservices/fetchUserDetails";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createHistory } from "@/helper/apiservices/pastHistoryService";
import { newContext } from "@/context/contextFun";

const Update_N_User = ({ userId }) => {
  const [qrValue, setQrValue] = useState([]);
  const { garbageUser, load } = useContext(newContext);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const defaultValue = {
    Garbage_Collected: "",
  };

  const validationSchema = Yup.object({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserDetails(userId);
        setQrValue([response.result]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [userId]);

  const runPasthistory = async (values) => {
    try {
      const user_ward = qrValue.length > 0 ? qrValue[0].Ward : "";
      console.log("valueee",values.Garbage_Collected);
  
      
      const res = await createHistory({
        house_id: userId,
        employee_id: garbageUser._id,
        employee_name: garbageUser.name,
        is_garabge_collected:values.Garbage_Collected,
        user_ward:user_ward,
        message:
          values.Remarks,
      });
      
      
    } catch (error) {
      console.log(error);
    } finally {
      router.push("/dashboard");
    }
  }; 


  const handleSubmit = async (garbageCollectedValue) => {
    const values = {
      Garbage_Collected: garbageCollectedValue,
      Remarks:
      garbageCollectedValue === true 
          ? "Garbage collected"
          : "Garbage not collected",
      
    };
    
    

    try {
      const response = await UpdateUserDetails(userId, values);
      const updatedResponse = await fetchUserDetails(userId);
      if (response.success === true) {
        toast.success("Updated user successfully");
      }
      setQrValue([updatedResponse.result]);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
    runPasthistory(values);
  };

  return (
    <>
      <div className="flex items-center justify-center m-5">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
          <h1 className="text-2xl font-bold text-center bg-primary text-white py-4">
            Update User Details
          </h1>
          <hr className="mb-4" />
          <div className="mb-4 overflow-x-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full border">
              {qrValue &&
                qrValue.map((ele, index) => (
                  <React.Fragment key={index}>
                    {/* Unique ID */}
                    <div className="p-2  text-center bg-gray-100 font-bold">
                      Unique ID 
                    </div>
                    <div className="p-2 text-center bg-gray-100">
                      {ele.Unique_Property_ID}
                    </div>

                    {/* Name of Owner */}
                    <div className="p-2 text-center bg-gray-100 font-bold">
                      Name of Owner
                    </div>
                    <div className="p-2 text-center bg-gray-100">
                      {ele.Name_of_Household_Owner}
                    </div>

                    {/* Locality */}
                    <div className="p-2  text-center bg-gray-100 font-bold">Locality</div>
                    <div className="p-2 text-center bg-gray-100 ">
                      {ele.Name_of_Localaty}
                    </div>

                    {/* Ward No */}
                    <div className="p-2 text-center  bg-gray-100 font-bold">Ward No</div>
                    <div className="p-2 text-center bg-gray-100 ">
                      {ele.Ward}
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 w-11/12 mx-auto p-4 shadow-lg rounded bg-white m-5">
        <h1 className="text-center text-2xl font-bold bg-primary text-white py-4 rounded">
          Update User Details
        </h1>
        <hr className="mb-4" />
        <Formik
          initialValues={defaultValue}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {}}
        >
          {({ resetForm }) => (
            <Form>
              <div className="mb-4">
                <label className=" text-lg font-extrabold text-gray-700 flex justify-center">
                  GARBAGE COLLECTED
                </label>
                <div className="flex space-x-4 mt-2">
                  <button
                    type="button"
                    className="bg-green-500 hover:bg-green-700 w-full text-white font-bold p-5 rounded"
                    onClick={() => handleSubmit(true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 w-full text-white font-bold p-5 rounded"
                    onClick={() => handleSubmit(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Update_N_User;