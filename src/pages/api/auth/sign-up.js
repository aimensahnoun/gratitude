import { authenticationSchema } from "@/schema/auth.schema";
import bcrypt from "bcrypt";

export default async function SignUp(req, res) {
  try {
    const { email, password } = authenticationSchema.parse(req.body);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return res
      .status(200)
      .json({ email, hashedPassword, verifyPassword, salt });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
}
