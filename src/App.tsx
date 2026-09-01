import { BrowserRouter, Routes, Route } from "react-router-dom";

import BoardPage from "./pages/BoardPage";
import PlacementDemoPage from "./pages/PlacementDemoPage";
import ColumnDemoPage from "./pages/ColumnDemoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/boards/:id" element={<BoardPage />} />
        <Route path="/placement-demo" element={<PlacementDemoPage />} />
        <Route path="/column-demo" element={<ColumnDemoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
