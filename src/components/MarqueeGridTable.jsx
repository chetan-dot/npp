import { deleteMarqueeData, updateMarqueeData } from "@/helper/apiservices/marqueeServices";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MarqueeGridTable = ({ marqueeData, fetchMarqueeData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMarquee, setSelectedMarquee] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditing]);

  const handleEditClick = (marquee) => {
    setSelectedMarquee(marquee);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMarquee(null);
  };

  const handleSaveEdit = async () => {
    if (selectedMarquee && selectedMarquee._id) {
      try {
        const updateData = {
          _id: selectedMarquee._id,
          info: selectedMarquee.info, 
        };
        
        const response = await updateMarqueeData(updateData);
        if (response) {  
          toast.success("Marquee text updated successfully!");
          setIsEditing(false);
          fetchMarqueeData();
        } else {
          throw new Error("Unexpected API response");
        }
      } catch (error) {
        toast.error("Failed to update marquee text. Please try again.");
      }
    }
  };

  const handleDeleteClick = async (marquee) => {
    const _id = marquee._id;
    try {
      const response = await deleteMarqueeData(_id);
      if (response) {
        toast.success("Marquee deleted successfully!");
        fetchMarqueeData();
      } else {
        throw new Error("Failed to delete marquee.");
      }
    } catch (error) {
      console.error("Error deleting marquee:", error);
      toast.error("Failed to delete marquee. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSelectedMarquee((prev) => ({ ...prev, [id]: value }));
  };

  const columnmarquee = [
    { field: "_id", headerName: "ID", minWidth: 250 },
    { field: "info", headerName: "Title", minWidth: 700 },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 100,
      renderCell: (params) => (
        <div className="flex gap-2 mr-0 mt-1">
          <div
            className="bg-primary cursor-pointer text-white rounded hover:bg-primary flex items-center justify-center"
            title="Edit"
            style={{ height: "40px", minWidth: "40px" }}
            onClick={() => handleEditClick(params.row)}
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
        rows={marqueeData}
        columns={columnmarquee}
        getRowId={(row) => row._id}
        slots={{ toolbar: GridToolbar }}
      />

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit Marquee</h2>
            <div>
              <div className="mb-3">
                <label htmlFor="info" className="block text-sm font-medium">
                  Marquee Text
                </label>
                <input
                  type="text"
                  id="info"
                  value={selectedMarquee?.info || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
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

export default MarqueeGridTable;