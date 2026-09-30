import { HttpError } from "../../utils/http-error.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Multipart forms send everything as strings, so accept a JSON array, "a, b" or an array.
function parseTags(tags) {
  if (Array.isArray(tags)) return tags.map(String);
  const s = String(tags).trim();
  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return arr.map(String);
    } catch {
      /* fall through */
    }
    throw new HttpError(400, "tags must be a JSON array or comma-separated list");
  }
  return s.split(",").map((t) => t.trim()).filter(Boolean);
}

function str(body, key, { max, required }) {
  const v = body[key];
  if (v === undefined || v === "") {
    if (required) throw new HttpError(400, `${key} is required`);
    return undefined;
  }
  if (typeof v !== "string") throw new HttpError(400, `${key} must be a string`);
  if (max && v.length > max) throw new HttpError(400, `${key} must be at most ${max} characters`);
  return v.trim();
}

// `partial` = update: every field optional, slug not changeable.
export function validateBlog(body = {}, { partial = false } = {}) {
  const out = {
    title: str(body, "title", { max: 200, required: !partial }),
    description: str(body, "description", { max: 500 }),
    content: str(body, "content", { required: !partial }),
    date: str(body, "date", {}),
  };
  if (!partial) {
    out.slug = str(body, "slug", { max: 120 }) ?? slugify(out.title);
    if (!SLUG.test(out.slug)) throw new HttpError(400, "slug must be lowercase words joined by '-'");
  }
  if (out.date && (!DATE.test(out.date) || isNaN(Date.parse(out.date))))
    throw new HttpError(400, "date must be YYYY-MM-DD");
  if (body.tags !== undefined) out.tags = parseTags(body.tags);

  // drop fields that weren't sent, so updates only touch what was given
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}
