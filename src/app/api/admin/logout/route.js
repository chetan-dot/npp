const { NextResponse } = require("next/server");

export const POST = async (req) => {
  try {
    const responce = NextResponse.json({
      message: "Logedout successfully",
      success: true,
    });
     responce.cookies.set("authToken", "", {
      expires: new Date(0),
    });
    return responce;
  } catch (error) {
    NextResponse.json({
      error: "Internal Server Issue",
      success: false,
    });
  }
};
