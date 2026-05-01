import { Router } from "express";
import {
  createMatch,
  getGames,
  submitMatchResult
} from "../controllers/gameController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getGames);
router.post("/matches", requireAuth, createMatch);
router.post("/matches/:matchId/result", requireAuth, submitMatchResult);

export default router;
