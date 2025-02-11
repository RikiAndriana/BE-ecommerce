import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controller/authController.js";
import { protectMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//post /api/v1/auth/register
router.post("/register", registerUser);

//post /api/v1/auth/login
router.post("/login", loginUser);

//get /api/v1/auth/logout
router.get("/logout", protectMiddleware, logoutUser);

//get /api/v1/auth/getuser
router.get("/getuser", protectMiddleware, getCurrentUser);

export default router;
