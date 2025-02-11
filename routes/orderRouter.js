import express from "express";
import {
  protectMiddleware,
  ownerMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createOrder,
  allOrder,
  detailOrder,
  currentUserOrder,
} from "../controller/orderController.js";

const router = express.Router();

// post /api/v1/order (CREATE, USER ONLY)
router.post("/", protectMiddleware, createOrder);

// get /api/v1/order/curent-user (READ, USER)
router.get("/current-user", protectMiddleware, currentUserOrder);

// get /api/v1/order (READ ALL, OWNER ONLY)
router.get("/", protectMiddleware, ownerMiddleware, allOrder);

// get /api/v1/order/:id (READ DETAIL, USER & OWNER)
router.get("/:id", protectMiddleware, ownerMiddleware, detailOrder);

export default router;
