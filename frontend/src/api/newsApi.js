import axios from "axios";


// =====================================================
// FAKE NEWS API
// =====================================================

const API = axios.create({
  baseURL: "http://localhost:5000/api/news",
});


// =====================================================
// ANALYZE NEWS
// =====================================================

export const analyzeNews = async (text) => {

  const token =
    localStorage.getItem("token");


  const response = await API.post(
    "/analyze",
    {
      text,
    },
    {
      headers: {
        "Content-Type": "application/json",

        // Send logged-in user's JWT
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};