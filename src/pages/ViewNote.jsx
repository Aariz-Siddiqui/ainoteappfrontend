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
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">
          🔐 View Private Note
        </h1>

        {!note && (
          <>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800"
            />

            <button
              onClick={unlockNote}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-slate-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Unlocking..." : "Unlock Note"}
            </button>

            {error && (
              <p className="text-red-500 mt-4 text-center text-sm">
                {error}
              </p>
            )}
          </>
        )}

        {note && (
          <>
            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl whitespace-pre-wrap mb-4 text-slate-800">
              {note}
            </div>

            <button
              onClick={summarizeNote}
              disabled={summaryLoading}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                summaryLoading
                  ? "bg-slate-400 cursor-not-allowed text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {summaryLoading
                ? "Generating Summary..."
                : "Generate AI Summary"}
            </button>

            {summary && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <strong className="block mb-2 text-slate-800">
                  AI Summary:
                </strong>
                <div className="text-slate-700 whitespace-pre-wrap">
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