import connectMongo from "@/db/db";
import User from "@/models/user";
import wards_analytics from "@/models/wards_analytics";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
connectMongo();
export const GET = async () => {
  try {
    const fetch_data = await mongoose.connection.db.collection("user_details");
    const result = await fetch_data.find({}).sort({ updatedAt: -1 }).toArray();
    const wardCounts = result.reduce((acc, item) => {
      const ward = item?.Ward;
      const localaty = item?.Name_of_Localaty;
      const garbageCollected = item?.Garbage_Collected ? 1 : 0;
      if (acc[ward]) {
        acc[ward].numberOfUser += 1;
        acc[ward].total_no_house_covered += garbageCollected;
      } else {
        acc[ward] = {
          label: ward,
          numberOfUser: 1,
          total_no_house_covered: garbageCollected,
          name_of_locality: localaty,
        };
      }
      return acc;
    }, {});
    const wardArray = Object.values(wardCounts);
    return NextResponse.json(
      { totalWards: wardArray, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const { data } = await req.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "data is required in array format", success: false },
        { status: 400 }
      );
    }
    const wardData = await new wards_analytics({
      data,
    });

    const saved_data = await wardData.save();
    return NextResponse.json(
      { ward_data: saved_data, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error, success: false }, { status: 500 });
  }
};
