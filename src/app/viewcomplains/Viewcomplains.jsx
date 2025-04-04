'use client';
import { allComplains } from '@/helper/apiservices/ContactDetails';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Paper, Button } from '@mui/material';
import { RejectComplains } from '@/helper/apiservices/fetchUserDetails';
import { toast } from 'react-toastify';

const ViewComplains = () => {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplains = async () => {
      try {
        const response = await allComplains();
        setComplains(response.data.getAllComplains);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplains();
  }, []);

  const handleResolved = (id) => {
    console.log(`Complaint ${id} marked as resolved.`);
  };

  const handleRejected = async (id) => {
    try {
      const response = await RejectComplains(id);
      if (response.success) {
        setComplains((prev) => prev.filter((complain) => complain._id !== id));
        toast.success('Complaint rejected successfully.');
      } else {
        console.error(`Error rejecting complaint ${id}:`, response.error);
      }
    } catch (error) {
      console.error('Error rejecting complaint:', error);
    }
  };

  const columns = [
    // { field: '_id', headerName: 'Complaint ID', minWidth: 280 },
    { field: 'complainerName', headerName: 'Name', minWidth: 150 },
    { field: 'complainerMobile', headerName: 'Mobile', minWidth: 150 },
    { field: 'complainerEmail', headerName: 'Email', minWidth: 250 },
    { field: 'complainSub', headerName: 'Subject', minWidth: 200 },
    { field: 'complainDesc', headerName: 'Description', minWidth: 250 },
    { field: 'complainZone', headerName: 'Zone', minWidth: 120 },
    { field: 'complainAddress', headerName: 'Address', minWidth: 280 },
    // { field: 'complainLandmark', headerName: 'Landmark', minWidth: 150 },
    // {
    //   field: 'complainDate',
    //   headerName: 'Date',
    //   minWidth: 150,
    //   valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    // },
    // {
    //   field: 'complainTime',
    //   headerName: 'Time',
    //   minWidth: 150,
    //   valueFormatter: (params) => new Date(params.value).toLocaleTimeString(),
    // },

    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleResolved(params.row._id)}
            style={{ marginRight: 8 }}
          >
            Resolved
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleRejected(params.row._id)}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-100">
      <div className=" mx-auto bg-white shadow-md rounded-lg p-6">
        <Typography variant="h4" gutterBottom style={{ color: '#F28C28' }}>
          Complaints List
        </Typography>

        <Paper style={{ height: 613, width: '100%' }}>
          <DataGrid
            rows={complains}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[5, 10, 20]}
          />
        </Paper>
      </div>
    </div>
  );
};

export default ViewComplains;
