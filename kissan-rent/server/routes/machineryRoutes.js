import { Router } from "express";
import { protect, allowRoles, requireVerified } from "../middleware/auth.js";
import { uploadMachinery } from "../middleware/upload.js";
import {
  listMachinery, getMachinery, myMachinery, addMachinery, updateMachinery, deleteMachinery,
} from "../controllers/machineryController.js";

const router = Router();
router.get("/", listMachinery);
router.get("/mine", protect, allowRoles("owner"), myMachinery); // /:id se pehle rakhna zaroori hai
router.get("/:id", getMachinery);
router.post("/", protect, allowRoles("owner"), requireVerified, uploadMachinery.array("images", 4), addMachinery);
router.put("/:id", protect, allowRoles("owner"), updateMachinery);
router.delete("/:id", protect, allowRoles("owner"), deleteMachinery);
export default router;
