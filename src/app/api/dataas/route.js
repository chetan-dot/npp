import connectMongo from "@/db/db";
import { NextResponse } from "next/server";
import garbage_history from "@/models/garbage_history";
connectMongo();

export const GET = async () => {
  try {
    const historyDatas = await garbage_history.find();
    return NextResponse.json(historyDatas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetcsh data" },
      { status: 500 }
    );
  }
};
export const PATCH = async (req) => {
  try {
    const { _id, historyData } = await req.json();
    if (!_id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updatedDetails = await garbage_history.findByIdAndUpdate(
      _id,
      historyData,
      { new: true }
    );

    if (!updatedDetails) {
      return NextResponse.json(
        { error: "No record found with that user_id" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: updatedDetails, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during update:", error);
    return NextResponse.json(
      { error: "Internal server issue", success: false },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const histories = await garbage_history.find(query);

    let wardData = [];

    histories.forEach((history) => {
      const historyData = JSON.parse(history.historyData);
      historyData.totalWards.forEach((ward) => {
        wardData.push({
          label: ward.label,
          data: [
            ward.numberOfUser - ward.total_no_house_covered,
            ward.total_no_house_covered,
          ],
          totalUser: ward.numberOfUser,
        });
      });
    });

    return NextResponse.json(
      {
        wardData,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
};
