import { Router } from "express";
import { protect, allowRoles, requireVerified } from "../middleware/auth.js";
import { createBooking, myBookings, ownerRequests, updateStatus, cancelBooking } from "../controllers/bookingController.js";

const router = Router();
router.post("/", protect, allowRoles("farmer"), requireVerified, createBooking);
router.get("/mine", protect, allowRoles("farmer"), myBookings);
router.get("/requests", protect, allowRoles("owner"), ownerRequests);
router.put("/:id/status", protect, allowRoles("owner"), updateStatus);
router.put("/:id/cancel", protect, allowRoles("farmer"), cancelBooking);
export default router;
