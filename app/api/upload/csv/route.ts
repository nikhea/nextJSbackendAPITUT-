import { NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { handleError } from "@/lib/httpResponseHandler";
import { uploadFilesCSVMiddleware } from "@/lib/uploadFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

function bufferToStream(buffer: ArrayBuffer) {
  return Readable.from(Buffer.from(buffer));
}

async function parseCSV(stream: Readable): Promise<any[]> {
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
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

    if (file.type !== "text/csv") {
      return NextResponse.json(
        { message: "invalid file type", success: false, statusCode: 400 },
        { status: 400 }
      );
    }

    await runMiddleware(req, res, uploadFilesCSVMiddleware);

    const stream = bufferToStream(await file.arrayBuffer());
    const results = await parseCSV(stream);

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
