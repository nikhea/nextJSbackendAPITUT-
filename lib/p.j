export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req: NextRequest, res: NextResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req: NextRequest, res: NextResponse): Promise<any> {
  try {
    await runMiddleware(req, res, uploadFilesCSVMiddleware);

    const file = (req as any).files["file"][0];
    console.log("Uploading file", file);

    if (!file) {
      return NextResponse.json(
        { message: "Missing required fields", success: false, statusCode: 400 },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return handleError(error);
  }
}

import uploader from "./multer";

const uploadFilesCSVMiddleware = uploader.fields([
  { name: "file", maxCount: 1 },
]);

export { uploadFilesCSVMiddleware };

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

]  ⚠ Page config in /home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/app/api/upload/route.ts is deprecated. Replace `export const config=...` with the following:
[0] Visit https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config for more information.
[0]  ○ Compiling /api/upload ...
[0]  ✓ Compiled /api/upload in 1108ms (108 modules)
[0] API error: TypeError: Cannot read properties of undefined (reading 'file')
[0]     at POST (webpack-internal:///(rsc)/./app/api/upload/route.ts:29:31)
[0]     at async /home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:55038
[0]     at async ek.execute (/home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:45808)
[0]     at async ek.handle (/home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/node_modules/next/dist/compiled/next-server/app-route.runtime.dev.js:6:56292)
[0]     at async doRender (/home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/node_modules/next/dist/server/base-server.js:1377:42)
[0]     at async cacheEntry.responseCache.get.routeKind (/home/imonikhea/Pictures/docker tut/c/expense-tracker-nextjs/node_modules/next/dist/server/base-server.js:1599:28)
[0]  POST /api/upload 500 in 1238ms
[0]  ✓ Compiled in 17ms