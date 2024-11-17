import connectMongo from "@/db/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
connectMongo();

const JWT_SECRET = "jwtTarunWebToken";
const bcrypt = require("bcryptjs");
export const POST = async (req) => {
  try {
    const { email, password, mobile_number } = await req.json();
    let query = {};

    if (email) {
      query.email = email;
    }
    
    if (mobile_number) {
      query.mobile_number = mobile_number;
    }

    const user = await User.findOne(query);
    console.log(password,user,'validate')
    if (!user) {
      return NextResponse.json("user not found with this email", {
        status: 500,
      });
    }
    if (user?.role != "garbage_collector") {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json("password is not matched", { status: 500 });
      }
    } else {
      if (password !== user.password) {
        return NextResponse.json("password is not matched", { status: 500 });
      }
    }

    const authToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

    const response = NextResponse.json(
      { user, success: true },
      { status: 200 }
    );
    console.log(user, "check usr");
    if (user.isActive) {
      cookies().set("authToken", authToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    // response.cookies.set("authToken", authToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Issue", success: false },
      { status: 500 }
    );
  }
};
