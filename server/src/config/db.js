import mongoose from "mongoose";

const isAtlasConnection = (mongoUri) =>
  mongoUri.includes("mongodb+srv://") || mongoUri.includes("mongodb.net");

const buildConnectionErrorMessage = (error, mongoUri) => {
  const isAtlas = isAtlasConnection(mongoUri);
  const reason = error?.reason?.type ? ` (${error.reason.type})` : "";

  if (isAtlas) {
    return [
      `MongoDB Atlas connection failed${reason}.`,
      "Your server reached the Atlas hostname, but Atlas did not allow a usable database connection.",
      "Fix this in MongoDB Atlas: Network Access -> Add IP Address -> add your current public IP address, or temporarily allow 0.0.0.0/0 for local testing.",
      "Also confirm the MONGODB_URI username, password, cluster host, and MONGODB_DB_NAME in server/.env."
    ].join(" ");
  }

  return [
    `MongoDB connection failed${reason}.`,
    "Make sure MongoDB is running and MONGODB_URI points to the correct database."
  ].join(" ");
};

export const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  const databaseName = process.env.MONGODB_DB_NAME || "one-v-one-platform";

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is not configured. Set MONGODB_URI in your Render service environment variables."
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: databaseName,
      serverSelectionTimeoutMS: 10000
    });
  } catch (error) {
    throw new Error(buildConnectionErrorMessage(error, mongoUri), {
      cause: error
    });
  }

  console.log(
    `MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}`
  );
};
