import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL; 

export const fetchAnalytics = async (file: string) => {
  const response = await axios.get(`${API_URL}/analytics?file${file}`);
  return response.data;
};

export const fetchDatasets = async () => {
  const response = await axios.get(`${API_URL}/datasets`);
  return response.data;
};

// export const uploadFile = async (file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const response = await axios.post(`${API_URL}/upload`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return response.data;
// };