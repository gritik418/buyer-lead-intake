import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { buyerSchema, BuyerType } from "@/validators/buyer";
import supabase from "@/lib/supabaseClient";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { updatedAt, ...body } = await req.json();

    const bearerToken = req.headers.get("Authorization");
    console.log("bearerToken", bearerToken);
    if (!bearerToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("bearerToken", bearerToken);

    const authToken = bearerToken.split(" ")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { success, data, error } = buyerSchema.safeParse(body);

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

    const currentBuyer = await prisma.buyer.findUnique({ where: { id } });

    if (!currentBuyer) {
      return NextResponse.json(
        { success: false, error: "Record not found." },
        { status: 400 }
      );
    }

    if (new Date(updatedAt).getTime() !== currentBuyer.updatedAt.getTime()) {
      return NextResponse.json(
        { success: false, error: "Record changed, please refresh." },
        { status: 400 }
      );
    }

    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: updatedBuyer.id,
        changedBy: user.id,
        diff: {
          action: "Updated",
          data,
        },
      },
    });

    return NextResponse.json({ success: true, buyer: updatedBuyer });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json(
        { success: false, errors: err.errors },
        { status: 400 }
      );
    }

    console.error("Update buyer error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
