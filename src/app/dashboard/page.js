'use client'
import React, { useContext } from 'react'
import Admin from '../new-admin-dashboard/Admin'
import { newContext } from '@/context/contextFun';
import { Backdrop, CircularProgress } from '@mui/material';


const page = () => {
  const { loading } = useContext(newContext);

  return (
    <div>
      <Admin />
      <Backdrop
        sx={(theme) => ({ color: 'rgb(242 140 40' })}
        open={loading}
      >
        <CircularProgress color="rgb(242 140 40" />
      </Backdrop>
    </div>
  )
}

export default page
