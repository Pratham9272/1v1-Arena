import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  const databaseName = process.env.MONGODB_DB_NAME || "one-v-one-platform";

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is not configured. Set MONGODB_URI in your Render service environment variables."
    );
  }

  await mongoose.connect(mongoUri, {
    dbName: databaseName,
    serverSelectionTimeoutMS: 10000
  });

  console.log(
    `MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}`
  );
};
