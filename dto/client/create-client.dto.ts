import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  email: z.string().email().nullish(),
  city: z.string().nullish(),
  deletedAt: z.date().nullish(),
});
