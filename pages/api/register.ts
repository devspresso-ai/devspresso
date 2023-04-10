
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, fullName, password } = req.body;
  /* @ts-ignore */
  const exists = await prisma.User.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    res.status(400).send("User already exists");
  } else {
    /* @ts-ignore */
    const user = await prisma.User.create({
      data: {
        email,
        fullName,
        password: await hash(password, 10),
      },
    });
    res.status(200).json(user);
  }
}
