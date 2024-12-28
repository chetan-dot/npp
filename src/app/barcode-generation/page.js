"use client";
import React, { useEffect, useState } from "react";
import { httpService } from "@/helper/apiservices/httpserivce";
import QRCode from "qrcode.react";

const BarcodeGeneration = () => {
  const [limitedUser, setLimitedUser] = useState([]);
  const [uniqueWards, setUniqueWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("23"); // Default Ward

  useEffect(() => {
    fetchLimitedUser();
  }, [selectedWard]);

  const fetchLimitedUser = async () => {
    try {
      const req = await fetch(`${httpService}/ward-barcode-genration`);
      const res = await req.json();

      const wards = [...new Set(res?.users?.map((item) => item?.Ward))];
      setUniqueWards(wards)
  

      const filters = res?.users?.filter((item) => item?.Ward === Number(selectedWard));
      setLimitedUser(
        filters.filter(
          (item) =>
            item?.Name_of_Household_Owner !== "Agyaat " &&
            item?.Name_of_Household_Owner !== "Agyaat" &&
            item?.Name_of_Household_Owner !== "Aagyat"
        )
      );
    } catch (error) {
      console.error("Error fetching limited users:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <h1 className="text-2xl w-1/2 font-bold mx-auto my-2 text-center bg-primary text-white py-4">
        Barcode Generation
      </h1>
      <div className="flex justify-center items-center gap-4 mb-4">
      <button
          onClick={handlePrint}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Print PDF
        </button>
        <select
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
        >
         {uniqueWards.map((ward, index) => (
            <option key={index} value={ward}>
              Ward {ward}
            </option>
          ))}
        </select>
        
      </div>

      <div className="grid grid-cols-3 print-container mx-auto p-4 gap-6">
        {limitedUser?.map((item) => {
          return (
            <div
              className="border-2 border-black rounded-lg w-[5in] h-[3in] p-2 avoid-page-break"
              key={item.Unique_Property_ID}
            >
              <div className="text-xl flex justify-center py-1 border-b-2 border-black font-semibold">
                <span className="text-green-600 font-bold uppercase">
                  Nagar Palika Parishad Noorpur (U.P.)
                </span>
              </div>
              <div className="flex mt-2 items-center">
                <div className="text-container space-y-1">
                  <div className="font-bold">
                    Unique ID :
                    <span className="font-normal">
                      {item.Unique_Property_ID}
                    </span>
                  </div>
                  <div className="font-bold">
                    Name of Owner :
                    <span className="font-normal">
                      {item.Name_of_Household_Owner}
                    </span>
                  </div>
                  <div className="font-bold">
                    Locality :
                    <span className="font-normal">{item.Name_of_Localaty}</span>
                  </div>
                  <div className="font-bold">
                    Ward No : <span className="font-normal">{item.Ward}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <QRCode
                    value={`https://npp-noorpur.org/dashboard/${item.Unique_Property_ID}/updateuser`}
                    size={185}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .avoid-page-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .print-container {
            width: 100%; /* Make the width full for printing */
          }

          button {
            display: none; /* Hide print button when printing */
          }
          @page {
            margin: 0.5in; /* Set a margin for printed pages */
          }
        }
      `}</style>
    </>
  );
};

export default BarcodeGeneration;
