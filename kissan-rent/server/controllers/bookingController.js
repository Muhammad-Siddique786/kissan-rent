import Booking from "../models/Booking.js";
import Machinery from "../models/Machinery.js";

// Date range overlap check: sirf APPROVED bookings se conflict hota hai
const hasConflict = (machineryId, start, end, excludeId = null) => {
  const filter = { machinery: machineryId, status: "approved", startDate: { $lte: end }, endDate: { $gte: start } };
  if (excludeId) filter._id = { $ne: excludeId };
  return Booking.findOne(filter);
};

export const createBooking = async (req, res, next) => {
  try {
    const { machineryId, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end < start)
      return res.status(400).json({ message: "Dates ghalat hain" });
    if (start < new Date(new Date().setHours(0, 0, 0, 0)))
      return res.status(400).json({ message: "Guzri hui date par booking nahi ho sakti" });

    const machinery = await Machinery.findById(machineryId);
    if (!machinery || !machinery.isAvailable)
      return res.status(404).json({ message: "Machinery available nahi hai" });

    if (await hasConflict(machinery._id, start, end))
      return res.status(400).json({ message: "Machine is date par pehle se booked hai" });

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const booking = await Booking.create({
      farmer: req.user._id,
      owner: machinery.owner,
      machinery: machinery._id,
      startDate: start,
      endDate: end,
      totalPrice: days * machinery.pricePerDay,
    });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

export const myBookings = async (req, res, next) => {
  try {
    res.json(await Booking.find({ farmer: req.user._id }).populate("machinery", "name pricePerDay").sort("-createdAt"));
  } catch (err) { next(err); }
};

export const ownerRequests = async (req, res, next) => {
  try {
    res.json(
      await Booking.find({ owner: req.user._id })
        .populate("machinery", "name")
        .populate("farmer", "name phone")
        .sort("-createdAt")
    );
  } catch (err) { next(err); }
};

// Owner: pending -> approved/rejected, approved -> completed
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, owner: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking nahi mili" });

    const allowed = { pending: ["approved", "rejected"], approved: ["completed"] };
    if (!allowed[booking.status]?.includes(status))
      return res.status(400).json({ message: `${booking.status} se ${status} nahi ho sakta` });

    if (status === "approved" && (await hasConflict(booking.machinery, booking.startDate, booking.endDate, booking._id)))
      return res.status(400).json({ message: "In dates par doosri booking approve ho chuki hai" });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking nahi mili" });
    if (!["pending", "approved"].includes(booking.status))
      return res.status(400).json({ message: "Ye booking cancel nahi ho sakti" });
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};
