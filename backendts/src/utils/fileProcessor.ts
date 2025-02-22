import fs from "fs";
import path from "path";
import readline from "readline";
import Transaction from "../models/transaction.model";
import ProcessedFile from "../models/processedFile.model";

const processTransactionFile = async (filePath: string) => {
  const fullPathParts = filePath.split(path.sep); 
  const subDir = fullPathParts[fullPathParts.length - 2]; 
  const fileName = fullPathParts[fullPathParts.length - 1]; 

  const fileDate = fileName.replace(".txt", ""); 

  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  const transactions = fileContent.split("\n").filter((line) => line.trim() !== "");

  for (const line of transactions) {
    const [salesStaffId, transactionTime, productData, saleAmount] = line.split(",");
    
    const products = productData
      .replace("[", "")
      .replace("]", "")
      .split("|")
      .map((item) => {
        const [productId, quantity] = item.split(":");
        return { productId, quantity: parseInt(quantity, 10) };
      });

    await Transaction.create({
      file: subDir, 
      fileDate, 
      salesStaffId: parseInt(salesStaffId, 10),
      transactionTime: new Date(transactionTime),
      products,
      saleAmount: parseFloat(saleAmount),
    });
  }

  console.log(`✅ Processed ${filePath}`);
};


/**
 * Recursively reads and processes transaction files, skipping already processed ones.
 * @param rootDir Root directory containing transaction files
 */
export const processAllFiles = async (rootDir: string) => {
  const subDirs = fs.readdirSync(rootDir).filter((file) =>
    fs.statSync(path.join(rootDir, file)).isDirectory()
  );

  for (const subDir of subDirs) {
    const subDirPath = path.join(rootDir, subDir);
    const files = fs.readdirSync(subDirPath).filter((file) => file.endsWith(".txt"));

    for (const file of files) {
      const filePath = path.join(subDirPath, file);

      const isProcessed = await ProcessedFile.findOne({ filePath });
      if (isProcessed) {
        console.log(`⏩ Skipping already processed file: ${filePath}`);
        continue;
      }

      await processTransactionFile(path.join(subDirPath, file));
      await ProcessedFile.create({ filePath });
    }
  }

  console.log("✅ All files processed successfully!");
};
//   const fileStream = fs.createReadStream(filePath);
//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });

//   const transactions = [];

//   for await (const line of rl) {
//     try {
//       const transaction = parseTransactionLine(line);
//       if (transaction) {
//         transactions.push(transaction);
//       }
//     } catch (error) {
//       console.error("❌ Error processing line:", line, error);
//     }
//   }

//   if (transactions.length > 0) {
//     await Transaction.insertMany(transactions);
//     console.log(`📂 Inserted ${transactions.length} transactions from ${filePath}`);
//   }
// };

/**
 * Parses a single transaction line from the text file.
 */
const parseTransactionLine = (line: string) => {
  const parts = line.split(",");

  if (parts.length !== 4) {
    console.error("❌ Invalid line format:", line);
    return null;
  }

  const salesStaffId = parseInt(parts[0], 10);
  const transactionTime = new Date(parts[1]);
  const products = parseProducts(parts[2]);
  const saleAmount = parseFloat(parts[3]);

  if (isNaN(salesStaffId) || isNaN(saleAmount) || !products.length) {
    console.error("❌ Invalid data in line:", line);
    return null;
  }

  return { salesStaffId, transactionTime, products, saleAmount };
};

/**
 * Parses the products string into an array of product objects.
 */
const parseProducts = (productString: string) => {
  const productRegex = /\[(.*?)\]/;
  const match = productString.match(productRegex);

  if (!match || !match[1]) return [];

  return match[1].split("|").map((item) => {
    const [productId, quantity] = item.split(":");
    return { productId, quantity: parseInt(quantity, 10) };
  });
};
