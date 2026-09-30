import express from "express";
import multer from "multer";
import env from "./config/env.js";
import { HttpError } from "./utils/http-error.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";

const app = express();
const allowedOrigins = (env.CORS_ORIGIN ?? "").split(",").map((o) => o.trim());

// ponytail: hand-rolled CORS for a fixed origin list; pull in `cors` if rules get fancier.
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.set({
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      Vary: "Origin",
    });
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});
app.use(express.json({ limit: "1mb" }));

app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Express 5 forwards rejected async handlers here.
app.use((err, _req, res, _next) => {
  const status =
    err.status ??
    (err instanceof multer.MulterError ? 400 : err.type === "entity.parse.failed" ? 400 : 500);
  // Only HttpErrors / 4xx carry messages meant for clients; hide anything unexpected.
  const exposed = err instanceof HttpError || status < 500;
  if (!exposed) console.error(err);
  res.status(status).json({ error: exposed ? err.message : "Internal server error" });
});

export default app;
