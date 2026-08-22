function SectionCard({ title, children }) {
  return (
   <div
  className="
  bg-slate-900/70
  backdrop-blur-xl
  border border-slate-700/60
  rounded-2xl
  p-6
  shadow-xl
  hover:border-emerald-500/50
  hover:shadow-emerald-500/20
  transition-all
  duration-300
"
>
      <h2 className="text-xl font-semibold text-white mb-5">
        {title}
      </h2>

      {children}
    </div>
  );
}

export default SectionCard;