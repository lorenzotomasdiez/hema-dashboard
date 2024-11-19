import { PrismaClient } from "@prisma/client";
import { env } from "../env.mjs";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

export const db =
  global.db ||
  new PrismaClient({
    log: [env.PRISMA_LOG],
  });

if (process.env.NODE_ENV !== "production") global.db = db;
