import { Router, type IRouter } from "express";

const router: IRouter = Router();

const planets = [
  {
    id: 1,
    name: "Porera",
    description: "The first planet, birthplace of civilization. Journey from primitive stone tools to the discovery of metals and beyond.",
    currentEra: 3,
    totalEras: 9,
    color: "#FF6B35",
    icon: "🌋",
    resources: 142500,
    population: 85000,
    isUnlocked: true,
  },
  {
    id: 2,
    name: "Doresa",
    description: "A lush planet of culture and commerce. From classical empires to industrial revolution, this world drives progress.",
    currentEra: 2,
    totalEras: 9,
    color: "#2ECC71",
    icon: "🌿",
    resources: 87300,
    population: 210000,
    isUnlocked: true,
  },
  {
    id: 3,
    name: "Aitherium",
    description: "The technological frontier. Robotics, space exploration, and the ultimate singularity await those who unlock this world.",
    currentEra: 1,
    totalEras: 9,
    color: "#00D4FF",
    icon: "⚡",
    resources: 12000,
    population: 5000,
    isUnlocked: false,
  },
];

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
