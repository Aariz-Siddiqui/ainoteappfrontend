import { useState } from "react";

export default function CreateNote() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("https://ainoteappbackend.vercel.app/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setText("");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.shareableUrl);
    alert("Link copied!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Private Note
        </h1>

        <textarea
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          placeholder="Write your note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating..." : "Create Note"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">Shareable URL:</p>
            <p className="text-blue-600 break-words mt-1">
              {result.shareableUrl}
            </p>

            <button
              onClick={copyToClipboard}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Copy Link
            </button>

            <p className="mt-3">
              <span className="font-semibold">Password:</span>{" "}
              {result.password}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}