import axios from "axios";

const API_URL = "http://localhost:4000/api"; 

export const fetchAnalytics = async (file: string) => {
  const response = await axios.get(`${API_URL}/analytics?file${file}`);
  return response.data;
};

export const fetchDatasets = async () => {
  const response = await axios.get(`${API_URL}/datasets`);
  return response.data;
};
