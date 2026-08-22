import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../api/authApi";
import LeftHero from "../components/interface/LeftHero";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);


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
  // ACTIVATE ACCOUNT
  // =====================================================

  const activateAccount = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/activate",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );


      const data =
        await response.json();

      console.log(
        "🔓 Activation Response:",
        data
      );


      if (!data.success) {

        alert(
          data.message ||
            "Unable to activate account."
        );

        return false;
      }


      alert(
        "Account activated successfully! ✅\n\n" +
        "You can now sign in with your password."
      );

      return true;

    } catch (error) {

      console.error(
        "❌ Activation Error:",
        error
      );

      alert(
        "Unable to activate account. Please try again."
      );

      return false;

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async () => {

    if (
      !formData.email ||
      !formData.password
    ) {

      alert(
        "Please enter email and password."
      );

      return;
    }


    try {

      setLoading(true);


      const data =
        await loginUser(formData);


      console.log(
        "🔐 Login Response:",
        data
      );


      // =================================================
      // NORMAL LOGIN SUCCESS
      // =================================================

      if (data.success) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");

        return;
      }


      // =================================================
      // ACCOUNT DEACTIVATED
      // =================================================

      if (
        data.accountDeactivated
      ) {

        const activate =
          window.confirm(
            "This account is currently deactivated.\n\n" +
            "Would you like to activate your account?"
          );


        if (!activate) {

          return;

        }


        const activated =
          await activateAccount();


        if (activated) {

          // Don't automatically enter dashboard.
          // User must login again.

          return;

        }

        return;

      }


      // =================================================
      // OTHER LOGIN ERROR
      // =================================================

      alert(
        data.message ||
          "Login failed."
      );

    } catch (error) {

      console.error(
        "❌ Login Error:",
        error
      );


      // =================================================
      // AXIOS ERROR
      // =================================================

      if (error.response) {

        const errorData =
          error.response.data;


        // ===============================================
        // ACCOUNT DEACTIVATED
        // ===============================================

        if (
          errorData.accountDeactivated
        ) {

          const activate =
            window.confirm(
              "This account is currently deactivated.\n\n" +
              "Would you like to activate your account?"
            );


          if (!activate) {

            return;

          }


          const activated =
            await activateAccount();


          if (activated) {

            return;

          }

          return;

        }


        alert(
          errorData.message ||
            "Login failed."
        );

      } else {

        alert(
          "Unable to connect to server."
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


      <LeftHero />


      <div className="w-1/2 flex justify-center items-center">


        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-[450px]">


          {/* =================================================
              TITLE
          ================================================= */}

          <h2 className="text-3xl text-white font-bold mb-2">
            Welcome Back
          </h2>


          <p className="text-gray-400 mb-8">
            Sign in to access your authentication dashboard.
          </p>


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
              />


            </div>

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="mb-2">

            <label className="block text-gray-300 mb-2">
              Password
            </label>


            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">


              <Lock
                className="text-gray-400"
                size={18}
              />


              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent text-white outline-none"
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="text-gray-400 hover:text-white"
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>


            </div>

          </div>


          {/* =================================================
              FORGOT PASSWORD
          ================================================= */}

          <div className="text-right mb-6">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/forgot-password"
                )
              }
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Forgot Password?
            </button>

          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >

            {loading
              ? "Please wait..."
              : "Sign In"}


            {!loading && (
              <ArrowRight
                size={18}
              />
            )}

          </button>


          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="text-center text-gray-400 mt-6">

            Don't have an account?{" "}


            <button
              onClick={() =>
                navigate(
                  "/register"
                )
              }
              className="text-emerald-400 hover:underline"
            >
              Create one
            </button>

          </p>


        </div>

      </div>

    </div>

  );

}

export default Login;