export const notFound = (req, res) => res.status(404).json({ message: "Route nahi mila" });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) return res.status(400).json({ message: "Email ya CNIC pehle se registered hai" });
  res.status(err.status || 500).json({ message: err.message || "Server error" });
};
