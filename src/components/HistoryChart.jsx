// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { fetchAllWards } from '@/helper/apiservices/fetchUserDetails';
// import { newContext } from '@/context/contextFun';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = ({ label, data, totalUser }) => {
//   const chartData = {
//     labels: ['Total Number Of Houses', 'Total Number of Houses Covered'],
//     datasets: [
//       {
//         label: label,
//         data: data,
//         backgroundColor: ['#F28C28', '#36A2EB'],
//         hoverBackgroundColor: ['#F28C28', '#36A2EB'],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           padding: 20,
//           boxWidth: 20,
//           usePointStyle: true,
//         },
//       },
//     },
//     layout: {
//       padding: {
//         top: 20,
//       },
//     },
//   };

//   return (
//     <div className="text-center" style={{ height: '200px', width: '200px' }}>
//       <Pie data={chartData} options={options} />
//       <h3 className="mt-2 text-lg font-semibold">
//         Ward no. {label} ({data[1]}/{totalUser})
//       </h3>
//     </div>
//   );
// };

// const HistoryChart = () => {
//   const { setLoading } = useContext(newContext);
//   const [wardData, setWardData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const fetchWardsData = (start, end) => {
//     setLoading(true);
//     fetchAllWards(start, end) // Pass the date filter parameters
//       .then((response) => {
//         const arr = response?.totalWards?.map((item) => ({
//           label: item.label,
//           data: [
//             item.numberOfUser - item.total_no_house_covered,
//             item.total_no_house_covered,
//           ],
//           totalUser: item.numberOfUser,
//         }));
//         setWardData(arr);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching wards:', error);
//         setLoading(false);
//       });
//   };

//   const handleFilter = () => {
//     if (startDate && endDate) {
//       fetchWardsData(startDate, endDate);
//     } else {
//       alert('Please select both start and end dates.');
//     }
//   };

//   useEffect(() => {
//     fetchWardsData(null, null); // Initial fetch without date filter
//   }, []);

//   const filteredWardData = wardData?.filter((ward) =>
//     String(ward.label).toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto">
//       {/* Title */}
//       <div className="flex justify-between items-center my-4">
//         <h2 className="text-2xl font-bold text-primary">
//           History Collection Status
//         </h2>
//         <select
//           className="p-2 border rounded text-primary w-1/3"
//           // value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//         >
//           <option value="">Select Month</option>
//           {Array.from({ length: 12 }, (_, i) => (
//             <option key={i} value={i + 1}>
//               {new Date(0, i).toLocaleString('default', { month: 'long' })}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex flex-col items-start bg-gray-100 w-full p-4">
//         <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
//           <div className="flex flex-col w-full">
//             <label className="mb-2 text-sm font-semibold text-start text-primary">
//               Start Date:
//             </label>
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               className="p-2 border rounded w-full text-primary"
//               placeholderText="Select Start Date"
//               dateFormat="yyyy-MM-dd"
//             />
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="mb-2 text-sm font-semibold text-start text-primary">
//               End Date:
//             </label>
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               className="p-2 border rounded w-full text-primary"
//               placeholderText="Select End Date"
//               dateFormat="yyyy-MM-dd"
//             />
//           </div>
//         </div>
//         <button
//           className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-activetabs transition-colors"
//           onClick={handleFilter}
//         >
//           Get History
//         </button>
//       </div>

//       <div className="flex flex-wrap justify-around">
//         {filteredWardData?.length > 0 ? (
//           filteredWardData?.map((ward, index) => (
//             <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
//               <PieChart
//                 totalUser={ward.totalUser}
//                 label={ward.label}
//                 data={ward.data}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="w-full text-center p-4">No wards found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryChart;

'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchAllWards } from '@/helper/apiservices/fetchUserDetails';
import { newContext } from '@/context/contextFun';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div className="text-center" style={{ height: '200px', width: '200px' }}>
      <Pie data={chartData} options={options} />
      <h3 className="mt-2 text-lg font-semibold">
        Ward no. {label} ({data[1]}/{totalUser})
      </h3>
    </div>
  );
};

const HistoryChart = () => {
  const { setLoading } = useContext(newContext);
  const [wardData, setWardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Function to set start and end date when month is selected
  const handleMonthChange = (month) => {
    console.log('month :>> ', month);
    if (month) {
      const year = new Date().getFullYear();
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      setStartDate(firstDay);
      setEndDate(lastDay);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setSelectedMonth(month);
  };

  const fetchWardsData = (start, end) => {
    setLoading(true);
    fetchAllWards(start, end)
      .then((response) => {
        const arr = response?.totalWards?.map((item) => ({
          label: item.label,
          data: [
            item.numberOfUser - item.total_no_house_covered,
            item.total_no_house_covered,
          ],
          totalUser: item.numberOfUser,
        }));
        setWardData(arr);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching wards:', error);
        setLoading(false);
      });
  };

  const handleFilter = () => {
    console.log('object :>> ', startDate);
    console.log('object :>> ', endDate);
    if (startDate && endDate) {
      fetchWardsData(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
    } else {
      alert('Please select both start and end dates.');
    }
  };

  useEffect(() => {
    fetchWardsData(null, null);
  }, []);

  const filteredWardData = wardData?.filter((ward) =>
    String(ward.label).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      {/* Title and Month Dropdown */}
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
        <button
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-activetabs transition-colors"
          onClick={handleFilter}
        >
          Get History
        </button>
      </div>

      <div className="flex flex-wrap justify-around">
        {filteredWardData?.length > 0 ? (
          filteredWardData?.map((ward, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
              <PieChart
                totalUser={ward.totalUser}
                label={ward.label}
                data={ward.data}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center p-4">No wards found</div>
        )}
      </div>
    </div>
  );
};

export default HistoryChart;
