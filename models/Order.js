import mongoose from "mongoose";
const { Schema } = mongoose;

const singleProduct = Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total harga harus diisi"],
  },
  itemsDetail: [singleProduct],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  firstName: {
    type: String,
    required: [true, "Nama depan harus diisi"],
  },
  lastName: {
    type: String,
    required: [true, "Nama belakang harus diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor hp harus diisi"],
  },
  email: {
    type: String,
    required: [true, "Email hp harus diisi"],
  },
});

export default mongoose.model("Order", orderSchema);
