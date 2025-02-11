import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import cookieParser from "cookie-parser";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};
const createUserCookie = (token, res) => {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const role = (await User.countDocuments()) === 0 ? "owner" : "user";

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
  });

  const token = createToken(user._id);
  createUserCookie(token, res);

  user.password = undefined;

  res.status(201).json({
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email dan Password harus diisi");
  }

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    const token = createToken(user._id);
    createUserCookie(token, res);
    user.password = undefined;
    res.status(200).json({
      data: user,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    return res.status(200).json({
      data: user,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout Berhasil",
  });
};
