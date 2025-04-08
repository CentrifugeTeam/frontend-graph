import { HashRouter, Route, Routes } from "react-router-dom";
import { GraphPage } from "@/pages/GraphPage";

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/profile/:id" element={<DetailsPage />} /> */}
        <Route path="/" element={<GraphPage />} />
      </Routes>
    </HashRouter>
  );
};
