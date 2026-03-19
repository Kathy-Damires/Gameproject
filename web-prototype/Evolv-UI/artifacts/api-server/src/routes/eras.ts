import { Router, type IRouter } from "express";
import { eras } from "../data/game-data";

const router: IRouter = Router();

router.get("/eras", (_req, res) => {
  res.json(eras);
});

export default router;
