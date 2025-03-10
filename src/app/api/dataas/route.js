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

// export const POST = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const startDate = searchParams.get("start_date");
//     const endDate = searchParams.get("end_date");
//     let query = {};

//     if (startDate && endDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     } else if (startDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//       };
//     } else if (endDate) {
//       query.createdAt = {
//         $lte: new Date(endDate),
//       };
//     }
//     const histories = await garbage_history.find(query);
//     return NextResponse.json(
//       { histories: histories, success: true },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("error ", error);
//   }
// };

// export const POST = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const startDate = searchParams.get("start_date");
//     const endDate = searchParams.get("end_date");
//     let query = {};
//     if (startDate && endDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     } else if (startDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//       };
//     } else if (endDate) {
//       query.createdAt = {
//         $lte: new Date(endDate),
//       };
//     }
//     const histories = await garbage_history.find(query);
//     const aggregatedWardsData = {};

//     let totalCount = 0;
//     histories.forEach((history) => {
//       const historyData = JSON.parse(history.historyData);
//       historyData.totalWards.forEach((ward) => {
//         const {
//           label,
//           numberOfUser,
//           total_no_house_covered,
//         } = ward;

//         if (!aggregatedWardsData[label]) {
//           aggregatedWardsData[label] = {
//             label,
//             totalNumberOfUsers: 0,
//             totalNoHouseCovered: 0,
//             count: 0,
//           };
//         }
//         aggregatedWardsData[label].totalNumberOfUsers += numberOfUser;
//         aggregatedWardsData[label].totalNoHouseCovered +=
//           total_no_house_covered;
//         aggregatedWardsData[label].count += 1;

//         totalCount++;
//       });
//     });
//     const wardsData = Object.keys(aggregatedWardsData).map((label) => {
//       const ward = aggregatedWardsData[label];
//       return {
//         label: ward.label,
//         totalNumberOfUsers: ward.totalNumberOfUsers,
//         totalNoHouseCovered: ward.totalNoHouseCovered,
//         avgNumberOfUsers: ward.totalNumberOfUsers / ward.count,
//         avgTotalHouseCovered: ward.totalNoHouseCovered / ward.count,
//       };
//     });
//     return NextResponse.json(
//       {
//         wardsData,
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("error ", error);
//     return NextResponse.json(
//       { success: false, message: "An error occurred" },
//       { status: 500 }
//     );
//   }
// };

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
    let totalUsers = 0;
    let totalHousesCovered = 0;
    let totalWardsCount = 0;

    histories.forEach((history) => {
      const historyData = JSON.parse(history.historyData);
      historyData.totalWards.forEach((ward) => {
        totalUsers += ward.numberOfUser;
        totalHousesCovered += ward.total_no_house_covered;
        totalWardsCount += 1;
      });
    });

    const averageUsers = totalUsers / totalWardsCount;
    const averageHousesCovered = totalHousesCovered / totalWardsCount;

    return NextResponse.json(
      {
        histories: [
          {
            totalUsers,
            totalHousesCovered,
            averageUsers,
            averageHousesCovered,
          },
        ],
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
