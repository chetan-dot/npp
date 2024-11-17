import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { DeleteGarbageUser, UpdateGarbageUser } from "@/helper/apiservices/fetchUserDetails";
import { toast } from "react-toastify";
import { newContext } from "@/context/contextFun";

const OnboardingRequest = ({ garbageAllUser }) => {
  const [users, setUsers] = useState(garbageAllUser);

  const inactiveUsers = users.filter((user) => !user.isActive)
  const { setLoading } = useContext(newContext);

  const handleAcceptInvitation = async (user_id) => {
    if (!user_id) {
      alert("User ID or Ward Assigned is missing.");
      return;
    }
    
    try {
      setLoading(true)
      const response = await UpdateGarbageUser(user_id, true);
      if (response.success) {
        toast(`User accepted successfully.`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === user_id ? { ...user, isActive: true } : user
          )
        );
        setLoading(false)

      } else {
        toast("Failed to update user: " + response.error);
        setLoading(false)

      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation.");
      setLoading(false)
    }
  };

  const handleDeleteUser = async (_id) => {
    try {
      setLoading(true);
      const response = await DeleteGarbageUser(_id);
      if (response && !response.error) {
        toast("User deleted successfully.");
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id)); // Corrected variable
      } else {
        toast("Failed to delete user: " + response.error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
      setLoading(false);
    }
  };
  

  const columnAdmin = [
    { field: "_id", headerName: "ID", minWidth: 250 },
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "name", headerName: "Name", minWidth: 150 },
    { field: "role", headerName: "Role", minWidth: 150 },
    { field: "isActive", headerName: "IsStatus", minWidth: 100 },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 400,
      renderCell: (params) => (
        <div className="flex gap-2 mr-0 mt-1">
          <div
            className="bg-primary cursor-pointer text-white px-2 rounded hover:bg-primary flex items-center justify-center"
            style={{ height: "40px", minWidth: "100px" }}
            onClick={() => handleAcceptInvitation(params.row._id)}
          >
            Accept Invitation
          </div>
          {/* <div
            className="bg-primary cursor-pointer text-white rounded hover:bg-primary flex items-center justify-center"
            title="Edit Invitation"
            style={{ height: "40px", minWidth: "40px" }}
          >
            <FontAwesomeIcon icon={faEdit} />
          </div> */}
          <div
            className="bg-primary cursor-pointer text-white rounded hover:bg-primary flex items-center justify-center"
            style={{ height: "40px", minWidth: "40px" }}
            title="Delete"
            onClick={() => handleDeleteUser(params.row._id)} 
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-primary text-start m-6">
        Onboarding Requests
      </h2>
      <div className="my-5 mx-5" style={{ height: 500 }}>
        {inactiveUsers.length > 0 ? (
          <DataGrid
            rows={inactiveUsers}
            columns={columnAdmin}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
          />
        ) : (
          "No inactive requests"
        )}
      </div>
    </div>
  );
};

export default OnboardingRequest;
