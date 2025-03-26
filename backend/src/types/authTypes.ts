import { z } from "zod";

export type RegisterInfo = {
    email: string;
    password: string;
    name?: string;
    isAdmin?: boolean;
}

export const RegSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    isAdmin: z.boolean().default(false)
})

export type LoginInfo = {
    email: string;
    password: string;
}
