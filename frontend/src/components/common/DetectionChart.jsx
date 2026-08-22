import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";

function DetectionChart() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // GET CURRENT USER ANALYSIS HISTORY
  // ==========================================

  useEffect(() => {

    const fetchAnalyses = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          setLoading(false);

          return;

        }


        const response = await fetch(
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


        if (response.status === 401) {

          setData([]);

          return;

        }


        const result =
          await response.json();


        console.log(
          "📊 Chart Data:",
          result
        );


        if (result.success) {

          const analyses =
            result.analyses || [];


          // ==========================================
          // CREATE LAST 7 DAYS
          // ==========================================

          const today =
            new Date();

          const lastSevenDays = [];


          for (
            let i = 6;
            i >= 0;
            i--
          ) {

            const date =
              new Date(today);

            date.setDate(
              today.getDate() - i
            );

            date.setHours(
              0,
              0,
              0,
              0
            );


            const nextDate =
              new Date(date);

            nextDate.setDate(
              date.getDate() + 1
            );


            // Count analyses for this day

            const count =
              analyses.filter(
                (item) => {

                  const createdDate =
                    new Date(
                      item.createdAt
                    );

                  return (
                    createdDate >= date &&
                    createdDate < nextDate
                  );

                }
              ).length;


            lastSevenDays.push({

              day:
                date.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                  }
                ),

              scans: count,

            });

          }


          setData(
            lastSevenDays
          );

        }

      } catch (error) {

        console.error(
          "❌ Detection Chart Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchAnalyses();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="w-full h-96 flex items-center justify-center">

        <p className="text-gray-400">
          Loading detection activity...
        </p>

      </div>

    );

  }


  // ==========================================
  // CHART
  // ==========================================

  return (

    <div className="w-full h-96">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart data={data}>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="day"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
          />

          <Line
            type="monotone"
            dataKey="scans"
            stroke="#10B981"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default DetectionChart;