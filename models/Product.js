import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name product harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "Price product harus diisi"],
  },
  description: {
    type: String,
    required: [true, "Description product harus diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Category product harus diisi"],
    enum: ["kemeja", "baju", "celana", "sepatu"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Product", productSchema);
