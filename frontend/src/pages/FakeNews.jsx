import {
  Newspaper,
  Search,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Trash2,
  History as HistoryIcon,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import { analyzeNews } from "../api/newsApi";

import {
  getAnalysisById,
  deleteAnalysis,
} from "../api/uploadApi";


function FakeNews() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ==========================================
  // SAVED ANALYSIS FROM HISTORY
  // ==========================================

  const savedAnalysis =
    location.state?.analysis || null;


  const isHistoryView =
    !!savedAnalysis;


  // ==========================================
  // STATE
  // ==========================================

  const [newsText, setNewsText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [savedAnalysisId, setSavedAnalysisId] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


  // ==========================================
  // LOAD SAVED NEWS ANALYSIS
  // ==========================================

  useEffect(() => {

    const loadSavedAnalysis =
      async () => {

        if (!savedAnalysis) {
          return;
        }


        console.log(
          "📰 Loading saved News analysis:",
          savedAnalysis
        );


        // ==========================================
        // SAVE ID
        // ==========================================

        setSavedAnalysisId(
          savedAnalysis._id ||
          savedAnalysis.id ||
          null
        );


        // ==========================================
        // FIND NEWS TEXT
        // ==========================================

        let text =
          savedAnalysis.newsText ||
          savedAnalysis.text ||
          savedAnalysis.content ||
          savedAnalysis.newsContent ||
          "";


        // ==========================================
        // IF TEXT IS NOT PRESENT
        // FETCH COMPLETE RECORD
        // ==========================================

        const analysisId =
          savedAnalysis._id ||
          savedAnalysis.id;


        if (
          !text &&
          analysisId
        ) {

          try {

            console.log(
              "📰 Fetching complete News analysis..."
            );


            const response =
              await getAnalysisById(
                analysisId
              );


            console.log(
              "📰 Saved News response:",
              response
            );


            if (
              response?.success &&
              response?.analysis
            ) {

              const analysis =
                response.analysis;


              text =
                analysis.newsText ||
                analysis.text ||
                analysis.content ||
                analysis.newsContent ||
                "";

            }

          } catch (error) {

            console.error(
              "❌ Failed to load saved News:",
              error
            );

          }

        }


        // ==========================================
        // SET NEWS TEXT
        // ==========================================

        setNewsText(
          text
        );


        // ==========================================
        // SET RESULT
        // ==========================================

        setResult({

          prediction:
            savedAnalysis.prediction ||
            "UNCERTAIN",

          confidence:
            Number(
              savedAnalysis.confidence ||
              0
            ),

          message:
            savedAnalysis.message ||
            "News analysis completed.",

        });

      };


    loadSavedAnalysis();

  }, [savedAnalysis]);


  // ==========================================
  // ANALYZE NEWS
  // ==========================================

  const handleAnalyze =
    async () => {

      if (!newsText.trim()) {

        alert(
          "Please enter a news article or claim."
        );

        return;

      }


      setLoading(true);

      setResult(null);


      try {

        console.log(
          "📰 Sending news to AI..."
        );


        const data =
          await analyzeNews(
            newsText.trim()
          );


        console.log(
          "📰 News AI Response:",
          data
        );


        if (!data.success) {

          throw new Error(
            data.message ||
            "News analysis failed."
          );

        }


        setResult({

          prediction:
            data.prediction ||
            "UNCERTAIN",

          confidence:
            Number(
              data.confidence ||
              0
            ),

          message:
            data.message ||
            "News analysis completed.",

        });


        // ==========================================
        // THIS IS A NEW ANALYSIS
        // ==========================================

        setSavedAnalysisId(
          data.analysisId ||
          null
        );


      } catch (error) {

        console.error(
          "❌ Fake News Error:",
          error
        );


        alert(
          error.response?.data?.message ||
          error.message ||
          "News analysis failed."
        );


        setResult(null);


      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // CLEAR
  // ==========================================

  const handleClear =
    () => {

      setNewsText("");

      setResult(null);

      setSavedAnalysisId(
        null
      );

      // Remove history state
      navigate(
        "/fake-news",
        {
          replace: true,
          state: null,
        }
      );

    };


  // ==========================================
  // BACK TO HISTORY
  // ==========================================

  const handleBackToHistory =
    () => {

      navigate(
        "/history"
      );

    };


  // ==========================================
  // DELETE SAVED ANALYSIS
  // ==========================================

  const handleDelete =
    async () => {

      if (
        !savedAnalysisId
      ) {

        alert(
          "Analysis ID not found."
        );

        return;

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this Fake News analysis?"
        );


      if (!confirmed) {

        return;

      }


      try {

        setDeleting(true);


        console.log(
          "🗑️ Deleting News analysis:",
          savedAnalysisId
        );


        const response =
          await deleteAnalysis(
            savedAnalysisId
          );


        console.log(
          "🗑️ Delete response:",
          response
        );


        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
            "Failed to delete analysis."
          );

        }


        alert(
          "Fake News analysis deleted successfully."
        );


        // ==========================================
        // RETURN TO HISTORY
        // ==========================================

        navigate(
          "/history"
        );


      } catch (error) {

        console.error(
          "❌ Delete News Error:",
          error
        );


        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed to delete analysis."
        );


      } finally {

        setDeleting(false);

      }

    };


  // ==========================================
  // PREDICTION STYLE
  // ==========================================

  const getPredictionStyle =
    () => {

      if (
        result?.prediction ===
        "FAKE"
      ) {

        return {

          container:
            "bg-red-500/10 border-red-500/40",

          text:
            "text-red-400",

          icon:
            "🚨",

        };

      }


      if (
        result?.prediction ===
        "REAL"
      ) {

        return {

          container:
            "bg-emerald-500/10 border-emerald-500/40",

          text:
            "text-emerald-400",

          icon:
            "✅",

        };

      }


      return {

        container:
          "bg-yellow-500/10 border-yellow-500/40",

        text:
          "text-yellow-400",

        icon:
          "⚠️",

      };

    };


  const predictionStyle =
    getPredictionStyle();


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <DashboardLayout>

      <div className="
        min-h-screen
        bg-slate-950
        text-white
        p-8
      ">

        <div className="
          max-w-6xl
          mx-auto
        ">


          {/* =================================
              TOP ACTIONS
          ================================= */}

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">


            {/* BACK */}

            <button

              onClick={
                handleBackToHistory
              }

              className="
                flex
                items-center
                gap-2
                text-gray-400
                hover:text-white
                transition
              "

            >

              <ArrowLeft
                size={20}
              />

              Back to History

            </button>


            {/* HISTORY MODE */}

            {isHistoryView && (

              <div className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-purple-500/10
                border
                border-purple-500/30
                text-purple-400
                text-sm
              ">

                <HistoryIcon
                  size={17}
                />

                Saved Analysis

              </div>

            )}

          </div>


          {/* =================================
              HEADER
          ================================= */}

          <div className="
            flex
            items-center
            gap-4
            mb-3
          ">

            <div className="
              w-14
              h-14
              rounded-xl
              bg-emerald-500/20
              flex
              items-center
              justify-center
            ">

              <Newspaper
                size={30}
                className="
                  text-emerald-400
                "
              />

            </div>


            <div>

              <h1 className="
                text-4xl
                font-bold
              ">

                Fake News Detection

              </h1>


              <p className="
                text-gray-400
                mt-1
              ">

                Analyze news articles and
                claims using VeriFrame AI.

              </p>

            </div>

          </div>


          {/* =================================
              INPUT
          ================================= */}

          <div className="
            mt-8
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-8
            shadow-xl
          ">


            <h2 className="
              text-2xl
              font-bold
              mb-2
            ">

              📰 News Content

            </h2>


            <p className="
              text-gray-400
              mb-6
            ">

              {isHistoryView

                ? "This is the news content from your saved analysis."

                : "Paste a news article, headline, or claim that you want VeriFrame to analyze."

              }

            </p>


            {/* TEXTAREA */}

            <textarea

              value={
                newsText
              }

              onChange={(e) =>
                setNewsText(
                  e.target.value
                )
              }

              placeholder="
                Paste the news article or claim here...
              "

              disabled={
                loading ||
                isHistoryView
              }

              className="
                w-full
                h-64
                bg-slate-950
                border
                border-slate-700
                rounded-xl
                p-5
                text-white
                placeholder-gray-600
                resize-none
                focus:outline-none
                focus:border-emerald-500
                transition
                disabled:opacity-70
              "

            />


            {/* CHARACTER COUNT */}

            <div className="
              flex
              justify-between
              items-center
              mt-3
            ">

              <span className="
                text-sm
                text-gray-500
              ">

                {newsText.length}
                {" "}
                characters

              </span>


              <span className="
                text-sm
                text-gray-500
              ">

                {isHistoryView
                  ? "Saved article"
                  : "Recommended: paste the complete article"
                }

              </span>

            </div>


            {/* =================================
                BUTTONS
            ================================= */}

            <div className="
              flex
              justify-center
              gap-4
              mt-8
              flex-wrap
            ">


              {/* ANALYZE */}

              {!isHistoryView && (

                <button

                  onClick={
                    handleAnalyze
                  }

                  disabled={
                    loading ||
                    !newsText.trim()
                  }

                  className="
                    flex
                    items-center
                    gap-3
                    px-8
                    py-4
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-teal-500
                    hover:scale-105
                    disabled:opacity-50
                    disabled:hover:scale-100
                    transition
                    font-bold
                    shadow-lg
                    shadow-emerald-500/20
                  "

                >

                  {loading ? (

                    <>

                      <Loader2
                        size={22}
                        className="
                          animate-spin
                        "
                      />

                      Analyzing...

                    </>

                  ) : (

                    <>

                      <Search
                        size={22}
                      />

                      Analyze News

                    </>

                  )}

                </button>

              )}


              {/* CLEAR */}

              {!isHistoryView && (

                <button

                  onClick={
                    handleClear
                  }

                  disabled={
                    loading
                  }

                  className="
                    px-8
                    py-4
                    rounded-xl
                    border
                    border-slate-700
                    hover:border-red-500
                    hover:text-red-400
                    transition
                    font-semibold
                    disabled:opacity-50
                  "

                >

                  Clear

                </button>

              )}


              {/* DELETE SAVED */}

              {isHistoryView && (

                <button

                  onClick={
                    handleDelete
                  }

                  disabled={
                    deleting
                  }

                  className="
                    flex
                    items-center
                    gap-3
                    px-8
                    py-4
                    rounded-xl
                    bg-red-500/10
                    border
                    border-red-500/40
                    text-red-400
                    hover:bg-red-500
                    hover:text-white
                    transition
                    font-semibold
                    disabled:opacity-50
                  "

                >

                  {deleting ? (

                    <>

                      <Loader2
                        size={20}
                        className="
                          animate-spin
                        "
                      />

                      Deleting...

                    </>

                  ) : (

                    <>

                      <Trash2
                        size={20}
                      />

                      Delete Analysis

                    </>

                  )}

                </button>

              )}

            </div>

          </div>


          {/* =================================
              RESULT
          ================================= */}

          {result && (

            <div className="
              mt-8
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-8
            ">


              {/* RESULT HEADER */}

              <div className="
                flex
                items-center
                gap-4
                mb-6
              ">

                <ShieldCheck
                  size={32}
                  className="
                    text-emerald-400
                  "
                />


                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    Analysis Result

                  </h2>


                  {isHistoryView && (

                    <p className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">

                      Retrieved from analysis history

                    </p>

                  )}

                </div>

              </div>


              {/* RESULT CARDS */}

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              ">


                {/* PREDICTION */}

                <div className={`
                  rounded-xl
                  p-6
                  border
                  ${predictionStyle.container}
                `}>

                  <p className="
                    text-gray-400
                  ">

                    Prediction

                  </p>


                  <div className="
                    flex
                    items-center
                    gap-3
                    mt-2
                  ">

                    <span className="
                      text-3xl
                    ">

                      {
                        predictionStyle.icon
                      }

                    </span>


                    <h2 className={`
                      text-4xl
                      font-bold
                      ${predictionStyle.text}
                    `}>

                      {
                        result.prediction
                      }

                    </h2>

                  </div>

                </div>


                {/* CONFIDENCE */}

                <div className="
                  bg-slate-950
                  rounded-xl
                  p-6
                  border
                  border-slate-800
                ">

                  <p className="
                    text-gray-400
                  ">

                    AI Confidence

                  </p>


                  <h2 className="
                    text-4xl
                    font-bold
                    text-cyan-400
                    mt-2
                  ">

                    {
                      Number(
                        result.confidence
                      ).toFixed(2)
                    }%

                  </h2>


                  <div className="
                    w-full
                    h-3
                    bg-slate-800
                    rounded-full
                    mt-4
                    overflow-hidden
                  ">

                    <div

                      className={`
                        h-full
                        transition-all
                        duration-700
                        ${
                          result.prediction ===
                          "FAKE"
                            ? "bg-red-500"
                            : result.prediction ===
                              "REAL"
                            ? "bg-emerald-500"
                            : "bg-yellow-500"
                        }
                      `}

                      style={{
                        width:
                          `${Math.min(
                            Math.max(
                              Number(
                                result.confidence
                              ),
                              0
                            ),
                            100
                          )}%`,
                      }}

                    />

                  </div>

                </div>

              </div>


              {/* MESSAGE */}

              <div className="
                mt-6
                bg-slate-950
                border
                border-slate-800
                rounded-xl
                p-5
              ">

                <p className="
                  text-gray-300
                  leading-7
                ">

                  {result.message}

                </p>

              </div>


              {/* DISCLAIMER */}

              <div className="
                mt-4
                bg-yellow-500/5
                border
                border-yellow-500/20
                rounded-xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-400
                  leading-6
                ">

                  ⚠️ This prediction is based
                  on the trained Fake News
                  dataset and should not be
                  treated as definitive proof
                  that a news claim is true
                  or false. Verify important
                  information using reliable
                  sources.

                </p>

              </div>


              {/* HISTORY ACTION */}

              {isHistoryView && (

                <div className="
                  mt-6
                  flex
                  justify-center
                ">

                  <button

                    onClick={
                      handleBackToHistory
                    }

                    className="
                      flex
                      items-center
                      gap-2
                      px-6
                      py-3
                      rounded-xl
                      bg-slate-800
                      hover:bg-slate-700
                      border
                      border-slate-700
                      text-white
                      transition
                    "

                  >

                    <HistoryIcon
                      size={18}
                    />

                    Back to History

                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  );

}


export default FakeNews;