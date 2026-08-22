import {
  Shield,
  Settings,
  Bell,
  Search,
  Upload,
  CheckCircle,
  BarChart3,
  ChevronDown,
  User,
  LogOut,
  Eye,
  X,
  LayoutDashboard,
  History,
  Image,
  Newspaper,
} from "lucide-react";

import SectionCard from "../components/common/SectionCard";
import DetectionChart from "../components/common/DetectionChart";
import DashboardLayout from "../components/layout/DashboardLayout";
import AnimatedStatCard from "../components/common/AnimatedStatCard";
import AIStatus from "../components/common/AIStatus";
import DetectionSummary from "../components/common/DetectionSummary";
import LiveThreatFeed from "../components/common/LiveThreatFeed";
import RecentActivity from "../components/common/RecentActivity";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {

  // ==========================================
  // USER
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const navigate = useNavigate();


  // ==========================================
  // ANALYSIS DATA
  // ==========================================

  const [analyses, setAnalyses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [showNotifications, setShowNotifications] =
    useState(false);


  // ==========================================
  // USER MENU
  // ==========================================

  const [showUserMenu, setShowUserMenu] =
    useState(false);


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      navigate("/");

    }

  }, [navigate]);


  // ==========================================
  // FETCH ANALYSIS HISTORY
  // ==========================================

  useEffect(() => {

    const fetchAnalyses = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {

          navigate("/");

          return;

        }


        console.log(
          "📊 Fetching dashboard analyses..."
        );


        const response =
          await fetch(
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


        // ==========================================
        // AUTH ERROR
        // ==========================================

        if (response.status === 401) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/");

          return;

        }


        const data =
          await response.json();


        console.log(
          "📊 Dashboard Data:",
          data
        );


        if (data.success) {

          setAnalyses(
            Array.isArray(
              data.analyses
            )
              ? data.analyses
              : []
          );

        } else {

          setAnalyses([]);

        }

      } catch (error) {

        console.error(
          "❌ Dashboard Data Error:",
          error
        );

        setAnalyses([]);

      } finally {

        setLoading(false);

      }

    };


    fetchAnalyses();

  }, [navigate]);


  // ==========================================
  // ANALYSIS TYPE HELPERS
  // ==========================================

  const isNewsAnalysis =
    (analysis) => {

      return (
        analysis?.analysisType ===
        "NEWS"
      );

    };


  const isImageAnalysis =
    (analysis) => {

      return (
        analysis?.analysisType ===
        "IMAGE" ||

        !analysis?.analysisType
      );

    };


  // ==========================================
  // SEPARATE IMAGE / NEWS
  // ==========================================

  const imageAnalyses =
    analyses.filter(
      isImageAnalysis
    );


  const newsAnalyses =
    analyses.filter(
      isNewsAnalysis
    );


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAnalyses =
    analyses.length;


  const totalImageAnalyses =
    imageAnalyses.length;


  const totalNewsAnalyses =
    newsAnalyses.length;


  const fakeDetections =
    analyses.filter(
      (item) =>
        String(
          item.prediction || ""
        ).toUpperCase() ===
        "FAKE"
    ).length;


  const realDetections =
    analyses.filter(
      (item) =>
        String(
          item.prediction || ""
        ).toUpperCase() ===
        "REAL"
    ).length;


  // ==========================================
  // AVERAGE CONFIDENCE
  // ==========================================

  const averageConfidence =
    analyses.length > 0

      ? (

          analyses.reduce(
            (total, item) => {

              return (
                total +
                Number(
                  item.confidence || 0
                )
              );

            },
            0
          )

          / analyses.length

        ).toFixed(1)

      : "0.0";


  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  const filteredAnalyses =
    searchTerm.trim()

      ? analyses.filter(
          (item) => {

            const search =
              searchTerm
                .trim()
                .toLowerCase();


            const fileName =
              String(
                item.fileName || ""
              ).toLowerCase();


            const prediction =
              String(
                item.prediction || ""
              ).toLowerCase();


            const semanticDescription =
              String(
                item.semanticDescription ||
                ""
              ).toLowerCase();


            const newsText =
              String(
                item.newsText ||
                ""
              ).toLowerCase();


            const analysisType =
              String(
                item.analysisType ||
                ""
              ).toLowerCase();


            return (

              fileName.includes(
                search
              )

              ||

              prediction.includes(
                search
              )

              ||

              semanticDescription.includes(
                search
              )

              ||

              newsText.includes(
                search
              )

              ||

              analysisType.includes(
                search
              )

            );

          }
        )

      : [];


  // ==========================================
  // GET STORED FILE NAME
  // ==========================================

  const getStoredFileName =
    (analysis) => {

      if (
        !analysis ||
        isNewsAnalysis(
          analysis
        )
      ) {

        return null;

      }


      if (
        analysis?.imageUrl
      ) {

        return null;

      }


      if (
        analysis?.imagePath
      ) {

        const parts =
          analysis.imagePath.split(
            /[\\/]/
          );


        return parts[
          parts.length - 1
        ];

      }


      return null;

    };


  // ==========================================
  // CREATE IMAGE URL
  // ==========================================

  const getImageUrl =
    (analysis) => {

      if (
        !analysis ||
        isNewsAnalysis(
          analysis
        )
      ) {

        return null;

      }


      if (
        analysis?.imageUrl
      ) {

        return analysis.imageUrl;

      }


      const storedFileName =
        getStoredFileName(
          analysis
        );


      if (
        storedFileName
      ) {

        return (
          `http://localhost:5000/uploads/${storedFileName}`
        );

      }


      return null;

    };


  // ==========================================
  // VIEW ANALYSIS
  // ==========================================

  const handleViewAnalysis =
    (analysis) => {

      if (!analysis) {

        console.error(
          "❌ Analysis data missing"
        );

        return;

      }


      console.log(
        "👁️ Opening analysis:",
        analysis
      );


      // ==========================================
      // NEWS
      // ==========================================

      if (
        isNewsAnalysis(
          analysis
        )
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


        setShowSearchResults(
          false
        );

        setShowNotifications(
          false
        );

        setShowUserMenu(
          false
        );

        return;

      }


      // ==========================================
      // IMAGE
      // ==========================================

      const imageUrl =
        getImageUrl(
          analysis
        );


      console.log(
        "🖼️ Image URL:",
        imageUrl
      );


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


      setShowSearchResults(
        false
      );

      setShowNotifications(
        false
      );

    };


  // ==========================================
  // GLOBAL PAGE SEARCH
  // ==========================================

  const handleGlobalSearch =
    (search) => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {

        return false;

      }


      // ==========================================
      // DASHBOARD
      // ==========================================

      if (
        value === "dashboard" ||
        value === "home" ||
        value === "overview"
      ) {

        navigate(
          "/dashboard"
        );

        return true;

      }


      // ==========================================
      // ANALYZE IMAGE
      // ==========================================

      if (
        value === "upload" ||
        value === "uploads" ||
        value === "analyze" ||
        value === "analyze image" ||
        value === "image analysis"
      ) {

        navigate(
          "/upload"
        );

        return true;

      }


      // ==========================================
      // FAKE NEWS
      // ==========================================

      if (
        value === "fake news" ||
        value === "fake news detection" ||
        value === "news analysis"
      ) {

        navigate(
          "/fake-news"
        );

        return true;

      }


      // ==========================================
      // HISTORY
      // ==========================================

      if (
        value === "history" ||
        value === "analysis history"
      ) {

        navigate(
          "/history"
        );

        return true;

      }


      // ==========================================
      // THREAT FEED
      // ==========================================

      if (
        value === "threat" ||
        value === "threat feed" ||
        value === "threats"
      ) {

        navigate(
          "/threat-feed"
        );

        return true;

      }


      // ==========================================
      // SETTINGS
      // ==========================================

      if (
        value === "settings" ||
        value === "setting" ||
        value === "profile"
      ) {

        navigate(
          "/settings"
        );

        return true;

      }


      return false;

    };


  // ==========================================
  // SEARCH INPUT
  // ==========================================

  const handleSearchChange =
    (e) => {

      const value =
        e.target.value;


      setSearchTerm(
        value
      );


      setShowSearchResults(
        value.trim().length > 0
      );

    };


  // ==========================================
  // SEARCH KEYBOARD
  // ==========================================

  const handleSearchKeyDown =
    (e) => {

      if (
        e.key !== "Enter"
      ) {

        return;

      }


      const search =
        searchTerm.trim();


      if (!search) {

        return;

      }


      const isPageSearch =
        handleGlobalSearch(
          search
        );


      if (isPageSearch) {

        setShowSearchResults(
          false
        );

        setSearchTerm("");

        setShowNotifications(
          false
        );

        setShowUserMenu(
          false
        );

        return;

      }


      // ==========================================
      // EXACTLY ONE MATCH
      // ==========================================

      if (
        filteredAnalyses.length === 1
      ) {

        handleViewAnalysis(
          filteredAnalyses[0]
        );

        return;

      }


      // ==========================================
      // MULTIPLE MATCHES
      // ==========================================

      if (
        filteredAnalyses.length > 1
      ) {

        setShowSearchResults(
          true
        );

        return;

      }


      setShowSearchResults(
        true
      );

    };


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch =
    () => {

      setSearchTerm("");

      setShowSearchResults(
        false
      );

    };


  // ==========================================
  // UPLOAD
  // ==========================================

  const handleUpload =
    () => {

      navigate(
        "/upload"
      );

    };


  // ==========================================
  // NOTIFICATION COUNT
  // ==========================================

  const notificationCount =
    Math.min(
      analyses.length,
      9
    );


  // ==========================================
  // RECENT NOTIFICATIONS
  // ==========================================

  const recentNotifications =
    analyses.slice(
      0,
      5
    );


  // ==========================================
  // TOGGLE NOTIFICATIONS
  // ==========================================

  const handleNotificationClick =
    () => {

      setShowNotifications(
        !showNotifications
      );

      setShowUserMenu(
        false
      );

      setShowSearchResults(
        false
      );

    };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate =
    (date) => {

      if (!date) {

        return "Unknown date";

      }


      try {

        return new Date(
          date
        ).toLocaleString();

      } catch {

        return "Unknown date";

      }

    };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/"
      );

    };


  // ==========================================
  // PAGE DEFINITIONS
  // ==========================================

  const pageDefinitions = [

    {
      keywords: [
        "dashboard",
        "home",
        "overview",
      ],

      title:
        "Dashboard",

      description:
        "Open Dashboard Overview",

      icon:
        LayoutDashboard,

      path:
        "/dashboard",

    },

    {
      keywords: [
        "upload",
        "uploads",
        "analyze",
        "analyze image",
        "image analysis",
      ],

      title:
        "Analyze Image",

      description:
        "Upload and analyze a new image",

      icon:
        Image,

      path:
        "/upload",

    },

    {
      keywords: [
        "fake news",
        "fake news detection",
        "news analysis",
      ],

      title:
        "Fake News",

      description:
        "Analyze news articles and claims",

      icon:
        Newspaper,

      path:
        "/fake-news",

    },

    {
      keywords: [
        "history",
        "analysis history",
      ],

      title:
        "History",

      description:
        "View previous analyses",

      icon:
        History,

      path:
        "/history",

    },

    {
      keywords: [
        "threat",
        "threat feed",
        "threats",
      ],

      title:
        "Threat Feed",

      description:
        "View the latest threat information",

      icon:
        Shield,

      path:
        "/threat-feed",

    },

    {
      keywords: [
        "settings",
        "setting",
        "profile",
      ],

      title:
        "Settings",

      description:
        "Manage your account settings",

      icon:
        Settings,

      path:
        "/settings",

    },

  ];


  // ==========================================
  // MATCHED PAGES
  // ==========================================

  const matchedPages =
    pageDefinitions.filter(
      (page) => {

        const search =
          searchTerm
            .trim()
            .toLowerCase();


        return page.keywords.some(
          (keyword) =>
            keyword.includes(
              search
            ) ||
            search.includes(
              keyword
            )
        );

      }
    );


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      <main
        className="
          flex-1
          min-w-0
        "
      >


        {/* ========================================== */}
        {/* TOP NAVBAR */}
        {/* ========================================== */}

        <div
          className="
            relative
            z-[200]
            flex
            justify-between
            items-center
            p-6
            border-b
            border-slate-800
            backdrop-blur-xl
          "
        >


          {/* ========================================== */}
          {/* SEARCH */}
          {/* ========================================== */}

          <div
            className="
              relative
              z-[300]
            "
          >

            <div
              className="
                flex
                items-center
                bg-slate-900/70
                backdrop-blur-xl
                border
                border-slate-700
                rounded-2xl
                px-5
                py-3
                w-[460px]
                hover:border-emerald-500/50
                focus-within:border-emerald-500
                transition-all
                duration-300
              "
            >

              <Search
                className="
                  text-gray-400
                  mr-3
                  flex-shrink-0
                "
                size={20}
              />


              <input

                value={
                  searchTerm
                }

                onChange={
                  handleSearchChange
                }

                onKeyDown={
                  handleSearchKeyDown
                }

                onFocus={() => {

                  if (
                    searchTerm.trim()
                  ) {

                    setShowSearchResults(
                      true
                    );

                  }

                }}

                placeholder="
                  Search analyses, pages, news, or image names...
                "

                className="
                  bg-transparent
                  outline-none
                  text-white
                  w-full
                  placeholder:text-gray-500
                "

              />


              {searchTerm && (

                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  className="
                    text-gray-500
                    hover:text-white
                    transition
                  "
                >

                  <X
                    size={18}
                  />

                </button>

              )}

            </div>


            {/* ========================================== */}
            {/* SEARCH DROPDOWN */}
            {/* ========================================== */}

            {showSearchResults && (

              <div
                className="
                  absolute
                  left-0
                  top-full
                  mt-3
                  w-[460px]
                  bg-slate-900
                  border
                  border-slate-700
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-[9999]
                "
              >


                {/* ========================================== */}
                {/* PAGES */}
                {/* ========================================== */}

                {matchedPages.length > 0 && (

                  <div>

                    <div
                      className="
                        px-4
                        py-3
                        border-b
                        border-slate-800
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >

                      Pages

                    </div>


                    {matchedPages.map(
                      (page) => {

                        const PageIcon =
                          page.icon;


                        return (

                          <button
                            key={
                              page.path
                            }
                            type="button"
                            onClick={() => {

                              navigate(
                                page.path
                              );

                              setSearchTerm(
                                ""
                              );

                              setShowSearchResults(
                                false
                              );

                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              hover:bg-slate-800
                              transition
                              border-b
                              border-slate-800
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-lg
                                  bg-emerald-500/10
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                <PageIcon
                                  size={19}
                                  className="
                                    text-emerald-400
                                  "
                                />

                              </div>


                              <div>

                                <p
                                  className="
                                    text-white
                                    font-semibold
                                  "
                                >

                                  {page.title}

                                </p>


                                <p
                                  className="
                                    text-gray-500
                                    text-xs
                                    mt-1
                                  "
                                >

                                  {page.description}

                                </p>

                              </div>

                            </div>

                          </button>

                        );

                      }
                    )}

                  </div>

                )}


                {/* ========================================== */}
                {/* ANALYSIS RESULTS */}
                {/* ========================================== */}

                {filteredAnalyses.length > 0 && (

                  <div>

                    <div
                      className="
                        px-4
                        py-3
                        border-b
                        border-slate-800
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >

                      Analyses

                    </div>


                    {filteredAnalyses
                      .slice(0, 8)
                      .map(
                        (analysis) => {

                          const news =
                            isNewsAnalysis(
                              analysis
                            );


                          return (

                            <button
                              key={
                                analysis._id
                              }
                              type="button"
                              onClick={() =>
                                handleViewAnalysis(
                                  analysis
                                )
                              }
                              className="
                                w-full
                                text-left
                                px-4
                                py-4
                                hover:bg-slate-800
                                transition
                                border-b
                                border-slate-800
                                last:border-b-0
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-3
                                "
                              >

                                <div
                                  className="
                                    w-10
                                    h-10
                                    rounded-lg
                                    bg-slate-800
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                  "
                                >

                                  {news ? (

                                    <Newspaper
                                      size={18}
                                      className="
                                        text-purple-400
                                      "
                                    />

                                  ) : (

                                    <Image
                                      size={18}
                                      className="
                                        text-cyan-400
                                      "
                                    />

                                  )}

                                </div>


                                <div
                                  className="
                                    min-w-0
                                    flex-1
                                  "
                                >

                                  <p
                                    className="
                                      text-white
                                      font-semibold
                                      truncate
                                    "
                                  >

                                    {news

                                      ? "Fake News Analysis"

                                      : analysis.fileName ||
                                        "Unknown Image"}

                                  </p>


                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-3
                                      mt-1
                                    "
                                  >

                                    <span
                                      className="
                                        text-xs
                                        text-gray-500
                                      "
                                    >

                                      {news
                                        ? "NEWS"
                                        : "IMAGE"}

                                    </span>


                                    <span
                                      className={`
                                        text-xs
                                        font-semibold
                                        ${
                                          String(
                                            analysis.prediction ||
                                            ""
                                          ).toUpperCase() ===
                                          "REAL"

                                            ? "text-emerald-400"

                                            : "text-red-400"
                                        }
                                      `}
                                    >

                                      {analysis.prediction ||
                                        "UNKNOWN"}

                                    </span>


                                    <span
                                      className="
                                        text-xs
                                        text-gray-500
                                      "
                                    >

                                      {Number(
                                        analysis.confidence ||
                                        0
                                      ).toFixed(2)}
                                      %

                                    </span>

                                  </div>

                                </div>

                              </div>

                            </button>

                          );

                        }
                      )}

                  </div>

                )}


                {/* ========================================== */}
                {/* NO RESULTS */}
                {/* ========================================== */}

                {filteredAnalyses.length === 0 &&
                  matchedPages.length === 0 && (

                    <div
                      className="
                        px-5
                        py-8
                        text-center
                      "
                    >

                      <Search
                        size={30}
                        className="
                          mx-auto
                          text-gray-600
                          mb-3
                        "
                      />


                      <p
                        className="
                          text-gray-300
                        "
                      >

                        No results found

                      </p>


                      <p
                        className="
                          text-gray-500
                          text-sm
                          mt-1
                      "
                      >

                        Try an image name, news text,
                        prediction, or page name.

                      </p>

                    </div>

                  )}

              </div>

            )}

          </div>


          {/* ========================================== */}
          {/* RIGHT SIDE */}
          {/* ========================================== */}

          <div
            className="
              flex
              items-center
              gap-6
            "
          >


            {/* ========================================== */}
            {/* NOTIFICATIONS */}
            {/* ========================================== */}

            <div
              className="
                relative
                z-[400]
              "
            >

              <button
                type="button"
                onClick={
                  handleNotificationClick
                }
                title="Notifications"
                className="
                  relative
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-800
                  transition
                "
              >

                <Bell
                  className="
                    text-white
                  "
                  size={24}
                />


                {notificationCount > 0 && (

                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      bg-red-500
                      text-white
                      text-[10px]
                      rounded-full
                      min-w-5
                      h-5
                      px-1
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >

                    {notificationCount}

                  </span>

                )}

              </button>


              {/* ========================================== */}
              {/* NOTIFICATION PANEL */}
              {/* ========================================== */}

              {showNotifications && (

                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-96
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                    z-[9999]
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      px-5
                      py-4
                      border-b
                      border-slate-800
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-white
                          font-bold
                        "
                      >

                        Notifications

                      </h3>


                      <p
                        className="
                          text-gray-500
                          text-xs
                          mt-1
                        "
                      >

                        Recent analysis activity

                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setShowNotifications(
                          false
                        )
                      }
                      className="
                        text-gray-500
                        hover:text-white
                      "
                    >

                      <X
                        size={18}
                      />

                    </button>

                  </div>


                  {recentNotifications.length > 0 ? (

                    <div
                      className="
                        max-h-96
                        overflow-y-auto
                      "
                    >

                      {recentNotifications.map(
                        (analysis) => {

                          const news =
                            isNewsAnalysis(
                              analysis
                            );


                          return (

                            <button
                              key={
                                analysis._id
                              }
                              type="button"
                              onClick={() =>
                                handleViewAnalysis(
                                  analysis
                                )
                              }
                              className="
                                w-full
                                text-left
                                px-5
                                py-4
                                hover:bg-slate-800
                                transition
                                border-b
                                border-slate-800
                                last:border-b-0
                              "
                            >

                              <div
                                className="
                                  flex
                                  gap-3
                                "
                              >

                                <div
                                  className={`
                                    w-10
                                    h-10
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                    ${
                                      analysis.prediction ===
                                      "FAKE"

                                        ? "bg-red-500/20"

                                        : "bg-emerald-500/20"
                                    }
                                  `}
                                >

                                  {news ? (

                                    <Newspaper
                                      size={18}
                                      className="
                                        text-purple-400
                                      "
                                    />

                                  ) : analysis.prediction ===
                                    "FAKE" ? (

                                    <Shield
                                      size={18}
                                      className="
                                        text-red-400
                                      "
                                    />

                                  ) : (

                                    <CheckCircle
                                      size={18}
                                      className="
                                        text-emerald-400
                                      "
                                    />

                                  )}

                                </div>


                                <div
                                  className="
                                    min-w-0
                                  "
                                >

                                  <p
                                    className="
                                      text-white
                                      font-semibold
                                    "
                                  >

                                    {news
                                      ? "Fake News analysis completed"
                                      : "Image analysis completed"}

                                  </p>


                                  <p
                                    className="
                                      text-gray-400
                                      text-sm
                                      truncate
                                      mt-1
                                    "
                                  >

                                    {news

                                      ? (
                                          analysis.newsText
                                            ? analysis.newsText
                                            : "News article analyzed"
                                        )

                                      : (
                                          analysis.fileName ||
                                          "Unknown Image"
                                        )}

                                  </p>


                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-2
                                      mt-2
                                    "
                                  >

                                    <span
                                      className="
                                        text-xs
                                        text-gray-500
                                      "
                                    >

                                      {news
                                        ? "NEWS"
                                        : "IMAGE"}

                                    </span>


                                    <span
                                      className="
                                        text-gray-600
                                      "
                                    >

                                      •

                                    </span>


                                    <span
                                      className={`
                                        text-xs
                                        font-semibold
                                        ${
                                          analysis.prediction ===
                                          "FAKE"

                                            ? "text-red-400"

                                            : "text-emerald-400"
                                        }
                                      `}
                                    >

                                      {analysis.prediction ||
                                        "UNKNOWN"}

                                    </span>


                                    <span
                                      className="
                                        text-gray-600
                                      "
                                    >

                                      •

                                    </span>


                                    <span
                                      className="
                                        text-gray-500
                                        text-xs
                                      "
                                    >

                                      {formatDate(
                                        analysis.createdAt
                                      )}

                                    </span>

                                  </div>

                                </div>

                              </div>

                            </button>

                          );

                        }
                      )}

                    </div>

                  ) : (

                    <div
                      className="
                        px-5
                        py-10
                        text-center
                      "
                    >

                      <Bell
                        size={30}
                        className="
                          mx-auto
                          text-gray-600
                          mb-3
                        "
                      />


                      <p
                        className="
                          text-gray-400
                        "
                      >

                        No notifications yet

                      </p>

                    </div>

                  )}


                  {recentNotifications.length > 0 && (

                    <button
                      type="button"
                      onClick={() => {

                        setShowNotifications(
                          false
                        );

                        navigate(
                          "/history"
                        );

                      }}
                      className="
                        w-full
                        px-5
                        py-3
                        text-center
                        text-emerald-400
                        hover:bg-slate-800
                        transition
                        text-sm
                        font-semibold
                      "
                    >

                      View All Analysis History

                    </button>

                  )}

                </div>

              )}

            </div>


            {/* ========================================== */}
            {/* UPLOAD BUTTON */}
            {/* ========================================== */}

            <button
              onClick={
                handleUpload
              }
              className="
                bg-emerald-500
                hover:bg-emerald-600
                hover:-translate-y-1
                hover:shadow-emerald-500/40
                shadow-lg
                shadow-emerald-500/20
                transition-all
                duration-300
                text-white
                px-6
                py-3
                rounded-xl
                flex
                items-center
                gap-2
                font-semibold
              "
            >

              <Upload
                size={18}
              />

              Upload New Image

            </button>


            {/* ========================================== */}
            {/* USER AREA */}
            {/* ========================================== */}

            <div
              className="
                relative
                z-[400]
              "
            >

              <button
                onClick={() => {

                  setShowUserMenu(
                    !showUserMenu
                  );

                  setShowNotifications(
                    false
                  );

                  setShowSearchResults(
                    false
                  );

                }}
                className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                  hover:bg-slate-800
                  px-3
                  py-2
                  rounded-xl
                  transition
                "
              >

                <div
                  className="
                    relative
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-full
                      bg-gradient-to-br
                      from-emerald-400
                      to-emerald-600
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-black
                      text-lg
                      shadow-lg
                      shadow-emerald-500/30
                    "
                  >

                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() ||
                      "U"}

                  </div>


                  <span
                    className="
                      absolute
                      bottom-1
                      right-1
                      w-3
                      h-3
                      bg-green-500
                      rounded-full
                      border-2
                      border-slate-900
                    "
                  />

                </div>


                <div
                  className="
                    text-left
                  "
                >

                  <h3
                    className="
                      text-white
                      font-semibold
                    "
                  >

                    {user?.name ||
                      "User"}

                  </h3>


                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >

                    User

                  </p>

                </div>


                <ChevronDown
                  size={18}
                  className={`
                    text-gray-400
                    transition-transform
                    duration-200
                    ${
                      showUserMenu
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>


              {/* ========================================== */}
              {/* USER DROPDOWN */}
              {/* ========================================== */}

              {showUserMenu && (

                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-56
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-xl
                    shadow-2xl
                    overflow-hidden
                    z-[9999]
                  "
                >

                  <button
                    onClick={() => {

                      setShowUserMenu(
                        false
                      );

                      navigate(
                        "/settings"
                      );

                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-gray-300
                      hover:bg-slate-800
                      hover:text-white
                      transition
                    "
                  >

                    <User
                      size={18}
                    />

                    <span>
                      Profile
                    </span>

                  </button>


                  <button
                    onClick={() => {

                      setShowUserMenu(
                        false
                      );

                      navigate(
                        "/settings"
                      );

                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-gray-300
                      hover:bg-slate-800
                      hover:text-white
                      transition
                    "
                  >

                    <Settings
                      size={18}
                    />

                    <span>
                      Settings
                    </span>

                  </button>


                  <div
                    className="
                      border-t
                      border-slate-800
                    "
                  />


                  <button
                    onClick={
                      handleLogout
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-red-400
                      hover:bg-red-500/10
                      transition
                    "
                  >

                    <LogOut
                      size={18}
                    />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* DASHBOARD CONTENT */}
        {/* ========================================== */}

        <div
          className="
            p-8
          "
        >

          <h1
            className="
              text-3xl
              font-bold
              text-white
              mb-8
            "
          >

            Dashboard Overview

          </h1>


          {/* ========================================== */}
          {/* MAIN STATISTICS */}
          {/* ========================================== */}

          <div
            className="
              grid
              grid-cols-4
              gap-6
            "
          >

            <AnimatedStatCard

              title="Total Analyses"

              value={
                loading
                  ? "..."
                  : totalAnalyses
              }

              color="text-cyan-400"

              subtitle="Image + Fake News"

              icon={
                <BarChart3
                  size={28}
                />
              }

            />


            <AnimatedStatCard

              title="Image Analyses"

              value={
                loading
                  ? "..."
                  : totalImageAnalyses
              }

              color="text-blue-400"

              subtitle="Deepfake checks"

              icon={
                <Image
                  size={28}
                />
              }

            />


            <AnimatedStatCard

              title="Fake News"

              value={
                loading
                  ? "..."
                  : totalNewsAnalyses
              }

              color="text-purple-400"

              subtitle="News analyses"

              icon={
                <Newspaper
                  size={28}
                />
              }

            />


            <AnimatedStatCard

              title="Average Confidence"

              value={
                loading
                  ? "..."
                  : `${averageConfidence}%`
              }

              color="text-yellow-400"

              subtitle="Across all analyses"

              icon={
                <BarChart3
                  size={28}
                />
              }

            />

          </div>


          {/* ========================================== */}
          {/* DETECTION STATISTICS */}
          {/* ========================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-6
              mt-6
            "
          >

            <AnimatedStatCard

              title="Fake Detected"

              value={
                loading
                  ? "..."
                  : fakeDetections
              }

              color="text-red-400"

              subtitle="Image + News"

              icon={
                <Shield
                  size={28}
                />
              }

            />


            <AnimatedStatCard

              title="Real Detected"

              value={
                loading
                  ? "..."
                  : realDetections
              }

              color="text-emerald-400"

              subtitle="Image + News"

              icon={
                <CheckCircle
                  size={28}
                />
              }

            />

          </div>


          {/* ========================================== */}
          {/* DETECTION ACTIVITY */}
          {/* ========================================== */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              mt-8
            "
          >

            <div
              className="
                col-span-2
              "
            >

              <SectionCard
                title="Detection Activity"
              >

                <div
                  className="
                    bg-slate-950
                    rounded-lg
                    border
                    border-slate-800
                    p-6
                  "
                >

                  <DetectionChart />

                </div>

              </SectionCard>

            </div>


            <AIStatus />

          </div>


          {/* ========================================== */}
          {/* DETECTION SUMMARY + LIVE FEED + RECENT */}
          {/* ========================================== */}
          {/* Keep the left column independent from the
              taller threat-feed column. This removes the
              large empty space below Detection Summary. */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
              mt-8
              items-start
            "
          >

            {/* ========================================== */}
            {/* LEFT COLUMN */}
            {/* ========================================== */}

            <div
              className="
                lg:col-span-2
                min-w-0
                space-y-6
              "
            >

              <DetectionSummary />

              <RecentActivity />

            </div>


            {/* ========================================== */}
            {/* RIGHT COLUMN */}
            {/* ========================================== */}

            <div
              className="
                lg:col-span-1
                min-w-0
                self-start
              "
            >

              <LiveThreatFeed />

            </div>

          </div>

        </div>

      </main>

    </DashboardLayout>

  );

}


export default Dashboard;