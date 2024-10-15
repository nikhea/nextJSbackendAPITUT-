import uploader from "./multer";

const uploadFilesCSVMiddleware = uploader.fields([
  { name: "file", maxCount: 1 },
]);

export { uploadFilesCSVMiddleware };
