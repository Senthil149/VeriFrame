function StatCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

export default StatCard;