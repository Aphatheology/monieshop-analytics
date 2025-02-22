import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  file: string;
  fileDate: string;
  salesStaffId: number;
  transactionTime: Date;
  products: { productId: string; quantity: number }[];
  saleAmount: number;
}

const TransactionSchema = new Schema<ITransaction>({
  file: { type: String, required: true },
  fileDate: { type: String, required: true },
  salesStaffId: { type: Number, required: true },
  transactionTime: { type: Date, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  saleAmount: { type: Number, required: true },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
