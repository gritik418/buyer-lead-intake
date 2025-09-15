import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { buyerSchema, BuyerType } from "@/validators/buyer";
import prisma from "@/lib/prismaClient";
import supabase from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file is required",
          error: "CSV file is required",
        },
        { status: 400 }
      );
    }

    if (file.type !== "text/csv") {
      return NextResponse.json(
        {
          success: false,
          message: "File type must be csv",
          error: "File type must be csv",
        },
        { status: 400 }
      );
    }

    const bearerToken = req.headers.get("Authorization");
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

    if (!user || !user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const text = await file.text();
    const records: Record<string, string>[] = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 200 rows allowed",
          error: "Maximum 200 rows allowed",
        },
        { status: 400 }
      );
    }

    const invalidRows: { row: any; errors: string[] }[] = [];
    const validRows: BuyerType[] = [];

    let i = 0;

    for (const row of records) {
      i++;
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

    await prisma.$transaction(
      validRows.map((data) =>
        prisma.buyer.create({ data: { ...data, ownerId: user.id } })
      )
    );

    let message = `Successfully imported ${validRows.length} ${
      validRows.length > 1 ? "buyers" : "buyer"
    }.`;
    if (invalidRows.length > 0) {
      message += ` Skipped ${invalidRows.length} invalid rows.`;
    }

    if (invalidRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: message,
          invalidRows,
          importedCount: validRows.length,
          skippedCount: invalidRows.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Successfully imported ${validRows.length} ${
        validRows.length > 1 ? "buyers" : "buyer"
      }.`,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Import failed", error: error },
      { status: 500 }
    );
  }
}
