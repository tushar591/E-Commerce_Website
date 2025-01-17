import express from "express";
import { createCourse, UpdateCourse } from "../controllers/course.constrollers.js";

const router = express.Router();

router.post("/create", createCourse);

router.put("/update/:courseid",UpdateCourse);

export default router;