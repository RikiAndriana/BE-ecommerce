import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middleware/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

// Router
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

// Config
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Parent Router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
  console.log(`aplikasi berjalan di port http://localhost:${port}`);
});

// Database
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database connect");
  })
  .catch((err) => {
    console.log(err);
  });
