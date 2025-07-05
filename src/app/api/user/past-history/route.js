import { NextResponse } from "next/server";
import connectMongo from "@/db/db";
import pastHistory from "@/models/pastHistory";
import garbage_history from "@/models/garbage_history";
connectMongo();

export const POST = async (req) => {
    try {
        const { house_id, employee_id, employee_name, user_ward, is_garabge_collected, message } = await req.json();
        if (!is_garabge_collected && !message) {
            return NextResponse.json(
                { error: "Message is required when garbage is not collected", success: false },
                { status: 400 }
            );
        }
        const newHistory = await new pastHistory({
            house_id,
            employee_id,
            employee_name,
            user_ward,
            is_garabge_collected,
            message: is_garabge_collected ? "" : message
        });

        const save_history = await newHistory.save();
        return NextResponse.json(
            { past_history: save_history, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error, success: false },
            { status: 500 }
        );
    }
};

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const house_id = searchParams.get("house_id");
        const startDate = searchParams.get("start_date");
        const endDate = searchParams.get("end_date");
        console.log(startDate,endDate,'endDate')
        let query = {};
        if (house_id) {
            query.house_id = house_id;
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),  
                $lte: new Date(endDate)     
            };
        } else if (startDate) {
            query.createdAt = {
                $gte: new Date(startDate)  
            };
        } else if (endDate) {
            query.createdAt = {
                $lte: new Date(endDate)    
            };
        }
        const histories = await pastHistory.find(query).select('-__v');
        console.log(histories)
        return NextResponse.json(
            { past_histories: histories, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error, success: false },
            { status: 500 }
        );
    }
};

// export const PATCH = async (req) => {
//     try {
//   const { user_id, label, numberOfUser, total_no_house_covered, name_of_locality } = await req.json()
  
//       if (!user_id) {
//         return NextResponse.json(
//           { error: "id is required" },
//           { status: 400 }
//         )
//       }
  
//       const updatedDetails= await garbage_history.findByIdAndUpdate(
//         user_id,
//         { label, numberOfUser, total_no_house_covered, name_of_locality, createdAt, 
//           updatedAt }
//       )
  
//       return NextResponse.json(
//         { data: updatedDetails, success: true },
//         { status: 200 }
//       )
//     } catch (error) {
//       return NextResponse.json(
//         { error: "internal server issue", success: false },
//         { status: 500 }
//       )
//     }
//   }

export const PATCH = async (req) => {
    try {
      const { user_id, label, numberOfUser, total_no_house_covered, name_of_locality } = await req.json();
  
      if (!user_id) {
        return NextResponse.json(
          { error: "id is required"},
          { status: 400 }
        );
      }
  
      const updatedDetails = await garbage_history.findByIdAndUpdate(
        user_id,
        {
          label,
          numberOfUser, 
          total_no_house_covered,
          name_of_locality,
          updatedAt: new Date() 
        },
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
      console.error(error);
      return NextResponse.json(
        { error: "internal server issue", success: false },
        { status: 500 }
      );
    }
  };
  