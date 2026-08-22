import { ShieldCheck, BadgeCheck, FileText } from "lucide-react";

function LeftHero() {
  return (
    <div className="w-1/2 flex flex-col justify-center px-16">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
          <ShieldCheck className="text-white" size={28} />
        </div>

        <h2 className="text-3xl font-bold text-white">
          VeriFrame
        </h2>
      </div>

      {/* Badge */}
      <div className="inline-block w-fit bg-emerald-900/40 border border-emerald-600 text-emerald-400 px-4 py-2 rounded-full mb-8">
        AI Content Forensics
      </div>

      {/* Heading */}
      <h1 className="text-6xl font-bold text-white leading-tight">
        Verify what's real in the age of AI.
      </h1>

      {/* Description */}
      <p className="text-gray-400 text-xl mt-8 leading-9">
        VeriFrame analyzes images for signs of manipulation and AI generation,
        giving you a clear authenticity verdict.
      </p>

      {/* Features */}
      <div className="mt-12 space-y-6">

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <ShieldCheck className="text-emerald-400" size={24} />
          </div>

          <div>
            <h3 className="text-white font-semibold">
              Deepfake Detection
            </h3>

            <p className="text-gray-500">
              Neural forensics detect manipulated media.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <BadgeCheck className="text-emerald-400" size={24} />
          </div>

          <div>
            <h3 className="text-white font-semibold">
              Authenticity Score
            </h3>

            <p className="text-gray-500">
              Every upload receives a trust score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <FileText className="text-emerald-400" size={24} />
          </div>

          <div>
            <h3 className="text-white font-semibold">
              Audit Reports
            </h3>

            <p className="text-gray-500">
              Export detailed forensic reports.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LeftHero;