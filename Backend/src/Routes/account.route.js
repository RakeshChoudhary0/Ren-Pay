import { Router } from "express";
import {
  useGetAccountBalance,
  useFindUserAccount,
} from "../Features/Account/account.controller.js";
import { authMiddleware } from "../Middlewares/AuthMiddleWare.js";

const router = Router();

router.get("/", authMiddleware, useGetAccountBalance);
router.get("/search", authMiddleware, useFindUserAccount);

export default router;
