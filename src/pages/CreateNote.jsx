import { useState } from "react";

export default function CreateNote() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://ainoteappbackend.vercel.app/api/notes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setText("");
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = result
    ? `${window.location.origin}/note/${result.id}`
    : "";

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          🔐 Private AI Notes
        </h1>
        <p className="text-center text-slate-300 text-sm mb-6">
          Create secure notes and generate AI summaries instantly.
        </p>

        <textarea
          rows="5"
          maxLength={500}
          placeholder="Write your private note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/20 p-4 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
        />

        <div className="text-right text-xs text-slate-400 mb-4">
          {text.length}/500 characters
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            loading || !text.trim()
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-blue-500/30"
          }`}
        >
          {loading ? "Creating..." : "Create Note"}
        </button>

        {message && (
          <p className="text-red-400 mt-4 text-center">{message}</p>
        )}

        {result && (
          <div className="mt-6 p-5 bg-green-500/10 border border-green-400/20 rounded-xl animate-fade-in">
            <p className="font-semibold mb-2">Shareable URL:</p>

            <div className="bg-white/5 p-3 rounded text-sm break-words mb-3">
              {shareUrl}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setMessage("Link copied!");
              }}
              className="text-sm text-blue-400 hover:underline"
            >
              Copy Link
            </button>

            <p className="mt-4">
              <span className="font-semibold">Password:</span>{" "}
              {result.password}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}