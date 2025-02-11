import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "Berhasil tambah product",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  // Salin query tanpa "page", "limit", "name"
  const queryObj = { ...req.query };
  const excludeField = ["page", "limit", "name"];
  excludeField.forEach((element) => delete queryObj[element]);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skipData = (page - 1) * limit;

  let totalProduct;
  let products;

  // Search By Name
  if (req.query.name) {
    const searchQuery = {
      name: { $regex: req.query.name, $options: "i" },
    };

    totalProduct = await Product.countDocuments(searchQuery);
    if (req.query.page && skipData >= totalProduct) {
      res.status(404);
      throw new Error("Halaman ini tidak tersedia");
    }
    products = await Product.find(searchQuery).skip(skipData).limit(limit);
  } else {
    // Filter
    totalProduct = await Product.countDocuments(queryObj);
    if (req.query.page && skipData >= totalProduct) {
      res.status(404);
      throw new Error("Halaman ini tidak tersedia");
    }

    products = await Product.find(queryObj).skip(skipData).limit(limit);
  }

  return res.status(200).json({
    message: "Berhasil tampil semua product",
    data: products,
    totalProducts: totalProduct,
    currentPage: page,
    totalPages: Math.ceil(totalProduct / limit),
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const product = await Product.findById(paramsId);

  if (!product) {
    res.status(404);
    throw new Error("Id product tidak ditemukan");
  }

  return res.status(200).json({
    message: "Berhasil tampil detail product",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(paramsId, req.body, {
    runValidators: true,
    new: true,
  });

  return res.status(200).json({
    message: "Update product berhasil",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  await Product.findByIdAndDelete(paramsId);
  return res.status(200).json({
    message: "Delete product berhasil",
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Tidak ada file yang diinput");
  }

  const imageFileName = req.file.filename;
  const pathImageFile = `/uploads/${imageFileName}`;
  res.status(200).json({
    message: "Image berhasil diupload",
    image: pathImageFile,
  });
});
