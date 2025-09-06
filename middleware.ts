import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // No middleware protection - let dashboard handle user state internally
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
