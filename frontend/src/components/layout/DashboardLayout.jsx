import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#060B1F] relative">

      {/* ========================================== */}
      {/* BACKGROUND GLOW */}
      {/* ========================================== */}

      <div
        className="
          absolute
          -top-40
          -left-40
          w-96
          h-96
          bg-emerald-500/10
          rounded-full
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]
          bg-cyan-500/5
          rounded-full
          blur-[150px]
          pointer-events-none
        "
      />

      {/* ========================================== */}
      {/* SIDEBAR */}
      {/* ========================================== */}

      <div className="relative z-30 flex-shrink-0">
        <Sidebar />
      </div>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}

      <motion.div
        className="
          flex-1
          min-w-0
          relative
          z-10
        "
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        {children}
      </motion.div>

    </div>
  );
}

export default DashboardLayout;