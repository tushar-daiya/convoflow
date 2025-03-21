import { z } from "zod";

export const siginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const apiKeySchema=z.object({
    openai:z.string(),
    pinecone:z.string(),
})
