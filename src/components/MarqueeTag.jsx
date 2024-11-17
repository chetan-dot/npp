import { getMarqueeData } from "@/helper/apiservices/marqueeServices";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MarqueeTag = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marqueeData = await getMarqueeData();
        console.log("Fetched marquee data:", marqueeData.data);
        setData(marqueeData.data);
      } catch (error) {
        toast.error("Failed to fetch marquee data.");
      }
    };

    fetchData();
  }, []);
  return (
    <div className="bg-secondary h-7 w-full flex justify-between items-center font-bold  px-6">
      <marquee className="space-x-10 w-full  text-sm text-base text-white uppercase">
        {data.map((d, i) => (
          <span key={i}>
            {d.new ? (
              <sup className="bg-red-600 text-white text-xs px-2">new</sup>
            ) : (
              <></>
            )}
            &nbsp;
            {d.info}
          </span>
        ))}
      </marquee>
    </div>
  );
};

export default MarqueeTag;
