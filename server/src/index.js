import "./config/env.js";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Failed to start server: port ${port} is already in use. Stop the old server process or set a different PORT in server/.env.`
        );
      } else {
        console.error(`Failed to start server: ${error.message}`);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
