import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ViewNote() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [note, setNote] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const unlockNote = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://ainoteappbackend.vercel.app/api/notes/${id}/unlock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Wrong password");
        return;
      }

      setNote(data.text);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const summarizeNote = async () => {
    setSummaryLoading(true);

    try {
      const response = await fetch(
        `https://ainoteappbackend.vercel.app/api/notes/${id}/summarize`,
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to summarize");
        return;
      }

      setSummary(data.summary);
    } catch (err) {
      setError("Server error");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          🔐 View Private Note
        </h1>

        {!note && (
          <>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"
            />

            <button
              onClick={unlockNote}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Unlocking..." : "Unlock Note"}
            </button>

            {error && (
              <p className="text-red-400 mt-4 text-center">{error}</p>
            )}
          </>
        )}

        {note && (
          <>
            <div className="p-4 bg-white/5 border border-white/20 rounded-xl whitespace-pre-wrap mb-4 text-slate-200">
              {note}
            </div>

            <button
              onClick={summarizeNote}
              disabled={summaryLoading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                summaryLoading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {summaryLoading
                ? "Generating Summary..."
                : "Generate AI Summary"}
            </button>

            {summary && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl animate-fade-in">
                <strong className="block mb-2">AI Summary:</strong>
                <div className="text-slate-300 whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}