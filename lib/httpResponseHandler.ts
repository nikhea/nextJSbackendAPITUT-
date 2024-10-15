import { NextResponse } from "next/server";

const handleError = (error: unknown, message?: string) => {
  console.error("API error:", error);
  return NextResponse.json(
    {
      success: false,
      statusCode: 500,
      message: message || "An error occurred while processing your request",
      error,
    },
    { status: 500 }
  );
};

export { handleError };
