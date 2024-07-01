import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { vaults } from "@/db/schema";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse, withApiValidation } from "@/lib/withApiValidation";

const InputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export default withApiMethods({
  POST: withApiValidation(InputSchema, async (req, res) => {
    const { id, name } = req.body;

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

    const updatedVault = await db
      .update(vaults)
      .set({
        name,
      })
      .where(eq(vaults.id, id))
      .returning({ id: vaults.id });

    res.status(200).json(buildResponse(true, { vaultId: updatedVault[0].id, updatedName: name }));
  }),
});
