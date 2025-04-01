import express from "express";
import { Login, Logout, SignUp } from "../controllers/admin.controllers.js";
import adminMiddleware from "../middleware/admin.mid.js";
const router = express.Router();                                                            

router.post("/signup",SignUp);

router.post("/login",Login);

router.post("/logout",adminMiddleware,Logout);

export default router; 