import express from "express";
import { Login, Logout, SignUp } from "../controllers/admin.controllers.js";
import adminMiddleware from "../middleware/admin.mid.js";
const router = express.Router();                                                            

router.post("/signup",SignUp);

router.get("/login",Login);

router.get("/logout",adminMiddleware,Logout);

export default router; 