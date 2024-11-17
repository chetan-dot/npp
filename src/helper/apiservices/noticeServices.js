import axios from "axios";
import { toast } from "react-toastify";
import { httpService } from "./httpserivce";

export const NoticeAdd = async (data) => {
  try {
    const response = await axios.post(
      `${httpService}/admin/noticeboard`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    // Check if response exists and has data
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Internal Server Issue or Invalid Response");
  }
};

export const getNotices = async () => {
  try {
    const response = await axios.get(`${httpService}/admin/noticeboard`, {
      headers: { "Content-Type": "application/json" },
    });
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Internal Server Issue or Invalid Response");
  }
};

export const updateNotice = async (data) => {
  try {
    const response = await axios.patch(
      `${httpService}/admin/noticeboard`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update notice. Please try again.");
  }
};

export const deleteNotice = async (ids) => {
  try {
    const response = await axios.delete(`${httpService}/admin/noticeboard`, {
      headers: { "Content-Type": "application/json" },
      data: { ids: ids },  // Pass IDs as an array
    });
 
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error("Error deleting notice:", error);
    toast.error("Failed to delete notice. Please try again.");
  }
};

