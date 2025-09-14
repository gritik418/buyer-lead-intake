import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { buyerSchema, BuyerType } from "@/validators/buyer";
import prisma from "@/lib/prismaClient";
import supabase from "@/lib/supabaseClient";

const headers = [
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
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "CSV file is required" },
        { status: 400 }
      );
    }

    if (file.type !== "text/csv") {
      return NextResponse.json(
        { error: "File type must be csv" },
        { status: 400 }
      );
    }

    const bearerToken = req.headers.get("Authorization");
    if (!bearerToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const authToken = bearerToken.split(" ")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: sessionData } = await supabase.auth.getUser(authToken);

    const user = sessionData.user;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const text = await file.text();
    const records: Record<string, string>[] = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length > 200) {
      return NextResponse.json(
        { error: "Maximum 200 rows allowed" },
        { status: 400 }
      );
    }

    const invalidRows: { row: any; errors: string[] }[] = [];
    const validRows: BuyerType[] = [];

    let i = 0;

    for (const row of records) {
      i++;
      console.log(row.bhk);
      const parsed = buyerSchema.safeParse({
        ...row,
        budgetMin: row.budgetMin ? Number(row.budgetMin) : undefined,
        budgetMax: row.budgetMax ? Number(row.budgetMax) : undefined,
        tags: row.tags ?? "",
        bhk: row.bhk || undefined,
      });

      if (parsed.success) {
        validRows.push(parsed.data);
      } else {
        invalidRows.push({
          row: i,
          errors: parsed.error.issues.map(
            (e) => `${e.path.join(".")}: ${e.message}`
          ),
        });
      }
    }
    if (invalidRows.length > 0) {
      return NextResponse.json({ invalidRows }, { status: 400 });
    }

    if (!user || !user.id)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await prisma.$transaction(
      validRows.map((data) =>
        prisma.buyer.create({ data: { ...data, ownerId: user.id } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Import failed", error: error },
      { status: 500 }
    );
  }
}
