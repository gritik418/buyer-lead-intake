import z from "zod";

export const buyerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.email().optional(),
    phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]),
    bhk: z.enum(["One", "Two", "Three", "Four", "Studio"]).optional(),
    purpose: z.enum(["Buy", "Rent"]),
    budgetMin: z.number().int().optional(),
    budgetMax: z.number().int().optional(),
    timeline: z.enum(["ZeroTo3m", "ThreeTo6m", "Over6m", "Exploring"]),
    source: z.enum(["Website", "Referral", "Walk_in", "Call", "Other"]),
    notes: z.string().max(1000).optional(),
    tags: z.preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
      } else if (typeof val === "object") {
        return val;
      }
      return [];
    }, z.array(z.string())),
  })
  .superRefine((data, ctx) => {
    if (
      (data.propertyType === "Apartment" || data.propertyType === "Villa") &&
      !data.bhk
    ) {
      ctx.addIssue({
        path: ["bhk"],
        code: z.ZodIssueCode.custom,
        message: "BHK is required for Apartment or Villa",
      });
    }

    if (
      data.budgetMin !== undefined &&
      data.budgetMax !== undefined &&
      data.budgetMin > data.budgetMax
    ) {
      ctx.addIssue({
        path: ["budgetMax"],
        code: z.ZodIssueCode.custom,
        message: "budgetMax must be greater than or equal to budgetMin",
      });
    }
  });

export type BuyerType = z.infer<typeof buyerSchema>;
