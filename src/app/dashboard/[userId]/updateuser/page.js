"use client";
import Update_N_User from "@/components/Update_N_User";
import React from "react";

const page = ({ params }) => {
  return (
    <div>
      <Update_N_User userId={params.userId} />
    </div>
  );
};

export default page;
