import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.js";
import { uploadImage } from "../../middlewares/upload.js";
import * as blog from "./blog.controller.js";

const router = Router();

router.get("/", blog.list);
router.get("/:slug", blog.getOne);
// Admin: JSON or multipart/form-data with an optional `coverImage` file.
router.post("/", requireAdmin, uploadImage.single("coverImage"), blog.create);
router.patch("/:slug", requireAdmin, uploadImage.single("coverImage"), blog.update);
router.delete("/:slug", requireAdmin, blog.remove);

export default router;
