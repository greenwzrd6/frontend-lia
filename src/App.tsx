import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import BoardPage from "./pages/BoardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/boards/:id" element={<BoardPage />} />
      </Routes>
      <Link to="/boards/11111111-1111-1111-1111-111111111111">Board 1</Link>
      <Link to="/boards/11111111-1111-1111-1111-111111111112">Board 2</Link>
    </BrowserRouter>
  );
}
