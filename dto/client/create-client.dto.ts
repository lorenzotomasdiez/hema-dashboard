import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  email: z.string().email("Email is required").nullable(),
  city: z.string().nullable(),
  deletedAt: z.date().nullable(),
});