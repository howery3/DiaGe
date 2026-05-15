import { Router, type IRouter } from "express";
import healthRouter from "./health";
import placesRouter from "./places";
import syncRouter from "./sync";

const router: IRouter = Router();

router.use(healthRouter);
router.use(placesRouter);
router.use(syncRouter);

export default router;
