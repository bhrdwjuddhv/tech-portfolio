import { db } from "../../config/env.js";
import { HttpError } from "../../utils/http-error.js";

const toBlog = (row) =>
  row && {
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content, // absent in list rows
    tags: JSON.parse(row.tags),
    date: row.date,
    coverImage: row.cover_image,
  };

// app field -> column
const COLUMNS = {
  slug: "slug",
  title: "title",
  description: "description",
  content: "content",
  tags: "tags",
  date: "date",
  coverImage: "cover_image",
  coverImageId: "cover_image_id",
};

const toRow = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [COLUMNS[k], k === "tags" ? JSON.stringify(v) : v]),
  );

export async function listBlogs() {
  const { results } = await db
    .prepare(
      "SELECT slug, title, description, tags, date, cover_image FROM blogs ORDER BY date DESC, id DESC",
    )
    .all();
  return results.map(toBlog);
}

export async function getBlog(slug) {
  const row = await db.prepare("SELECT * FROM blogs WHERE slug = ?").bind(slug).first();
  return toBlog(row);
}

// Returns the raw row so callers can see cover_image_id (for Cloudinary cleanup).
export function getBlogRow(slug) {
  return db.prepare("SELECT * FROM blogs WHERE slug = ?").bind(slug).first();
}

export async function createBlog(data) {
  const row = toRow(data);
  const cols = Object.keys(row);
  try {
    const created = await db
      .prepare(
        `INSERT INTO blogs (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")}) RETURNING *`,
      )
      .bind(...Object.values(row))
      .first();
    return toBlog(created);
  } catch (err) {
    if (/UNIQUE constraint failed/.test(err.message))
      throw new HttpError(409, `A blog with slug "${data.slug}" already exists`);
    throw err;
  }
}

export async function updateBlog(slug, data) {
  const row = toRow(data);
  const sets = Object.keys(row).map((c) => `${c} = ?`);
  const updated = await db
    .prepare(
      `UPDATE blogs SET ${[...sets, "updated_at = datetime('now')"].join(", ")} WHERE slug = ? RETURNING *`,
    )
    .bind(...Object.values(row), slug)
    .first();
  return toBlog(updated);
}

// Returns the deleted row's cover_image_id (or null), undefined if nothing was deleted.
export async function deleteBlog(slug) {
  const row = await db
    .prepare("DELETE FROM blogs WHERE slug = ? RETURNING cover_image_id")
    .bind(slug)
    .first();
  return row ? row.cover_image_id : undefined;
}
