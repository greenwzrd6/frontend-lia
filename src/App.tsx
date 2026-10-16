import { BrowserRouter, Routes, Route } from "react-router-dom";

import BoardPage from "./pages/BoardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/boards/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
