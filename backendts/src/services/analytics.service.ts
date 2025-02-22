import Transaction from "../models/transaction.model";

export const getAnalytics = async (file: string) => {
  const matchStage = file ? { file } : {};

  const highestSalesVolumeDay = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionTime" } },
        totalVolume: { $sum: { $sum: "$products.quantity" } },
      },
    },
    { $sort: { totalVolume: -1 } },
    { $limit: 1 },
  ]);

  const highestSalesValueDay = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionTime" } },
        totalValue: { $sum: "$saleAmount" },
      },
    },
    { $sort: { totalValue: -1 } },
    { $limit: 1 },
  ]);

  const mostSoldProduct = await Transaction.aggregate([
    { $match: matchStage },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 1 },
  ]);

  const highestSalesStaffByMonth = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$transactionTime" },
          month: { $month: "$transactionTime" },
          salesStaffId: "$salesStaffId",
        },
        totalSales: { $sum: "$saleAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, totalSales: -1 },
    },
    {
      $group: {
        _id: { year: "$_id.year", month: "$_id.month" },
        topSalesStaff: { $first: "$_id.salesStaffId" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const highestHourByTransactionVolume = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $hour: "$transactionTime" },
        avgVolume: { $avg: { $sum: "$products.quantity" } },
      },
    },
    { $sort: { avgVolume: -1 } },
    { $limit: 1 },
  ]);

  return {
    highestSalesVolumeDay: highestSalesVolumeDay[0]?._id || null,
    highestSalesVolume: highestSalesVolumeDay[0]?.totalVolume || 0,
    highestSalesValueDay: highestSalesValueDay[0]?._id || null,
    highestSalesValue: highestSalesValueDay[0]?.totalValue || 0,
    mostSoldProduct: mostSoldProduct[0]?._id || null,
    highestSalesStaffByMonth,
    highestHourByTransactionVolume: highestHourByTransactionVolume[0]?._id || null,
  };
};

export const getDatasets = async () => {
  const datasets = await Transaction.distinct("file"); 
      
  return datasets;
}