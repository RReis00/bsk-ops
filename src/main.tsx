import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.warn("[PWA] onRegisteredSW:", swUrl, registration);
  },
  onRegisterError(error) {
    console.error("[PWA] register error:", error);
  },
});
