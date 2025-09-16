import { buyerSchema } from "../validators/buyer";

describe("buyerSchema", () => {
  const baseValid = {
    fullName: "Ritik Gupta",
    email: "ritik@example.com",
    phone: "9876543210",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "Two",
    purpose: "Buy",
    budgetMin: 2000000,
    budgetMax: 4000000,
    timeline: "ZeroTo3m",
    source: "Website",
    notes: "Interested in IT park area",
    tags: "Hot,Follow-up",
  };

  it("accepts a valid buyer", () => {
    const result = buyerSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("rejects if bhk missing for Apartment", () => {
    const invalid = { ...baseValid, bhk: undefined };
    const result = buyerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/BHK is required/);
    }
  });

  it("rejects if budgetMin > budgetMax", () => {
    const invalid = { ...baseValid, budgetMin: 5000000, budgetMax: 4000000 };
    const result = buyerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(
        /budgetMax must be greater/
      );
    }
  });

  it("parses tags string into array", () => {
    const input = { ...baseValid, tags: "Hot, Cold, Interested" };
    const result = buyerSchema.parse(input);
    expect(result.tags).toEqual(["Hot", "Cold", "Interested"]);
  });
});
