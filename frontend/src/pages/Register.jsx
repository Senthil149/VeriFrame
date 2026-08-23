import {
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { registerUser } from "../api/authApi";
import LeftHero from "../components/interface/LeftHero";


function Register() {

  const navigate = useNavigate();


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });


  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async () => {

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;


    if (!name) {

      alert("Please enter your full name.");

      return;
    }


    if (!email) {

      alert("Please enter your email.");

      return;
    }


    if (!password) {

      alert("Please enter your password.");

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters."
      );

      return;
    }


    // -----------------------------------------------
    // START LOADING
    // -----------------------------------------------

    try {

      setLoading(true);


      console.log(
        "📤 Sending registration request..."
      );

      console.log(
        "📧 Email:",
        email
      );


      // ---------------------------------------------
      // API REQUEST
      // ---------------------------------------------

      const data = await registerUser({
        name,
        email,
        password,
      });


      console.log(
        "📥 Registration Response:",
        data
      );


      // ---------------------------------------------
      // CHECK RESPONSE
      // ---------------------------------------------

      if (!data) {

        console.error(
          "❌ registerUser returned undefined/null"
        );

        alert(
          "Registration failed: No response received from server."
        );

        return;
      }


      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      if (data.success) {

        console.log(
          "✅ Registration successful"
        );


        alert(
          data.message ||
          "Registration Successful"
        );


        navigate("/");

        return;
      }


      // ---------------------------------------------
      // BACKEND RETURNED ERROR
      // ---------------------------------------------

      console.error(
        "❌ Registration rejected:",
        data
      );


      alert(
        data.message ||
        data.error ||
        "Registration failed. Please try again."
      );

    } catch (error) {

      console.error(
        "❌ Registration Error:",
        error
      );


      // ---------------------------------------------
      // AXIOS ERROR
      // ---------------------------------------------

      if (error.response) {

        console.error(
          "HTTP Status:",
          error.response.status
        );


        console.error(
          "Server Response:",
          error.response.data
        );


        const errorData =
          error.response.data;


        const message =
          errorData?.message ||
          errorData?.error ||
          "Registration failed. Please try again.";


        alert(message);

      }

      // ---------------------------------------------
      // REQUEST SENT BUT NO RESPONSE
      // ---------------------------------------------

      else if (error.request) {

        console.error(
          "❌ No response received from backend:",
          error.request
        );


        alert(
          "Unable to connect to the backend server.\n\n" +
          "Please make sure the backend is running on port 5000."
        );

      }

      // ---------------------------------------------
      // OTHER ERROR
      // ---------------------------------------------

      else {

        console.error(
          "❌ Request setup error:",
          error.message
        );


        alert(
          error.message ||
          "Registration failed. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-950 flex">


      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <LeftHero />


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="w-1/2 flex justify-center items-center">


        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-[450px]">


          {/* =================================================
              TITLE
          ================================================= */}

          <h2 className="text-3xl text-white font-bold mb-2">
            Create Account
          </h2>


          <p className="text-gray-400 mb-8">
            Join VeriFrame to verify digital content.
          </p>


          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="mb-5">

            <label className="block text-gray-300 mb-2">
              Full Name
            </label>


            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">

              <User
                className="text-gray-400"
                size={18}
              />


              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 bg-transparent text-white outline-none"
                disabled={loading}
              />

            </div>

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="mb-5">

            <label className="block text-gray-300 mb-2">
              Email
            </label>


            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">

              <Mail
                className="text-gray-400"
                size={18}
              />


              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-3 bg-transparent text-white outline-none"
                disabled={loading}
              />

            </div>

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="mb-6">

            <label className="block text-gray-300 mb-2">
              Password
            </label>


            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">

              <Lock
                className="text-gray-400"
                size={18}
              />


              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full p-3 bg-transparent text-white outline-none"
                disabled={loading}
              />

            </div>

          </div>


          {/* =================================================
              REGISTER BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"
            }


            {!loading && (
              <ArrowRight size={18} />
            )}

          </button>


          {/* =================================================
              LOGIN
          ================================================= */}

          <p className="text-center text-gray-400 mt-6">

            Already have an account?{" "}


            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-emerald-400 hover:underline"
              disabled={loading}
            >
              Sign In
            </button>

          </p>


        </div>

      </div>

    </div>

  );

}


export default Register;