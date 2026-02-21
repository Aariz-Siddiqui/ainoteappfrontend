import { Routes, Route } from "react-router-dom";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white p-4 text-center font-semibold text-lg">
        🔐 Private AI Notes
      </div>

      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:id" element={<ViewNote />} />
      </Routes>
    </div>
  );
}

export default App;