import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../api/uploadApi";
import { sendAnalysisNotification } from "../../utils/notifications";

function UploadBox() {

  const navigate = useNavigate();

  const fileInput = useRef(null);


  const [preview, setPreview] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [resolution, setResolution] =
    useState("");


  // =========================
  // HANDLE FILE SELECTION
  // =========================

  const handleFileChange = (e) => {

    const file =
      e.target.files[0];


    if (!file)
      return;


    // Only images

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select a valid image file."
      );

      return;
    }


    // Maximum 5 MB

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Image size must be less than 5 MB."
      );

      return;
    }


    setSelectedImage(file);


    const imagePreview =
      URL.createObjectURL(file);


    setPreview(
      imagePreview
    );


    // Get image resolution

    const img =
      new Image();


    img.onload = () => {

      setResolution(
        `${img.width} × ${img.height}`
      );

    };


    img.src =
      imagePreview;

  };


  // =========================
  // ANALYZE IMAGE
  // =========================

  const handleAnalyze =
    async () => {

      if (!selectedImage) {

        alert(
          "Please select an image first."
        );

        return;
      }


      try {

        const formData =
          new FormData();


        formData.append(
          "image",
          selectedImage
        );


        console.log(
          "📤 Sending image to backend..."
        );


        const data =
          await uploadImage(
            formData
          );


        console.log(
          "✅ AI Response:",
          data
        );


        // =========================
        // CHECK BACKEND RESPONSE
        // =========================

        if (!data.success) {

          alert(
            data.message ||
            "AI analysis failed"
          );

          return;
        }


        // ==========================================
        // SEND BROWSER NOTIFICATION
        // ==========================================

        await sendAnalysisNotification({

          fileName:
            selectedImage.name,

          prediction:
            data.prediction,

          confidence:
            data.confidence,

        });


        // =========================
        // LOG AI RESULT
        // =========================

        console.log(
          "Prediction:",
          data.prediction
        );


        console.log(
          "Confidence:",
          data.confidence
        );


        // =========================
        // LOG SEMANTIC ANALYSIS
        // =========================

        console.log(
          "Semantic Analysis:",
          data.semanticAnalysis
        );


        // =========================
        // LOG IMAGE HASH
        // =========================

        console.log(
          "🔐 Image SHA-256 Hash:",
          data.imageHash
        );


        // =========================
        // LOG BLOCKCHAIN
        // =========================

        console.log(
          "🔗 Blockchain Status:",
          data.blockchainStatus
        );


        console.log(
          "🔗 Blockchain Record ID:",
          data.blockchainRecordId
        );


        console.log(
          "🔗 Blockchain Block Index:",
          data.blockchainBlockIndex
        );


        console.log(
          "🔗 Blockchain Previous Hash:",
          data.blockchainPreviousHash
        );


        // =========================
        // LOG IMAGE INFORMATION
        // =========================

        console.log(
          "Image URL:",
          data.imageUrl
        );


        console.log(
          "Analysis ID:",
          data.analysisId
        );


        // =========================
        // GO TO LOADING PAGE
        // =========================

        navigate(
          "/loading",
          {
            state: {

              // ==========================================
              // TEMPORARY BROWSER PREVIEW
              // ==========================================

              image:
                preview,


              // ==========================================
              // ACTUAL BACKEND IMAGE
              // ==========================================

              imageUrl:
                data.imageUrl,


              // ==========================================
              // CNN AI RESULT
              // ==========================================

              prediction:
                data.prediction,

              confidence:
                data.confidence,


              // ==========================================
              // SEMANTIC ANALYSIS
              // ==========================================

              semanticAnalysis:
                data.semanticAnalysis,


              // ==========================================
              // SHA-256 IMAGE HASH
              // ==========================================

              imageHash:
                data.imageHash,


              // ==========================================
              // BLOCKCHAIN INFORMATION
              // ==========================================

              blockchainStatus:
                data.blockchainStatus,

              blockchainRecordId:
                data.blockchainRecordId,

              blockchainBlockIndex:
                data.blockchainBlockIndex,

              blockchainPreviousHash:
                data.blockchainPreviousHash,


              // ==========================================
              // MONGODB ANALYSIS ID
              // ==========================================

              analysisId:
                data.analysisId,


              // ==========================================
              // ORIGINAL FILE NAME
              // ==========================================

              fileName:
                selectedImage.name,

            },
          }
        );


      } catch (error) {

        console.log(
          "❌ Upload Error:",
          error
        );


        if (error.response) {

          alert(
            error.response.data?.message ||
            "AI Service Failed"
          );

        } else {

          alert(
            "Image Upload Failed"
          );

        }

      }

    };


  // =========================
  // DRAG OVER
  // =========================

  const handleDragOver =
    (e) => {

      e.preventDefault();

      setDragActive(
        true
      );

    };


  // =========================
  // DRAG LEAVE
  // =========================

  const handleDragLeave =
    () => {

      setDragActive(
        false
      );

    };


  // =========================
  // DROP IMAGE
  // =========================

  const handleDrop =
    (e) => {

      e.preventDefault();


      setDragActive(
        false
      );


      const file =
        e.dataTransfer.files[0];


      if (!file)
        return;


      // Only images

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please drop a valid image file."
        );

        return;
      }


      // Maximum 5 MB

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        alert(
          "Image size must be less than 5 MB."
        );

        return;
      }


      setSelectedImage(
        file
      );


      const imagePreview =
        URL.createObjectURL(
          file
        );


      setPreview(
        imagePreview
      );


      // Get resolution

      const img =
        new Image();


      img.onload = () => {

        setResolution(
          `${img.width} × ${img.height}`
        );

      };


      img.src =
        imagePreview;

    };


  // =========================
  // REMOVE IMAGE
  // =========================

  const handleRemoveImage =
    () => {

      setPreview(
        null
      );


      setSelectedImage(
        null
      );


      setResolution(
        ""
      );


      if (
        fileInput.current
      ) {

        fileInput.current.value =
          "";

      }

    };


  return (

    <div

      onDragOver={
        handleDragOver
      }

      onDragLeave={
        handleDragLeave
      }

      onDrop={
        handleDrop
      }

      className={`
        border-2
        border-dashed
        rounded-3xl
        p-14
        text-center
        backdrop-blur-xl
        bg-slate-900/70
        shadow-2xl
        transition-all
        duration-300

        ${
          dragActive
            ? "border-emerald-500 bg-slate-800 shadow-emerald-500/20 scale-[1.01]"
            : "border-slate-700 hover:border-emerald-500 hover:shadow-emerald-500/20"
        }
      `}

    >

      {/* Upload Icon */}

      <UploadCloud
        size={85}
        className="mx-auto text-emerald-400 mb-4"
      />


      {/* Heading */}

      <h2 className="text-3xl font-bold text-white mt-4">

        Drag & Drop Image

      </h2>


      <p className="text-gray-400 mt-3 text-lg">

        or click to browse from your computer

      </p>


      {/* Supported Formats */}

      <div className="flex justify-center gap-6 mt-5 text-sm">

        <span className="text-emerald-400">
          ✓ JPG
        </span>

        <span className="text-emerald-400">
          ✓ PNG
        </span>

        <span className="text-emerald-400">
          ✓ JPEG
        </span>

        <span className="text-gray-400">
          Max 5 MB
        </span>

      </div>


      {/* Hidden File Input */}

      <input

        type="file"

        accept="image/*"

        ref={fileInput}

        className="hidden"

        onChange={
          handleFileChange
        }

      />


      {/* Choose Image */}

      <button

        onClick={() =>
          fileInput.current.click()
        }

        className="
          mt-8
          px-8
          py-4
          rounded-xl
          bg-emerald-500
          hover:bg-emerald-600
          hover:-translate-y-1
          transition-all
          duration-300
          shadow-lg
          shadow-emerald-500/20
          text-white
          font-semibold
        "

      >

        Choose Image

      </button>


      {/* ========================= */}
      {/* IMAGE SELECTED */}
      {/* ========================= */}

      {preview && (

        <div className="mt-12">

          <div className="grid grid-cols-2 gap-8">


            {/* ========================= */}
            {/* IMAGE PREVIEW */}
            {/* ========================= */}

            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold text-white mb-5">

                Image Preview

              </h3>


              <img

                src={preview}

                alt="Preview"

                className="w-full h-96 object-contain rounded-xl shadow-xl"

              />

            </div>


            {/* ========================= */}
            {/* FILE INFORMATION */}
            {/* ========================= */}

            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold text-white mb-6">

                File Information

              </h3>


              {/* Resolution */}

              <div>

                <p className="text-gray-400">
                  Resolution
                </p>


                <h2 className="text-purple-400 font-semibold">

                  {resolution}

                </h2>

              </div>


              {/* ========================= */}
              {/* AI PIPELINE */}
              {/* ========================= */}

              <div className="mt-8 bg-slate-900 rounded-2xl border border-slate-700 p-6">

                <h3 className="text-2xl font-bold text-white mb-6">

                  AI Detection Pipeline

                </h3>


                <div className="space-y-5">


                  <div className="flex justify-between items-center">

                    <span className="text-white">

                      🧠 CNN Deepfake Model

                    </span>


                    <span className="text-green-400 font-semibold">

                      Ready

                    </span>

                  </div>


                  <div className="flex justify-between items-center">

                    <span className="text-white">

                      🔍 Semantic Similarity

                    </span>


                    <span className="text-green-400 font-semibold">

                      Ready

                    </span>

                  </div>


                  <div className="flex justify-between items-center">

                    <span className="text-white">

                      🔗 Blockchain Verification

                    </span>


                    <span className="text-green-400 font-semibold">

                      Ready

                    </span>

                  </div>


                  <div className="border-t border-slate-700 pt-4 flex justify-between">

                    <span className="text-gray-400">

                      System Status

                    </span>


                    <span className="text-emerald-400 font-bold">

                      Waiting for Analysis

                    </span>

                  </div>


                </div>

              </div>


              {/* File Name / Size / Format */}

              <div className="space-y-5 mt-6">


                <div>

                  <p className="text-gray-400">

                    File Name

                  </p>


                  <h2 className="text-white font-semibold">

                    {selectedImage.name}

                  </h2>

                </div>


                <div>

                  <p className="text-gray-400">

                    File Size

                  </p>


                  <h2 className="text-emerald-400 font-semibold">

                    {selectedImage.size <
                    1024 * 1024

                      ? `${(
                          selectedImage.size /
                          1024
                        ).toFixed(1)} KB`

                      : `${(
                          selectedImage.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB`}

                  </h2>

                </div>


                <div>

                  <p className="text-gray-400">

                    File Format

                  </p>


                  <h2 className="text-cyan-400 font-semibold">

                    {selectedImage.type}

                  </h2>

                </div>


                {/* Status */}

                <div>

                  <p className="text-gray-400">

                    Status

                  </p>


                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500 rounded-xl p-4">

                    <p className="text-emerald-400 font-semibold">

                      ✅ Image validation successful

                    </p>


                    <p className="text-gray-400 text-sm mt-1">

                      The uploaded image is compatible with all detection modules.

                    </p>

                  </div>


                  <h2 className="text-green-400 font-bold">

                    Ready for Analysis

                  </h2>

                </div>

              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* ANALYSIS BUTTONS */}
          {/* ========================= */}

          <div className="mt-10 bg-slate-900 border border-slate-700 rounded-2xl p-8">

            <div className="text-center mb-8">

              <h2 className="text-2xl font-bold text-white">

                🤖 Ready for AI Analysis

              </h2>


              <p className="text-gray-400 mt-3">

                Your uploaded image has passed validation and is ready for CNN,
                Semantic Analysis and Blockchain verification.

              </p>

            </div>


            <div className="flex justify-center gap-6">


              {/* Analyze */}

              <button

                onClick={
                  handleAnalyze
                }

                className="
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                  hover:scale-105
                  transition-all
                  duration-300
                  px-10
                  py-4
                  rounded-xl
                  font-bold
                  text-white
                  shadow-xl
                  shadow-emerald-500/20
                "

              >

                🚀 Analyze Image

              </button>


              {/* Remove */}

              <button

                onClick={
                  handleRemoveImage
                }

                className="
                  bg-red-500
                  hover:bg-red-600
                  hover:scale-105
                  transition-all
                  duration-300
                  px-10
                  py-4
                  rounded-xl
                  font-bold
                  text-white
                "

              >

                🗑 Remove Image

              </button>

            </div>


            {/* Tip */}

            <div className="mt-8 text-center">

              <p className="text-gray-400">

                💡 Tip: Higher-resolution images usually produce more accurate AI analysis.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default UploadBox;