import prisma from "@/lib/prismaClient";
import { checkRateLimit } from "@/lib/rateLimiter";
import supabase from "@/lib/supabaseClient";
import { buyerSchema } from "@/validators/buyer";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = checkRateLimit(`create:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Try again later.",
          error: "Rate limit exceeded. Try again later.",
        },
        { status: 429 }
      );
    }

    const { id } = await params;
    const { updatedAt, ...body } = await req.json();

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

    const { success, data, error } = buyerSchema.safeParse(body);

    const { data: sessionData } = await supabase.auth.getUser(authToken);

    const user = sessionData.user;
    if (!user || !user.id)
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
        id: user.id,
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

    if (new Date(updatedAt).getTime() !== currentBuyer?.updatedAt.getTime()) {
      return NextResponse.json(
        {
          success: false,
          message: "Record changed, please refresh.",
          error: "Record changed, please refresh.",
        },
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
        changedBy: user?.id,
        diff: {
          action: "Updated",
          data,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Record updated.",
      buyer: updatedBuyer,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json(
        { success: false, errors: err.errors, message: "Validation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data: sessionData } = await supabase.auth.getUser(authToken);

    const user = sessionData.user;
    if (!user || !user.id)
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
          error: "Not authenticated",
        },
        { status: 401 }
      );

    const userData = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const currentBuyer = await prisma.buyer.findUnique({ where: { id } });

    console.log(currentBuyer, user.id);

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
          message: "You're not authorized to delete this buyer.",
          error: "Not authorized.",
        },
        { status: 401 }
      );
    }
    await prisma.buyerHistory.deleteMany({
      where: { buyerId: id },
    });

    await prisma.buyer.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Record deleted.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json(
        { success: false, errors: err.errors, message: "Validation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
