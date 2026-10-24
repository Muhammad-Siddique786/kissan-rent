import Machinery from "../models/Machinery.js";

export const listMachinery = async (req, res, next) => {
  try {
    const { category, district, maxPrice, q } = req.query;
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (district) filter.district = new RegExp(district, "i");
    if (maxPrice) filter.pricePerDay = { $lte: Number(maxPrice) };
    if (q) filter.name = new RegExp(q, "i");
    res.json(await Machinery.find(filter).populate("owner", "name phone").sort("-createdAt"));
  } catch (err) { next(err); }
};

export const getMachinery = async (req, res, next) => {
  try {
    const item = await Machinery.findById(req.params.id).populate("owner", "name phone");
    if (!item) return res.status(404).json({ message: "Machinery nahi mili" });
    res.json(item);
  } catch (err) { next(err); }
};

export const myMachinery = async (req, res, next) => {
  try {
    res.json(await Machinery.find({ owner: req.user._id }).sort("-createdAt"));
  } catch (err) { next(err); }
};

export const addMachinery = async (req, res, next) => {
  try {
    const { name, category, description, pricePerDay, district, city } = req.body;
    const images = (req.files || []).map((f) => f.filename);
    const item = await Machinery.create({
      owner: req.user._id, name, category, description, pricePerDay: Number(pricePerDay), district, city, images,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

export const updateMachinery = async (req, res, next) => {
  try {
    const item = await Machinery.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ message: "Machinery nahi mili ya aap ki nahi hai" });
    ["name", "category", "description", "pricePerDay", "district", "city", "isAvailable"].forEach((f) => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

export const deleteMachinery = async (req, res, next) => {
  try {
    const item = await Machinery.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ message: "Machinery nahi mili ya aap ki nahi hai" });
    res.json({ message: "Delete ho gayi" });
  } catch (err) { next(err); }
};
