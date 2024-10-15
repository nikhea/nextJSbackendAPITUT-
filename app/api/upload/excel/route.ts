import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { handleError } from "@/lib/httpResponseHandler";
import { uploadFilesCSVMiddleware } from "@/lib/uploadFile";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

function filterEmptyRows(data: any[]): any[] {
  return data
    .map((row) => {
      const cleanedRow = Object.fromEntries(
        Object.entries(row).filter(([key, value]) => !key.startsWith("__EMPTY"))
      );

      return cleanedRow;
    })
    .filter((row) =>
      Object.values(row).some(
        (value) => value !== null && value !== undefined && value !== ""
      )
    );
}

async function runMiddleware(
  req: NextRequest,
  res: NextResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });
}

// async function parseExcel(buffer: ArrayBuffer): Promise<any[]> {
//   const workbook = XLSX.read(buffer, { type: "array" });
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data = XLSX.utils.sheet_to_json(sheet);
//   const filteredData = filterEmptyRows(data);

//   return filteredData;
// }

async function parseExcel(buffer: ArrayBuffer): Promise<any[]> {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0]; // Read the first sheet
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const filteredData = filterEmptyRows(data);

  return filteredData;
}

export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file: any = formData.get("file");

    if (!file.name) {
      return NextResponse.json(
        { message: "Missing required fields", success: false, statusCode: 400 },
        { status: 400 }
      );
    }

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return NextResponse.json(
        {
          message: "Invalid file type, only Excel allowed",
          success: false,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await runMiddleware(req, res, uploadFilesCSVMiddleware);

    const buffer = await file.arrayBuffer();
    const results = await parseExcel(buffer);

    if (results.length === 0) {
      return NextResponse.json(
        {
          message: "CSV file is empty or not processed",
          success: false,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "File uploaded and processed successfully",
        data: results,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}
