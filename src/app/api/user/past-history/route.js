import { NextResponse } from "next/server";
import connectMongo from "@/db/db";
import pastHistory from "@/models/pastHistory";
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
