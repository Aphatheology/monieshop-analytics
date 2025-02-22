import dotenv from "dotenv";
import mongoose from 'mongoose';
import app from './app';
import path from "path";
import { processAllFiles } from "./utils/fileProcessor";


dotenv.config();

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/monieshop");

    const server = app.listen(process.env.PORT, () => {
      // logger.info(`Db connected and app listening on port ${config.port}`);
      console.log(`Db connected and app listening on port ${process.env.PORT}`);
    });

    const transactionFilesDir = path.join(__dirname, "../sample_data");

    processAllFiles(transactionFilesDir)
      .then(() => console.log("All transaction files processed."))
      .catch((error) => console.error("Error processing files:", error));

    const shutdown = async () => {
      // logger.info('Shutting down...');
      await mongoose.disconnect();
      server.close(() => {
        // logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    // logger.error(error);
    process.exit(1);
  }
};

startServer();