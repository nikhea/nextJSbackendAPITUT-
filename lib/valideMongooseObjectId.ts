import mongoose from "mongoose";

const valideMongooseObjectId = (userId: string, NextResponse: any) => {
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
};

export { valideMongooseObjectId };
