import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ["farmer", "owner", "admin"], default: "farmer" },
    cnicNumber: { type: String, unique: true, sparse: true },
    cnicFront: String,
    cnicBack: String,
    verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
