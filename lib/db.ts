import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URL: string | undefined = process.env.MONGODB_URI;

const connectDB = async (): Promise<void> => {
  const mongooseOptions: ConnectOptions = {
    retryWrites: true,
    writeConcern: { w: "majority" },
    readPreference: "nearest",
  };
  try {
    const conn = await mongoose.connect(MONGODB_URL!, mongooseOptions);
    console.log(
      `MongoDB Connected: ${conn.connection.host} Successfully Connected to MongoDB!`
    );
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

export { connectDB, disconnectDB };
