/* eslint-disable no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { buildErrorResponse } from "@/lib/withApiValidation";

type HTTPMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export const withApiMethods =
  <R extends NextApiRequest>(
    handlers: Partial<
      Record<HTTPMethods | "default", (req: R, res: NextApiResponse) => unknown>
    >
  ) =>
  (req: R, res: NextApiResponse) => {
    const method = req.method as HTTPMethods;
    const handler = handlers[method] || handlers.default;

    if (handler) {
      return handler(req, res);
    }

    return res
      .status(405)
      .json(buildErrorResponse(`Method ${method} not allowed`));
  };
