import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang masih kosong");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const product = await Product.findById(cart.productId);
    if (!product) {
      res.status(404);
      throw new Error("id product tidak ditemukan");
    }

    const { name, price, _id } = product;
    const newItem = {
      quantity: cart.quantity,
      name,
      price,
      productId: _id,
    };
    orderItem = [...orderItem, newItem];
    total += cart.quantity * price;
  }
  const order = await Order.create({
    itemsDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    userId: req.user._id,
  });

  res.status(200).json({
    message: "Berhasil buat order product",
    total,
    order,
  });
});

export const allOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  res.status(200).json({
    message: "Berhasil tampil semua order product",
    data: orders,
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.status(200).json({
    message: "Berhasil tampil detail order product",
    data: order,
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ userId: req.user._id });

  res.status(200).json({
    data: order,
    message: "Berhasil tampil current user order product",
  });
});
