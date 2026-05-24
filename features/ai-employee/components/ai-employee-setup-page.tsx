import Link from "next/link";
import Image from "next/image";

import { AIEmployeeSetupForm } from "@/features/ai-employee/components/ai-employee-setup-form";
import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { canManageAIEmployee } from "@/features/ai-employee/utils/can-manage-ai-employee";
import { requireWorkspace } from "@/features/workspace";

export async function AIEmployeeSetupPage() {
  const currentWorkspace = await requireWorkspace();
  const settings = await getAIEmployeeSettings(currentWorkspace.workspace.id);
  const canManage = canManageAIEmployee(currentWorkspace.role);
  const isEditing = Boolean(settings);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/zol-logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full ring-1 ring-zinc-200"
            />
            <span className="text-lg font-bold tracking-tight">ZOL</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            AI employee setup
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {isEditing ? "Update your AI employee" : "Teach ZOL about your business"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
            {isEditing
              ? "Update how ZOL introduces itself, what it knows about your business, and when you are open."
              : "Tell ZOL about your business so it can answer customer calls with helpful, specific responses."}
          </p>
        </div>

        <AIEmployeeSetupForm settings={settings} canManage={canManage} />
      </div>
    </main>
  );
}
