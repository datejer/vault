import { db } from "@/db";
import { vaults } from "@/db/schema";
import { compare } from "@/lib/bcrypt";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse, withApiValidation } from "@/lib/withApiValidation";
import { z } from "zod";
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
