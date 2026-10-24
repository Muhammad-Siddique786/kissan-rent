import path from "path";
import User from "../models/User.js";
import Machinery from "../models/Machinery.js";
import Booking from "../models/Booking.js";

export const stats = async (req, res, next) => {
  try {
    const [users, owners, machinery, bookings, active, completed, pendingUsers] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "owner" }),
      Machinery.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "approved" }),
      Booking.countDocuments({ status: "completed" }),
      User.countDocuments({ verificationStatus: "pending", role: { $ne: "admin" } }),
    ]);
    res.json({ users, owners, machinery, bookings, active, completed, pendingUsers });
  } catch (err) { next(err); }
};

export const listUsers = async (req, res, next) => {
  try {
    const filter = { role: { $ne: "admin" } };
    if (req.query.status) filter.verificationStatus = req.query.status;
    res.json(await User.find(filter).sort("-createdAt"));
  } catch (err) { next(err); }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status ghalat hai" });
    const user = await User.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
    if (!user) return res.status(404).json({ message: "User nahi mila" });
    res.json(user);
  } catch (err) { next(err); }
};

// CNIC image sirf admin dekh sakta hai
export const getCnicImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const file = user?.[req.params.side === "back" ? "cnicBack" : "cnicFront"];
    if (!file) return res.status(404).json({ message: "Image nahi mili" });
    res.sendFile(path.resolve("uploads/cnic", file));
  } catch (err) { next(err); }
};
