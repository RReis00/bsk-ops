import { Routes, Route } from "react-router-dom";
import A2HSBanner from "./components/A2HSBanner";
import InstallPage from "./pages/InstallPage";
import UpdatePrompt from "./components/UpdatePrompt";
import DataSandbox from "./pages/DataSandbox";

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
        <Route path="/data" element={<DataSandbox />} />
      </Routes>

      <A2HSBanner />
      <UpdatePrompt />
    </>
  );
}
