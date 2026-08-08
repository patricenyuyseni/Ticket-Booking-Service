import { z } from "zod";

const createBookingSchema = z.object({
  customer_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export { createBookingSchema };