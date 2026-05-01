import { Router } from "express";
import { getDashboard } from "../controllers/adminController.js";
import { requireAdminAccessKey } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAdminAccessKey, getDashboard);

export default router;
