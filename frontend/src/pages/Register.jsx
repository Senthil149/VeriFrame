import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/authApi";
import LeftHero from "../components/interface/LeftHero";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
console.log(formData);
const handleSubmit = async () => {
  try {
    const data = await registerUser(formData);

    console.log(data);

    alert("Registration Successful");

    navigate("/");
  } catch (error) {
  console.log(error);

  if (error.response) {
    console.log(error.response.data);
    alert(error.response.data.message);
  } else {
    alert("Registration Failed");
  }
}
};

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <LeftHero />

      <div className="w-1/2 flex justify-center items-center">
        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-[450px]">

          <h2 className="text-3xl text-white font-bold mb-2">
            Create Account
          </h2>

          <p className="text-gray-400 mb-8">
            Join VeriFrame to verify digital content.
          </p>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">
              Full Name
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">
              <User className="text-gray-400" size={18} />

              <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Your Name"
  className="w-full p-3 bg-transparent text-white outline-none"
/>
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">
              <Mail className="text-gray-400" size={18} />

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

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3">
              <Lock className="text-gray-400" size={18} />

              <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Create Password"
  className="w-full p-3 bg-transparent text-white outline-none"
/>
            </div>
          </div>

         <button
  onClick={handleSubmit}
  className="w-full bg-emerald-500 hover:bg-emerald-600 transition text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
>
            Create Account
            <ArrowRight size={18} />
          </button>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-emerald-400 hover:underline"
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