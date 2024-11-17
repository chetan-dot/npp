import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import GarbageHistoryTable from "@/app/GarbageHistoryTable/GarbageHistoryTable";
import { httpService } from "@/helper/apiservices/httpserivce";
import { newContext } from "@/context/contextFun";

const Cardbutton = ({ userDetails }) => {
  const [showCard, setShowCard] = useState(false);
  const [StartDate, setStartDate] = useState(null);
  const [EndDate, setEndDate] = useState(null);
  const [Houseid, setHouseid] = useState(null);
  const [filteredData, setFilteredData] = useState(null); // State for filtered data
  const [loading, setLoading] = useState(false);
  const { garbageUser, load } = useContext(newContext);

  // Function to toggle card visibility
  const toggleCard = () => setShowCard(!showCard);

  useEffect(() => {
    load(); // Load garbage user context
  }, []);

  // Set Houseid when userDetails change
  useEffect(() => {
    if (userDetails?.Unique_Property_ID) {
      setHouseid(userDetails.Unique_Property_ID); // Set Houseid from userDetails
    }
  }, [userDetails]);

  // Automatically fetch history when Houseid is set (without clicking "Get History")
  useEffect(() => {
    if (Houseid) {
      handleGetHistory(); // Fetch history automatically on first render
    }
  }, [Houseid]);

  // Function to fetch history based on house ID and optionally selected dates
  const handleGetHistory = async () => {
    if (!Houseid) return; // If no house ID, do nothing
  
    setLoading(true); // Start loading
  
    const params = { house_id: Houseid }; // Always filter by house ID
  
    // Only add the date filters if they are selected
    if (StartDate) {
      params.start_date = StartDate.toISOString();
    }
    if (EndDate) {
      // Set EndDate to the end of the day (23:59:59)
      const adjustedEndDate = new Date(EndDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      params.end_date = adjustedEndDate.toISOString();
    }
  
    try {
      const response = await axios.get(`${httpService}/user/past-history`, {
        params: params, // Pass house_id and optionally dates as query params
      });
  
      if (response.status === 200) {
        setFilteredData(response.data.past_histories); // Set filtered data
      } else {
        console.error("Error fetching data:", response.statusText);
        alert("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching data");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <div className="flex flex-col items-start justify-start w-full mt-2 ml-4">
      {/* Button to toggle the card */}
      <button
        onClick={toggleCard}
        className="px-6 py-2 my-2 bg-primary text-white font-semibold rounded-md hover:bg-activetabs transition duration-300 w-fit"
      >
        {showCard ? "Hide your past History" : "Know your past history"}
      </button>

      {/* The Card (visible when showCard is true) */}
      {showCard && (
        <div className="mt-4 w-full p-6 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-start p-4 bg-gray-100 rounded-lg shadow-lg w-fit md:w-1/2">
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
              <div className="flex flex-col w-full sm:w-1/2 mb-4 sm:mb-0">
                <label className="mb-2 text-sm font-semibold text-gray-600">
                  Start Date:
                </label>
                <DatePicker
                  selected={StartDate}
                  onChange={(date) => setStartDate(date)}
                  className="p-2 border rounded w-full text-gray-700"
                  placeholderText="Select Start Date"
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="mb-2 text-sm font-semibold text-gray-600">
                  End Date:
                </label>
                <DatePicker
                  selected={EndDate}
                  onChange={(date) => setEndDate(date)}
                  className="p-2 border rounded w-full text-gray-700"
                  placeholderText="Select End Date"
                />
              </div>
            </div>
            <button
              onClick={handleGetHistory} // Fetch history on button click
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-activetabs transition-colors"
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Loading..." : "Get History"}
            </button>
          </div>

          {/* Display the filtered history data if available */}
          {filteredData && filteredData.length > 0 ? (
            <GarbageHistoryTable data={filteredData} />
          ) : (
            <p className="mt-4 text-gray-600 flex justify-center font-bold">
              {loading ? "Fetching data..." : "NO DATA AVAILABLE"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cardbutton;
