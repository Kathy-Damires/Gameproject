import { Router, type IRouter } from "express";
import healthRouter from "./health";
import planetsRouter from "./planets";
import erasRouter from "./eras";
import cardsRouter from "./cards";
import achievementsRouter from "./achievements";
import clansRouter from "./clans";
import characterRouter from "./character";

const router: IRouter = Router();

router.use(healthRouter);
router.use(planetsRouter);
router.use(erasRouter);
router.use(cardsRouter);
router.use(achievementsRouter);
router.use(clansRouter);
router.use(characterRouter);

export default router;
