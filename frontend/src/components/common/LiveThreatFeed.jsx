import {
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Newspaper,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";



function LiveThreatFeed() {

  const [threats, setThreats] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(null);

  const [activeThreatCount, setActiveThreatCount] = useState(0);

  const isMounted = useRef(true);

  const requestId = useRef(0);



  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {

    if (!date) {
      return "Unknown time";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown time";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );

  };



  // ==========================================
  // GET ANALYSIS TYPE
  // ==========================================

  const getAnalysisType = (analysis) => {

    return String(
      analysis?.analysisType || "IMAGE"
    )
      .trim()
      .toUpperCase();

  };



  // ==========================================
  // GET PREDICTION
  // ==========================================

  const getPrediction = (analysis) => {

    return String(
      analysis?.prediction || ""
    )
      .trim()
      .toUpperCase();

  };



  // ==========================================
  // GET CREATED DATE
  // ==========================================

  const getCreatedTime = (analysis) => {

    const time =
      new Date(
        analysis?.createdAt || 0
      ).getTime();

    return Number.isNaN(time)
      ? 0
      : time;

  };



  // ==========================================
  // GET DISPLAY NAME
  // ==========================================

  const getDisplayName = (analysis, isNews) => {

    if (isNews) {

      const newsText =
        String(
          analysis?.newsText || ""
        ).trim();

      if (!newsText) {
        return "News article analyzed";
      }

      // Keep the feed compact.
      if (newsText.length > 80) {

        return (
          newsText.substring(0, 80) +
          "..."
        );

      }

      return newsText;

    }



    return (
      analysis?.fileName ||
      "Unknown image"
    );

  };



  // ==========================================
  // GET TITLE
  // ==========================================

  const getTitle = (
    analysis,
    isNews,
    prediction
  ) => {

    if (isNews) {

      if (prediction === "FAKE") {
        return "Fake News detected";
      }

      if (prediction === "REAL") {
        return "News analyzed";
      }

      return "News analyzed";

    }



    if (prediction === "FAKE") {
      return "Deepfake detected";
    }



    if (prediction === "REAL") {
      return "Authentic image analyzed";
    }



    return "Image analyzed";

  };



  // ==========================================
  // GET RISK
  // ==========================================

  const getRisk = (
    prediction,
    confidence
  ) => {

    // A fake result is a threat.
    if (prediction === "FAKE") {

      if (confidence >= 85) {
        return "High";
      }

      return "Medium";

    }



    // REAL results are not threats.
    if (prediction === "REAL") {
      return "Low";
    }



    return "Medium";

  };



  // ==========================================
  // FETCH THREATS
  // ==========================================

  const fetchThreats = async (
    isInitialLoad = false
  ) => {

    const currentRequest =
      ++requestId.current;



    try {

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }



      const token =
        localStorage.getItem(
          "token"
        );



      if (!token) {

        if (isMounted.current) {

          setThreats([]);

          setActiveThreatCount(0);

          setLastUpdated(null);

        }

        return;

      }



      const response =
        await fetch(
          "http://localhost:5000/api/upload/history",
          {
            method: "GET",

            cache: "no-store",

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

              "Cache-Control":
                "no-cache",

              Pragma:
                "no-cache",

            },

          }
        );



      if (
        response.status === 401
      ) {

        console.log(
          "❌ Live Threat Feed: Unauthorized"
        );

        if (
          isMounted.current &&
          currentRequest === requestId.current
        ) {

          setThreats([]);

          setActiveThreatCount(0);

        }

        return;

      }



      if (!response.ok) {

        throw new Error(
          `History request failed: ${response.status}`
        );

      }



      const data =
        await response.json();



      console.log(
        "🚨 Live Threat Feed API Response:",
        data
      );



      if (
        !data ||
        !data.success
      ) {

        throw new Error(
          data?.message ||
          "Failed to fetch analysis history"
        );

      }



      const analyses =
        Array.isArray(
          data.analyses
        )
          ? data.analyses
          : [];



      // ==========================================
      // SORT EVERYTHING BY CREATED DATE
      // NEWEST FIRST
      // ==========================================

      const sortedAnalyses =
        [...analyses].sort(
          (a, b) =>
            getCreatedTime(b) -
            getCreatedTime(a)
        );



      console.log(
        "📊 Sorted analyses:",
        sortedAnalyses.map(
          (item) => ({
            id: item?._id,
            type: item?.analysisType,
            prediction: item?.prediction,
            createdAt: item?.createdAt,
          })
        )
      );



      // ==========================================
      // ACTIVE THREATS
      //
      // Only FAKE results count as threats.
      // This includes:
      // IMAGE + NEWS
      // ==========================================

      const fakeAnalyses =
        sortedAnalyses.filter(
          (analysis) =>
            getPrediction(
              analysis
            ) === "FAKE"
        );



      // ==========================================
      // FEED RECORDS
      //
      // Show:
      //
      // 1. FAKE image
      // 2. FAKE news
      // 3. REAL news
      //
      // We intentionally don't show REAL
      // image results because this is a
      // THREAT feed.
      // ==========================================

      const feedAnalyses =
        sortedAnalyses.filter(
          (analysis) => {

            const type =
              getAnalysisType(
                analysis
              );

            const prediction =
              getPrediction(
                analysis
              );



            const isNews =
              type === "NEWS";



            const isFakeImage =
              type === "IMAGE" &&
              prediction === "FAKE";



            return (
              isNews ||
              isFakeImage
            );

          }
        );



      // ==========================================
      // LATEST 5
      // ==========================================

      const latestAnalyses =
        feedAnalyses.slice(
          0,
          5
        );



      // ==========================================
      // FORMAT FOR UI
      // ==========================================

      const formattedThreats =
        latestAnalyses.map(
          (analysis) => {

            const type =
              getAnalysisType(
                analysis
              );



            const prediction =
              getPrediction(
                analysis
              );



            const isNews =
              type === "NEWS";



            const confidence =
              Number(
                analysis?.confidence || 0
              );



            return {

              id:
                analysis?._id,

              isNews:
                isNews,

              prediction:
                prediction,

              fileName:
                getDisplayName(
                  analysis,
                  isNews
                ),

              title:
                getTitle(
                  analysis,
                  isNews,
                  prediction
                ),

              risk:
                getRisk(
                  prediction,
                  confidence
                ),

              confidence:
                confidence,

              time:
                formatTime(
                  analysis?.createdAt
                ),

              createdAt:
                analysis?.createdAt,

            };

          }
        );



      // ==========================================
      // IGNORE OLD REQUEST
      //
      // If two requests are running at the
      // same time, an older response should
      // never overwrite the newer response.
      // ==========================================

      if (
        !isMounted.current ||
        currentRequest !== requestId.current
      ) {

        return;

      }



      // ==========================================
      // UPDATE UI
      // ==========================================

      setThreats(
        formattedThreats
      );

      setActiveThreatCount(
        fakeAnalyses.length
      );

      setLastUpdated(
        new Date()
      );



    } catch (error) {

      console.error(
        "❌ Live Threat Feed Error:",
        error
      );

    } finally {

      if (
        isMounted.current &&
        currentRequest === requestId.current
      ) {

        setLoading(false);

        setRefreshing(false);

      }

    }

  };



  // ==========================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================

  useEffect(() => {

    isMounted.current = true;



    // Initial request.
    fetchThreats(true);



    // Refresh every 5 seconds.
    const interval =
      setInterval(
        () => {
          fetchThreats(false);
        },
        5000
      );



    return () => {

      isMounted.current = false;

      clearInterval(
        interval
      );

    };

  }, []);



  // ==========================================
  // MANUAL REFRESH
  // ==========================================

  const handleRefresh = () => {

    fetchThreats(false);

  };



  // ==========================================
  // LOADING
  // ==========================================

  if (
    loading &&
    threats.length === 0
  ) {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-5
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              🚨 Live Threat Feed
            </h2>

            <p
              className="
                text-gray-500
                text-xs
                mt-1
              "
            >
              Latest threats & news analyses
            </p>

          </div>

        </div>



        <div
          className="
            flex
            items-center
            justify-center
            h-32
          "
        >

          <p
            className="
              text-gray-400
              text-sm
            "
          >
            Loading threat activity...
          </p>

        </div>

      </div>

    );

  }



  // ==========================================
  // NO FEED DATA
  // ==========================================

  if (
    threats.length === 0
  ) {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-5
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              🚨 Live Threat Feed
            </h2>

            <p
              className="
                text-gray-500
                text-xs
                mt-1
              "
            >
              Latest threats & news analyses
            </p>

          </div>



          <button
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
            className="
              p-2
              rounded-lg
              bg-slate-800
              hover:bg-slate-700
              text-gray-400
              hover:text-white
              transition
              disabled:opacity-50
            "
            title="Refresh"
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

          </button>

        </div>



        <div
          className="
            flex
            items-center
            gap-3
            py-6
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-emerald-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <ShieldCheck
              size={24}
              className="
                text-emerald-400
              "
            />

          </div>



          <div>

            <h3
              className="
                text-white
                font-semibold
                text-sm
              "
            >
              No Recent Threat Activity
            </h3>



            <p
              className="
                text-gray-500
                text-xs
                mt-1
              "
            >
              No fake-news or deepfake activity found.
            </p>

          </div>

        </div>

      </div>

    );

  }



  // ==========================================
  // THREAT FEED
  // ==========================================

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-5
      "
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-4
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            🚨 Live Threat Feed
          </h2>



          <p
            className="
              text-gray-500
              text-xs
              mt-1
            "
          >
            Latest threats & news analyses
          </p>

        </div>



        <button
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
          className="
            p-2
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
            text-gray-400
            hover:text-white
            transition
            disabled:opacity-50
          "
          title="Refresh"
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

        </button>

      </div>



      {/* ==========================================
          ACTIVE THREATS
      ========================================== */}

      <div
        className="
          mb-3
          px-3
          py-2
          rounded-lg
          bg-red-500/10
          border
          border-red-500/20
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
          "
        >

          <span
            className="
              text-gray-400
              text-sm
            "
          >
            Active threats
          </span>



          <span
            className="
              text-red-400
              font-bold
              text-base
            "
          >
            {activeThreatCount}
          </span>

        </div>

      </div>



      {/* ==========================================
          FEED ITEMS
      ========================================== */}

      <div
        className="
          space-y-2
        "
      >

        {threats.map(
          (item) => (

            <div
              key={
                item.id
              }
              className="
                bg-slate-950
                rounded-lg
                px-3
                py-3
                border
                border-transparent
                hover:border-red-500/40
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {/* ICON */}

                <div
                  className="
                    flex-shrink-0
                  "
                >

                  {item.isNews ? (

                    <Newspaper
                      className={
                        item.prediction === "FAKE"
                          ? "text-red-400"
                          : "text-purple-400"
                      }
                      size={18}
                    />

                  ) : (

                    item.prediction === "FAKE" ? (

                      <AlertTriangle
                        className="
                          text-red-400
                        "
                        size={18}
                      />

                    ) : (

                      <ShieldCheck
                        className="
                          text-emerald-400
                        "
                        size={18}
                      />

                    )

                  )}

                </div>



                {/* MAIN INFORMATION */}

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <h3
                      className="
                        text-white
                        font-medium
                        text-sm
                        truncate
                      "
                    >
                      {item.title}
                    </h3>

                  </div>



                  <p
                    className="
                      text-gray-400
                      text-xs
                      truncate
                      mt-1
                    "
                    title={
                      item.fileName
                    }
                  >
                    {item.fileName}
                  </p>



                  <p
                    className="
                      text-gray-600
                      text-[11px]
                      mt-1
                    "
                  >
                    {item.time}
                  </p>

                </div>



                {/* RIGHT SIDE */}

                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-1
                    flex-shrink-0
                  "
                >

                  <span
                    className={`
                      px-2
                      py-0.5
                      rounded-full
                      text-[10px]
                      font-semibold
                      ${
                        item.risk === "High"
                          ? "bg-red-500/20 text-red-400"
                          : item.risk === "Low"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    `}
                  >
                    {item.risk}
                  </span>



                  <span
                    className={`
                      text-[10px]
                      font-semibold
                      ${
                        item.prediction === "FAKE"
                          ? "text-red-400"
                          : "text-emerald-400"
                      }
                    `}
                  >
                    {item.prediction || "UNKNOWN"}
                  </span>



                  <span
                    className="
                      text-[11px]
                      text-cyan-400
                      font-medium
                    "
                  >
                    {item.confidence.toFixed(
                      2
                    )}
                    %
                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>



      {/* ==========================================
          LAST UPDATED
      ========================================== */}

      {lastUpdated && (

        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            mt-3
          "
        >

          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-emerald-400
            "
          />

          <p
            className="
              text-gray-600
              text-[10px]
              text-center
            "
          >
            Updated{" "}
            {lastUpdated.toLocaleTimeString(
              "en-IN"
            )}
          </p>

        </div>

      )}

    </div>

  );

}



export default LiveThreatFeed;