import {
  Mail,
  ArrowLeft,
  Send,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  forgotPassword,
} from "../api/authApi";

import LeftHero from "../components/interface/LeftHero";


function ForgotPassword() {

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [sent, setSent] =
    useState(false);


  const [resetLink, setResetLink] =
    useState("");


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (!email.trim()) {

        alert(
          "Please enter your email."
        );

        return;
      }


      try {

        setLoading(true);


        const data =
          await forgotPassword(
            email.trim()
          );


        console.log(
          "📧 Forgot Password:",
          data
        );


        if (!data.success) {

          alert(
            data.message ||
              "Unable to process request."
          );

          return;
        }


        setSent(true);


        // Development only

        if (
          data.developmentResetLink
        ) {

          setResetLink(
            data.developmentResetLink
          );

        }

      } catch (error) {

        console.error(
          "❌ Forgot Password Error:",
          error
        );


        if (error.response) {

          alert(
            error.response.data.message ||
              "Unable to process request."
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


          {!sent ? (

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

                Forgot Password?

              </h2>


              <p className="text-gray-400 mb-8">

                Enter your email and we'll
                generate a secure password
                reset link.

              </p>


              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <label className="block text-gray-300 mb-2">

                  Email

                </label>


                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 mb-6">


                  <Mail
                    className="text-gray-400"
                    size={18}
                  />


                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    className="w-full p-3 bg-transparent text-white outline-none"
                  />


                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >

                  {loading
                    ? "Generating..."
                    : "Send Reset Link"}


                  {!loading && (
                    <Send size={18} />
                  )}

                </button>


              </form>

            </>

          ) : (

            <div>

              {/* SUCCESS */}

              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-5">

                ✓

              </div>


              <h2 className="text-3xl text-white font-bold mb-3">

                Check Your Email

              </h2>


              <p className="text-gray-400 leading-relaxed">

                If an account exists for{" "}

                <span className="text-white">

                  {email}

                </span>

                , a password reset link
                has been generated.

              </p>


              {/* DEVELOPMENT LINK */}

              {resetLink && (

                <div className="mt-6 bg-slate-950 border border-yellow-500/30 rounded-xl p-4">

                  <p className="text-yellow-400 text-sm font-semibold mb-2">

                    Development Reset Link

                  </p>


                  <p className="text-gray-400 text-xs mb-3">

                    This link is shown only
                    during local development.

                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        new URL(
                          resetLink
                        ).pathname
                      )
                    }
                    className="text-left text-emerald-400 text-sm break-all hover:underline"
                  >

                    {resetLink}

                  </button>

                </div>

              )}


              {/* BACK */}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold"
              >

                Back to Login

              </button>


            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default ForgotPassword;