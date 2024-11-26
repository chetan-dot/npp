"use client";
import React, { useEffect, useState } from "react";
import { httpService } from "@/helper/apiservices/httpserivce";
import QRCode from "qrcode.react";

const BarcodeGeneration = () => {
  const [limitedUser, setLimitedUser] = useState([]);

  useEffect(() => {
    fetchLimitedUser();
  }, []);

  const fetchLimitedUser = async () => {
    try {
      const req = await fetch(`${httpService}/ward-barcode-genration`);
      const res = await req.json();
      const filter = res?.limituser?.filter((item) => item?.Ward === 5);
      setLimitedUser(filter);
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
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 mx-auto block"
      >
        Print PDF
      </button>
      <div className="grid grid-cols-1 print-container w-1/2 mx-auto p-4 gap-4">
        {limitedUser.map((item) => {
          if (item.Name_of_Household_Owner === "Agyaat") {
            return null;
          }
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
                <div className="text-container text-sm space-y-1">
                  <div className="font-bold">
                    Unique ID:{" "}
                    <span className="font-normal">
                      {item.Unique_Property_ID}
                    </span>
                  </div>
                  <div className="font-bold">
                    Name of Owner:{" "}
                    <span className="font-normal">
                      {item.Name_of_Household_Owner}
                    </span>
                  </div>
                  <div className="font-bold">
                    Locality:{" "}
                    <span className="font-normal">{item.Name_of_Localaty}</span>
                  </div>
                  <div className="font-bold">
                    Ward No: <span className="font-normal">{item.Ward}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <QRCode
                    value={`https://npp-noorpur.org/dashboard/${item.Unique_Property_ID}/updateuser`}
                    size={190}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add print-specific styles */}
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

          // .text-2xl {
          //   font-size: 1.25rem; /* Adjust font size for print */
          // }

          .print-container {
            width: 100%; /* Make the width full for printing */
          }

          button {
            display: none; /* Hide print button when printing */
          }
        }
      `}</style>
    </>
  );
};

export default BarcodeGeneration;
