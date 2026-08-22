import {
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

function ThreatFeed() {

  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH CURRENT USER ANALYSIS DATA
  // ==========================================

  const fetchThreats = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/");

        return;

      }


      const response = await fetch(
        "http://localhost:5000/api/upload/history",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );


      if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

        return;

      }


      const data =
        await response.json();


      console.log(
        "🚨 Threat Feed:",
        data
      );


      if (data.success) {

        setAnalyses(
          Array.isArray(data.analyses)
            ? data.analyses
            : []
        );

      } else {

        setAnalyses([]);

      }

    } catch (error) {

      console.error(
        "❌ Threat Feed Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchThreats();

  }, []);


  // ==========================================
  // STATISTICS
  // ==========================================

  const activeThreats =
    analyses.filter(
      (item) =>
        item.prediction === "FAKE"
    ).length;


  const highRisk =
    analyses.filter(
      (item) =>
        item.prediction === "FAKE" &&
        Number(
          item.confidence || 0
        ) >= 70
    ).length;


  const resolved =
    analyses.filter(
      (item) =>
        item.prediction === "REAL"
    ).length;


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Unknown time";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredAnalyses =
    analyses.filter(
      (analysis) =>
        analysis.fileName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // ==========================================
  // RISK
  // ==========================================

  const getRiskLevel = (
    analysis
  ) => {

    const confidence =
      Number(
        analysis.confidence || 0
      );


    if (
      analysis.prediction === "REAL"
    ) {

      return "Low";

    }


    if (confidence >= 70) {

      return "High";

    }


    return "Medium";

  };


  // ==========================================
  // RISK COLORS
  // ==========================================

  const badgeColor = (level) => {

    switch (level) {

      case "High":
        return "bg-red-500/20 text-red-400";

      case "Medium":
        return "bg-yellow-500/20 text-yellow-400";

      default:
        return "bg-emerald-500/20 text-emerald-400";

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <DashboardLayout>

        <main className="flex-1 p-10">

          <h1 className="text-4xl font-bold text-white mb-2">
            Threat Feed
          </h1>

          <p className="text-gray-400 mb-8">
            Latest AI deepfake and digital security alerts.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">

            <p className="text-gray-400">
              Loading threat feed...
            </p>

          </div>

        </main>

      </DashboardLayout>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <DashboardLayout>

      <main className="flex-1 p-10">


        {/* TITLE */}

        <div className="flex justify-between items-center mb-2">

          <div>

            <h1 className="text-4xl font-bold text-white">
              Threat Feed
            </h1>

            <p className="text-gray-400 mt-2">
              Latest AI deepfake and digital security alerts.
            </p>

          </div>


          {/* REFRESH */}

          <button
            onClick={fetchThreats}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              bg-slate-900
              border
              border-slate-700
              hover:border-emerald-500
              rounded-xl
              text-white
              transition
            "
          >

            <RefreshCw size={18} />

            Refresh

          </button>

        </div>


        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-3 gap-6 mt-8 mb-8">


          {/* ACTIVE THREATS */}

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-5
              hover:-translate-y-2
              hover:shadow-[0_0_30px_rgba(239,68,68,0.20)]
              hover:border-red-500
              transition-all
              duration-300
            "
          >

            <p className="text-gray-400">
              Active Threats
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {activeThreats}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Deepfake images detected
            </p>

          </div>


          {/* HIGH RISK */}

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-5
              hover:-translate-y-2
              hover:shadow-[0_0_30px_rgba(234,179,8,0.20)]
              hover:border-yellow-500
              transition-all
              duration-300
            "
          >

            <p className="text-gray-400">
              High Risk
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {highRisk}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              High-confidence deepfakes
            </p>

          </div>


          {/* RESOLVED */}

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-5
              hover:-translate-y-2
              hover:shadow-[0_0_30px_rgba(16,185,129,0.20)]
              hover:border-emerald-500
              transition-all
              duration-300
            "
          >

            <p className="text-gray-400">
              Resolved
            </p>

            <h2 className="text-4xl font-bold text-emerald-400 mt-2">
              {resolved}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Authentic images verified
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            bg-slate-900
            border
            border-slate-800
            focus-within:border-emerald-500
            rounded-xl
            p-4
            mb-8
            transition
          "
        >

          <Search
            size={20}
            className="text-gray-500 mr-3"
          />

          <input
            type="text"
            placeholder="Search threats by image name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              bg-transparent
              outline-none
              text-white
              placeholder:text-gray-500
            "
          />

        </div>


        {/* NO DATA */}

        {filteredAnalyses.length === 0 && (

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-12
              text-center
            "
          >

            <CheckCircle
              size={45}
              className="mx-auto text-emerald-400 mb-4"
            />

            <h2 className="text-xl font-semibold text-white">
              No analysis found
            </h2>

            <p className="text-gray-500 mt-2">
              No threat matches your search.
            </p>

          </div>

        )}


        {/* THREAT CARDS */}

        <div className="space-y-6">

          {filteredAnalyses.map(
            (analysis) => {

              const isFake =
                analysis.prediction === "FAKE";


              const risk =
                getRiskLevel(
                  analysis
                );


              const confidence =
                Number(
                  analysis.confidence || 0
                );


              return (

                <div
                  key={analysis._id}
                  className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-xl
                    p-6
                    hover:-translate-y-1
                    hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
                    hover:border-emerald-500
                    transition-all
                    duration-300
                  "
                >

                  <div className="flex justify-between items-center">


                    {/* LEFT */}

                    <div className="flex items-start gap-4">

                      <div
                        className="
                          w-12
                          h-12
                          rounded-xl
                          bg-slate-800
                          flex
                          items-center
                          justify-center
                        "
                      >

                        {isFake ? (

                          <AlertTriangle
                            className="text-red-400"
                            size={22}
                          />

                        ) : (

                          <CheckCircle
                            className="text-emerald-400"
                            size={22}
                          />

                        )}

                      </div>


                      <div>

                        <h2 className="text-xl font-semibold text-white">

                          {isFake
                            ? `Deepfake detected: ${analysis.fileName}`
                            : `Authentic image: ${analysis.fileName}`}

                        </h2>


                        <p className="text-gray-400 mt-2">

                          AI Prediction:{" "}

                          <span
                            className={
                              isFake
                                ? "text-red-400 font-semibold"
                                : "text-emerald-400 font-semibold"
                            }
                          >

                            {analysis.prediction}

                          </span>

                        </p>


                        <p className="text-gray-500 text-sm mt-1">

                          Analyzed:{" "}

                          {formatDate(
                            analysis.createdAt
                          )}

                        </p>


                        <p className="text-gray-500 text-sm mt-1">

                          Confidence:{" "}

                          <span className="text-cyan-400">

                            {confidence.toFixed(2)}%

                          </span>

                        </p>


                        {/* VIEW HISTORY */}

                        <button
                          onClick={() =>
                            navigate("/history")
                          }
                          className="
                            mt-4
                            px-4
                            py-2
                            bg-emerald-500
                            hover:bg-emerald-600
                            rounded-lg
                            text-white
                            text-sm
                            transition
                          "
                        >

                          View History

                        </button>

                      </div>

                    </div>


                    {/* RIGHT */}

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        font-medium
                        whitespace-nowrap
                        ${badgeColor(risk)}
                      `}
                    >

                      {risk} Risk

                    </span>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </main>

    </DashboardLayout>

  );

}

export default ThreatFeed;