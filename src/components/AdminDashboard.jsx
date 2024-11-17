"use client";
import React, { useState, useContext } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import moment from "moment";
import EditPopup from "./EditPopup";
import { updateSaveUser } from "../helper/apiservices/fetchUserDetails";
import { newContext } from "@/context/contextFun";
import * as XLSX from "xlsx";
import { signupAdmin } from "@/helper/apiservices/adminService";

const AdminDashboard = ({
  garbageUser,
  garbageAllUser,
  fetchDataGarbageTable,
  loading,
}) => {
  if (!garbageUser) {
    return <div>Loading...</div>;
  }
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFileUploadOpen, setFileUploadOpen] = useState(false);
  const { setLoading } = useContext(newContext);

  const inactiveUsers = garbageAllUser.filter((user) => user.isActive);

  const handleEdit = (userData) => {
    setSelectedUser(userData);
    setPopupOpen(true);
  };

  const handleSave = async (updatedUser) => {
    const ward_assigned = updatedUser?.wards?.map((item) => item.label);
    console.log("ward_assigned :>> ", ward_assigned);
    const user_id = selectedUser?._id;
    const updatedValues = { ward_assigned, user_id };

    try {
      setLoading(true);
      await updateSaveUser({ ...updatedValues });
      await fetchDataGarbageTable();
      toast("User Updated Successfully");
      setPopupOpen(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setLoading(false);
    }
    setPopupOpen(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
          console.log("Parsed Sheet Data:", sheetData);

        
          
          if (sheetData.length === 0) {
            console.error(
              "Sheet data is empty. Please check the file content."
            );
          }
          const groupedData = sheetData.reduce((acc, { employee_name, mobile_number, ward_number }) => {
            const existingEmployee = acc.find(item => item.employee_name === employee_name && item.mobile_number === mobile_number);
            if (existingEmployee) {
              if (!existingEmployee.ward_assigned.includes(ward_number)) {
                existingEmployee.ward_assigned.push(ward_number);
              }
            } else {
              acc.push({
                employee_name,
                mobile_number,
                ward_assigned: [ward_number]
              });
            }
            return acc;
          }, []);
          
          await signupAdmin(groupedData);
          toast.success('users has been created')
        } catch (error) {
          console.error("Error parsing XLSX file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid XLSX file.");
    }
  };

  const columnAdmin = [
    { field: "_id", headerName: "ID", minWidth: 250 },
    { field: "email", headerName: "Email", minWidth: 170 },
    { field: "name", headerName: "Name", minWidth: 170 },
    { field: "role", headerName: "Role", minWidth: 150 },
    { field: "isActive", headerName: "IsStatus", minWidth: 100 },
    { field: "ward_assigned", headerName: "Assign Ward", minWidth: 100 },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 150,
      renderCell: (params) => (
        <div className="flex mt-1">
          <div
            className="bg-primary cursor-pointer text-white px-2 rounded hover:bg-primary flex items-center justify-center"
            style={{ height: "40px", minWidth: "100px" }}
            onClick={() => handleEdit(params.row)}
          >
            Assign Ward
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-center">
        <div className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-[97%] lg:p-6 p-3 bg-primary border border-gray-200 rounded-lg shadow hover:bg-primary dark:bg-primary dark:border-primary dark:hover:bg-primary">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:px-6 px-0 py-4">
            {garbageUser &&
              Object.entries(garbageUser)
                .slice(2, 6)
                .map(([key, value]) => {
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
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mx-5 my-8">
        <h2 className="text-2xl font-bold text-primary">
          {" "}
          Assigned Garbage Collectors
        </h2>
        {isFileUploadOpen && (
          <input
            type="file"
            accept=".xlsx"
            className="ml-52"
            onChange={handleFileUpload}
          />
        )}
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-activetabs"
          onClick={() => setFileUploadOpen(true)}
        >
          Users Upload
        </button>
      </div>
      <div className="my-5 mx-5" style={{ height: 500 }}>
        {inactiveUsers.length > 0 ? (
          <DataGrid
            rows={inactiveUsers}
            columns={columnAdmin}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            loading={loading}
          />
        ) : (
          "No record found."
        )}
      </div>

      <EditPopup
        open={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        data={selectedUser}
        onSave={handleSave}
      />
    </>
  );
};

export default AdminDashboard;
