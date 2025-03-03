import { NextResponse } from 'next/server';
import connectMongo from '@/db/db';
import UserDetails from '@/models/userDetailsSchema ';

connectMongo();

// export const GET = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const ids = searchParams.getAll('ids');

//     console.log('Received IDs:', ids);

//     if (!ids || ids.length === 0) {
//       return NextResponse.json(
//         { error: "Invalid input. 'ids' must be an array." },
//         { status: 400 }
//       );
//     }

//     const houseOwners = await UserDetails.find({ _id: { $in: ids } });

//     return NextResponse.json(
//       { success: true, data: houseOwners },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Issue', success: false },
//       { status: 500 }
//     );
//   }
// };

export const POST = async (req) => {
  try {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid input. 'ids' must be an array." },
        { status: 400 }
      );
    }

    const houseOwners = await UserDetails.find({ _id: { $in: ids } });

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
