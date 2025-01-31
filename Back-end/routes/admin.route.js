import express from "express";
import { Login, Logout, SignUp } from "../controllers/admin.controllers.js";

const router = express.Router();                                                            

router.post("/signup",SignUp);

router.get("/login",Login);

router.get("/logout",Logout);

export default router; 