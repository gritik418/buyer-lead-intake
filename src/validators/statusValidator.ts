import z from "zod";

const statusValidator = z.enum([
  "New",
  "Qualified",
  "Contacted",
  "Visited",
  "Negotiation",
  "Converted",
  "Dropped",
]);

export default statusValidator;

export type StatusType = z.infer<typeof statusValidator>;
