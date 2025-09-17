import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { stringify } from "csv-stringify/sync";
import { City, Prisma, PropertyType, Status, Timeline } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const where: Prisma.BuyerWhereInput = {};

    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const status = searchParams.get("status");
    const timeline = searchParams.get("timeline");
    const sort = searchParams.get("sort") || "updatedAt:desc";

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (city) where.city = city as City;
    if (propertyType) where.propertyType = propertyType as PropertyType;
    if (status) where.status = status as Status;
    if (timeline) where.timeline = timeline as Timeline;

    let orderBy: Prisma.BuyerOrderByWithRelationInput = { updatedAt: "desc" };
    const [field, dir] = sort.split(":");
    if (field && dir) orderBy = { [field]: dir };

    const buyers = await prisma.buyer.findMany({
      where,
      orderBy,
    });

    const records = buyers.map((buyer) => ({
      fullName: buyer.fullName,
      email: buyer.email,
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk,
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin,
      budgetMax: buyer.budgetMax,
      timeline: buyer.timeline,
      source: buyer.source,
      notes: buyer.notes,
      tags: buyer.tags,
      status: buyer.status,
    }));

    const csv = stringify(records, {
      header: true,
      columns: [
        "fullName",
        "email",
        "phone",
        "city",
        "propertyType",
        "bhk",
        "purpose",
        "budgetMin",
        "budgetMax",
        "timeline",
        "source",
        "notes",
        "tags",
        "status",
      ],
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=buyers.csv",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error.", error },
      { status: 500 }
    );
  }
}
