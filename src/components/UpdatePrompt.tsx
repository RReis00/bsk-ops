import { useEffect, useState } from "react";
import { onUpdate } from "../pwaUpdate";

export default function UpdatePrompt() {
  const [runUpdate, setRunUpdate] = useState<null | (() => void)>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onUpdate((fn) => setRunUpdate(() => fn));

    const handler = () => {
      if (refreshing) window.location.reload();
    };
    navigator.serviceWorker?.addEventListener("controllerchange", handler);
    return () =>
      navigator.serviceWorker?.removeEventListener("controllerchange", handler);
  }, [refreshing]);

  if (!runUpdate) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black text-white px-4 py-2 shadow-lg flex gap-2 items-center z-50">
      <span>Nova versão disponível</span>
      <button
        className="bg-white text-black px-3 py-1 rounded"
        onClick={() => {
          setRefreshing(true);
          runUpdate();
        }}
      >
        Atualizar
      </button>
      <button
        className="bg-gray-700 px-3 py-1 rounded"
        onClick={() => setRunUpdate(null)}
      >
        Depois
      </button>
    </div>
  );
}
