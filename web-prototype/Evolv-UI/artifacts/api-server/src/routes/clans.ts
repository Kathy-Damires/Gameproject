import { Router, type IRouter } from "express";
import { clans } from "../data/game-data";

const router: IRouter = Router();

router.get("/clans", (_req, res) => {
  res.json(clans);
});

export default router;
