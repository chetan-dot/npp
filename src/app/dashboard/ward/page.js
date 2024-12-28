"use client";
import React, { useContext, useEffect, useState } from "react";
import { httpService } from "@/helper/apiservices/httpserivce";
import QRCode from "qrcode.react";
import { newContext } from "@/context/contextFun";
import { Backdrop, CircularProgress } from "@mui/material";

const WardBarcodeGeneration = () => {
  const [wardsData, setWardsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedWard, setSelectedWard] = useState("all");
  const { loading, setLoading } = useContext(newContext);
  useEffect(() => {
    fetchWards();
  }, []);

  useEffect(() => {
    // Filter data based on selected ward
    if (selectedWard === "all") {
      setFilteredData(wardsData);
    } else {
      setFilteredData(wardsData.filter((item) => item.ward === selectedWard));
    }
  }, [selectedWard, wardsData]);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const req = await fetch(`${httpService}/ward-barcode-genration`);
      const res = await req.json();

      const wardsMap = {};

      res?.users?.forEach((item) => {
        if (item?.Ward && item?.Name_of_Localaty) {
          wardsMap[item.Ward] = item.Name_of_Localaty;
        }
      });

      const wardsArray = Object.entries(wardsMap).map(([ward, locality]) => ({
        ward,
        locality,
      }));

      setWardsData(wardsArray);
      setFilteredData(wardsArray); // Set initial filtered data
      setLoading(false);
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
      {loading ? (
        <>
         <Backdrop
    sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>;
        </>
      ) : (
        <>
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Print PDF
            </button>
            <select
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded max-h-32 overflow-y-auto"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="all">All Wards</option>
              {wardsData.map((ward) => (
                <option key={ward.ward} value={ward.ward}>
                  Ward {ward.ward}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 print-container mx-auto p-4 gap-6">
            {filteredData.map(({ ward, locality }) => (
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
                  <div className="text-container space-y-1">
                    <div className="font-bold">
                      Ward No: <span className="font-normal">{ward}</span>
                    </div>
                    <div className="font-bold">
                      Locality: <span className="font-normal">{locality}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-16">
                    <QRCode
                      value={`https://npp-noorpur.org/dashboard/ward/${ward}`}
                      size={190}
                    />
                  </div>
                </div>
              </div>
            ))}
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
                width: 100%;
              }

              button {
                display: none;
              }
              @page {
                margin: 0.5in;
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default WardBarcodeGeneration;
