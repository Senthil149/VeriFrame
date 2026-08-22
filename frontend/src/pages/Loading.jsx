import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Loading() {

  const navigate = useNavigate();
  const location = useLocation();
  const image = location.state?.image;
const imageUrl = location.state?.imageUrl;
  const [cnn, setCnn] = useState(0);
const [semantic, setSemantic] = useState(0);
const [blockchain, setBlockchain] = useState(0);
const [status, setStatus] = useState("Initializing AI Engine...");

  useEffect(() => {

  const interval = setInterval(() => {

    setCnn((v) => {

      if (v < 100) {
        setStatus("Running CNN Deepfake Detection...");
        return v + 5;
      }

      return v;
    });

    setSemantic((v) => {

      if (cnn >= 40 && v < 100) {
        setStatus("Performing Semantic Analysis...");
        return v + 5;
      }

      return v;
    });

    setBlockchain((v) => {

      if (semantic >= 60 && v < 100) {
        setStatus("Verifying Blockchain...");
        return v + 5;
      }

      return v;
    });

  }, 120);

  return () => clearInterval(interval);

}, [cnn, semantic]);
useEffect(() => {

  if (
    cnn >= 100 &&
    semantic >= 100 &&
    blockchain >= 100
  ) {

    setStatus("Generating Report...");

    setTimeout(() => {

      navigate("/result", {
        state: location.state,
      });

    }, 800);

  }

}, [cnn, semantic, blockchain]);
const overall = Math.floor(
  (cnn + semantic + blockchain) / 3
);
  return (
  <div className="min-h-screen bg-[#050816] flex items-center justify-center p-8">

    <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10">

      {/* Header */}

      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold text-white">
          🤖 AI Analysis in Progress
        </h1>

        <p className="text-gray-400 mt-3">
          Please wait while VeriFrame analyzes your uploaded image.
        </p>

      </div>

      {/* Progress Bars */}

     <div className="grid grid-cols-3 gap-8">

  {/* Left Side */}

  <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">

    <h2 className="text-xl text-white font-bold mb-5">
      Uploaded Image
    </h2>

    <img
  src={imageUrl || image}
  alt="Uploaded"
  className="w-full h-80 object-contain rounded-xl"
/>

  </div>

  {/* Right Side */}

  <div className="col-span-2 space-y-8"></div>

        {/* CNN */}

        <div>

          <div className="flex justify-between text-white mb-2">

            <span>🧠 CNN Deepfake Detection</span>

            <span>{cnn}%</span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${cnn}%` }}
            />

          </div>

        </div>

        {/* Semantic */}

        <div>

          <div className="flex justify-between text-white mb-2">

            <span>🔍 Semantic Analysis</span>

            <span>{semantic}%</span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${semantic}%` }}
            />

          </div>

        </div>

        {/* Blockchain */}

        <div>

          <div className="flex justify-between text-white mb-2">

            <span>🔗 Blockchain Verification</span>

            <span>{blockchain}%</span>

          </div>

          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${blockchain}%` }}
            />

          </div>

        </div>

      </div>

      {/* Overall */}

      <div className="mt-12">

        <div className="flex justify-between text-xl text-white mb-3">

          <span>Overall Progress</span>

          <span className="text-emerald-400">
            {overall}%
          </span>

        </div>

        <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 transition-all duration-300"
            style={{ width: `${overall}%` }}
          />

        </div>

      </div>

      {/* Status */}

      <div className="mt-10 bg-slate-800 rounded-2xl p-6 border border-slate-700">

        <p className="text-gray-400 text-sm">
          Current Status
        </p>

        <h2 className="text-2xl font-bold text-emerald-400 mt-2">
          {status}
        </h2>

      </div>

    </div>

  </div>
);
}

export default Loading;