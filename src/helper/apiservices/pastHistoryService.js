import axios from "axios";
import { httpService } from "./httpserivce";

export const createHistory = async (payload) => {
  try {
    const response = await axios.post(`${httpService}/user/past-history`, payload);
    console.log(response);
    
    return response.data; 
     // Return the response data directly
  } catch (error) {
    console.error("Error creating past history:", error);
    return { error: error.message };
  }
};

  export const getHistory =  () => {
    try {
      const response =  axios.post(`${httpService}/user/past-history`);
      const data =  response;
      console.log('data :>> ', data);
      return data;
    } catch (error) {
      console.error("Error fetching user details");
      return { error: error.message };
    }
  };