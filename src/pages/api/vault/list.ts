import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vaults } from "@/db/schema";
import { getServerSideSession } from "@/lib/getServerSideSession";
import { withApiMethods } from "@/lib/withApiMethods";
import { buildErrorResponse, buildResponse } from "@/lib/withApiValidation";

export default withApiMethods({
  GET: async (req, res) => {
    const session = await getServerSideSession(req);

    if (session.expired) {
      res.status(400).json(buildErrorResponse("Session expired, please log in again"));
      return;
    }

    if (!session.user) {
      res.status(400).json(buildErrorResponse("Please log in"));
      return;
    }

    const userVaults = await db.select().from(vaults).where(eq(vaults.userId, session.user.id));

    res.status(200).json(buildResponse(true, { vaults: userVaults }));
  },
});
