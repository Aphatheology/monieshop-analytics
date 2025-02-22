import { Request, Response } from "express";
import { getAnalytics, getDatasets } from "../services/analytics.service";

export const fetchAnalytics = async (req: Request, res: Response) => {
  try {
    const file = req.query.file as string; 
    const data = await getAnalytics(file);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

export const fetchDatasetOptions = async (req: Request, res: Response) => {
  try {
    const datasets = await getDatasets(); 
    res.json(datasets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dataset options" });
  }
};
