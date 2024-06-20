import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vaults } from "@/db/schema";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse } from "@/lib/withApiValidation";

export default withApiMethods({
  GET: async (req, res) => {
    const user = await getServerSideSession(req);

    if (!user) {
      res.status(400).json(buildErrorResponse("Please log in"));
      return;
    }

    const userVaults = await db.select().from(vaults).where(eq(vaults.userId, user.id));

    res.status(200).json(buildResponse(true, { vaults: userVaults }));
  },
});
