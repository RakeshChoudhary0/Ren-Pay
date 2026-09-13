import { Router } from "express";
import { getUsers } from "../Features/Payment/payment.controller.js";
import { authMiddleware } from "../Middlewares/AuthMiddleWare.js";

const router = Router();

router.get("/get-users-on-search", authMiddleware, getUsers);

export default router;
