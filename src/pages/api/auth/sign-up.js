import { authenticationSchema } from "@/schema/auth.schema";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function SignUp(req, res) {
  const secret = process.env.JWT_SECRET;

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

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email },
      secret,
      {
        expiresIn: "1h",
      }
    );

    delete user.hash;

    return res.status(201).json({
      user: {
        ...user,
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
}
