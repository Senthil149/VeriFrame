import axios from "axios";

// =====================================================
// BACKEND API URL
// =====================================================

// Use VITE_API_URL when available.
// Otherwise use the local backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// =====================================================
// AUTH API
// =====================================================

const API = axios.create({
  baseURL: `${API_URL}/api/auth`,
});


// =====================================================
// ADD AUTH TOKEN AUTOMATICALLY
// =====================================================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (userData) => {

  console.log(
    "📤 Register Request:",
    userData
  );

  console.log(
    "🌐 Register URL:",
    `${API_URL}/api/auth/register`
  );


  const response = await API.post(
    "/register",
    userData
  );


  console.log(
    "📥 Register Response:",
    response.data
  );


  return response.data;

};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (userData) => {

  console.log(
    "📤 Login Request:",
    userData
  );

  console.log(
    "🌐 Login URL:",
    `${API_URL}/api/auth/login`
  );


  const response = await API.post(
    "/login",
    userData
  );


  console.log(
    "📥 Login Response:",
    response.data
  );


  return response.data;

};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (email) => {

  const response = await API.post(
    "/forgot-password",
    {
      email,
    }
  );

  return response.data;

};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (
  token,
  newPassword
) => {

  const response = await API.put(
    `/reset-password/${token}`,
    {
      newPassword,
    }
  );

  return response.data;

};


// =====================================================
// EXPORT API INSTANCE
// =====================================================

export default API;