import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { getNotices, NoticeAdd } from "@/helper/apiservices/noticeServices";
import { toast } from "react-toastify";
import NoticeGridTable from "./NoticeGridTable";
import { getMarqueeData, MarqueeAdd } from "@/helper/apiservices/marqueeServices";
import MarqueeGridTable from "./MarqueeGridTable";

const ManageNotice = () => {
  const [notices, setNotices] = useState([]);
  const [marqueeData, setMarqueeData] = useState([]);

  const fetchNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data.data);
    } catch (error) {
      toast.error("Failed to fetch notices.");
    }
  };

  const fetchMarqueeData = async () => {
    try {
      const data = await getMarqueeData();
      setMarqueeData(data.data);
    } catch (error) {
      toast.error("Failed to fetch marquee data.");
    }
  };

  const handleNoticeSubmit = async (values, { resetForm }) => {
    try {
      const response = await NoticeAdd(values);
      toast.success("Notice added successfully!");
      resetForm();
      fetchNotices();
    } catch (error) {
      toast.error("Failed to add notice. Please try again.");
    }
  };

  const handleMarqueeSubmit = async (values, { resetForm }) => {
    try {
      const response = await MarqueeAdd(values);
      if (response) {
        toast.success("Marquee text saved successfully!");
        resetForm();
        fetchMarqueeData();
      }
    } catch (error) {
      toast.error("Failed to save marquee text. Please try again.");
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchMarqueeData();
  }, []);
  return (
    <>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary text-start">
          Manage notices
        </h2>
        <Formik
          initialValues={{ title: "", type: "" }}
          onSubmit={handleNoticeSubmit}
        >
          <Form>
            <div className="mt-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Notice Text
              </label>
              <Field
                id="title"
                name="title"
                placeholder="Enter notice text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="mt-6 flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="" label="Select category" />
                  <option value="Notice Board" label="Notice Board" />
                  <option value="Press Release" label="Press Release" />
                  <option value="Budget" label="Budget" />
                </Field>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="px-4 mt-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="container mx-auto  mt-8 px-4">
        <h2 className="text-2xl font-bold text-primary text-start">Marquee</h2>

        <Formik
          initialValues={{ info: "" }}
          onSubmit={handleMarqueeSubmit}
        >
          <Form>
            {/* Text Input */}
            <div className="mt-4">
              <label
                htmlFor="info"
                className="block text-sm font-medium text-gray-700"
              >
                marquee Text
              </label>
              <Field
                id="info"
                name="info"
                placeholder="Enter Marquee"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <button
                type="submit"
                className=" mt-4 px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                save
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl pl-4 font-bold text-primary text-start">
          Manage notices Table
        </h2>
        <NoticeGridTable notices={notices} fetchtable={fetchNotices} />
      </div>
      <div className="mt-5">
        <h2 className="text-2xl pl-4 font-bold text-primary text-start">
          Manage Marquee Table
        </h2>
        <MarqueeGridTable marqueeData={marqueeData} fetchMarqueeData={fetchMarqueeData} />
      </div>
    </>
  );
};

export default ManageNotice;
