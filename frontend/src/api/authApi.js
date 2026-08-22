import axios from "axios";


// =====================================================
// AUTH API
// =====================================================

const API = axios.create({

  baseURL:
    "http://localhost:5000/api/auth",

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

    return Promise.reject(
      error
    );

  }

);


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (
  userData
) => {

  console.log(
    "Sending:",
    userData
  );


  const response =
    await API.post(
      "/register",
      userData
    );


  console.log(
    "Response:",
    response
  );


  return response.data;

};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  userData
) => {

  const response =
    await API.post(
      "/login",
      userData
    );


  return response.data;

};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (
  email
) => {

  const response =
    await API.post(
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

  const response =
    await API.put(
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