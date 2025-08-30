import { useEffect, useState } from "react";

interface BeforeInstallPromptEventLike extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface UseA2HS {
  canInstall: boolean;
  promptInstall: () => Promise<void>;
  dismiss: () => void;
}

export function useA2HS(cooldownDays = 7): UseA2HS {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEventLike | null>(
    null
  );
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const lastDismiss = Number(localStorage.getItem("a2hs-dismissed") ?? 0);
    const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
    if (lastDismiss && Date.now() - lastDismiss < cooldownMs) return;

    const onPrompt = (e: Event) => {
      const ev = e as BeforeInstallPromptEventLike;
      if ("prompt" in ev) {
        e.preventDefault();
        setDeferred(ev);
        setCanInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onPrompt as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onPrompt as EventListener
      );
  }, [cooldownDays]);

  const promptInstall = async (): Promise<void> => {
    if (!deferred) return;
    const ev = deferred;
    setDeferred(null);
    setCanInstall(false);
    await ev.prompt();
  };

  const dismiss = (): void => {
    setCanInstall(false);
    localStorage.setItem("a2hs-dismissed", String(Date.now()));
  };

  return { canInstall, promptInstall, dismiss };
}
