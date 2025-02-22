import { Router } from "express";
import { fetchAnalytics, fetchDatasetOptions } from "../controllers/analytics.controller";

const router = Router();
router.get("/analytics", fetchAnalytics);
router.get("/datasets", fetchDatasetOptions);

export default router;
