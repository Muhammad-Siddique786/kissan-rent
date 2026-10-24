import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, verificationStatus: u.verificationStatus });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, cnicNumber } = req.body;
    if (!name || !email || !password || !phone || !cnicNumber)
      return res.status(400).json({ message: "Tamam fields zaroori hain" });
    if (!["farmer", "owner"].includes(role))
      return res.status(400).json({ message: "Role farmer ya owner hona chahiye" });
    if (!/^\d{13}$/.test(cnicNumber))
      return res.status(400).json({ message: "CNIC 13 digits ka hona chahiye (dashes ke baghair)" });
    if (password.length < 6) return res.status(400).json({ message: "Password kam az kam 6 characters" });
    if (!req.files?.cnicFront || !req.files?.cnicBack)
      return res.status(400).json({ message: "CNIC ki front aur back photo zaroori hai" });

    const user = await User.create({
      name, email, phone, role, cnicNumber,
      password: await bcrypt.hash(password, 10),
      cnicFront: req.files.cnicFront[0].filename,
      cnicBack: req.files.cnicBack[0].filename,
    });
    res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email ya password ghalat hai" });
    res.json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (err) { next(err); }
};

export const me = (req, res) => res.json(publicUser(req.user));
