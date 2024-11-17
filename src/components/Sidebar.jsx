import React from "react";

const Sidebar = ({ activeTab, setActiveTab, garbageUser }) => {
  return (
    <div className="w-full lg:w-[19%] lg:mt-10 mt-6 lg:m-6 sm:m-2 p-5 bg-primary shadow-md rounded">
      <ul className="list-none p-0 space-y-4">
        {garbageUser?.role === "admin" && (
          <>
            <li
              className={`flex items-center text-white cursor-pointer ${
                activeTab === "Admin Dashboard" ? "text-gray-300" : ""
              }`}
              onClick={() => setActiveTab("Admin Dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`flex items-center text-white cursor-pointer ${
                activeTab === "Analytics / Status" ? "text-gray-300" : ""
              }`}
              onClick={() => setActiveTab("All Analytices")}
            >
              Analytics
            </li>
            <li
              className={`flex items-center text-white cursor-pointer ${
                activeTab === "Analytics / Status" ? "text-gray-300" : ""
              }`}
              onClick={() => setActiveTab("Onboarding Request")}
            >
              Onboarding Requests
            </li>
            <li
              className={`flex items-center text-white cursor-pointer ${
                activeTab === "Analytics / Status" ? "text-gray-300" : ""
              }`}
              onClick={() => setActiveTab("Manage Notice")}
            >
              Manage Notice
            </li> 
          </>
        )}

        {garbageUser?.role === "garbage_collector" && (
          <>
            <li
              className={`flex items-center text-white cursor-pointer ${
                activeTab === "Garbage Collector" ? "text-gray-300" : ""
              }`}
              onClick={() => setActiveTab("Garbage Collector")}
            >
              Dashboard
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
