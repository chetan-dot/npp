"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateGstatus } from "@/helper/apiservices/updateGstatus";
import { useRouter } from "next/navigation";
const Ward_N_Barcode_Generation = ({ wardId }) => {
  console.log("Ward ID:", wardId);
 const route = useRouter();
  const defaultValue = {
    Garbage_Collected: "",
  };


  const validationSchema = Yup.object({});

  const handleSubmit = async () => {
    try {
      const data = {
        ward: [Number(wardId)],
      };
      const response = await updateGstatus(data);
      if (response) {
        toast.success("Garbage collection status updated successfully");
        route.push('/dashboard');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  

  return (
    <div className="md:w-1/2 w-11/12 mx-auto p-4 shadow-lg rounded bg-white m-5">
      <h1 className="text-center text-2xl font-bold bg-primary text-white py-4 rounded">
        Update Ward Details
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
              <label className="text-lg font-extrabold text-gray-700 flex justify-center">
                GARBAGE COLLECTED
              </label>
              <div className="flex space-x-4 mt-2">
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 w-full text-white font-bold p-5 rounded"
                  onClick={handleSubmit}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 w-full text-white font-bold p-5 rounded"
                  onClick={() => toast.info("No action taken")}
                >
                  No
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Ward_N_Barcode_Generation;
