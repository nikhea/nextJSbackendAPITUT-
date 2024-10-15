import multer from "multer";

const storage = multer.diskStorage({});

const limits = { fileSize: 5 * 1024 * 1024 };

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "text/csv", // .csv
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, CSV, XLS, and XLSX are allowed."
      ),
      false
    );
  }
};

const uploader = multer({
  storage,
  limits,
  fileFilter,
});

export default uploader;
