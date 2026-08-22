import DashboardLayout from "../components/layout/DashboardLayout";
import UploadBox from "../components/common/UploadBox";

function UploadImage() {
  return (
    <DashboardLayout>

      <div className="p-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-white">
            Analyze Image
          </h1>

          <p className="text-gray-400 mt-2">
            Upload an image to detect AI-generated or
            manipulated content using CNN, Semantic
            Analysis and Blockchain verification.
          </p>

        </div>


        {/* ==========================================
            UPLOAD BOX
        ========================================== */}

        <UploadBox />

      </div>

    </DashboardLayout>
  );
}

export default UploadImage;