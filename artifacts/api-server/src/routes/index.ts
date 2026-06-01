import { Router, type IRouter } from "express";
import accountRouter from "./account";
import configRouter from "./config";
import healthRouter from "./health";
import placesRouter from "./places";
import storesRouter from "./stores";
import syncRouter from "./sync";

const router: IRouter = Router();

router.use(accountRouter);
router.use(configRouter);
router.use(healthRouter);
router.use(placesRouter);
router.use(storesRouter);
router.use(syncRouter);

export default router;
