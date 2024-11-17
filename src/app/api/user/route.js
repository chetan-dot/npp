import { cookies } from "next/headers";
import User from "@/models/user";
import { NextResponse } from "next/server";
import connectMongo from "@/db/db";
connectMongo();

export const DELETE = async (req) => {
  const _id = await req.json();
  console.log(_id)

  if (!_id) {
    return NextResponse.json(
      { error: "user_id required" },
      { status: 400 }
    )
  }
  const deletedUser = await User.findByIdAndDelete(_id)
  console.log(deletedUser)
  return NextResponse.json(
    { data: deletedUser, success: true },
    { status: 200 }
  );
}


export const PATCH = async (req) => {
  try {
    await connectMongo(); 

    const { user_id,name,role,ward_assigned,isActive,mobile_number} = await req.json(); 

    if (!user_id  ) {
      return NextResponse.json(
        { error: "Missing required fields (userId or ward_assigned)" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {name,role,ward_assigned,isActive,mobile_number}
    );

    // If the user doesn't exist
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: updatedUser, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Issue", details: error.message, success: false },
      { status: 500 }
    );
  }
};


export const GET = async (req) => {
    const cookieStore = cookies();
    const authToken = cookieStore.get("authToken")?.value;
    try {
      if (!authToken) {
        return NextResponse.json({ message: "No token found" }, { status: 401 });
      }
      const users = await User.find().select("-password");
      return NextResponse.json({ users, success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Issue", success: false },
        { status: 500 }
      );
    }
  };