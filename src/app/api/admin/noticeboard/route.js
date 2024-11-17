import { NextResponse } from "next/server";
import noticeBoard from "@/models/noticeBoard";
import connectMongo from "@/db/db";
connectMongo();

export const POST = async (req) => {
  try {
    const requestBody = await req.json();

    const { title, type } = requestBody;

    if (!title || !type) {
      return NextResponse.json(
        { error: "'title' and 'type' are required.", success: false },
        { status: 400 }
      );
    }

    const savedNotice = await noticeBoard.create({
      title,
      type,
    });

    return NextResponse.json(
      {
        message: "Notice created successfully",
        data: savedNotice,
        success: true,
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
    const notices = await noticeBoard.find();

    if (notices.length === 0) {
      return NextResponse.json(
        { error: "No notices found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notices retrieved successfully",
      data: notices,
      success: true,
    });
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
    const { _id, title, type } = await req.json();
    console.log(_id);

    if (!_id) {
      return NextResponse.json(
        { error: "Missing required field 'id'" },
        { status: 400 }
      );
    }

    const updatedUser = await noticeBoard.findByIdAndUpdate(_id, {
      title,
      type,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Notice not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      notice: updatedUser,
      message: "Notice updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "IDs are required and should be an array", success: false },
        { status: 400 }
      );
    }

    const result = await noticeBoard.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No notices found for the provided IDs", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} notice(s) deleted successfully`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};
