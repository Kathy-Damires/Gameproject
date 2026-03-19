import { Router, type IRouter } from "express";
import { planets } from "../data/game-data";

const router: IRouter = Router();

router.get("/planets", (_req, res) => {
  res.json(planets);
});

router.get("/planets/:id", (req, res) => {
  const id = Number(req.params.id);
  const planet = planets.find((p) => p.id === id);
  if (!planet) {
    res.status(404).json({ error: "Planet not found" });
    return;
  }
  res.json(planet);
});

export default router;
