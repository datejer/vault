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
  id: z.string(),
  name: z.string(),
  value: z.string(),
  password: z.string(),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { id, name, value, password } = req.body;

    const user = await getServerSideSession(req);

    if (!user) {
      res.status(400).json(buildErrorResponse("Please log in"));
      return;
    }

    const vault = await db.select().from(vaults).where(eq(vaults.id, id));

    if (vault.length === 0 || vault[0].userId !== user.id) {
      res.status(400).json(buildErrorResponse("Invalid vault"));
      return;
    }

    const passwordCorrect = await compare(password, user.password);

    if (!passwordCorrect) {
      res.status(400).json(buildErrorResponse("Invalid password"));
      return;
    }

    const encryptedValue = await encrypt(value, password);

    const updatedVault = await db
      .update(vaults)
      .set({
        name,
        value: encryptedValue,
      })
      .where(eq(vaults.id, id))
      .returning({ id: vaults.id });

    res.status(200).json(buildResponse(true, { vaultId: updatedVault[0].id }));
  }),
});
