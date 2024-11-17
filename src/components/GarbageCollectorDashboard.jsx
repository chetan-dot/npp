import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import Barcode from "@/app/admin/Barcode";

const GarbageCollectorDashboard = ({ garbageUser, user, columns, loading }) => {
  // Check if garbageUser is defined before rendering its details
  if (!garbageUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {garbageUser?.role === "garbage_collector" && <Barcode />}
      <div className="flex justify-center mt-2">
        <div className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-[97%] lg:p-6 p-3 bg-primary border border-primary rounded-lg shadow hover:bg-primary dark:bg-primary dark:border-primary dark:hover:bg-primary">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:px-6 px-0 py-4">
            {/* Add a check to ensure Object.entries is only used if garbageUser exists */}
            {garbageUser &&
              Object.entries(garbageUser)
                .slice(1, 6)
                .map(([key, value], index) => {
                  if (key === "updated_at" || index === 3) {
                    return null;
                  }
                  const displayKey =
                    key === "created_at"
                      ? "Date Of Onboarding"
                      : key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase());
                  const displayValue =
                    key === "created_at"
                      ? moment(value).format("MMM DD, YYYY")
                      : value;
                  return (
                    <div
                      key={key}
                      className="flex flex-col md:flex-row items-start md:items-center mb-2"
                    >
                      <span className="text-lg font-semibold text-white dark:text-white mr-2">
                        {displayKey} :
                      </span>
                      <span className="text-base text-white dark:text-white">
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
            <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
              <span className="text-lg font-semibold text-white dark:text-white mr-2">
                Assigned Ward :
              </span>
              <span className="text-base text-white dark:text-white">
                {garbageUser.ward_assigned
                  ? garbageUser.ward_assigned.join(", ")
                  : "No Ward Assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary text-start m-6">
        Assigned User
      </h2>
      <div className="my-5 mx-5" style={{ height: 500 }}>
        {user && (
          <DataGrid
            rows={user}
            columns={columns}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default GarbageCollectorDashboard;
