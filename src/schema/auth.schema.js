import { string, object } from "zod";

export const authenticationSchema = object({
  email: string().email("Please enter a valid email"),
  password: string().min(8, "Minimum 8 characters"),
});
