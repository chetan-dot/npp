import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { updateNotice,deleteNotice } from "@/helper/apiservices/noticeServices";

const NoticeGridTable = ({ notices ,fetchtable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditing]);

  const handleEditClick = (notice) => {
    setSelectedNotice(notice);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedNotice(null); 
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updateNotice({ _id: selectedNotice._id, ...selectedNotice });
      toast.success("Notice updated successfully!");
      setIsEditing(false);
      fetchtable()
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Failed to update notice.");
    }
  };

  const handleDeleteClick = async (selectedNotice) => {
    console.log('Selected notice :>> ', selectedNotice);
  
    // Get the _id of the selected notice and wrap it in an array
    const idsToDelete = [selectedNotice._id];  // Send _id as an array
    console.log('IDs for deletion:', idsToDelete);
  
    try {
      const response = await deleteNotice(idsToDelete); // Pass the array of IDs
      toast.success("Notice deleted successfully!");
      fetchtable(); // Refresh the table data
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice.");
    }
  };
  
  const columnAdmin = [
    { field: "_id", headerName: "ID", minWidth: 250 },
    { field: "title", headerName: "Title", minWidth: 400 },
    { field: "type", headerName: "Type", minWidth: 200 },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 400,
      renderCell: (params) => (
        <div className="flex gap-2 mr-0 mt-1">
          <div
            className="bg-primary cursor-pointer text-white rounded hover:bg-primary flex items-center justify-center"
            title="Edit"
            style={{ height: "40px", minWidth: "40px" }}
            onClick={() => handleEditClick(params.row)} // Pass the row data to the handler
          >
            <FontAwesomeIcon icon={faEdit} />
          </div>
          <div
            className="bg-primary cursor-pointer text-white rounded hover:bg-primary flex items-center justify-center"
            style={{ height: "40px", minWidth: "40px" }}
            title="Delete"
            onClick={() => handleDeleteClick(params.row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="my-5 mx-5" style={{ height: 400 }}>
      <DataGrid
        rows={notices}
        columns={columnAdmin}
        getRowId={(row) => row._id}
        slots={{ toolbar: GridToolbar }}
      />

      {isEditing && selectedNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit Notice</h2>
            <div>
              <div className="mb-3">
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  id="title"
                  value={selectedNotice.title}
                  onChange={(e) => setSelectedNotice({ ...selectedNotice, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="block text-sm font-medium">Category</label>
                <select
                  id="type"
                  value={selectedNotice.type}
                  onChange={(e) => setSelectedNotice({ ...selectedNotice, type: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="" label="Select category" />
                  <option value="Notice Board" label="Notice Board" />
                  <option value="Press Release" label="Press Release" />
                  <option value="Budget" label="Budget" />
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancelEdit}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeGridTable;
