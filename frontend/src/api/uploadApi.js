import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/upload",
});


// =====================================================
// UPLOAD IMAGE
// =====================================================

export const uploadImage = async (formData) => {

  const token = localStorage.getItem("token");

  const response = await API.post(
    "/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",

        // Send logged-in user's JWT
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// GET ANALYSIS HISTORY
// =====================================================

export const getAnalysisHistory = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// GET ONE ANALYSIS
// =====================================================

export const getAnalysisById = async (id) => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    `/history/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// DELETE ANALYSIS
// =====================================================

export const deleteAnalysis = async (id) => {

  const token = localStorage.getItem("token");

  const response = await API.delete(
    `/history/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};