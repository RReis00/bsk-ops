import { useEffect, useState } from "react";
import { onUpdateVisible } from "../pwaUpdate";
import { useA2HS } from "../hooks/useA2HS";

export default function A2HSBanner() {
  const { canInstall, promptInstall, dismiss } = useA2HS();
  const [hide, setHide] = useState(false);

  useEffect(() => onUpdateVisible(setHide), []);

  if (!canInstall || hide) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 m-3 rounded-2xl bg-black text-white shadow-xl">
      <span>Instalar BSK Ops App</span>
      <button
        className="rounded-xl px-3 py-2 bg-white text-black"
        onClick={() => void promptInstall()}
      >
        Instalar
      </button>
      <button className="rounded-xl px-3 py-2 bg-neutral-800" onClick={dismiss}>
        Agora não
      </button>
    </div>
  );
}
