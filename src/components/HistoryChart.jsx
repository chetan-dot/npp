'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { datehistory } from '@/helper/apiservices/fetchUserDetails';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { newContext } from '@/context/contextFun';
// import { mockHistoryData } from '@/helper/mockHistoryData'; // Import mock data

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ label, data, totalUser }) => {
  const chartData = {
    labels: ['Total Number Of Houses', 'Total Number of Houses Covered'],
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: ['#F28C28', '#36A2EB'],
        hoverBackgroundColor: ['#F28C28', '#36A2EB'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          boxWidth: 20,
          usePointStyle: true,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  return (
    <div
      className="text-center mt-2 "
      style={{ height: '200px', width: '200px' }}
    >
      <Pie data={chartData} options={options} />
      <h3 className=" text-lg font-semibold">
        Ward no. {label} ({Math.round(data[1])}/{Math.round(totalUser)})
      </h3>
    </div>
  );
};

const HistoryChart = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { setLoading } = useContext(newContext);
  const [wardData, setWardData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchHistoryData = async (month, start, end) => {
    setLoading(true);
    try {
      const formattedStart = start.toISOString().split('T')[0];
      const formattedEnd = end.toISOString().split('T')[0];

      const response = await datehistory(formattedStart, formattedEnd);

      const arr = response.wardsData
        .map((ward) => {
          try {
            return {
              label: ward.label,
              data: [
                ward.totalNumberOfUsers - ward.totalNoHouseCovered,
                ward.totalNoHouseCovered,
              ],
              totalUser: ward.totalNumberOfUsers,
            };
          } catch (error) {
            console.error('Error parsing ward data:', error);
            return null;
          }
        })
        .filter(Boolean);
      setWardData(arr);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistoryData(selectedMonth, startDate, endDate);
  }, []);

  const handleMonthChange = (month) => {
    const parsedMonth = parseInt(month, 10);
    setSelectedMonth(parsedMonth);
    const currentYear = new Date().getFullYear();
    const newStartDate = new Date(currentYear, parsedMonth - 1, 1);
    const newEndDate = new Date(currentYear, parsedMonth, 0);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    fetchHistoryData(parsedMonth, newStartDate, newEndDate);
  };

  const handleFetchHistory = () => {
    fetchHistoryData(selectedMonth, startDate, endDate);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-2xl font-bold text-primary">
          History Collection Status
        </h2>
        <select
          className="p-2 border rounded text-primary w-1/3"
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-start bg-gray-100 w-full p-4">
        <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
          <div className="flex flex-col w-full">
            <label className="mb-2 text-sm font-semibold text-start text-primary">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="p-2 border rounded w-full text-primary"
              placeholderText="Select Start Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-2 text-sm font-semibold text-start text-primary">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="p-2 border rounded w-full text-primary"
              placeholderText="Select End Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start bg-gray-100 w-full p-4">
        <button
          className="mt-4 px-6 py-2 rounded-lg shadow transition-colors bg-primary text-white hover:bg-activetabs"
          onClick={handleFetchHistory}
        >
          Get History
        </button>
      </div>

      <div className="flex flex-wrap justify-around">
        {wardData.length > 0 ? (
          wardData.map((ward, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
              <PieChart
                totalUser={ward.totalUser}
                label={ward.label}
                data={ward.data}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No data available for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryChart;
