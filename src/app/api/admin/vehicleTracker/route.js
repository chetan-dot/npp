import { NextResponse } from "next/server";
import vehicle from "@/models/vehicleTracker";
import connectMongo from "@/db/db";
connectMongo();

export const POST = async (req) => {
  try {
    const { vehicleNo, ownerName, deviceId, garbageCollectorId, vehicleType } =
      await req.json();
    if (
      !vehicleNo ||
      !ownerName ||
      !deviceId ||
      !garbageCollectorId ||
      !vehicleType
    ) {
      return NextResponse.json(
        { error: " missing all fields are required", success: false },
        { status: 401 }
      );
    }

    console.log("vehoicle", vehicleNo, ownerName, deviceId, garbageCollectorId);
    

    const vehcileTracker = await vehicle.create({
      vehicleNo,
      ownerName,
      deviceId,
      garbageCollectorId,
      vehicleType,
    });
    return NextResponse.json(
      {
        data: vehcileTracker,
        success: true,
        message: "vehicle tracker created  successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tracker:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const tracker = await vehicle.find({});
    return NextResponse.json({ data: tracker, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating tracker:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};