import { Routes, Route } from "react-router-dom";
import A2HSBanner from "./components/A2HSBanner";
import InstallPage from "./pages/InstallPage";
import UpdatePrompt from "./components/UpdatePrompt";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage";
import WeekPage from "./pages/WeekPage";
import ChecklistsPage from "./pages/ChecklistsPage";
import SummariesPage from "./pages/SummariesPage";
import BlocksPage from "./pages/BlocksPage";
import RecurrencesPage from "./pages/RecurrencesPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/week" element={<WeekPage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/summaries" element={<SummariesPage />} />
          <Route path="/blocks" element={<BlocksPage />} />
          <Route path="/recurrences" element={<RecurrencesPage />} />
        </Route>

        <Route path="/install" element={<InstallPage />} />
      </Routes>

      <A2HSBanner />
      <UpdatePrompt />
    </>
  );
}
