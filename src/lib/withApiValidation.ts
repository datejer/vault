/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export const withApiValidation =
  <R extends NextApiRequest, S extends z.AnyZodObject>(
    schema: S,
    handler: (
      req: Override<
        R,
        {
          body: z.infer<S>;
        }
      >,
      res: NextApiResponse
    ) => unknown
  ) =>
  async (req: R, res: NextApiResponse) => {
    const parsedSchema = schema.safeParse(req.body);

    if (!parsedSchema.success) {
      const { errors } = parsedSchema.error;

      return res
        .status(400)
        .json(buildErrorResponse("Invalid request", errors));
    }

    req.body = parsedSchema.data;

    return await handler(req, res);
  };

export const buildResponse = (success = true, data?: Object) => ({
  success,
  data,
});

export const buildErrorResponse = (message: string, errors?: any) => ({
  success: false,
  error: { message, errors },
});

export type APIResponse = ReturnType<typeof buildResponse>;
export type APIError = ReturnType<typeof buildErrorResponse>;
