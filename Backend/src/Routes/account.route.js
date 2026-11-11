import { Router } from "express";
import { useGetAccountBalance } from "../Features/Account/account.controller.js";
import { authMiddleware } from "../Middlewares/AuthMiddleWare.js";

const router = Router();

router.get("/", authMiddleware, useGetAccountBalance);

export default router;
