import { NextResponse } from 'next/server';
import vehicle from '@/models/vehicleTracker';
import connectMongo from '@/db/db';
import { getAccessToken } from '@/helper/vehicleTrackerToken';
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

export const POST = async (req) => {
  try {
    const allDevices = await vehicle.find({});
    if (!allDevices || allDevices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No devices found in the database.',
        },
        { status: 404 }
      );
    }
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access token is not available.',
        },
        { status: 500 }
      );
    }

    const locationResults = [];

    for (const device of allDevices) {
      try {
        const response = await fetch(
          `https://open.iopgps.com/api/device/location?accessToken=${accessToken}&imei=${device.deviceId}`,
          {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
        const locationData = await response.json();

        const gpsTime = new Date(locationData.gpsTime * 1000);
        const istTime = gpsTime.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        if (locationData?.code === 0) {
          locationResults.push({
            deviceId: device.deviceId,
            vehicleName: device.vehicleName,
            ward: device.ward,
            location: {
              lat: locationData.lat,
              lng: locationData.lng,
              address: locationData.address,

              gpsTime: istTime,
            },
            success: true,
          });
        } else {
          locationResults.push({
            deviceId: device.deviceId,
            vehicleName: device.vehicleName,
            ward: device.ward,
            location: null,
            success: false,
            message: locationData.message || 'No location data',
          });
        }
        // console.log(`Device: ${device.deviceId}`, locationData);
      } catch (err) {
        locationResults.push({
          deviceId: device.deviceId,
          vehicleName: device.vehicleName,
          location: null,
          success: false,
          error: err.message,
        });
      }
    }
    return NextResponse.json(
      {
        success: true,
        count: locationResults.length,
        devices: locationResults,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const tracker = await vehicle.find({});
    return NextResponse.json({ data: tracker, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error creating tracker:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { _id, vehicleName, ownerName, vehicleType, ward } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Missing required field 'id'" },
        { status: 400 }
      );
    }

    const updatedVehicle = await vehicle.findByIdAndUpdate(_id, {
      vehicleName,
      ownerName,
      vehicleType,
      ward,
    });

    if (!updatedVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      vehicleData: updatedVehicle,
      message: 'vehicle updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error occurred:', error);
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
        { error: ' id field is  required.', success: false },
        { status: 401 }
      );
    }
    const deleteVehicle = await vehicle.findByIdAndDelete(_id);
    return NextResponse.json(
      {
        data: deleteVehicle,
        message: 'vechile data delete successfully',
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
