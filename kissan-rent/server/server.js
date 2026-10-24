import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import machineryRoutes from "./routes/machineryRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Sirf machinery photos public hain. CNIC folder public NAHI hai.
app.use("/uploads/machinery", express.static(path.join(__dirname, "uploads/machinery")));

app.get("/", (req, res) => res.json({ message: "Kissan Rent API chal rahi hai" }));
app.use("/api/auth", authRoutes);
app.use("/api/machinery", machineryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server port ${PORT} par chal raha hai`)));
