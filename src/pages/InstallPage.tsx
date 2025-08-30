import { useA2HS } from "../hooks/useA2HS";

export default function InstallPage() {
  const { canInstall, promptInstall } = useA2HS();

  return (
    <main className="mx-auto max-w-md p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-2">Instalar BSK Ops</h1>
      <p className="mb-4 opacity-80">Instala para abrir em ecrã completo e usar offline.</p>

      <button
        disabled={!canInstall}
        onClick={() => void promptInstall()}
        className="rounded-xl bg-white text-black px-4 py-2 disabled:opacity-50"
      >
        {canInstall ? "Instalar agora" : "Aguarda…"}
      </button>
    </main>
  );
}
