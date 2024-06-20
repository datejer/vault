import { GetServerSidePropsContext } from "next";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";

const UNAUTHENTICATED_REDIRECT = {
  redirect: {
    destination: "/auth",
    permanent: false,
  },
};

export const getServerSideProtectedRoute = async (context: GetServerSidePropsContext) => {
  const { cookies } = context.req;

  if (!cookies.session) {
    return UNAUTHENTICATED_REDIRECT;
  }

  const decoded = jwt.verify(cookies.session, process.env.JWT_SECRET!);
  const decodedId = typeof decoded === "string" ? JSON.parse(decoded).id : decoded.id;

  const user = await db.query.users.findFirst({
    where: eq(users.id, decodedId),
    with: {
      vaults: true,
    },
  });

  if (!user) {
    // remove session cookie if its invalid
    context.res.setHeader("Set-Cookie", "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");

    return UNAUTHENTICATED_REDIRECT;
  }

  const { password: _password, ...userWithoutPassword } = user;

  return {
    props: {
      user: userWithoutPassword,
    },
  };
};
