import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Configuración de almacenamiento con Multer
// Define dónde y cómo se guardan los archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp + extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro de archivos
// Solo permitimos imágenes (jpeg, jpg, png) para evitar archivos maliciosos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|png/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Archivo debe ser una imagen válida (jpeg, jpg, png)"));
};

// Inicializar multer con la configuración previa
// Limitamos el tamaño a 5MB para no saturar el servidor
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB
  fileFilter: fileFilter,
});

export default upload;
