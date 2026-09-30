import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.js";
import * as contact from "./contact.controller.js";

const router = Router();

router.post("/", contact.create);
router.get("/", requireAdmin, contact.list);

export default router;
