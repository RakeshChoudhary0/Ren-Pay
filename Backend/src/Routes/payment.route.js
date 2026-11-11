import { Router } from "express";
import { authMiddleware } from "../Middlewares/AuthMiddleWare.js";
import { sendToUser } from "../Features/Payment/payment.controller.js";

const router = Router();

router.post("/send", authMiddleware , sendToUser)

export default router;
