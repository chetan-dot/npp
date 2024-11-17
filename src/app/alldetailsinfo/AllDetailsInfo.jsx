"use client";
import React, { useContext, useEffect, useState } from "react";
import { fetchAllUserDetails } from "@/helper/apiservices/fetchUserDetails";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { newContext } from "@/context/contextFun";

const CircularProgressBarInNumber = ({ number, color, totalUser }) => {
  const r = 60; // radius of the circle
  const circ = 2 * Math.PI * r; // circumference of the circle
  const strokePct = ((totalUser - number) * circ) / totalUser; // how much of the circumference should be visible

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle
        cx="75"
        cy="75"
        r={r}
        fill="transparent"
        stroke="#e6e6e6"
        strokeWidth="15"
        strokeDasharray={circ}
        strokeDashoffset="0"
      />
      <circle
        cx="75"
        cy="75"
        r={r}
        fill="transparent"
        stroke={color}
        strokeWidth="15"
        strokeDasharray={circ}
        strokeDashoffset={strokePct.toString()}
        strokeLinecap="round"
        transform="rotate(-90 75 75)"
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="24"
        fill="#333"
      >
        {number}
      </text>
    </svg>
  );
};

const CircularProgressBar = ({ percentage, color }) => {
  const r = 60; // radius of the circle
  const circ = 2 * Math.PI * r; // circumference of the circle
  const strokePct = ((100 - percentage) * circ) / 100; // how much of the circumference should be visible

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle
        cx="75"
        cy="75"
        r={r}
        fill="transparent"
        stroke="#e6e6e6"
        strokeWidth="15"
        strokeDasharray={circ}
        strokeDashoffset="0"
      />
      <circle
        cx="75"
        cy="75"
        r={r}
        fill="transparent"
        stroke={color}
        strokeWidth="15"
        strokeDasharray={circ}
        strokeDashoffset={strokePct.toString()}
        strokeLinecap="round"
        transform="rotate(-90 75 75)"
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="24"
        fill="#333"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const AllDetailsInfo = () => {
  const [user, setUser] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [countUserFalse, setCountUserFalse] = useState(null);
  const [countUserTrue, setCountUserTrue] = useState(null);
  const { loading, setLoading } = useContext(newContext);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchAllUserDetails();
      setUser(response.result);
      setTotalUser(response.totalUser);
      setCountUserFalse(response.countUserFalse);
      setCountUserTrue(response.countUserTrue);
      return response;
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const calculatePerFalse = ((countUserFalse / totalUser) * 100).toFixed(2);
  const calculatePerTrue = ((countUserTrue / totalUser) * 100).toFixed(2);
  const calculatePerTotle = ((totalUser / totalUser) * 100).toFixed(2);

  return (
    <>
      {!loading && <div>
        <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-primary text-center mb-4">Garbage Collection  Status</h2> 
          <div className="flex justify-center md:justify-evenly  flex-wrap mb-10 gap-5">
            <div>
              <CircularProgressBar
                percentage={calculatePerTrue}
                color="#F28C28"
              />
              <p className="text-sm text-gray-500">Garbage Collected</p>
            </div>
            <div>
              <CircularProgressBar
                percentage={calculatePerTotle}
                color="#F28C28"
              />
              <p className="text-sm text-center text-gray-500">Total User</p>
            </div>
            <div>
              <CircularProgressBar
                percentage={calculatePerFalse}
                color="#FF4500"
              />
              <p className="text-sm text-gray-500">Garbage Not Collected</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-4">
          {/* <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Status Of Garbage per houses
        </h2> */}

          <div className="flex justify-center md:justify-evenly flex-wrap  mb-10 gap-5">
            <div className="text-center">
              <CircularProgressBarInNumber
                number={countUserTrue}
                totalUser={totalUser}
                color="#F28C28"
              />
              <p className="text-sm text-gray-500">House Attended</p>
            </div>
            <div className="text-center">
              <CircularProgressBarInNumber number={totalUser} color="#F28C28" />
              <p className="text-sm text-center text-gray-500">Total House</p>
            </div>
            <div className="text-center">
              <CircularProgressBarInNumber
                number={countUserFalse}
                totalUser={totalUser}
                color="#FF4500"
              />
              <p className="text-sm text-gray-500">Houses Left</p>
            </div>
          </div>
        </div>
      </div>}

    </>
  );

};

export default AllDetailsInfo;
