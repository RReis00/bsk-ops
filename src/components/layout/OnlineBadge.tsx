import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function OnlineBadge() {
  const online = useOnlineStatus();

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs",
        online
          ? "bg-green-500/20 text-green-300"
          : "bg-red-500/20 text-red-300",
        "border border-white/10",
      ].join(" ")}
      aria-live="polite"
      title={online ? "Ligação ativa" : "Sem ligação"}
    >
      <span
        className={[
          "rounded-full",
          "w-1.5 h-1.5",
          online ? "bg-green-400" : "bg-red-400",
        ].join(" ")}
      />
      {online ? "Online" : "Offline"}
    </span>
  );
}
