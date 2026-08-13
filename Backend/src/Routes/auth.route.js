import { Router } from "express";
import {
  userLoginController,
  useLogOutController,
  useSignUpController,
} from "../Features/Auth/auth.controller.js";

const router = Router();

router.post("/login", userLoginController);
router.post("/signup", useSignUpController);
router.post("/logout", useLogOutController);

export default router;
