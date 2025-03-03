'use client';
import React, { useContext, useEffect, useState } from 'react';
import { httpService } from '@/helper/apiservices/httpserivce';
import QRCode from 'qrcode.react';
import ContextFun, { newContext } from '@/context/contextFun';
import { Backdrop, CircularProgress } from '@mui/material';

const BarcodeGeneration = () => {
  const [limitedUser, setLimitedUser] = useState([]);
  const [uniqueWards, setUniqueWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('23'); // Default Ward
  const [filterData, setFilterData] = useState([]);
  const { loading, setLoading } = useContext(newContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLimitedUser();
    return () => {
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    const dupLimitedUser = [...limitedUser];

    const filter = dupLimitedUser.filter(
      (item) => item?.Ward === Number(selectedWard)
    );
    setFilterData(filter);
  }, [selectedWard, limitedUser]);

  const fetchLimitedUser = async () => {
    try {
      const req = await fetch(`${httpService}/ward-barcode-genration`);
      const res = await req.json();
      const wards = [...new Set(res?.users?.map((item) => item?.Ward))];
      setUniqueWards(wards);
      const filters = res?.users;
      setLimitedUser(
        filters.filter(
          (item) =>
            item?.Name_of_Household_Owner !== 'Agyaat ' &&
            item?.Name_of_Household_Owner !== 'Agyaat' &&
            item?.Name_of_Household_Owner !== 'Aagyat'
        )
      );
    } catch (error) {
      console.error('Error fetching limited users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Ensure input is not empty

    setLoading(true);
    try {
      // Extract 16-digit ID followed by an optional alphabet character
      const regex = /\b\d{16}[A-Z]?\b/g;
      const matches = searchTerm.match(regex);

      if (!matches || matches.length === 0) {
        console.error('No valid IDs found in input');
        setLoading(false);
        return;
      }

      const response = await fetch(`${httpService}/houseowner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: matches }),
      });

      const result = await response.json();
      if (result.success) {
        setFilterData(result.data);
      } else {
        console.error('Search failed:', result.error);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
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
        <input
          type="text"
          className="border px-4 py-2 rounded w-1/3"
          placeholder="Search by household owner  Unique ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>

      {loading ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Print PDF
            </button>
            <select
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
              style={{ cursor: 'pointer' }}
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
            {filterData?.map((item) => {
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
                        <span className="font-normal">
                          {item.Name_of_Localaty}
                        </span>
                      </div>
                      <div className="font-bold">
                        Ward No :{' '}
                        <span className="font-normal">{item.Ward}</span>
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
      )}
    </>
  );
};

export default BarcodeGeneration;
