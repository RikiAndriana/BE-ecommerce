import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

export const protectMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized - token fail");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized - token not exist");
  }
});

export const ownerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as Owner");
  }
};
