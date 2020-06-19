import { MiddlewareFn, ResolverData, NextFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-fastify";
import { verify } from "jsonwebtoken";

import { BaseContext } from "../utils/context";
import config from "../config";

export const AdminMiddleware: MiddlewareFn<BaseContext> = async (
  { context }: ResolverData<BaseContext>,
  next: NextFn
) => {
  const token: string = context.req.headers["authorization"];

  if (!token) {
    throw new AuthenticationError("NO_TOKEN");
  }
  try {
    const { type, username }: any = verify(token, config.admin.loginJWT!);

    if (type !== "admin" && username !== config.admin.username) {
      throw new AuthenticationError("INVALID_TOKEN");
    }

    next();
  } catch (error) {
    throw new AuthenticationError("INVALID_TOKEN");
  }
};
