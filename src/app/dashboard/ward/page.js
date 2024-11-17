"use client";
import React, { useEffect, useState } from "react";
import { httpService } from "@/helper/apiservices/httpserivce";
import QRCode from "qrcode.react";

const WardBarcodeGeneration = () => {
  const [wardsData, setWardsData] = useState([]);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const req = await fetch(`${httpService}/ward-barcode-genration`);
      const res = await req.json();
  
      const wardsMap = {};
  
      res?.limituser?.forEach((item) => {
        if (item?.Ward && item?.Name_of_Localaty) { 
          wardsMap[item.Ward] = item.Name_of_Localaty;
        }
      });
  
      const wardsArray = Object.entries(wardsMap)
        .map(([ward, locality]) => ({
          ward,
          locality,
        }))
        .filter(({ ward }) => ward !== undefined);
  
      setWardsData(wardsArray);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <h1 className="text-2xl w-1/2 font-bold mx-auto my-2 text-center bg-primary text-white py-4">
        Ward Barcode Generation
      </h1>
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 mx-auto block"
      >
        Print PDF
      </button>
      <div className="grid grid-cols-1 print-container w-1/2 mx-auto p-4 gap-4">
        {wardsData.map(({ ward, locality }) => (
          <div
            className="border-2 border-black rounded-lg w-[5in] h-[3in] p-2 avoid-page-break"
            key={ward}
          >
            <div className="text-xl flex justify-center py-1 border-b-2 border-black font-semibold">
              <span className="text-green-600 font-bold uppercase">
                Nagar Palika Parishad Noorpur (U.P.)
              </span>
            </div>
            <div className="flex mt-2 items-center">
              <div className="text-container text-sm space-y-1">
                <div className="font-bold">
                  Ward No: <span className="font-normal">{ward}</span>
                </div>
                <div className="font-bold">
                  Locality: <span className="font-normal">{locality}</span>
                </div>
              </div>

              <div className="flex-shrink-0 ml-4">
                <QRCode
                  value={`https://npp-noorpur.org/dashboard/ward/${ward}`}
                  size={190}
                />
              </div>
            </div>
          </div>
        ))}
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

export default WardBarcodeGeneration;
