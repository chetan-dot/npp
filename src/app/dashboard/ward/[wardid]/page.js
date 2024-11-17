"use client";
import Ward_N_Barcode_Generation from '@/components/Ward_N_Barcode_Generation';
import React from 'react';

const Page = ({ params }) => {
  return (
    <div>
      <Ward_N_Barcode_Generation wardId={params.wardid}/>
    </div>
  );
};

export default Page;
