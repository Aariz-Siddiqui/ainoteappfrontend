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
      setMessage("Note created successfully 🎉");
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
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          🔐 Private AI Notes
        </h1>

        <p className="text-center text-slate-500 text-sm mb-6">
          Create secure notes and generate AI summaries instantly.
        </p>

        <textarea
          rows="5"
          maxLength={500}
          placeholder="Write your private note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white border border-slate-300 p-4 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none text-slate-800"
        />

        <div className="text-right text-xs text-slate-500 mb-4">
          {text.length}/500 characters
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            loading || !text.trim()
              ? "bg-slate-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
          }`}
        >
          {loading ? "Creating..." : "Create Note"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">
            {message}
          </p>
        )}

        {result && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
            <p className="font-semibold mb-2 text-slate-800">
              Shareable URL:
            </p>

            <div className="bg-slate-100 p-3 rounded text-sm break-words mb-3 text-slate-800">
              {shareUrl}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setMessage("Link copied ✅");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Copy Link
            </button>

            <p className="mt-4 text-slate-800">
              <span className="font-semibold">Password:</span>{" "}
              {result.password}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}