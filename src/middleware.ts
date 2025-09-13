import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { data, error } = await supabase.auth.getSession();
  console.log("data", data);
  console.log("error", error);
}

export const config = {
  matcher: "/",
};
