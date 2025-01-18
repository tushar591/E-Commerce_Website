import express from "express";
import { SignUp } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/signup",SignUp);

export default router; 