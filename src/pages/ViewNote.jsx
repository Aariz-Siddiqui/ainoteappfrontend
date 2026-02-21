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
        alert(data.error || "Failed to summarize");
        return;
      }

      setSummary(data.summary);
    } catch (err) {
      alert("Server error");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          View Private Note
        </h1>

        {!note && (
          <>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={unlockNote}
              disabled={loading}
              className={`w-full py-2 rounded text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Unlocking..." : "Unlock Note"}
            </button>

            {error && (
              <p className="text-red-500 mt-3 text-center">{error}</p>
            )}
          </>
        )}

        {note && (
          <>
            <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {note}
            </div>

            <button
              onClick={summarizeNote}
              disabled={summaryLoading}
              className={`mt-4 w-full py-2 rounded text-white transition ${
                summaryLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {summaryLoading ? "Generating Summary..." : "Summarize Note"}
            </button>

            {summary && (
              <div className="mt-4 p-4 bg-yellow-100 rounded whitespace-pre-wrap">
                <strong>AI Summary:</strong>
                <div className="mt-2">{summary}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}