import prisma from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { buyerSchema } from "@/validators/buyer";
import supabase from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { success, data: parsedData, error } = buyerSchema.safeParse(json);

    const bearerToken = req.headers.get("Authorization");
    if (!bearerToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const authToken = bearerToken.split(" ")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!success) {
      const formattedErrors = error.format();
      return NextResponse.json(
        {
          success: false,
          errors: formattedErrors,
          message: "Validation failed.",
        },
        { status: 400 }
      );
    }

    const { data: sessionData } = await supabase.auth.getUser(authToken);

    const user = sessionData.user;
    if (!user || !user.id)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const buyer = await prisma.buyer.create({
      data: {
        ownerId: user.id,
        email: parsedData?.email,
        fullName: parsedData?.fullName! || "",
        phone: parsedData?.phone! || "",
        city: parsedData?.city!,
        propertyType: parsedData?.propertyType!,
        bhk: parsedData?.bhk || null,
        purpose: parsedData?.purpose!,
        budgetMin: parsedData?.budgetMin,
        budgetMax: parsedData?.budgetMax,
        timeline: parsedData?.timeline!,
        source: parsedData?.source!,
        notes: parsedData?.notes,
        tags: parsedData?.tags,
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: user.id,
        diff: {
          action: "Created",
          data: parsedData,
        },
      },
    });

    return NextResponse.json({ success: true, buyer, message: "Buyer added." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
