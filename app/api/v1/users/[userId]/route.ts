import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/model/user.model";
import { handleError } from "@/lib/httpResponseHandler";
import { valideMongooseObjectId } from "@/lib/valideMongooseObjectId";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid or missing user ID",
          success: false,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    valideMongooseObjectId(userId, NextResponse);

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User retrieved successfully",
        success: true,
        statusCode: 200,
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, "Failed to fetch users");
  }
}

// if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//   return NextResponse.json(
//     {
//       message: "Invalid or missing user ID",
//       success: false,
//       statusCode: 400,
//     },
//     { status: 400 }
//   );
// }
