import { createHash, timingSafeEqual } from "node:crypto";
import env from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

const sha256 = (s) => createHash("sha256").update(s).digest();

// Guards write/admin routes: `Authorization: Bearer <ADMIN_TOKEN>`.
// ponytail: single shared token; swap for real users/sessions if more than one admin ever exists.
export function requireAdmin(req, _res, next) {
  const token = req.get("authorization")?.replace(/^Bearer /, "") ?? "";
  // Hash both sides so timingSafeEqual gets equal lengths and leaks nothing about the token.
  if (!env.ADMIN_TOKEN || !timingSafeEqual(sha256(token), sha256(env.ADMIN_TOKEN)))
    throw new HttpError(401, "Unauthorized");
  next();
}
