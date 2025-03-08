import connectMongo from "@/db/db";
import { NextResponse } from "next/server";
import garbage_history from "@/models/garbage_history";
connectMongo();
// export const GET = async () => {
//   try {
//     const response = await fetch(
//       process.env.NEXT_PUBLIC_HTTP_SERVICE + "/user/wards"
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch data");
//     }

//     const hh = await response.json();
//     const { success, ...filteredData } = hh;
//     const paylod = {
//       historyData: JSON.stringify(filteredData),
//     };

//     const data = await garbage_history.create(paylod);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// };

export const GET = async () => {
  try {
    const historyDatas = await garbage_history.find();
    return NextResponse.json(historyDatas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
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
    const histories = await garbage_history.find(query).select("-__v");
    return NextResponse.json(
      { histories: histories, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
  }
};
