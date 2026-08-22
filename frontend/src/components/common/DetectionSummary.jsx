import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  useEffect,
  useState,
} from "react";

const COLORS = [
  "#10B981",
  "#EF4444",
];


function DetectionSummary() {

  const [data, setData] = useState([
    {
      name: "Authentic",
      value: 0,
    },
    {
      name: "Deepfake",
      value: 0,
    },
  ]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // FETCH IMAGE ANALYSIS DATA
  // ==========================================

  useEffect(() => {

    const fetchDetectionData =
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
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );


          if (
            response.status === 401
          ) {

            setData([
              {
                name: "Authentic",
                value: 0,
              },
              {
                name: "Deepfake",
                value: 0,
              },
            ]);

            return;

          }


          const result =
            await response.json();


          console.log(
            "📊 Detection Summary:",
            result
          );


          if (
            result.success
          ) {

            const analyses =
              Array.isArray(
                result.analyses
              )
                ? result.analyses
                : [];


            // ==========================================
            // IMPORTANT:
            // ONLY COUNT IMAGE ANALYSES
            // ==========================================

            const imageAnalyses =
              analyses.filter(
                (item) =>
                  String(
                    item.analysisType ||
                    "IMAGE"
                  ).toUpperCase() ===
                  "IMAGE"
              );


            // ==========================================
            // AUTHENTIC IMAGES
            // ==========================================

            const authenticCount =
              imageAnalyses.filter(
                (item) =>
                  String(
                    item.prediction ||
                    ""
                  ).toUpperCase() ===
                  "REAL"
              ).length;


            // ==========================================
            // DEEPFAKES
            // ==========================================

            const deepfakeCount =
              imageAnalyses.filter(
                (item) =>
                  String(
                    item.prediction ||
                    ""
                  ).toUpperCase() ===
                  "FAKE"
              ).length;


            setData([
              {
                name: "Authentic",
                value:
                  authenticCount,
              },

              {
                name: "Deepfake",
                value:
                  deepfakeCount,
              },
            ]);

          }

        } catch (error) {

          console.error(
            "❌ Detection Summary Error:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


    fetchDetectionData();

  }, []);


  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    data[0].value +
    data[1].value;


  // ==========================================
  // PERCENTAGES
  // ==========================================

  const authenticPercentage =
    total > 0
      ? Math.round(
          (data[0].value /
            total) *
            100
        )
      : 0;


  const deepfakePercentage =
    total > 0
      ? Math.round(
          (data[1].value /
            total) *
            100
        )
      : 0;


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
          p-5
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            text-white
            mb-3
          "
        >
          Detection Summary
        </h2>


        <div
          className="
            h-40
            flex
            items-center
            justify-center
          "
        >

          <p
            className="
              text-gray-400
              text-sm
            "
          >
            Loading detection data...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // NO DATA
  // ==========================================

  if (total === 0) {

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

        <h2
          className="
            text-xl
            font-semibold
            text-white
            mb-3
          "
        >
          Detection Summary
        </h2>


        <div
          className="
            h-40
            flex
            items-center
            justify-center
          "
        >

          <p
            className="
              text-gray-500
              text-sm
            "
          >
            No image analysis data yet.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // CHART
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

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-2
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
            Detection Summary
          </h2>

          <p
            className="
              text-gray-500
              text-xs
              mt-1
            "
          >
            Image detection overview
          </p>

        </div>


        <div
          className="
            text-right
          "
        >

          <p
            className="
              text-gray-500
              text-xs
            "
          >
            Total
          </p>

          <p
            className="
              text-cyan-400
              font-bold
              text-lg
            "
          >
            {total}
          </p>

        </div>

      </div>


      {/* ========================================== */}
      {/* SMALL DONUT */}
      {/* ========================================== */}

      <div
        className="
          h-40
          w-full
        "
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              innerRadius={45}
              outerRadius={68}
              dataKey="value"
              paddingAngle={3}
              stroke="#0F172A"
              strokeWidth={2}
            >

              {data.map(
                (entry, index) => (

                  <Cell
                    key={
                      entry.name
                    }
                    fill={
                      COLORS[index]
                    }
                  />

                )
              )}

            </Pie>


            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#0F172A",

                border:
                  "1px solid #334155",

                borderRadius:
                  "8px",

                color:
                  "#FFFFFF",

                fontSize:
                  "12px",
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>


      {/* ========================================== */}
      {/* STATISTICS */}
      {/* ========================================== */}

      <div
        className="
          grid
          grid-cols-3
          gap-3
          mt-2
        "
      >

        {/* AUTHENTIC */}

        <div
          className="
            bg-slate-950
            rounded-xl
            p-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-400
              "
            />

            <span
              className="
                text-gray-400
                text-xs
              "
            >
              Authentic
            </span>

          </div>


          <p
            className="
              text-emerald-400
              text-xl
              font-bold
              mt-1
            "
          >
            {authenticPercentage}%
          </p>

        </div>


        {/* DEEPFAKE */}

        <div
          className="
            bg-slate-950
            rounded-xl
            p-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-red-400
              "
            />

            <span
              className="
                text-gray-400
                text-xs
              "
            >
              Deepfake
            </span>

          </div>


          <p
            className="
              text-red-400
              text-xl
              font-bold
              mt-1
            "
          >
            {deepfakePercentage}%
          </p>

        </div>


        {/* TOTAL */}

        <div
          className="
            bg-slate-950
            rounded-xl
            p-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-cyan-400
              "
            />

            <span
              className="
                text-gray-400
                text-xs
              "
            >
              Analyses
            </span>

          </div>


          <p
            className="
              text-cyan-400
              text-xl
              font-bold
              mt-1
            "
          >
            {total}
          </p>

        </div>

      </div>

    </div>

  );

}


export default DetectionSummary;