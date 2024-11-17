import connectMongo from "@/db/db";
import UserDetails from "@/models/userDetailsSchema ";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
connectMongo();
export const POST = async (req) => {
  try {
    const { ward } = await req.json();
    console.log("Received ward:", ward); 
    if (!Array.isArray(ward) || ward.length === 0) {
      return NextResponse.json(
        { error: "Ward parameter must be a non-empty array" },
        { status: 400 }
      );
    };
const fetch_data = mongoose.connection.db.collection("user_details");

    console.log("Update Query:", { Ward: { $in: ward } });
    const updatedGarbage = await fetch_data.updateMany(
      { Ward: { $in: ward } },
      { $set: { Garbage_Collected: true } }
    );

    console.log("Update result:", updatedGarbage); 
    
    return NextResponse.json(
      { data: updatedGarbage, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during update:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
