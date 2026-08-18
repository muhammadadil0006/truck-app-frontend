import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="animate-fade-up flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
