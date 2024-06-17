import { withApiMethods } from "@/lib/withApiMethods";
import { buildResponse } from "@/lib/withApiValidation";
import { serialize } from "cookie";

export default withApiMethods({
  POST: async (req, res) => {
    const cookie = serialize("session", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    res.status(200).json(buildResponse(true));
  },
});
