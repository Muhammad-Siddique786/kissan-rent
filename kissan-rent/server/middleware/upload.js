import multer from "multer";
import path from "path";
import crypto from "crypto";

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${folder}`),
    filename: (req, file, cb) =>
      cb(null, crypto.randomBytes(12).toString("hex") + path.extname(file.originalname).toLowerCase()),
  });

const imageFilter = (req, file, cb) =>
  /jpe?g|png|webp/.test(file.mimetype) ? cb(null, true) : cb(new Error("Sirf jpg/png/webp images allowed hain"));

const limits = { fileSize: 3 * 1024 * 1024 };

export const uploadCnic = multer({ storage: makeStorage("cnic"), fileFilter: imageFilter, limits });
export const uploadMachinery = multer({ storage: makeStorage("machinery"), fileFilter: imageFilter, limits });
