import { NextResponse } from "next/server";
import vehicle from "@/models/vehicleTracker";
import connectMongo from "@/db/db";
connectMongo();

// export const POST = async (req) => {
//   try {
//     const { vehicleName, ownerName, vehicleType, ward } =
//       await req.json();
//     if (
//       !vehicleName ||
//       !ownerName ||
//       !vehicleType ||
//       !ward
//     ) {
//       return NextResponse.json(
//         { error: " missing all fields are required", success: false },
//         { status: 401 }
//       );
//     }
    

//     const vehicleTracker = await vehicle.create({
//       vehicleName,
//       ownerName,
//       vehicleType,
//       ward,
//     });

//     return NextResponse.json(
//       {
//         data: vehicleTracker,
//         success: true,
//         message: "vehicle tracker created  successfully",
//       },
//       { status: 201 }
//     );
    
//   } catch (error) {
//     console.error("Error creating tracker:", error);
//     return NextResponse.json(
//       { error: error.message, success: false },
//       { status: 500 }
//     );
//   }
// };

// export const GET = async (req) => {
//   try {
//     const tracker = await vehicle.find({});
//     return NextResponse.json({ data: tracker, success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error creating tracker:", error);
//     return NextResponse.json(
//       { error: error.message, success: false },
//       { status: 500 }
//     );
//   }
// };



export const POST = async (req) => {
  try {
    const response = await fetch("https://open.iopgps.com/api/device/location?accessToken=4dfca99ef0c84b509796eda3c6c2fa8f&imei=356218604142446", {
      method: "GET", 
      headers: {
        "Content-Type": "application/json"
      },
     
    });

    const data = await response.json();
    console.log("response", data);

    return NextResponse.json(
      { data, success: true, message: "tracker created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating tracker:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}


export const PATCH = async (req) => {
  try {
    const { _id, vehicleNo, vehicleName, ownerName, vehicleType, ward, deviceId, garbageCollectorId, } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Missing required field 'id'" },
        { status: 400 }
      );
    }

    const updatedVehicle = await vehicle.findByIdAndUpdate(_id, {
        vehicleName, ownerName, vehicleType, ward, vehicleNo, deviceId, garbageCollectorId
    });

    if (!updatedVehicle) {
      return NextResponse.json(
        { error: "Vehicle not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      vehicleData: updatedVehicle,
      message: "vehicle updated successfully",
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
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { error: " id field is  required.", success: false },
        { status: 401 }
      );
    }
    const deleteVehicle = await vehicle.findByIdAndDelete(_id);
    return NextResponse.json(
      {
        data: deleteVehicle,
        message: "vechile data delete successfully",
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