import express from "express";
import {
  protectMiddleware,
  ownerMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createProduct,
  allProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
} from "../controller/productController.js";
import { upload } from "../utils/uploadFileHandle.js";

const router = express.Router();

// CRUD Product

// post /api/v1/product (CREATE, OWNER ONLY)
router.post("/", protectMiddleware, ownerMiddleware, createProduct);

// get /api/v1/product (READ ALL)
router.get("/", allProduct);

// get /api/v1/product/:id (READ DETAIL)
router.get("/:id", detailProduct);

// put /api/v1/product/:id (UPDATE, OWNER ONLY)
router.put("/:id", protectMiddleware, ownerMiddleware, updateProduct);

// delete /api/v1/product/:id (DELETE, OWNER ONLY)
router.delete("/:id", protectMiddleware, ownerMiddleware, deleteProduct);

// post /api/v1/product/file-upload (FILE UPLOAD, OWNER ONLY)
router.post(
  "/file-upload",
  protectMiddleware,
  ownerMiddleware,
  upload.single("image"),
  fileUpload
);

export default router;
