import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const middleware = (request) => {
  const ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:3000",
    "https://npp-noorpur.org",
  ];
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse("Forbidden: Your origin is not allowed.", {
      status: 403,
    });
  }
  const response = NextResponse.next();

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { headers: response.headers });
    }

    return response;
  }

  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const { pathname } = request.nextUrl;
  if (pathname === "/" && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.endsWith("/updateuser") && !authToken) {
    const id = pathname.split("/dashboard/")[1].split("/")[0];
    console.log(id, "check id");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.endsWith("/updateuser") && authToken) {
    return NextResponse.next();
  }
  const authRoutes = ["/forgetpassword", "/signup", "/login"];
  if (authRoutes.some((route) => pathname.startsWith(route)) && authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
};
