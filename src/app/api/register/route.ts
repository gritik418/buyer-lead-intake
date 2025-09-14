import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, email } = await req.json();

    const user = await prisma.user.upsert({
      where: { email },
      update: { id },
      create: { id, email, role: "USER" },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
