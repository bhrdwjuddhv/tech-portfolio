import * as contactService from "./contact.service.js";
import { validateContact } from "./contact.validation.js";

export async function create(req, res) {
  const saved = await contactService.createMessage(validateContact(req.body));
  res.status(201).json({ id: saved.id });
}

export async function list(_req, res) {
  res.json({ messages: await contactService.listMessages() });
}
