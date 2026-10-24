import mongoose from "mongoose";

const machinerySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["Tractor", "Harvester", "Thresher", "Sprayer", "Other"] },
    description: String,
    pricePerDay: { type: Number, required: true, min: 0 },
    district: { type: String, required: true },
    city: String,
    images: [String],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Machinery", machinerySchema);
