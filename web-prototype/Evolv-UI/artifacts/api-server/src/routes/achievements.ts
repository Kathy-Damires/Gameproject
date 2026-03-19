import { Router, type IRouter } from "express";
import { achievements } from "../data/game-data";

const router: IRouter = Router();

router.get("/achievements", (_req, res) => {
  res.json(achievements);
});

export default router;
