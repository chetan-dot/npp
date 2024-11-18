import React, { useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchAllWards } from "@/helper/apiservices/fetchUserDetails";
import { getHistory } from "@/helper/apiservices/pastHistoryService";
import { newContext } from "@/context/contextFun";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ label, data, totalUser }) => {
  const chartData = {
    labels: ["Total Number Of Houses", "Total Number of Houses Covered"],
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: ["#F28C28", "#36A2EB"],
        hoverBackgroundColor: ["#F28C28", "#36A2EB"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
    <div className="text-center " style={{ height: "200px", width: "200px" }}>
      <Pie data={chartData} options={options} />
      <h3 className="mt-2 text-lg font-semibold">
        Ward no. {label} ({data[1]}/{totalUser})
      </h3>
    </div>
  );
};

const PieChartContainer = () => {
  const { setLoading } = useContext(newContext);
  const [wardData, setWardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAllWards()
      .then((response) => {
        const arr = response?.totalWards?.map((item, index) => {
          return {
            label: item.label,
            data: [
              item.numberOfUser - item.total_no_house_covered,
              item.total_no_house_covered,
            ],
            totalUser: item.numberOfUser,
          };
        });
        setWardData(arr);
        console.log(arr, "arr");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });

   
  }, []);

  const filteredWardData = wardData?.filter((ward) =>
    String(ward.label).toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('object :>> ', filteredWardData);

  return (
    <div className="container mx-auto px-4">
      {/* Title added here */}
      <div className="flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold text-primary">
          Garbage Collection Status
        </h2>
        <input
          type="text"
          placeholder="Search by ward"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full max-w-md"
        />
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

export default PieChartContainer;
