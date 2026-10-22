import { BrowserRouter, Routes, Route } from "react-router-dom";

import BoardPage from "./pages/BoardPage";

/**
 * Application root that sets up React Router with a single `/boards/:id`
 * route rendering {@link BoardPage}.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/boards/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
