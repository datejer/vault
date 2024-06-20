import { z } from "zod";
import { db } from "@/db";
import { vaults } from "@/db/schema";
import { compare } from "@/lib/bcrypt";
import { encrypt } from "@/lib/crypto";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { vaultType } from "@/lib/vaultTypes";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse, withApiValidation } from "@/lib/withApiValidation";

const InputSchema = z.object({
  name: z.string(),
  type: vaultType,
  value: z.string(),
  password: z.string(),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { name, type, value, password } = req.body;

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
        type,
        userId: user.id,
        value: encryptedValue,
      })
      .returning({ id: vaults.id });

    res.status(200).json(buildResponse(true, { vaultId: vault[0].id }));
  }),
});
