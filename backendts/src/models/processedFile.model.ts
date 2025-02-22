import mongoose from "mongoose";

const ProcessedFileSchema = new mongoose.Schema({
  filePath: { type: String, unique: true, required: true }, 
  processedAt: { type: Date, default: Date.now },
});

const ProcessedFile = mongoose.model("ProcessedFile", ProcessedFileSchema);
export default ProcessedFile;
