"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Barcode = () => {
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // New state for handling error messages

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250, 
          height: 250,
        },
        fps: 51,
      },
      []
    );
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setResult(result);
      setErrorMessage(null);
      hideExtraVideos();
    }

    function error(err) {
      // if (err instanceof Html5QrcodeScanner.QrCodeError) {
      //   setErrorMessage("Unable to detect a valid QR code. Please try again.");
      // } else {
      //   setErrorMessage("An unknown error occurred while scanning.");
      // }
      // console.warn(err);
      // hideExtraVideos();

      setErrorMessage("Unable to detect a valid QR code. Please try again.");
      console.warn(err);
      hideExtraVideos(); 
    }

    const hideExtraVideos = () => {
      setTimeout(() => {
        const videoElements = document.querySelectorAll("#reader__scan_region video");
        if (videoElements.length > 1) {
          videoElements.forEach((video, index) => {
            if (index > 0) {
              video.style.display = "none"; // Hide all extra videos
            }
          });
        }
      });
    };
    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg lg:ml-5 ml-0 p-6">
        {result ? (
          <div className="p-6 bg-green-50 rounded-lg shadow-md text-center">
            <p className="text-2xl font-semibold text-green-600 mb-4">
              Success!
            </p>
            <div className="w-full overflow-hidden break-words">
              <Link
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 transition-colors duration-300 break-words"
              >
                {result}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div
              id="reader"
              className="w-full h-[20rem] md:h-96 bg-gray-200 rounded-lg items-center text-center justify-center"
            >
              <p className="text-gray-500">Loading QR Code Scanner...</p>
            </div>
            {/* {errorMessage && (
              <p className="text-red-500 mt-4 text-center">
                {errorMessage}
              </p>
            )} */}
          </>
        )}
      </div>
    </>
  );
};

export default Barcode;