import express from "express";
import { Login, Logout, Purchases, SignUp } from "../controllers/user.controllers.js";
import userMiddleware from "../middleware/user.mid.js";

const router = express.Router();                                                            

router.post("/signup",SignUp);

router.get("/login",Login);

router.get("/logout",Logout);

router.get("/purchases",userMiddleware,Purchases);

export default router; 