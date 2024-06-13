import { GetServerSidePropsContext, NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getServerSideSession = async (req: NextApiRequest) => {
  const { cookies } = req;

  if (!cookies.session) {
    return null;
  }

  const decoded = jwt.verify(cookies.session, process.env.JWT_SECRET!);
  const decodedId =
    typeof decoded === "string" ? JSON.parse(decoded).id : decoded.id;

  if (!decodedId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, decodedId),
  });

  if (!user) {
    return null;
  }

  return user;
};
