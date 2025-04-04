'use client';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { newContext } from '@/context/contextFun';
import Sidebar from '../../components/Sidebar';
import AdminDashboard from '../../components/AdminDashboard';
import GarbageCollectorDashboard from '../../components/GarbageCollectorDashboard';
import { fetchAllUserDetails } from '@/helper/apiservices/fetchUserDetails';
import { getCurrentUserDetails } from '@/helper/apiservices/adminService';
import axios from 'axios';
import { httpService } from '@/helper/apiservices/httpserivce';
import AllDetailsInfo from '../alldetailsinfo/AllDetailsInfo';
import PieChart from '@/components/PieChart';
import OnboardingRequest from '@/components/OnboardingRequest';
import ManageNotice from '@/components/ManageNotice';
import HistoryChart from '@/components/HistoryChart';
import ViewComplains from '../viewcomplains/Viewcomplains';

const MapTracker = dynamic(() => import('../../components/MapTracker'), {
  ssr: false,
});

const Admin = () => {
  const { garbageUser, load } = useContext(newContext);
  const [user, setUser] = useState([]);
  const [garbageAllUser, setGarbageAllUser] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [chartType, setChartType] = useState('Pie Chart');
  const { loading, setLoading } = useContext(newContext);

  const fetchData = async () => {
    try {
      const [userDetailsResponse, currentUserResponse] = await Promise.all([
        fetchAllUserDetails(),
        getCurrentUserDetails(),
      ]);
      if (userDetailsResponse?.result) {
        let dynamicward = [];
        if (currentUserResponse?.user?.ward_assigned) {
          dynamicward = currentUserResponse.user.ward_assigned.map(Number);
        }
        const filteredUsers = userDetailsResponse.result.filter((item) =>
          dynamicward.includes(Number(item.Ward))
        );
        setUser(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
    }
  };

  const fetchDataGarbageTable = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${httpService}/user`);
      const garbageCollectorData = response.data.users.filter(
        (item) => item.role === 'garbage_collector'
      );
      setGarbageAllUser(garbageCollectorData);
    } catch (error) {
      console.error('Error fetching garbage collector data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataGarbageTable();
    fetchData();
    load();
  }, []);

  useEffect(() => {
    if (garbageUser?.role === 'admin') {
      setActiveTab('Admin Dashboard');
    } else {
      setActiveTab('Garbage Collector');
    }
  }, [garbageUser]);

  const columns = [
    { field: 'Unique_Property_ID', headerName: 'ID', minWidth: 200 },
    {
      field: 'Name_of_Household_Owner',
      headerName: 'Name of Household Owner',
      minWidth: 250,
    },
    {
      field: 'Mobile_No',
      headerName: 'Mobile Number',
      minWidth: 170,
      renderCell: (params) => (
        <div>{params.row.Mobile_No || 'Not Available'}</div>
      ),
    },
    {
      field: 'Name_of_Localaty',
      headerName: 'Name of Localaty',
      minWidth: 170,
    },
    {
      field: 'Remarks',
      headerName: 'Remarks',
      minWidth: 190,
      renderCell: (params) => (
        <div>{params.row.Remarks || 'Remarks not added'}</div>
      ),
    },
    { field: 'Ward', headerName: 'Ward', minWidth: 100 },
    {
      field: 'Garbage_Collected',
      headerName: 'Garbage Collected',
      minWidth: 150,
      renderCell: (params) => (
        <div>{params.row.Garbage_Collected ? '✅' : '❌'}</div>
      ),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        garbageUser={garbageUser}
      />
      {/* Main content */}
      <div className="flex-1 lg:w-3/4 lg:p-8 m-4 lg:mr-4">
        <h1 className="text-2xl font-bold text-primary ml-0 m-5 text-start">
          Hi, welcome back Mr.{garbageUser?.name}!
        </h1>
        <div className="text-gray-700">
          {activeTab === 'Admin Dashboard' && garbageUser?.role === 'admin' ? (
            <AdminDashboard
              garbageUser={garbageUser}
              garbageAllUser={garbageAllUser}
              loading={loading}
              fetchDataGarbageTable={fetchDataGarbageTable}
            />
          ) : activeTab === 'All Analytices' ? (
            <>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setChartType('Pie Chart')}
                  className={`px-4 py-2 rounded-md ${
                    chartType === 'Pie Chart'
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  Pie Chart
                </button>
                <button
                  onClick={() => setChartType('Circle Chart')}
                  className={`px-4 py-2 rounded-md ${
                    chartType === 'Circle Chart'
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  Circle Chart
                </button>
              </div>
              <div className="text-center">
                {chartType === 'Pie Chart' ? <PieChart /> : <AllDetailsInfo />}
              </div>
            </>
          ) : activeTab === 'Onboarding Request' ? (
            <>
              <OnboardingRequest garbageAllUser={garbageAllUser} />
            </>
          ) : activeTab === 'Manage Notice' ? (
            <>
              <ManageNotice />
            </>
          ) : activeTab === 'past-history' ? (
            <>
              <div className="text-center">
                <HistoryChart />
              </div>
            </>
          ) : activeTab === 'View-Complains' ? (
            <>
              <div className="text-center">
                <ViewComplains />
              </div>
            </>
          ) : activeTab === 'Tracking Van' ? (
            <>
              <div className="text-center">
                <MapTracker />
              </div>
            </>
          ) : (
            <GarbageCollectorDashboard
              garbageUser={garbageUser}
              user={user}
              columns={columns}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
