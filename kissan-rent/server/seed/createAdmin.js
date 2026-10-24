import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

await mongoose.connect(process.env.MONGO_URI);
await User.deleteOne({ email: process.env.ADMIN_EMAIL });
await User.create({
  name: "Admin",
  email: process.env.ADMIN_EMAIL,
  password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
  phone: "03000000000",
  role: "admin",
  verificationStatus: "approved",
});
console.log("Admin ban gaya / reset ho gaya:", process.env.ADMIN_EMAIL);
await mongoose.disconnect();