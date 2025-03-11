// 'use client';
// import React, { useContext, useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement,
// } from 'chart.js';
// import { datehistory } from '@/helper/apiservices/fetchUserDetails';
// import { newContext } from '@/context/contextFun';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// ChartJS.register(
//   LineElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement
// );

// const WaveChart = ({ label, data, totalUser }) => {
//   const chartData = {
//     labels: ['Total Houses', 'Houses Covered'],
//     datasets: [
//       {
//         label: `Ward ${label}`,
//         data: data,
//         borderColor: '#36A2EB',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         pointBackgroundColor: '#36A2EB',
//         borderWidth: 2,
//         fill: true,
//         tension: 0.4,
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
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div className="text-center" style={{ height: '250px', width: '300px' }}>
//       <Line data={chartData} options={options} />
//       <h3 className="mt-2 text-lg font-semibold">
//         Ward no. {label} ({data[1]}/{totalUser})
//       </h3>
//     </div>
//   );
// };

// const HistoryChart = () => {
//   const { setLoading } = useContext(newContext);
//   const [wardData, setWardData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState('');

//   const today = new Date();
//   const formattedToday = today.toISOString().split('T')[0];

//   const [startDate, setStartDate] = useState(today);
//   const [endDate, setEndDate] = useState(today);

//   const handleMonthChange = (month) => {
//     if (month) {
//       const year = new Date().getFullYear();
//       const firstDay = new Date(year, month - 1, 1);
//       const lastDay = new Date(year, month, 0);

//       setStartDate(firstDay);
//       setEndDate(lastDay);
//       fetchWardsData(
//         firstDay.toISOString().split('T')[0],
//         lastDay.toISOString().split('T')[0]
//       );
//     } else {
//       setStartDate(null);
//       setEndDate(null);
//     }
//     setSelectedMonth(month);
//   };

//   const fetchWardsData = (start, end) => {
//     setLoading(true);
//     datehistory(start, end)
//       .then((response) => {
//         const arr = response?.histories.map((item) => {
//           try {
//             const parsedItem = JSON.parse(item.historyData);
//             return parsedItem.totalWards.map((ward) => {
//               return {
//                 label: ward.label,
//                 data: [
//                   ward.numberOfUser - ward.total_no_house_covered,
//                   ward.total_no_house_covered,
//                 ],
//                 totalUser: ward.numberOfUser,
//               };
//             });
//           } catch (error) {
//             console.error('Error parsing JSON:', error);
//             return [];
//           }
//         });
//         setWardData(arr);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching history data:', error);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchWardsData(formattedToday, formattedToday);
//   }, []);

//   const handleFilter = () => {
//     if (startDate && endDate) {
//       fetchWardsData(
//         startDate.toISOString().split('T')[0],
//         endDate.toISOString().split('T')[0]
//       );
//     } else {
//       alert('Please select both start and end dates.');
//     }
//   };
//   const filteredWardData = wardData?.map((ward) => {
//     return ward;
//   });

//   return (
//     <div className="container mx-auto">
//       {/* Title and Month Dropdown */}
//       <div className="flex justify-between items-center my-4">
//         <h2 className="text-2xl font-bold text-primary">
//           History Collection Status
//         </h2>
//         <select
//           className="p-2 border rounded text-primary w-1/3"
//           value={selectedMonth}
//           onChange={(e) => handleMonthChange(e.target.value)}
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
//           className={`mt-4 px-6 py-2 rounded-lg shadow transition-colors ${
//             startDate && endDate
//               ? 'bg-primary text-white hover:bg-activetabs'
//               : 'bg-gray-400 cursor-not-allowed'
//           }`}
//           onClick={handleFilter}
//           disabled={!startDate || !endDate}
//         >
//           Get History
//         </button>
//       </div>

//       <div className="flex flex-wrap justify-around">
//         {filteredWardData?.length > 0 ? (
//           filteredWardData.map((wardGroup, index) => (
//             <React.Fragment key={index}>
//               {wardGroup.map((ward, subIndex) => (
//                 <div
//                   key={`${index}-${subIndex}`}
//                   className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2"
//                 >
//                   <WaveChart
//                     totalUser={ward.totalUser}
//                     label={ward.label}
//                     data={ward.data}
//                   />
//                 </div>
//               ))}
//             </React.Fragment>
//           ))
//         ) : (
//           <div className="w-full text-center p-4">
//             Please select date then History showing
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryChart;
'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { newContext } from '@/context/contextFun';
import { mockHistoryData } from '@/helper/mockHistoryData'; // Import mock data

ChartJS.register(
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const WaveChart = ({ label, data, totalUser }) => {
  const chartData = {
    labels: ['Total Houses', 'Houses Covered'],
    datasets: [
      {
        label: `Ward ${label}`,
        data: data,
        borderColor: '#F28C28',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: '#36A2EB',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="text-center" style={{ height: '250px', width: '300px' }}>
      <Line data={chartData} options={options} />
      <h3 className="mt-2 text-lg font-semibold">
        Ward no. {label} ({data[1]}/{totalUser})
      </h3>
    </div>
  );
};

const HistoryChart = () => {
  const { setLoading } = useContext(newContext);
  const [wardData, setWardData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchMockData = (month) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const filteredData = mockHistoryData.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return (
            itemDate.getFullYear() === new Date().getFullYear() &&
            itemDate.getMonth() + 1 === month
          );
        });

        const arr = filteredData.flatMap((item) => {
          const parsedItem = JSON.parse(item.historyData);
          return parsedItem.totalWards.map((ward) => ({
            label: ward.label,
            data: [
              ward.numberOfUser - ward.total_no_house_covered,
              ward.total_no_house_covered,
            ],
            totalUser: ward.numberOfUser,
          }));
        });

        setWardData(arr);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchMockData(selectedMonth); // Fetch data when component mounts
  }, []);

  const handleMonthChange = (month) => {
    const parsedMonth = parseInt(month, 10);
    setSelectedMonth(parsedMonth);
    fetchMockData(parsedMonth); // Pass updated month
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
        <button
          className="mt-4 px-6 py-2 rounded-lg shadow transition-colors bg-primary text-white hover:bg-activetabs"
          onClick={() => fetchMockData(selectedMonth)}
        >
          Get History
        </button>
      </div>

      <div className="flex flex-wrap justify-around">
        {wardData.length > 0 ? (
          wardData.map((ward, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
              <WaveChart
                totalUser={ward.totalUser}
                label={ward.label}
                data={ward.data}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center p-4">
            No data available for the selected month.
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryChart;
