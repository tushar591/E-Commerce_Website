import express from "express";
import { Login, SignUp } from "../controllers/user.controllers.js";

const router = express.Router();                                                            

router.post("/signup",SignUp);

router.get("/login",Login);

export default router; 