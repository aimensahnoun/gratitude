import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken from  "jsonwebtoken";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const secret = process.env.JWT_SECRET;

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jsonwebtoken.sign({ id: user.id }, secret, {
      expiresIn: "1d",
    });

    delete user.hash;

    return res.status(200).json({
      user: {
        ...user,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
