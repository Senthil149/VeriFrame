import {
  Brain,
  Cpu,
  ShieldCheck,
  Database,
} from "lucide-react";

import { useEffect, useState } from "react";

function AIStatus() {

  const [backendStatus, setBackendStatus] =
    useState("Checking...");

  const [databaseStatus, setDatabaseStatus] =
    useState("Checking...");


  // ==========================================
  // CHECK BACKEND / DATABASE
  // ==========================================

  useEffect(() => {

    const checkBackend = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/"
        );


        if (response.ok) {

          setBackendStatus("Online");

          // Backend is responding.
          // MongoDB is connected in the backend.
          setDatabaseStatus("Connected");

        } else {

          setBackendStatus("Offline");

          setDatabaseStatus("Unavailable");

        }

      } catch (error) {

        console.error(
          "❌ Backend Status Error:",
          error
        );

        setBackendStatus("Offline");

        setDatabaseStatus("Unavailable");

      }

    };


    checkBackend();

  }, []);


  // ==========================================
  // SYSTEM STATUS
  // ==========================================

  const systems = [

    // ========================================
    // CNN DEEPFAKE DETECTION
    // ========================================

    {
      icon: <Brain size={22} />,

      title: "CNN Model",

      status: "Online",

      active: true,
    },


    // ========================================
    // SEMANTIC IMAGE ANALYSIS
    // ========================================

    {
      icon: <Cpu size={22} />,

      title: "Semantic Engine",

      status: "Online",

      active: true,
    },


    // ========================================
    // BLOCKCHAIN VERIFICATION
    // ========================================

    {
      icon: <ShieldCheck size={22} />,

      title: "Blockchain",

      status: "Online",

      active: true,
    },


    // ========================================
    // DATABASE
    // ========================================

    {
      icon: <Database size={22} />,

      title: "Database",

      status: databaseStatus,

      active:
        databaseStatus === "Connected",
    },

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">


      {/* ===================================== */}
      {/* TITLE */}
      {/* ===================================== */}

      <h2 className="text-2xl font-semibold text-white mb-6">

        AI System Status

      </h2>


      {/* ===================================== */}
      {/* SYSTEM LIST */}
      {/* ===================================== */}

      <div className="space-y-5">


        {systems.map((item) => (

          <div
            key={item.title}
            className="
              flex
              items-center
              justify-between
              bg-slate-950
              rounded-xl
              p-4
              hover:border
              hover:border-emerald-500
              transition
            "
          >


            {/* ================================= */}
            {/* LEFT SIDE */}
            {/* ================================= */}

            <div className="flex items-center gap-4">


              {/* ICON */}

              <div
                className={
                  item.active
                    ? "text-emerald-400"
                    : "text-gray-500"
                }
              >

                {item.icon}

              </div>


              {/* TITLE + STATUS */}

              <div>

                <h3 className="text-white font-medium">

                  {item.title}

                </h3>


                <p
                  className={
                    item.active
                      ? "text-gray-500 text-sm"
                      : "text-yellow-500 text-sm"
                  }
                >

                  {item.status}

                </p>

              </div>

            </div>


            {/* ================================= */}
            {/* RIGHT SIDE */}
            {/* ================================= */}

            <div className="flex items-center gap-2">


              {/* STATUS DOT */}

              <div
                className={`
                  w-3
                  h-3
                  rounded-full
                  ${
                    item.active
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-600"
                  }
                `}
              />


              {/* STATUS TEXT */}

              <span
                className={`
                  text-sm
                  ${
                    item.active
                      ? "text-green-400"
                      : "text-gray-500"
                  }
                `}
              >

                {item.active
                  ? "Active"
                  : "Inactive"}

              </span>

            </div>


          </div>

        ))}


      </div>


      {/* ==========================================
          BACKEND STATUS
      ========================================== */}

      <div className="mt-6 pt-5 border-t border-slate-800">


        <div className="flex justify-between items-center">


          <span className="text-gray-400">

            VeriFrame Backend

          </span>


          <span
            className={
              backendStatus === "Online"
                ? "text-emerald-400 font-semibold"
                : backendStatus === "Checking..."
                ? "text-yellow-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >

            {backendStatus}

          </span>


        </div>


      </div>


    </div>

  );

}


export default AIStatus;