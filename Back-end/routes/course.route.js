import express from "express";
import { createCourse, UpdateCourse,DeleteCourse,getCourse, courseDetails } from "../controllers/course.constrollers.js";

const router = express.Router();

router.post("/create", createCourse);

router.put("/update/:courseid",UpdateCourse);

router.delete("/delete/:courseid",DeleteCourse);

router.get("/courses",getCourse);

router.get("/:courseid",courseDetails)

export default router;