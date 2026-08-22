import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Image as ImageIcon,
  Newspaper,
  Eye,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

import {
  getAnalysisById,
  deleteAnalysis,
} from "../api/uploadApi";


function History() {

  const navigate = useNavigate();


  const [analyses, setAnalyses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // SEARCH
  // ==========================================

  const [searchTerm, setSearchTerm] =
    useState("");


  // ==========================================
  // FILTER
  // ==========================================

  const [filter, setFilter] =
    useState("ALL");


  // ==========================================
  // GET HISTORY
  // ==========================================

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          console.log(
            "❌ No login token found"
          );

          setLoading(false);

          return;

        }


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

          console.log(
            "❌ Unauthorized - token expired"
          );


          alert(
            "Your session has expired. Please login again."
          );


          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          window.location.href = "/";

          return;

        }


        const data =
          await response.json();


        console.log(
          "📊 History Response:",
          data
        );


        // ==========================================
        // SUCCESS
        // ==========================================

        if (data.success) {

          setAnalyses(

            Array.isArray(
              data.analyses
            )
              ? data.analyses
              : []

          );

        } else {

          console.log(
            "❌ History API Error:",
            data.message
          );

          setAnalyses([]);

        }


      } catch (error) {

        console.error(
          "❌ History Error:",
          error
        );

        setAnalyses([]);

      } finally {

        setLoading(false);

      }

    };


    fetchHistory();

  }, []);


  // ==========================================
  // VIEW ANALYSIS
  // ==========================================

  const handleView = async (id) => {

    try {

      console.log(
        "👁️ Loading analysis:",
        id
      );


      const data =
        await getAnalysisById(id);


      if (
        !data ||
        !data.success ||
        !data.analysis
      ) {

        alert(
          data?.message ||
          "Failed to load analysis"
        );

        return;

      }


      const analysis =
        data.analysis;


      // ==========================================
      // NEWS ANALYSIS
      // ==========================================

      if (
        analysis.analysisType ===
        "NEWS"
      ) {

        navigate(
          "/fake-news",
          {
            state: {
              analysis,
            },
          }
        );

        return;

      }


      // ==========================================
      // IMAGE ANALYSIS
      // ==========================================

      let imageFileName =
        "";


      if (
        analysis.imagePath
      ) {

        imageFileName =
          analysis.imagePath
            .split(/[\\/]/)
            .pop();

      }


      const imageUrl =
        imageFileName
          ? `http://localhost:5000/uploads/${imageFileName}`
          : "";


      // ==========================================
      // SEMANTIC
      // ==========================================

      const semanticDescription =
        analysis.semanticDescription ||
        "";


      // ==========================================
      // BLOCKCHAIN
      // ==========================================

      const blockchainStatus =
        analysis.blockchainStatus ||
        (
          analysis.blockchainVerified
            ? "VERIFIED"
            : "PENDING"
        );


      const blockchainBlockIndex =
        analysis.blockchainBlockIndex ??
        analysis.blockNumber ??
        analysis.blockIndex ??
        null;


      const blockchainRecordId =
        analysis.blockchainRecordId ||
        analysis.blockHash ||
        "";


      const blockchainPreviousHash =
        analysis.blockchainPreviousHash ||
        analysis.previousHash ||
        "";


      // ==========================================
      // RESULT DATA
      // ==========================================

      const resultData = {

        imageUrl:
          imageUrl,

        prediction:
          analysis.prediction,

        confidence:
          analysis.confidence,

        fileName:
          analysis.fileName,

        analysisId:
          analysis._id,

        semanticAnalysis: {

          success:
            !!semanticDescription,

          description:
            semanticDescription,

        },

        imageHash:
          analysis.imageHash ||
          "",

        blockchainStatus:
          blockchainStatus,

        blockchainRecordId:
          blockchainRecordId,

        blockchainBlockIndex:
          blockchainBlockIndex,

        blockchainPreviousHash:
          blockchainPreviousHash,

        blockchainVerified:
          analysis.blockchainVerified ||
          blockchainStatus ===
            "VERIFIED",

      };


      navigate(
        "/result",
        {
          state: resultData,
        }
      );


    } catch (error) {

      console.error(
        "❌ View Analysis Error:",
        error
      );


      alert(
        error?.response?.data?.message ||
        "Failed to load analysis"
      );

    }

  };


  // ==========================================
  // DELETE ANALYSIS
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this analysis?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const data =
        await deleteAnalysis(id);


      if (
        !data ||
        !data.success
      ) {

        alert(
          data?.message ||
          "Failed to delete analysis"
        );

        return;

      }


      setAnalyses(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== id
          )
      );


      console.log(
        "✅ Analysis removed from history"
      );


    } catch (error) {

      console.error(
        "❌ Delete Analysis Error:",
        error
      );


      alert(
        error?.response?.data?.message ||
        "Failed to delete analysis"
      );

    }

  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAnalyses =
    analyses.length;


  const authenticCount =
    analyses.filter(
      (item) =>
        item.prediction ===
        "REAL"
    ).length;


  const fakeCount =
    analyses.filter(
      (item) =>
        item.prediction ===
        "FAKE"
    ).length;


  const imageCount =
    analyses.filter(
      (item) =>
        item.analysisType !==
        "NEWS"
    ).length;


  const newsCount =
    analyses.filter(
      (item) =>
        item.analysisType ===
        "NEWS"
    ).length;


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) {

      return "Unknown";

    }


    return new Date(
      date
    ).toLocaleString();

  };


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredAnalyses =
    analyses.filter(
      (item) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();


        // IMAGE SEARCH
        const imageName =
          item.fileName ||
          "";


        // NEWS SEARCH
        const newsText =
          item.newsText ||
          "";


        const matchesSearch =
          !search ||
          imageName
            .toLowerCase()
            .includes(search) ||
          newsText
            .toLowerCase()
            .includes(search);


        // FILTER
        let matchesFilter =
          true;


        if (
          filter === "REAL"
        ) {

          matchesFilter =
            item.prediction ===
            "REAL";

        }


        if (
          filter === "FAKE"
        ) {

          matchesFilter =
            item.prediction ===
            "FAKE";

        }


        if (
          filter === "IMAGE"
        ) {

          matchesFilter =
            item.analysisType !==
            "NEWS";

        }


        if (
          filter === "NEWS"
        ) {

          matchesFilter =
            item.analysisType ===
            "NEWS";

        }


        return (
          matchesSearch &&
          matchesFilter
        );

      }
    );


  // ==========================================
  // RESULT COLOR
  // ==========================================

  const getResultStyle = (
    prediction
  ) => {

    if (
      prediction ===
      "REAL"
    ) {

      return "text-emerald-400";

    }


    if (
      prediction ===
      "FAKE"
    ) {

      return "text-red-400";

    }


    return "text-yellow-400";

  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <DashboardLayout>

      <main className="
        flex-1
        p-10
        min-h-screen
      ">


        {/* =====================================
            TITLE
        ===================================== */}

        <h1 className="
          text-4xl
          font-bold
          text-white
          mb-2
        ">

          Analysis History

        </h1>


        <p className="
          text-gray-400
          mb-8
        ">

          View your previous image and
          fake news analyses.

        </p>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="
          grid
          grid-cols-5
          gap-4
          mb-8
        ">


          {/* TOTAL */}

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
            hover:border-cyan-500
            transition
          ">

            <p className="
              text-gray-400
            ">

              Total

            </p>


            <h2 className="
              text-4xl
              font-bold
              text-cyan-400
              mt-2
            ">

              {totalAnalyses}

            </h2>

          </div>


          {/* REAL */}

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
            hover:border-emerald-500
            transition
          ">

            <p className="
              text-gray-400
            ">

              Real

            </p>


            <h2 className="
              text-4xl
              font-bold
              text-emerald-400
              mt-2
            ">

              {authenticCount}

            </h2>

          </div>


          {/* FAKE */}

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
            hover:border-red-500
            transition
          ">

            <p className="
              text-gray-400
            ">

              Fake

            </p>


            <h2 className="
              text-4xl
              font-bold
              text-red-400
              mt-2
            ">

              {fakeCount}

            </h2>

          </div>


          {/* IMAGES */}

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
            hover:border-cyan-500
            transition
          ">

            <p className="
              text-gray-400
            ">

              Images

            </p>


            <h2 className="
              text-4xl
              font-bold
              text-cyan-400
              mt-2
            ">

              {imageCount}

            </h2>

          </div>


          {/* NEWS */}

          <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
            hover:border-purple-500
            transition
          ">

            <p className="
              text-gray-400
            ">

              News

            </p>


            <h2 className="
              text-4xl
              font-bold
              text-purple-400
              mt-2
            ">

              {newsCount}

            </h2>

          </div>

        </div>


        {/* =====================================
            SEARCH
        ===================================== */}

        <input

          type="text"

          value={
            searchTerm
          }

          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }

          placeholder="
            🔍 Search by image name or news content...
          "

          className="
            w-full
            bg-slate-900
            border
            border-slate-800
            focus:border-emerald-500
            rounded-xl
            p-4
            mb-6
            outline-none
            text-white
            transition
          "

        />


        {/* =====================================
            FILTERS
        ===================================== */}

        <div className="
          flex
          gap-3
          mb-8
          flex-wrap
        ">


          {[
            {
              key: "ALL",
              label: "All",
            },

            {
              key: "IMAGE",
              label: "🖼️ Images",
            },

            {
              key: "NEWS",
              label: "📰 Fake News",
            },

            {
              key: "REAL",
              label: "Real",
            },

            {
              key: "FAKE",
              label: "Fake",
            },

          ].map(
            (item) => (

              <button

                key={
                  item.key
                }

                onClick={() =>
                  setFilter(
                    item.key
                  )
                }

                className={`
                  px-5
                  py-2
                  rounded-lg
                  transition
                  ${
                    filter ===
                    item.key
                      ? item.key ===
                        "FAKE"
                        ? "bg-red-500 text-white"
                        : "bg-emerald-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }
                `}

              >

                {item.label}

              </button>

            )
          )}

        </div>


        {/* =====================================
            TABLE HEADER
        ===================================== */}

        <div className="
          grid
          grid-cols-6
          bg-slate-900
          p-4
          rounded-t-lg
          font-semibold
          text-white
          gap-4
        ">

          <span>
            Type
          </span>

          <span>
            Content
          </span>

          <span>
            Result
          </span>

          <span>
            Confidence
          </span>

          <span>
            Date
          </span>

          <span>
            Action
          </span>

        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (

          <div className="
            bg-slate-900
            p-10
            text-center
          ">

            <p className="
              text-gray-400
            ">

              Loading analysis history...

            </p>

          </div>

        )}


        {/* =====================================
            NO RESULTS
        ===================================== */}

        {!loading &&
          filteredAnalyses.length === 0 && (

          <div className="
            bg-slate-900
            p-10
            text-center
            rounded-b-lg
          ">

            <p className="
              text-gray-400
            ">

              {searchTerm

                ? "No analyses found matching your search."

                : "No analysis history found."

              }

            </p>

          </div>

        )}


        {/* =====================================
            HISTORY
        ===================================== */}

        {!loading &&
          filteredAnalyses.length > 0 && (

          <div className="
            bg-slate-900
            rounded-b-lg
            overflow-hidden
          ">

            {filteredAnalyses.map(
              (item) => {

                const isNews =
                  item.analysisType ===
                  "NEWS";


                const title =
                  isNews
                    ? "Fake News Analysis"
                    : (
                        item.fileName ||
                        "Image Analysis"
                      );


                const preview =
                  isNews
                    ? (
                        item.newsText ||
                        "News article"
                      )
                    : (
                        item.fileName ||
                        "Uploaded image"
                      );


                const resultText =
                  item.prediction ===
                  "REAL"
                    ? "REAL"
                    : item.prediction ===
                      "FAKE"
                    ? "FAKE"
                    : "UNCERTAIN";


                return (

                  <div
                    key={
                      item._id
                    }
                    className="
                      grid
                      grid-cols-6
                      gap-4
                      items-center
                      p-4
                      border-b
                      border-slate-800
                      hover:bg-slate-800/60
                      transition
                    "
                  >


                    {/* TYPE */}

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <div className={`
                        w-10
                        h-10
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        ${
                          isNews
                            ? "bg-purple-500/15 text-purple-400"
                            : "bg-cyan-500/15 text-cyan-400"
                        }
                      `}>

                        {isNews ? (

                          <Newspaper
                            size={20}
                          />

                        ) : (

                          <ImageIcon
                            size={20}
                          />

                        )}

                      </div>


                      <span className="
                        text-sm
                        text-gray-300
                      ">

                        {isNews
                          ? "News"
                          : "Image"
                        }

                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="
                      min-w-0
                    ">

                      <p className="
                        text-white
                        font-medium
                        truncate
                      ">

                        {title}

                      </p>


                      <p className="
                        text-xs
                        text-gray-500
                        mt-1
                        truncate
                      ">

                        {preview}

                      </p>

                    </div>


                    {/* RESULT */}

                    <div className="
                      font-semibold
                    ">

                      <span className={
                        getResultStyle(
                          resultText
                        )
                      }>

                        {resultText}

                      </span>

                    </div>


                    {/* CONFIDENCE */}

                    <div className="
                      text-cyan-400
                      font-semibold
                    ">

                      {Number(
                        item.confidence ||
                        0
                      ).toFixed(2)}%

                    </div>


                    {/* DATE */}

                    <div className="
                      text-sm
                      text-gray-400
                    ">

                      {formatDate(
                        item.createdAt
                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">


                      <button

                        onClick={() =>
                          handleView(
                            item._id
                          )
                        }

                        className="
                          p-2
                          rounded-lg
                          text-cyan-400
                          hover:bg-cyan-500/10
                          transition
                        "

                        title="View"

                      >

                        <Eye
                          size={18}
                        />

                      </button>


                      <button

                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }

                        className="
                          p-2
                          rounded-lg
                          text-red-400
                          hover:bg-red-500/10
                          transition
                        "

                        title="Delete"

                      >

                        <Trash2
                          size={18}
                        />

                      </button>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </main>

    </DashboardLayout>

  );

}


export default History;