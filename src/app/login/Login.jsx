"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginAdmin } from "@/helper/apiservices/adminService";
import { toast } from "react-toastify";

const Login = () => {
  const route = useRouter();
  const [activeTab, setActiveTab] = useState("email");

  const formFields = {
    email: { name: "email", type: "email", label: "Email" },
    mobile_number: { name: "mobile_number", type: "text", label: "Phone Number" },
  };

  const defaultValue = { email: "", mobile_number: "", password: "" };

  const getValidationSchema = (activeTab) =>
    Yup.object({
      email: activeTab === "email"
        ? Yup.string().email("Invalid email address").required("Email is required")
        : Yup.string(),
      mobile_number: activeTab === "mobile_number"
        ? Yup.string()
            .matches(/^\d+$/, "mobile_number number must contain only digits")
            .required("mobile_number number is required")
        : Yup.string(),
      password: Yup.string().required("Password is required"),
    });

  const handleSubmit = async (values, { resetForm, setErrors }) => {
    const payload = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "")
    );
    try {
      const response = await loginAdmin(payload);
      if (response.data) {
        if (response.data?.user?.isActive) {
          toast.success("Login successfully");
          route.push("/dashboard");
          resetForm();
          return;
        }
        toast.error("Your request in process");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ submit: "Login failed. Please try again." });
    }
  };

  const designer_life = "/undraw_designer_life.svg";

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen ">
      <div className="flex flex-col md:flex-row w-4/5 min-h-96 m-10 lg:h-auto border gap-4 border-gray-300 rounded-lg overflow-hidden justify-center shadow-xl">
        <div className="md:block md:w-1/2 ml-2">
          <Image
            src={designer_life}
            width={500}
            height={400}
            alt="Designer Life"
          />
        </div>
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 bg-white py-auto">
          <h2 className="mb-4 sm:mb-6 text-2xl font-bold text-center">Login</h2>

          {/* Tabs for Email and mobile_number */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 ${activeTab === "email" ? "border-b-2 border-primary font-bold" : ""}`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab("mobile_number")}
              className={`px-4 py-2 ${activeTab === "mobile_number" ? "border-b-2 border-primary font-bold" : ""}`}
            >
              Phone Number
            </button>
          </div>

          <Formik
            initialValues={defaultValue}
            validationSchema={getValidationSchema(activeTab)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-2 sm:space-y-4">
                {/* Conditionally render field based on activeTab */}
                <div className="mb-2 sm:mb-4">
                  <label
                    htmlFor={formFields[activeTab].name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {formFields[activeTab].label}
                  </label>
                  <Field
                    className="w-full px-2 py-1 sm:px-3 sm:py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:border-primary"
                    type={formFields[activeTab].type}
                    name={formFields[activeTab].name}
                    id={formFields[activeTab].name}
                    placeholder={`Enter your ${formFields[activeTab].label.toLowerCase()}`}
                  />
                  <ErrorMessage
                    name={formFields[activeTab].name}
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div className="mb-2 sm:mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    className="w-full px-2 py-1 sm:px-3 sm:py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:border-primary"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <Link
                  href="/forgetpassword"
                  className="text-sm text-primary hover:text-primary flex justify-center"
                >
                  Forgot password?
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-activetabs focus:outline-none"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;