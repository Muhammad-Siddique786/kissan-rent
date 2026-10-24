import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Login zaroori hai" });
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User nahi mila" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token ghalat ya expire hai" });
  }
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};

// Sirf verified users booking/listing kar saken
export const requireVerified = (req, res, next) => {
  if (req.user.verificationStatus !== "approved")
    return res.status(403).json({ message: "Pehle admin se CNIC verification karwayen" });
  next();
};
