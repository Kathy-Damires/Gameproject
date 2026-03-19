import { Router, type IRouter } from "express";
import { cards } from "../data/game-data";

const router: IRouter = Router();

router.get("/cards", (_req, res) => {
  res.json(cards);
});

export default router;
