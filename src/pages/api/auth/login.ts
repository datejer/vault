import { db } from "@/db";
import { users } from "@/db/schema";
import { compare } from "@/lib/bcrypt";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse, withApiValidation } from "@/lib/withApiValidation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const InputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { email, password } = req.body;

    const userExists = await db.select().from(users).where(eq(users.email, email));

    if (userExists.length === 0) {
      res.status(400).json(buildErrorResponse("Invalid email or password"));
      return;
    }

    const passwordCorrect = await compare(password, userExists[0].password);

    if (!passwordCorrect) {
      res.status(400).json(buildErrorResponse("Invalid email or password"));
      return;
    }

    // set session cookie
    const token = jwt.sign({ id: userExists[0].id }, process.env.JWT_SECRET!, {
      expiresIn: 60 * 60,
    });

    const cookie = serialize("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(200).json(buildResponse(true));
  }),
});
