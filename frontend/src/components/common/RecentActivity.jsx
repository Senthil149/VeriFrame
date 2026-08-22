import {
  Image as ImageIcon,
  Newspaper,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";


function RecentActivity() {

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();


  // ==========================================
  // GET RECENT ANALYSES
  // ==========================================

  useEffect(() => {

    const fetchRecentActivity =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );


          if (!token) {

            setLoading(false);

            return;

          }


          const response =
            await fetch(

              "http://localhost:5000/api/upload/history",

              {

                method:
                  "GET",

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",

                },

              }

            );


          // ==========================================
          // AUTH ERROR
          // ==========================================

          if (
            response.status === 401
          ) {

            console.log(
              "❌ Recent Activity: Unauthorized"
            );

            setActivities([]);

            return;

          }


          // ==========================================
          // RESPONSE
          // ==========================================

          const data =
            await response.json();


          console.log(
            "🕒 Recent Activity:",
            data
          );


          if (
            data.success &&
            Array.isArray(
              data.analyses
            )
          ) {

            // ==========================================
            // GET LATEST 5
            // ==========================================

            const recentAnalyses =
              data.analyses
                .slice(0, 5);


            // ==========================================
            // FORMAT
            // ==========================================

            const formattedActivities =
              recentAnalyses.map(
                (analysis) => {

                  const type =
                    String(
                      analysis.analysisType ||
                      "IMAGE"
                    ).toUpperCase();


                  const isNews =
                    type === "NEWS";


                  const prediction =
                    String(
                      analysis.prediction ||
                      "UNKNOWN"
                    ).toUpperCase();


                  const isFake =
                    prediction === "FAKE";


                  // ==========================================
                  // NEWS TITLE
                  // ==========================================

                  let title;


                  if (isNews) {

                    title =
                      isFake

                        ? "Fake News detected"

                        : prediction ===
                          "REAL"

                          ? "News classified as REAL"

                          : "News analysis completed";

                  }

                  // ==========================================
                  // IMAGE TITLE
                  // ==========================================

                  else {

                    title =
                      isFake

                        ? `Deepfake detected: ${
                            analysis.fileName ||
                            "Image"
                          }`

                        : prediction ===
                          "REAL"

                          ? `Authentic image analyzed: ${
                              analysis.fileName ||
                              "Image"
                            }`

                          : `Image analysis completed: ${
                              analysis.fileName ||
                              "Image"
                            }`;

                  }


                  // ==========================================
                  // NEWS PREVIEW
                  // ==========================================

                  const newsPreview =
                    isNews

                      ? String(
                          analysis.newsText ||
                          "News article analyzed."
                        )
                          .replace(
                            /\s+/g,
                            " "
                          )
                          .trim()

                      : "";


                  return {

                    id:
                      analysis._id,

                    type:
                      type,

                    isNews:
                      isNews,

                    isFake:
                      isFake,

                    prediction:
                      prediction,

                    title:
                      title,

                    fileName:
                      analysis.fileName ||
                      "Image",

                    newsPreview:
                      newsPreview,

                    confidence:
                      `${Number(
                        analysis.confidence ||
                        0
                      ).toFixed(2)}%`,

                    time:
                      formatTime(
                        analysis.createdAt
                      ),

                    analysis:
                      analysis,

                  };

                }
              );


            setActivities(
              formattedActivities
            );

          } else {

            setActivities([]);

          }


        } catch (error) {

          console.error(
            "❌ Recent Activity Error:",
            error
          );

          setActivities([]);

        } finally {

          setLoading(false);

        }

      };


    fetchRecentActivity();

  }, []);


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime =
    (date) => {

      if (!date) {

        return "Unknown time";

      }


      try {

        return new Date(
          date
        ).toLocaleString(

          "en-IN",

          {

            dateStyle:
              "medium",

            timeStyle:
              "short",

          }

        );

      } catch {

        return "Unknown time";

      }

    };


  // ==========================================
  // VIEW ANALYSIS
  // ==========================================

  const handleView =
    (item) => {

      if (!item?.analysis) {

        return;

      }


      const analysis =
        item.analysis;


      // ==========================================
      // FAKE NEWS
      // ==========================================

      if (
        item.isNews
      ) {

        navigate(
          "/fake-news",
          {

            state: {

              analysis:
                analysis,

            },

          }
        );


        return;

      }


      // ==========================================
      // IMAGE
      // ==========================================

      let imageUrl =
        analysis.imageUrl ||
        null;


      // ==========================================
      // CREATE IMAGE URL FROM PATH
      // ==========================================

      if (
        !imageUrl &&
        analysis.imagePath
      ) {

        const parts =
          analysis.imagePath
            .split(
              /[\\/]/
            );


        const fileName =
          parts[
            parts.length - 1
          ];


        if (fileName) {

          imageUrl =
            `http://localhost:5000/uploads/${fileName}`;

        }

      }


      // ==========================================
      // OPEN RESULT PAGE
      // ==========================================

      navigate(
        "/result",
        {

          state: {

            imageUrl:
              imageUrl,

            image:
              imageUrl,

            prediction:
              analysis.prediction,

            confidence:
              analysis.confidence,

            semanticAnalysis: {

              success:
                Boolean(
                  analysis.semanticDescription
                ),

              description:
                analysis.semanticDescription ||
                "",

            },

            analysisId:
              analysis._id,

            fileName:
              analysis.fileName,

            imageHash:
              analysis.imageHash ||
              "",

            blockchainStatus:
              analysis.blockchainStatus ||
              "NOT_IMPLEMENTED",

            blockchainRecordId:
              analysis.blockchainRecordId ||
              "",

            blockchain:
              analysis.blockchain ||
              null,

          },

        }
      );

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          h-full
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            text-white
            mb-6
          "
        >

          Recent Activity

        </h2>


        <div
          className="
            flex
            items-center
            gap-3
            text-gray-400
          "
        >

          <div
            className="
              w-5
              h-5
              border-2
              border-slate-600
              border-t-emerald-400
              rounded-full
              animate-spin
            "
          />

          Loading recent activity...

        </div>

      </div>

    );

  }


  // ==========================================
  // NO ACTIVITY
  // ==========================================

  if (
    activities.length === 0
  ) {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          h-full
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            text-white
            mb-6
          "
        >

          Recent Activity

        </h2>


        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            py-10
          "
        >

          <CheckCircle
            size={40}
            className="
              text-gray-700
              mb-3
            "
          />


          <p
            className="
              text-gray-500
            "
          >

            No analysis activity yet.

          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // DISPLAY ACTIVITIES
  // ==========================================

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        h-full
      "
    >

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-semibold
              text-white
            "
          >

            Recent Activity

          </h2>


          <p
            className="
              text-gray-500
              text-sm
              mt-1
            "
          >

            Latest Image and Fake News analyses

          </p>

        </div>

      </div>


      {/* ========================================== */}
      {/* ACTIVITY LIST */}
      {/* ========================================== */}

      <div
        className="
          space-y-4
        "
      >

        {activities.map(
          (item) => (

            <div
              key={
                item.id
              }
              className="
                flex
                items-start
                gap-4
                p-4
                rounded-xl
                bg-slate-950/50
                border
                border-slate-800
                hover:bg-slate-800/60
                hover:border-slate-700
                transition-all
              "
            >

              {/* ========================================== */}
              {/* ICON */}
              {/* ========================================== */}

              <div
                className={`
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  ${
                    item.isNews

                      ? "bg-purple-500/15 text-purple-400"

                      : item.isFake

                        ? "bg-red-500/20 text-red-400"

                        : "bg-emerald-500/20 text-emerald-400"
                  }
                `}
              >

                {item.isNews ? (

                  <Newspaper
                    size={21}
                  />

                ) : item.isFake ? (

                  <AlertTriangle
                    size={21}
                  />

                ) : (

                  <CheckCircle
                    size={21}
                  />

                )}

              </div>


              {/* ========================================== */}
              {/* CONTENT */}
              {/* ========================================== */}

              <div
                className="
                  flex-1
                  min-w-0
                "
              >

                {/* TITLE */}

                <h3
                  className="
                    text-white
                    font-medium
                  "
                >

                  {item.title}

                </h3>


                {/* NEWS PREVIEW */}

                {item.isNews && (

                  <p
                    className="
                      text-gray-500
                      text-sm
                      mt-1
                      line-clamp-2
                    "
                  >

                    {item.newsPreview}

                  </p>

                )}


                {/* IMAGE FILE */}

                {!item.isNews && (

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mt-1
                    "
                  >

                    <ImageIcon
                      size={14}
                      className="
                        text-gray-600
                      "
                    />


                    <p
                      className="
                        text-gray-500
                        text-sm
                        truncate
                      "
                    >

                      {item.fileName}

                    </p>

                  </div>

                )}


                {/* ========================================== */}
                {/* META */}
                {/* ========================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-2
                    flex-wrap
                  "
                >

                  {/* TYPE */}

                  <span
                    className={`
                      text-xs
                      px-2
                      py-1
                      rounded-md
                      font-semibold
                      ${
                        item.isNews

                          ? "bg-purple-500/10 text-purple-400"

                          : "bg-cyan-500/10 text-cyan-400"
                      }
                    `}
                  >

                    {item.isNews
                      ? "NEWS"
                      : "IMAGE"}

                  </span>


                  {/* PREDICTION */}

                  <span
                    className={`
                      text-sm
                      font-semibold
                      ${
                        item.isFake

                          ? "text-red-400"

                          : item.prediction ===
                            "REAL"

                            ? "text-emerald-400"

                            : "text-yellow-400"
                      }
                    `}
                  >

                    {item.prediction}

                  </span>


                  <span
                    className="
                      text-gray-700
                    "
                  >

                    •

                  </span>


                  {/* CONFIDENCE */}

                  <span
                    className="
                      text-gray-400
                      text-sm
                    "
                  >

                    {item.confidence}

                  </span>


                  <span
                    className="
                      text-gray-700
                    "
                  >

                    •

                  </span>


                  {/* TIME */}

                  <span
                    className="
                      text-gray-500
                      text-sm
                    "
                  >

                    {item.time}

                  </span>

                </div>

              </div>


              {/* ========================================== */}
              {/* VIEW BUTTON */}
              {/* ========================================== */}

              <button
                type="button"
                onClick={() =>
                  handleView(
                    item
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  bg-slate-800
                  border
                  border-slate-700
                  text-gray-300
                  hover:bg-emerald-500/10
                  hover:border-emerald-500/40
                  hover:text-emerald-400
                  transition
                  flex-shrink-0
                "
                title="View analysis"
              >

                <Eye
                  size={16}
                />

                <span
                  className="
                    text-sm
                    hidden
                    sm:inline
                  "
                >

                  View

                </span>

              </button>

            </div>

          )
        )}

      </div>

    </div>

  );

}


export default RecentActivity;