import { authenticationSchema } from "@/schema/auth.schema";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function SignUp(req, res) {
  try {
    const { email, password } = authenticationSchema.parse(req.body);

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
      },
    });

    delete user.hash;

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
}
