import express from "express";
import { OrderData } from "../controllers/order.controller.js";
import userMiddleware from "../middleware/user.mid.js";

const router = express.Router();                                                            

router.post("/",userMiddleware,OrderData);

export default router; 