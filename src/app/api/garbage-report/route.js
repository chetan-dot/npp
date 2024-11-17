import connectMongo from "@/db/db";
import pastHistory from "@/models/pastHistory";
import { NextResponse } from "next/server";
connectMongo();

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("start_date");
        const endDate = searchParams.get("end_date");
        const userWard = searchParams.get("user_ward");
        let query = {};
        // if (startDate && endDate) {
        //     query.createdAt = {
        //         $gte: new Date(startDate),  
        //         $lte: new Date(endDate)     
        //     };
        // } else if (startDate) {
        //     query.createdAt = {
        //         $gte: new Date(startDate)  
        //     };
        // } else if (endDate) {
        //     query.createdAt = {
        //         $lte: new Date(endDate)    
        //     };
        // }
        const histories = await pastHistory.find(query).select('-__v');
        console.log(histories,'histories')
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