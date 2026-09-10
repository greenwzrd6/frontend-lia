import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import BoardPage from "./pages/BoardPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 flex gap-4">
        <Link to="/boards/11111111-1111-1111-1111-111111111111">
          Board 1
        </Link>
      </nav>

      <Routes>
        <Route path="/boards/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}