/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST || []);

void self.skipWaiting();
void clientsClaim();

self.addEventListener("activate", () => {
  console.warn("SW ativado: BSK Ops");
});
