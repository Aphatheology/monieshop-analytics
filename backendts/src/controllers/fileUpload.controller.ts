import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs-extra";
import unzipper from "unzipper";
import Transaction from "../models/transaction.model";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    fs.ensureDirSync(uploadPath); 
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export const uploadFile = upload.single("file");

export const processZipFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const zipPath = req.file.path;
    const extractPath = path.join(__dirname, "../../extracted");

    fs.ensureDirSync(extractPath);

    await fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: extractPath })).promise();

    const files = await fs.readdir(extractPath);

    for (const file of files) {
      if (path.extname(file) === ".json") {
        const filePath = path.join(extractPath, file);
        const data = JSON.parse(await fs.readFile(filePath, "utf-8"));

        const transactions = data.map((t: any) => ({ ...t, file: req.file?.originalname }));

        await Transaction.insertMany(transactions);
      }
    }

    await fs.remove(extractPath);
    await fs.remove(zipPath);

    res.json({ message: "File processed successfully" });
  } catch (error) {
    console.error("Error processing ZIP file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};
