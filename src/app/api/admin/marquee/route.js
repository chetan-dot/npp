import { NextResponse } from "next/server";
import marquee from "@/models/marqueeModel";
import connectMongo from "@/db/db";
connectMongo();

export const POST = async (req) => {
  try {
    const { info, new: isNew } = await req.json();
    if (!info) {
      return NextResponse.json(
        { error: " info field is  required.", success: false },
        { status: 401 }
      );
    }
    const newMarquee = await marquee.create({ info, new: isNew });
    return NextResponse.json(
      {
        data: newMarquee,
        success: true,
        message: "marquee create successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const Marquee = await marquee.find({});
    return NextResponse.json({ data: Marquee, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { _id, info, new: isNew } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { error: " id field is  required.", success: false },
        { status: 401 }
      );
    }
    const updatemarquee = await marquee.findByIdAndUpdate(_id, {
      info,
      new: isNew,
    });
    return NextResponse.json(
      {
        data: updatemarquee,
        message: "marquee update successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { error: " id field is  required.", success: false },
        { status: 401 }
      );
    }
    const deletemarquee = await marquee.findByIdAndDelete(_id);
    return NextResponse.json(
      {
        data: deletemarquee,
        message: "marquee delete successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
