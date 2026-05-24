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
              ? "Your live phone line was updated with your latest changes."
              : assistantSyncFailed
                ? "Settings were saved, but your phone line could not be refreshed automatically. Open phone line setup to apply changes."
                : "Your AI employee settings are saved."}
          </p>
        </div>
      </div>
    </div>
  );
}
