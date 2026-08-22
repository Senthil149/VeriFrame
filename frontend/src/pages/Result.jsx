import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // DATA FROM UPLOAD
  // ==========================================

  const [analysisData, setAnalysisData] = useState(
    location.state || {}
  );

  const [loadingAnalysis, setLoadingAnalysis] =
    useState(false);


  // ==========================================
  // ANALYSIS ID
  // ==========================================

  const analysisId =
    location.state?.analysisId ||
    location.state?._id ||
    location.state?.id ||
    "";


  // ==========================================
  // FETCH SAVED ANALYSIS IF NEEDED
  // ==========================================

  useEffect(() => {

    const fetchAnalysis = async () => {

      if (!analysisId) {
        return;
      }

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }

        setLoadingAnalysis(true);

        const response = await fetch(
          `http://localhost:5000/api/upload/history/${analysisId}`,
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


        if (!response.ok) {

          console.log(
            "⚠️ Could not fetch saved analysis:",
            response.status
          );

          return;
        }


        const data =
          await response.json();


        console.log(
          "📄 Saved Analysis:",
          data
        );


        if (data.success) {

          const savedAnalysis =
            data.analysis ||
            data.data ||
            data.result;


          if (savedAnalysis) {

            setAnalysisData(
              (previous) => ({
                ...previous,
                ...savedAnalysis,

                // Preserve frontend image data
                image:
                  previous.image ||
                  savedAnalysis.image,

                imageUrl:
                  previous.imageUrl ||
                  savedAnalysis.imageUrl,
              })
            );

          }

        }

      } catch (error) {

        console.error(
          "❌ Result analysis fetch error:",
          error
        );

      } finally {

        setLoadingAnalysis(false);

      }

    };


    fetchAnalysis();

  }, [analysisId]);


  // ==========================================
  // DATA
  // ==========================================

  const image =
    analysisData.image;

  const imageUrl =
    analysisData.imageUrl;

  const prediction =
    analysisData.prediction;


  const confidence =
    analysisData.confidence;


  // ==========================================
  // SEMANTIC ANALYSIS
  // ==========================================

  const semanticAnalysis =
    analysisData.semanticAnalysis;


  const semanticDescription =
    analysisData.semanticDescription ||
    semanticAnalysis?.description ||
    "";


  // ==========================================
  // ANALYSIS TYPE
  // ==========================================

  const analysisType =
    String(
      analysisData.analysisType ||
      "IMAGE"
    ).toUpperCase();


  // ==========================================
  // IMAGE HASH
  // ==========================================

  const imageHash =
    analysisData.imageHash ||
    "";


  // ==========================================
  // BLOCKCHAIN DATA
  // ==========================================

  const blockchainStatus =
    String(
      analysisData.blockchainStatus ||
      ""
    ).toUpperCase();


  const blockchainRecordId =
    analysisData.blockchainRecordId ||
    "";


  const blockchainBlockIndex =
    analysisData.blockchainBlockIndex;


  const blockchainBlockHash =
    analysisData.blockchainBlockHash ||
    "";


  const blockchainPreviousHash =
    analysisData.blockchainPreviousHash ||
    "";


  const blockchainVerified =
    analysisData.blockchainVerified === true;


  // ==========================================
  // CONFIDENCE
  // ==========================================

  const confidenceValue =
    typeof confidence === "number"
      ? confidence
      : Number(
          confidence || 0
        );


  // ==========================================
  // REAL / FAKE
  // ==========================================

  const isReal =
    String(
      prediction || ""
    ).toUpperCase() === "REAL";


  const isFake =
    String(
      prediction || ""
    ).toUpperCase() === "FAKE";


  // ==========================================
  // RISK
  // ==========================================

  const risk = isReal
    ? confidenceValue >= 70
      ? "LOW"
      : "MEDIUM"
    : confidenceValue >= 70
      ? "HIGH"
      : "MEDIUM";


  // ==========================================
  // RECOMMENDATION
  // ==========================================

  const recommendation = isReal

    ? "The AI model classified this image as REAL. However, AI detection is not 100% reliable, so verify important content using additional sources."

    : isFake

      ? "The AI model classified this image as FAKE. We recommend verifying the source before trusting or sharing this image."

      : "The AI model could not determine a reliable classification. Please analyze the image again.";


  // ==========================================
  // BLOCKCHAIN VERIFIED
  // ==========================================

  const isBlockchainVerified =
    blockchainVerified ||
    blockchainStatus === "VERIFIED";


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      <main className="flex-1 p-10">


        {/* ===================================== */}
        {/* PAGE TITLE */}
        {/* ===================================== */}

        <h1 className="text-4xl font-bold text-white mb-8">

          Analysis Result

        </h1>


        {/* ===================================== */}
        {/* LOADING SAVED ANALYSIS */}
        {/* ===================================== */}

        {loadingAnalysis && (

          <div className="
            mb-6
            bg-slate-900
            border
            border-cyan-500/20
            rounded-xl
            p-4
          ">

            <p className="text-cyan-400">

              🔄 Loading saved analysis information...

            </p>

          </div>

        )}


        {/* ===================================== */}
        {/* ANALYSIS COMPLETED */}
        {/* ===================================== */}

        <div className="
          mb-8
          bg-gradient-to-r
          from-emerald-500/10
          to-cyan-500/10
          border
          border-emerald-500/30
          rounded-2xl
          p-6
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-white
              ">

                AI Analysis Completed

              </h2>


              <p className="
                text-gray-400
                mt-2
              ">

                Your uploaded image has been analyzed using the VeriFrame AI detection model.

              </p>

            </div>


            <div className="
              w-20
              h-20
              rounded-full
              bg-emerald-500/20
              flex
              items-center
              justify-center
              text-4xl
            ">

              🤖

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* MAIN GRID */}
        {/* ===================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
        ">


          {/* ===================================== */}
          {/* UPLOADED IMAGE */}
          {/* ===================================== */}

          <div className="
            bg-slate-900
            rounded-xl
            p-6
            border
            border-slate-800
          ">

            <h2 className="
              text-2xl
              font-semibold
              text-white
              mb-4
            ">

              Uploaded Image

            </h2>


            {imageUrl || image ? (

              <img
                src={
                  imageUrl ||
                  image
                }
                alt="Uploaded"
                className="
                  w-full
                  h-96
                  object-contain
                  rounded-lg
                  bg-slate-950
                "
              />

            ) : (

              <div className="
                h-96
                bg-slate-950
                rounded-lg
                flex
                items-center
                justify-center
                text-gray-500
              ">

                No Image Selected

              </div>

            )}

          </div>


          {/* ===================================== */}
          {/* PREDICTION RESULT */}
          {/* ===================================== */}

          <div className="
            bg-slate-900
            rounded-xl
            p-6
            border
            border-slate-800
          ">

            <h2 className="
              text-2xl
              font-semibold
              text-white
              mb-6
            ">

              AI Prediction

            </h2>


            <div className="space-y-6">


              {/* ================================= */}
              {/* PREDICTION */}
              {/* ================================= */}

              <div>

                <p className="
                  text-gray-400
                  mb-2
                ">

                  Prediction

                </p>


                <div
                  className={`
                    inline-flex
                    items-center
                    gap-3
                    px-5
                    py-3
                    rounded-xl
                    border

                    ${
                      isReal
                        ? "bg-emerald-500/20 border-emerald-500"
                        : isFake
                          ? "bg-red-500/20 border-red-500"
                          : "bg-yellow-500/20 border-yellow-500"
                    }
                  `}
                >

                  <span className="text-3xl">

                    {isReal
                      ? "✅"
                      : isFake
                        ? "🚨"
                        : "⚠️"}

                  </span>


                  <h1
                    className={`
                      text-4xl
                      font-bold

                      ${
                        isReal
                          ? "text-emerald-400"
                          : isFake
                            ? "text-red-400"
                            : "text-yellow-400"
                      }
                    `}
                  >

                    {prediction ||
                      "UNKNOWN"}

                  </h1>

                </div>

              </div>


              {/* ================================= */}
              {/* RISK */}
              {/* ================================= */}

              <div className="mb-8">

                <p className="text-gray-400">

                  Overall AI Risk

                </p>


                <h1
                  className={`
                    text-5xl
                    font-bold

                    ${
                      risk === "LOW"
                        ? "text-emerald-400"
                        : risk === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-red-500"
                    }
                  `}
                >

                  {risk}

                </h1>

              </div>


              {/* ================================= */}
              {/* CONFIDENCE */}
              {/* ================================= */}

              <div>

                <p className="text-gray-400">

                  Confidence Score

                </p>


                <h2
                  className={`
                    text-3xl
                    font-bold

                    ${
                      isReal
                        ? "text-emerald-400"
                        : isFake
                          ? "text-red-400"
                          : "text-cyan-400"
                    }
                  `}
                >

                  {confidenceValue.toFixed(2)}%

                </h2>


                <div className="
                  w-full
                  h-3
                  bg-slate-800
                  rounded-full
                  mt-3
                  overflow-hidden
                ">

                  <div
                    className={`
                      h-full

                      ${
                        isReal
                          ? "bg-emerald-500"
                          : isFake
                            ? "bg-red-500"
                            : "bg-cyan-500"
                      }
                    `}
                    style={{
                      width:
                        `${Math.min(
                          Math.max(
                            confidenceValue,
                            0
                          ),
                          100
                        )}%`,
                    }}
                  />

                </div>

              </div>


              {/* ================================= */}
              {/* SEMANTIC ANALYSIS */}
              {/* ================================= */}

              {analysisType === "IMAGE" && (

                <div>

                  <p className="text-gray-400">

                    Semantic Analysis

                  </p>


                  {semanticDescription ? (

                    <>

                      <h2 className="
                        text-xl
                        font-bold
                        text-cyan-400
                        mt-1
                      ">

                        Content Detected

                      </h2>


                      <div className="
                        mt-3
                        bg-slate-800
                        border
                        border-cyan-500/30
                        rounded-lg
                        p-4
                      ">

                        <p className="
                          text-gray-200
                          leading-7
                        ">

                          {semanticDescription}

                        </p>

                      </div>


                      <p className="
                        text-sm
                        text-gray-500
                        mt-2
                      ">

                        Generated using the VeriFrame image semantic analysis model.

                      </p>

                    </>

                  ) : (

                    <>

                      <h2 className="
                        text-xl
                        font-bold
                        text-gray-500
                      ">

                        Not Available

                      </h2>


                      <p className="
                        text-sm
                        text-gray-500
                        mt-1
                      ">

                        Semantic analysis could not be generated for this image.

                      </p>

                    </>

                  )}

                </div>

              )}


              {/* ================================= */}
              {/* BLOCKCHAIN VERIFICATION */}
              {/* ================================= */}

              {analysisType === "IMAGE" && (

                <div>

                  <p className="text-gray-400">

                    Blockchain Verification

                  </p>


                  {isBlockchainVerified ? (

                    <>

                      {/* VERIFIED HEADER */}

                      <div className="
                        mt-2
                        flex
                        items-center
                        gap-3
                      ">

                        <span className="text-3xl">

                          🔐

                        </span>


                        <h2 className="
                          text-xl
                          font-bold
                          text-emerald-400
                        ">

                          VERIFIED

                        </h2>

                      </div>


                      {/* BLOCKCHAIN DATA */}

                      <div className="
                        mt-4
                        bg-slate-800
                        border
                        border-emerald-500/30
                        rounded-lg
                        p-4
                        space-y-4
                      ">


                        {/* Block Number */}

                        <div>

                          <p className="
                            text-gray-500
                            text-sm
                          ">

                            Blockchain Block

                          </p>

                          <p className="
                            text-white
                            font-semibold
                          ">

                            #
                            {blockchainBlockIndex ??
                              "N/A"}

                          </p>

                        </div>


                        {/* Record ID */}

                        <div>

                          <p className="
                            text-gray-500
                            text-sm
                          ">

                            Blockchain Record ID

                          </p>

                          <p className="
                            text-purple-400
                            text-xs
                            break-all
                            mt-1
                            font-mono
                          ">

                            {blockchainRecordId ||
                              "Not Available"}

                          </p>

                        </div>


                        {/* IMAGE HASH */}

                        <div>

                          <p className="
                            text-gray-500
                            text-sm
                          ">

                            Image SHA-256 Hash

                          </p>

                          <p className="
                            text-cyan-400
                            text-xs
                            break-all
                            mt-1
                            font-mono
                          ">

                            {imageHash ||
                              "Not Available"}

                          </p>

                        </div>


                        {/* BLOCK HASH */}

                        <div>

                          <p className="
                            text-gray-500
                            text-sm
                          ">

                            Blockchain Block Hash

                          </p>

                          <p className="
                            text-purple-400
                            text-xs
                            break-all
                            mt-1
                            font-mono
                          ">

                            {blockchainBlockHash ||
                              "Not Available"}

                          </p>

                        </div>


                        {/* PREVIOUS HASH */}

                        <div>

                          <p className="
                            text-gray-500
                            text-sm
                          ">

                            Previous Block Hash

                          </p>

                          <p className="
                            text-gray-400
                            text-xs
                            break-all
                            mt-1
                            font-mono
                          ">

                            {blockchainPreviousHash ||
                              "Not Available"}

                          </p>

                        </div>

                      </div>


                      {/* VERIFICATION MESSAGES */}

                      <div className="mt-3">

                        <p className="
                          text-sm
                          text-emerald-400
                        ">

                          ✓ Image fingerprint matches the blockchain record.

                        </p>


                        <p className="
                          text-sm
                          text-emerald-400
                          mt-1
                        ">

                          ✓ Blockchain integrity verified.

                        </p>

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="
                        mt-2
                        flex
                        items-center
                        gap-3
                      ">

                        <span className="text-3xl">

                          ⚠️

                        </span>


                        <h2 className="
                          text-xl
                          font-bold
                          text-yellow-400
                        ">

                          {blockchainStatus ||
                            "NOT AVAILABLE"}

                        </h2>

                      </div>


                      <p className="
                        text-sm
                        text-gray-500
                        mt-2
                      ">

                        Blockchain verification could not be completed for this analysis.

                      </p>

                    </>

                  )}

                </div>

              )}


              {/* ================================= */}
              {/* ANALYZE ANOTHER IMAGE */}
              {/* ================================= */}

              <button
                onClick={() =>
                  navigate("/upload")
                }
                className="
                  w-full
                  mt-4
                  border
                  border-slate-700
                  hover:border-emerald-500
                  hover:bg-emerald-500/10
                  py-3
                  rounded-lg
                  text-white
                  transition
                "
              >

                Analyze Another Image

              </button>

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* AI RECOMMENDATION */}
        {/* ===================================== */}

        <div className="
          mt-8
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-4
          ">

            🤖 AI Recommendation

          </h2>


          <p className="
            text-gray-300
            leading-8
          ">

            {recommendation}

          </p>

        </div>


        {/* ===================================== */}
        {/* IMAGE INFORMATION */}
        {/* ===================================== */}

        <div className="
          mt-8
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            text-white
            mb-6
          ">

            📋 Image Information

          </h2>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          ">


            {/* Prediction */}

            <div>

              <p className="text-gray-400">

                Prediction

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                {prediction ||
                  "Not Available"}

              </h3>

            </div>


            {/* Confidence */}

            <div>

              <p className="text-gray-400">

                AI Confidence

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                {confidenceValue
                  ? `${confidenceValue.toFixed(2)}%`
                  : "Not Available"}

              </h3>

            </div>


            {/* Format */}

            <div>

              <p className="text-gray-400">

                Format

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                Image

              </h3>

            </div>


            {/* Detection Model */}

            <div>

              <p className="text-gray-400">

                Detection Model

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                MobileNetV2

              </h3>

            </div>


            {/* Semantic Description */}

            <div className="
              md:col-span-2
            ">

              <p className="text-gray-400">

                Semantic Description

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                {semanticDescription ||
                  "Not Available"}

              </h3>

            </div>


            {/* Image Hash */}

            <div className="
              md:col-span-2
            ">

              <p className="text-gray-400">

                Image SHA-256 Hash

              </p>


              <h3 className="
                text-cyan-400
                text-sm
                font-mono
                break-all
              ">

                {imageHash ||
                  "Not Available"}

              </h3>

            </div>


            {/* Blockchain Status */}

            <div>

              <p className="text-gray-400">

                Blockchain Status

              </p>


              <h3
                className={`
                  font-semibold

                  ${
                    isBlockchainVerified
                      ? "text-emerald-400"
                      : "text-yellow-400"
                  }
                `}
              >

                {blockchainStatus ||
                  "Not Available"}

              </h3>

            </div>


            {/* Block Index */}

            <div>

              <p className="text-gray-400">

                Blockchain Block

              </p>


              <h3 className="
                text-white
                font-semibold
              ">

                {blockchainBlockIndex !==
                undefined &&
                blockchainBlockIndex !==
                null

                  ? `#${blockchainBlockIndex}`

                  : "Not Available"}

              </h3>

            </div>

          </div>

        </div>


      </main>

    </DashboardLayout>

  );

}

export default Result;