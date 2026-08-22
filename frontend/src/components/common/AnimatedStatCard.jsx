import { motion } from "framer-motion";

function AnimatedStatCard({
  title,
  value,
  color,
  icon,
  subtitle,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
  scale: 1.04,
  y: -10,
  boxShadow: "0px 0px 35px rgba(16,185,129,0.25)",
}}
      transition={{ duration: 0.4 }}
      className="
bg-gradient-to-br
from-slate-900
to-slate-800
backdrop-blur-xl
border
border-slate-700/60
rounded-2xl
p-6
shadow-xl
hover:border-emerald-500/60
hover:shadow-emerald-500/30
hover:-translate-y-2
transition-all
duration-300
"
    >
      <div className="flex justify-between relative">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div>

         <p className="uppercase tracking-wider text-gray-400 text-xs font-semibold">
            {title}
          </p>

          <h2 className={`text-5xl font-extrabold mt-3 ${color}`}>
            {value}
          </h2>

          <p className="text-gray-500 text-xs mt-2">
            {subtitle}
          </p>

        </div>

        <div className="text-emerald-400">
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default AnimatedStatCard;