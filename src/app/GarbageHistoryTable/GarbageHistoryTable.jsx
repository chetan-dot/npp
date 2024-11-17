"use client";
// import { httpService } from '@/helper/apiservices/httpserivce';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import axios from 'axios';
import { useState } from 'react';

const GarbageHistoryTable = ({data}) => {
  // Define columns for DataGrid
  const columns = [
    { field: 'employee_id', headerName: 'Employee ID', minWidth: 250 },
    { field: 'employee_name', headerName: 'Garbage Collected By', minWidth: 220 },
    { field: 'createdAt', headerName: 'Collection Date', minWidth: 200 },
    {
      field: 'is_garabge_collected',
      headerName: 'Garbage Collected',
      minWidth: 200,
      renderCell: (params) => (
        <span className={params.value ? "text-green-500" : "text-red-500"}>
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    // { field: 'message', headerName: 'Message', minWidth: 200 },
  ];

  // Prepare rows for DataGrid using the data prop
  const rows = data?.map((entry, index) => ({
    id: entry._id || index, // MUI DataGrid needs an id field for each row
    employee_id: entry.employee_id,
    employee_name: entry.employee_name,
    is_garabge_collected: entry.is_garabge_collected,
    // Convert the createdAt date to dd-mm-yy format
    createdAt: new Date(entry.createdAt).toLocaleDateString('en-GB'),
    // message: entry.message,
  }));

  return (
    <div className="my-5 overflow-x-auto" style={{ height: 500,width:900}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[5]}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
};

export default GarbageHistoryTable;