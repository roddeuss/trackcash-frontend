"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddToHomePrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-neutral-800 shadow-lg border rounded-2xl px-4 py-3 flex items-center gap-3">
      <span className="text-sm">Install TrackCash di perangkatmu?</span>
      <Button
        size="sm"
        onClick={async () => {
          setOpen(false);
          if (!deferred) return;
          deferred.prompt();
          await deferred.userChoice;
          setDeferred(null);
        }}
      >
        Install
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Nanti
      </Button>
    </div>
  );
}
