import {
  Lock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  resetPassword,
} from "../api/authApi";

import LeftHero from "../components/interface/LeftHero";


function ResetPassword() {

  const navigate =
    useNavigate();


  const { token } =
    useParams();


  const [password, setPassword] =
    useState("");


  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [success, setSuccess] =
    useState(false);


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !password ||
        !confirmPassword
      ) {

        alert(
          "Please enter both password fields."
        );

        return;
      }


      if (password.length < 6) {

        alert(
          "Password must be at least 6 characters."
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match."
        );

        return;
      }


      if (!token) {

        alert(
          "Invalid password reset link."
        );

        return;
      }


      try {

        setLoading(true);


        const data =
          await resetPassword(
            token,
            password
          );


        console.log(
          "🔐 Reset Password:",
          data
        );


        if (!data.success) {

          alert(
            data.message ||
              "Unable to reset password."
          );

          return;
        }


        setSuccess(true);


      } catch (error) {

        console.error(
          "❌ Reset Password Error:",
          error
        );


        if (error.response) {

          alert(
            error.response.data.message ||
              "Unable to reset password."
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


  return (

    <div className="min-h-screen bg-slate-950 flex">


      <LeftHero />


      <div className="w-1/2 flex justify-center items-center">


        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-[450px]">


          {!success ? (

            <>

              {/* BACK */}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
              >

                <ArrowLeft size={18} />

                Back to Login

              </button>


              {/* TITLE */}

              <h2 className="text-3xl text-white font-bold mb-2">

                Reset Password

              </h2>


              <p className="text-gray-400 mb-8">

                Create a new password for
                your VeriFrame account.

              </p>


              <form
                onSubmit={
                  handleSubmit
                }
              >

                {/* NEW PASSWORD */}

                <label className="block text-gray-300 mb-2">

                  New Password

                </label>


                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 mb-5">


                  <Lock
                    className="text-gray-400"
                    size={18}
                  />


                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    className="w-full p-3 bg-transparent text-white outline-none"
                  />


                </div>


                {/* CONFIRM */}

                <label className="block text-gray-300 mb-2">

                  Confirm Password

                </label>


                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 mb-6">


                  <Lock
                    className="text-gray-400"
                    size={18}
                  />


                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    className="w-full p-3 bg-transparent text-white outline-none"
                  />


                </div>


                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
                >

                  {loading
                    ? "Updating..."
                    : "Reset Password"}

                </button>


              </form>

            </>

          ) : (

            <div className="text-center">


              <CheckCircle
                size={55}
                className="text-emerald-400 mx-auto mb-5"
              />


              <h2 className="text-3xl text-white font-bold mb-3">

                Password Reset!

              </h2>


              <p className="text-gray-400">

                Your password has been
                updated successfully.

              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="w-full mt-7 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold"
              >

                Go to Login

              </button>


            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default ResetPassword;