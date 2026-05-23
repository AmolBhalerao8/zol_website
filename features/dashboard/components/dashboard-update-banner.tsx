import { CheckCircle2, Info } from "lucide-react";

type DashboardUpdateBannerProps = {
  assistantSync?: string;
};

export function DashboardUpdateBanner({ assistantSync }: DashboardUpdateBannerProps) {
  const assistantSynced = assistantSync === "synced";
  const assistantSyncFailed = assistantSync === "failed";

  return (
    <div
      className={
        assistantSyncFailed
          ? "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
      }
      role="status"
    >
      <div className="flex items-start gap-3">
        {assistantSyncFailed ? (
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        )}
        <div>
          <p className="font-semibold">AI employee settings saved</p>
          <p className="mt-1 leading-6 opacity-90">
            {assistantSynced
              ? "Your live communication channel was updated with the latest business context and instructions."
              : assistantSyncFailed
                ? "Settings were saved, but the live channel could not be refreshed automatically. Open voice channel setup and update your AI employee to apply changes."
                : "Your AI employee configuration is up to date."}
          </p>
        </div>
      </div>
    </div>
  );
}
