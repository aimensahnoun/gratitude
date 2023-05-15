import { PrismaClient } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const jwt = req.headers?.authorization?.split(" ")[1];

      if (!jwt) {
        return res.status(401).json({ msg: "No token, authorization denied" });
      }

      const { id } = req.query;

      const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);

      console.log(decoded);

      if (!decoded || decoded.id !== id) {
        return res
          .status(401)
          .json({ msg: "You cannot access another users profile" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          bio: true,
          email: true,
          Article: {
            select: {},
          },
        },
      });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  } else if (req.method === "PUT") {
    const jwt = req.headers?.authorization?.split(" ")[1];

    if (!jwt) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const { id } = req.query;

    const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);

    console.log(decoded);

    if (!decoded || decoded.id !== id) {
      return res
        .status(401)
        .json({ msg: "You cannot access another users profile" });
    }

    const { bio } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        bio: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);

    await prisma.user.update({
      data: { bio },
    });
  } else if (req.method === "OPTIONS") {
    res.setHeader("Allow", ["GET", "PUT", "OPTIONS"]);
    return res.status(204).end();
  }
  return res.status(405).json({ err: `Method not allowed ${req.method}` });
}
