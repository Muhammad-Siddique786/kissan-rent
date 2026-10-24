import { Router } from "express";
import { protect, allowRoles } from "../middleware/auth.js";
import { stats, listUsers, verifyUser, getCnicImage } from "../controllers/adminController.js";

const router = Router();
router.use(protect, allowRoles("admin"));
router.get("/stats", stats);
router.get("/users", listUsers);
router.put("/users/:id/verify", verifyUser);
router.get("/users/:id/cnic/:side", getCnicImage);
export default router;
