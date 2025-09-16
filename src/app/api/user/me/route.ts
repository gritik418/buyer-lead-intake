import supabase from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const bearerToken = request.headers.get("Authorization");
    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const authToken = bearerToken.split(" ")[1];
    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }
    const { data: sessionData } = await supabase.auth.getUser(authToken);

    const user = sessionData.user;
    if (!user || !user.id)
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          error: "Not authenticated",
        },
        { status: 401 }
      );

    const userData = await prisma?.user.findUnique({ where: { id: user.id } });

    if (!userData || !userData?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error." },
      { status: 500 }
    );
  }
}
