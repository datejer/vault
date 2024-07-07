import { NextApiRequest } from "next";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { User, users } from "@/db/schema";

export const getServerSideSession = async (
  req: NextApiRequest,
): Promise<{ user: User | null; expired?: boolean }> => {
  const { cookies } = req;

  if (!cookies.session) {
    return { user: null };
  }

  let decodedId;
  await jwt.verify(cookies.session, process.env.JWT_SECRET!, function (err, decoded) {
    if (err && err.name === "TokenExpiredError") {
      return { expired: true };
    }

    if (decoded) {
      decodedId = typeof decoded === "string" ? JSON.parse(decoded).id : decoded.id;
    }
  });

  if (!decodedId) {
    return { user: null };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, decodedId),
  });

  if (!user) {
    return { user: null };
  }

  return { user };
};
