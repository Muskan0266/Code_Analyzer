import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Cpu, Code } from "lucide-react";

export default function LandingPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setResult("");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/explain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            code
          ),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Backend Error");
      }

      const data = await res.json();

      setResult(data.result);

    } catch (err) {
      console.error(err);
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-cyan-400/30 mb-6 text-sm"
        >
          <Cpu size={16} className="text-cyan-400" />
          Code Intelligence Engine
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Explain Code with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            AI
          </span>
        </h1>

        <p className="text-gray-400 mb-8">
          Paste any code. Get explanation, complexity, and improvements.
        </p>

        <div className="bg-white/5 border border-cyan-400/20 rounded-3xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-2">
            <Code className="text-cyan-400" size={18} />
            <span className="text-sm text-gray-400">Code Input</span>
          </div>

          <textarea
            rows={10}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black/40 p-3 rounded-xl outline-none text-sm font-mono"
          />

          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Explain Code
            </span>
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-cyan-400 animate-pulse">
            Analyzing code...
          </p>
        )}

        {result && (
          <div className="mt-6 text-left bg-white/5 border border-white/10 p-4 rounded-xl whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}