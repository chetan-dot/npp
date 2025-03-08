import { GET as history } from "../user/wards/route";
import { NextResponse } from "next/server";
import garbage_history from "@/models/garbage_history";
export const GET = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HTTP_SERVICE + "/user/wards"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const hh = await response.json();
    const { success, ...filteredData } = hh;
    const paylod = {
      historyData: JSON.stringify(hh),
    };

    const data = await garbage_history.create(paylod);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
  }
};
