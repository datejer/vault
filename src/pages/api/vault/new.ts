import { db } from "@/db";
import { users, vaults } from "@/db/schema";
import { compare, hash } from "@/lib/bcrypt";
import { withApiMethods } from "@/lib/withApiMethods";
import {
  buildErrorResponse,
  buildResponse,
  withApiValidation,
} from "@/lib/withApiValidation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { encrypt } from "@/lib/crypto";

const InputSchema = z.object({
  name: z.string(),
  value: z.string(),
  password: z.string(),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { name, value, password } = req.body;

    const user = await getServerSideSession(req);

    if (!user) {
      res.status(400).json(buildErrorResponse("Please log in"));
      return;
    }

    const passwordCorrect = await compare(password, user.password);

    if (!passwordCorrect) {
      res.status(400).json(buildErrorResponse("Invalid password"));
      return;
    }

    const encryptedValue = await encrypt(value, password);

    console.log(encryptedValue);

    const vault = await db
      .insert(vaults)
      .values({
        name,
        userId: user.id,
        value: encryptedValue,
      })
      .returning({ id: vaults.id });

    res.status(200).json(buildResponse(true, { vaultId: vault[0].id }));
  }),
});
