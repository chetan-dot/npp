import axios from "axios";
import { toast } from "react-toastify";
import { httpService } from "./httpserivce";

export const MarqueeAdd = async (data) => {
  try {
    const response = await axios.post(`${httpService}/admin/marquee`, data, {
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

// Function to get marquee data
export const getMarqueeData = async () => {
  try {
    const response = await axios.get(`${httpService}/admin/marquee`);
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch marquee data.");
  }
};

export const updateMarqueeData = async (data) => {
  try {
    const response = await axios.patch(`${httpService}/admin/marquee`, data, {
      headers: { "Content-Type": "application/json" },
    });
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update marquee data.");
  }
};

export const deleteMarqueeData = async (id) => {
  try {
    const response = await axios.delete(`${httpService}/admin/marquee`, {
      data: { _id: id },
      headers: { "Content-Type": "application/json" },
    });
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete marquee data.");
  }
};
