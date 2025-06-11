import { NextResponse } from 'next/server';
import connectMongo from '@/db/db';
import UserDetails from '@/models/userDetailsSchema ';

connectMongo();

// export const POST = async (req) => {
//   const data = await req.json();
//   if (Array.isArray(data)) {
//     try {
//       const usersToCreate = data.map(
//         ({ employee_name, mobile_number, ward_assigned }) => {
//           return {
//             Unique_Property_ID: { type: String, unique: true },
//   Name_of_Localaty: { type: String },
//   Name_of_Household_Owner: { type: String },
//   Name_of_Household_Owner_Father_Husband: { type: String },
//   House_Type: { type: String },
//   Source_of_Water_Supply: { type: String },
//   Objective_of_use: { type: String },
//   Use_Self_Rent: { type: String },
//   Total_Area_Sq_Ft: { type: Number },
//   Coverd_Area_Sq_Ft_Residential: { type: Number },
//   Coverd_Area_Sq_Ft_Commercial: { type: Number },
//   Uncoverd_Area_Sq_Ft: { type: Number },
//   Mobile_No: { type: Number },
//   Front_Road_Type_Width_in_Feet: { type: Number },
//   Remarks: { type: String },
//   Status: { type: String },
//   Ward: { type: Number }
//           };
//         }
//       );
//       const createdUsers = await User.insertMany(usersToCreate, {
//         ordered: false,
//       });
//       return NextResponse.json({ data: createdUsers }, { status: 200 });
//     } catch (error) {
//       console.error("Error inserting users:", error);

//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   } else {
//     try {
//       const { name, email, role } = await req.json();

//       if (!name || !email || !role) {
//         return NextResponse.json(
//           { error: "Missing required fields" },
//           { status: 400 }
//         );
//       }

//       const newUser = await new User({
//         name,
//         email,
//         role,
//       });
//       const saved_user = await newUser.save();
//       return NextResponse.json(
//         { User: saved_user, success: false },
//         { status: 200 }
//       );
//     } catch (error) {
//       return NextResponse.json(
//         { error: "Internal Server Issue", success: true },
//         { status: 500 }
//       );
//     }
//   }
// };

// get methord using query params
// export const GET = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const ids = searchParams.getAll("ids");

//     console.log("Received IDs:", ids);

//     if (!ids || ids.length === 0) {
//       return NextResponse.json({ error: "Invalid input. 'ids' must be an array." }, { status: 400 });
//     }

//     const houseOwners = await UserDetails.find({ _id: { $in: ids } });

//     return NextResponse.json({ success: true, data: houseOwners }, { status: 200 });

//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "Internal Server Issue", success: false }, { status: 500 });
//   }
// };

// post methord using body params
export const POST = async (req) => {
  try {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid input. 'ids' must be an array." },
        { status: 400 }
      );
    }

    const houseOwners = await UserDetails.find({
      Unique_Property_ID: { $in: ids },
    });

    return NextResponse.json(
      { success: true, data: houseOwners },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Issue', success: false },
      { status: 500 }
    );
  }
};
