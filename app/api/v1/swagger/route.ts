import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/httpResponseHandler";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    return NextResponse.json(
      {
        message: "users fetch successfully",
        success: true,
        statusCode: 200,
        data: "users",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, "Failed to fetch users");
  }
}
// import swaggerJsdoc from "swagger-jsdoc";

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Next.js Swagger API",
//       version: "1.0.0",
//       description: "A sample API for learning Swagger and Next.js",
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000/api',
//       },
//     ],
//   },
//   apis: ["./pages/api/*.ts", "./app/api/*.ts"],
// };

// const swaggerSpec = swaggerJsdoc(options);

// function swagger(req: NextApiRequest, res: NextApiResponse) {
//   res.setHeader("Content-Type", "application/json");
//   res.send(swaggerSpec);
// }

// export default swagger;
