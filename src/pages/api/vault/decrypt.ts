import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { vaults } from "@/db/schema";
import { compare } from "@/lib/bcrypt";
import { decrypt } from "@/lib/crypto";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse, withApiValidation } from "@/lib/withApiValidation";

const InputSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { id, password } = req.body;

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

    const decryptedValue = await decrypt(vault[0].value || "", password);

    res.status(200).json(buildResponse(true, { value: decryptedValue }));
  }),
});
