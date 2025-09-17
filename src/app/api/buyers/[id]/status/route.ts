import supabase from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import statusValidator from "@/validators/statusValidator";
import { ZodError } from "zod";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const bearerToken = req.headers.get("Authorization");

    if (!bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
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
          message: "Not authenticated.",
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const {
      success,
      data: validatedStatus,
      error,
    } = statusValidator.safeParse(status);

    const { data: sessionData } = await supabase.auth.getUser(authToken);
    const user = sessionData.user;

    if (!user || !user?.id)
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
          error: "Not authenticated",
        },
        { status: 401 }
      );

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

    const userData = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    const currentBuyer = await prisma.buyer.findUnique({ where: { id } });

    if (!currentBuyer) {
      return NextResponse.json(
        {
          success: false,
          error: "Record not found.",
          message: "Record not found.",
        },
        { status: 400 }
      );
    }

    if (
      !userData ||
      (userData?.id !== currentBuyer?.ownerId && userData?.role !== "ADMIN")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You're not authorized to edit this buyer.",
          error: "Not authorized.",
        },
        { status: 401 }
      );
    }

    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: {
        status: validatedStatus,
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: updatedBuyer.id,
        changedBy: user?.id,
        diff: {
          action: "Updated",
          data: { status },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Status updated.",
        buyer: updatedBuyer,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: err.issues, message: "Validation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
