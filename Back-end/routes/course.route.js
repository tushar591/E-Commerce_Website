import express from "express";
import { createCourse, UpdateCourse,DeleteCourse,getCourse, courseDetails, buyCourse } from "../controllers/course.constrollers.js";
import userMiddleware from "../middleware/user.mid.js";

const router = express.Router();

router.post("/create", createCourse);

router.put("/update/:courseid",UpdateCourse);

router.delete("/delete/:courseid",DeleteCourse);

router.get("/courses",getCourse);

router.get("/:courseid",courseDetails)

router.post("buy/:courseId",userMiddleware,buyCourse);

export default router;