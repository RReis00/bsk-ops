import { registerSW } from "virtual:pwa-register";

let notify: ((runUpdate: () => void) => void) | null = null;

export function onUpdate(cb: (runUpdate: () => void) => void) {
  notify = cb;
}

const listeners: ((visible: boolean) => void)[] = [];
export function onUpdateVisible(cb: (visible: boolean) => void) {
  listeners.push(cb);
}
function setUpdateVisible(v: boolean) {
  for (const l of listeners) l(v);
}

export function initPWA() {
  if (!import.meta.env.PROD) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      setUpdateVisible(true);
      notify?.(() => {
        setUpdateVisible(false);
        void updateSW(true);
      });
    },
    onOfflineReady() {
      // something in the future
    },
  });
}
