import { z } from "zod";

const createEventSchema = z.object({
  name: z.string().min(1).max(150),
  venue: z.string().min(1).max(150),
  starts_at: z.iso.datetime(),
  capacity: z.number().int().min(0),
});

export { createEventSchema };