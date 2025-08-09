import { Router } from "express";
import { generateRoadmap } from "../controllers/generateRoadmap.js";

const router = Router();
router.post("/generate", generateRoadmap);
export default router;
