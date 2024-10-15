import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/model/user.model";
import { handleError } from "@/lib/httpResponseHandler";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const users = await User.find({ is_deleted: false }).lean();
    return NextResponse.json(
      {
        message: "users fetch successfully",
        success: true,
        statusCode: 200,
        data: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, "Failed to fetch users");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Missing required fields", success: false, statusCode: 400 },
        { status: 400 }
      );
    }
    await connectDB();
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      is_deleted: false,
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? "User with this email already exists"
          : "Username is already taken";

      return NextResponse.json(
        { message, success: false, statusCode: 400 },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      email,
      username,
      password,
    });
    return NextResponse.json(
      {
        message: "users created successfully",
        success: true,
        statusCode: 201,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, username, password } = body;

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

    await connectDB();

    const user = await User.findOne({ _id: userId, is_deleted: false });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false, statusCode: 404 },
        { status: 404 }
      );
    }

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
        is_deleted: false,
      });

      if (existingUser) {
        const message = "Username is already taken";
        return NextResponse.json(
          { message, success: false, statusCode: 400 },
          { status: 400 }
        );
      }
    }

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        success: true,
        statusCode: 200,
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { userId } = body;

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

    await connectDB();

    const user = await User.findOne({ _id: userId, is_deleted: false });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false, statusCode: 404 },
        { status: 404 }
      );
    }

    user.is_deleted = true;

    await user.save();
    return NextResponse.json(
      {
        message: "User deleted successfully",
        success: true,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error);
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (!body.email || !body.username || !body.password) {
//       return NextResponse.json(
//         { message: "Missing required fields", success: false, statusCode: 400 },
//         { status: 400 }
//       );
//     }
//     await connectDB();
//     const userEmailExist = await User.findOne({ email: body.email });
//     const userUsernameExist = await User.findOne({ username: body.username });

//     if (userEmailExist) {
//       return NextResponse.json(
//         { message: "user already exists", success: false, statusCode: 400 },
//         { status: 400 }
//       );
//     }

//     if (userUsernameExist) {
//       return NextResponse.json(
//         { message: "user name taken already", success: false, statusCode: 400 },
//         { status: 400 }
//       );
//     }
//     const newUser = await User.create(body);
//     return NextResponse.json(
//       {
//         message: "users created successfully",
//         success: true,
//         statusCode: 201,
//         data: newUser,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return handleError(error);
//   }
// }
