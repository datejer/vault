import { GetServerSidePropsContext } from "next";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const UNAUTHENTICATED_REDIRECT = {
  redirect: {
    destination: "/auth",
    permanent: false,
  },
};

export const getServerSideProtectedRoute = async (
  context: GetServerSidePropsContext
) => {
  const { cookies } = context.req;

  if (!cookies.session) {
    return UNAUTHENTICATED_REDIRECT;
  }

  const decoded = jwt.verify(cookies.session, process.env.JWT_SECRET!);
  const decodedId =
    typeof decoded === "string" ? JSON.parse(decoded).id : decoded.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, decodedId),
  });

  if (!user) {
    return UNAUTHENTICATED_REDIRECT;
  }

  const { password, ...userWithoutPassword } = user;

  return {
    props: {
      user: userWithoutPassword,
    },
  };
};