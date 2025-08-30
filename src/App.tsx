import { Routes, Route } from "react-router-dom";
import A2HSBanner from "./components/A2HSBanner";
import InstallPage from "./pages/InstallPage";
import UpdatePrompt from "./components/UpdatePrompt";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-black text-white p-6">
              BSK Ops (8521)
            </div>
          }
        />
        <Route path="/install" element={<InstallPage />} />
      </Routes>

      <A2HSBanner />
      <UpdatePrompt />
    </>
  );
}
