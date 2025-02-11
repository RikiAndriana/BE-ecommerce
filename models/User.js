import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name harus diisi"],
    unique: [true, "Username sudah digunakan"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: [true, "Email  sudah terdaftar"],
    validate: {
      validator: validator.isEmail,
      message: "Inputan harus berformat email 'example@mail.com'",
    },
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
    minLength: [6, "Password minimal 6 character"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

// hash password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// verify user
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
