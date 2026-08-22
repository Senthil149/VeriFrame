import {
  Eye,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

function HistoryRow({
  id,
  image,
  result,
  confidence,
  date,
  onView,
  onDelete,
}) {

  // ==========================================
  // VIEW ANALYSIS
  // ==========================================

  const handleView = () => {

    if (!id) {
      console.error(
        "❌ Cannot view analysis: ID is missing"
      );
      return;
    }

    if (typeof onView !== "function") {
      console.error(
        "❌ Cannot view analysis: onView function is missing"
      );
      return;
    }

    console.log(
      "👁️ View clicked:",
      id
    );

    onView(id);
  };


  // ==========================================
  // DELETE ANALYSIS
  // ==========================================

  const handleDelete = () => {

    if (!id) {
      console.error(
        "❌ Cannot delete analysis: ID is missing"
      );
      return;
    }

    if (typeof onDelete !== "function") {
      console.error(
        "❌ Cannot delete analysis: onDelete function is missing"
      );
      return;
    }

    console.log(
      "🗑️ Delete clicked:",
      id
    );

    onDelete(id);
  };


  return (

    <div
      className="
        grid
        grid-cols-5
        items-center
        p-4
        border-t
        border-slate-800
        hover:bg-slate-800/40
        transition
      "
    >

      {/* ===================================== */}
      {/* IMAGE / FILE */}
      {/* ===================================== */}

      <div className="flex items-center gap-3 min-w-0">

        <div
          className="
            w-14
            h-14
            rounded-lg
            bg-slate-800
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >

          <ImageIcon
            size={24}
            className="text-emerald-400"
          />

        </div>


        <span
          className="
            text-white
            font-semibold
            truncate
            max-w-[180px]
          "
          title={image || "Unknown Image"}
        >

          {image || "Unknown Image"}

        </span>

      </div>


      {/* ===================================== */}
      {/* RESULT */}
      {/* ===================================== */}

      <div>

        <span
          className={`
            inline-flex
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
            ${
              result === "Authentic"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >

          {result || "Unknown"}

        </span>

      </div>


      {/* ===================================== */}
      {/* CONFIDENCE */}
      {/* ===================================== */}

      <div>

        <span className="text-cyan-400 font-semibold">

          {confidence || "0.00%"}

        </span>

      </div>


      {/* ===================================== */}
      {/* DATE */}
      {/* ===================================== */}

      <div>

        <span className="text-gray-400">

          {date || "Unknown"}

        </span>

      </div>


      {/* ===================================== */}
      {/* ACTIONS */}
      {/* ===================================== */}

      <div className="flex items-center gap-3">


        {/* ===================================== */}
        {/* VIEW BUTTON */}
        {/* ===================================== */}

        <button
          type="button"
          onClick={handleView}
          title="View Analysis"
          aria-label={`View analysis ${image || ""}`}
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-emerald-500
            text-gray-300
            hover:text-white
            flex
            items-center
            justify-center
            transition-all
            duration-200
            cursor-pointer
          "
        >

          <Eye size={20} />

        </button>


        {/* ===================================== */}
        {/* DELETE BUTTON */}
        {/* ===================================== */}

        <button
          type="button"
          onClick={handleDelete}
          title="Delete Analysis"
          aria-label={`Delete analysis ${image || ""}`}
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-red-500
            text-gray-300
            hover:text-white
            flex
            items-center
            justify-center
            transition-all
            duration-200
            cursor-pointer
          "
        >

          <Trash2 size={20} />

        </button>

      </div>

    </div>

  );
}

export default HistoryRow;