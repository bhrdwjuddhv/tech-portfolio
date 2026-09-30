import { db } from "../../config/env.js";

export function createMessage({ name, email, phone, interested, message }) {
  return db
    .prepare(
      "INSERT INTO contact_messages (name, email, phone, interested, message) VALUES (?, ?, ?, ?, ?) RETURNING id, created_at",
    )
    .bind(name, email, phone, interested, message)
    .first();
}

export async function listMessages() {
  const { results } = await db
    .prepare("SELECT * FROM contact_messages ORDER BY id DESC")
    .all();
  return results;
}
