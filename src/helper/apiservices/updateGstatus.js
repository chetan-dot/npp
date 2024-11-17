import axios from "axios";
import { toast } from "react-toastify";
import { httpService } from "./httpserivce";

export const updateGstatus = async (data) => {
  try {
    console.log("Data for POST API:", data);
    const response = await axios.post(
      `${httpService}/noorpuruser/updateGstatus`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response && response.data) {
      console.log("Response from API:", response.data);
      return response.data;
    } else {
      throw new Error("Empty or invalid response from server");
    }
  } catch (error) {
    console.error("Error in updateGstatus:", error);
    toast.error("Internal Server Issue or Invalid Response");
  }
};
