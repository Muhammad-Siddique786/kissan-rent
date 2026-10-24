import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { uploadCnic } from "../middleware/upload.js";

const router = Router();
router.post("/register", uploadCnic.fields([{ name: "cnicFront", maxCount: 1 }, { name: "cnicBack", maxCount: 1 }]), register);
router.post("/login", login);
router.get("/me", protect, me);
export default router;
