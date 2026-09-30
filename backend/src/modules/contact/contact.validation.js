import { HttpError } from "../../utils/http-error.js";

// Keep in sync with frontend/src/data/site.js -> contactSubjects.
const SUBJECTS = ["web", "uiux", "branding", "freelance"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v) => (typeof v === "string" ? v.trim() : "");

// Mirrors the Yup schema on the Get In Touch page, plus upper bounds.
export function validateContact(body = {}) {
  const msg = {
    name: text(body.name),
    email: text(body.email),
    phone: text(body.phone) || null,
    interested: text(body.interested),
    message: text(body.message),
  };
  const fail = (m) => {
    throw new HttpError(400, m);
  };

  if (msg.name.length < 2 || msg.name.length > 100) fail("Name must be 2-100 characters");
  if (!EMAIL.test(msg.email) || msg.email.length > 254) fail("Please enter a valid email");
  if (msg.phone && (msg.phone.length < 5 || msg.phone.length > 15)) fail("Invalid phone number");
  if (!SUBJECTS.includes(msg.interested)) fail("Please select a subject");
  if (msg.message.length < 5 || msg.message.length > 5000) fail("Message must be 5-5000 characters");
  return msg;
}
