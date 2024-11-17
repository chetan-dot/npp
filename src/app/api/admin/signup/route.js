import { NextResponse } from "next/server";
import User from "@/models/user";
import connectMongo from "@/db/db";
const bcrypt = require("bcryptjs");
connectMongo();

export const POST = async (req) => {
  const data = await req.json();
  if (Array.isArray(data)) {
    try {
      const usersToCreate = data.map(
        ({ employee_name, mobile_number, ward_assigned }) => {
          console.log(employee_name, mobile_number, ward_assigned ,'checkthis')
          return {
            name: employee_name,
            mobile_number:mobile_number,
            ward_assigned,
            isActive: true,
            password:mobile_number,
            role: "garbage_collector",
            email: `${employee_name.split(' ')[0]}${String(mobile_number).slice(0,3)}@gmail.com`, 
          };
        }
      );
      const createdUsers = await User.insertMany(usersToCreate, {
        ordered: false,
      });
      return NextResponse.json({ data: createdUsers }, { status: 200 });
    } catch (error) {
      console.error("Error inserting users:", error);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    try {
      const { name, email, password, role } = await req.json();

      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const genSalt = 10;
      const hashedPassword = await bcrypt.hash(password, genSalt);

      const newUser = await new User({
        name,
        email,
        password: hashedPassword,
        role,
      });
      const saved_user = await newUser.save();
      return NextResponse.json(
        { User: saved_user, success: false },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Issue", success: true },
        { status: 500 }
      );
    }
  }
};
