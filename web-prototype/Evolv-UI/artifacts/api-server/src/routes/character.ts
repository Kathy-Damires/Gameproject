import { Router, type IRouter } from "express";
import { character } from "../data/game-data";

const router: IRouter = Router();

router.get("/character", (_req, res) => {
  res.json(character);
});

export default router;
