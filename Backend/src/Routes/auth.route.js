import { Router } from "express";
import {
  useLogOutController,
  useGetMe,
  useRefreshToken,
  useGoogleSignin,
} from "../Features/Auth/auth.controller.js";
import { authMiddleware } from "../Middlewares/AuthMiddleWare.js";

const router = Router();

router.post("/google-oauth", useGoogleSignin);
router.post("/logout", useLogOutController);
router.get("/me", authMiddleware, useGetMe);
router.post("/refresh-token", useRefreshToken);

export default router;
