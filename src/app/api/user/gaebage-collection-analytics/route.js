import connectMongo from "@/db/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

connectMongo();

export const GET = async () => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$Ward",
          numberOfUser: { $sum: 1 },
          total_no_house_covered: {
            $sum: { $cond: [{ $eq: ["$Garbage_Collected", true] }, 1, 0] },
          },
        },
      },

      {
        $sort: { _id: -1 },
      },
    ];

    const result = await mongoose.connection.db
      .collection("user_details")
      .aggregate(pipeline)
      .toArray();

    const wardArray = result.map((item) => ({
      label: item._id,
      numberOfUser: item.numberOfUser,
      total_no_house_covered: item.total_no_house_covered,
    }));

    return NextResponse.json(
      { totalWards: wardArray, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
